
interface DataPoint {
  [key: string]: any;
}

interface AnomalyDetectionConfig {
  method: 'zscore' | 'iqr' | 'movingAverage';
  field: string;
  threshold: number;
  windowSize?: number; // For moving average
}

// Z-Score method (standard deviations from mean)
function detectAnomaliesWithZScore(data: DataPoint[], field: string, threshold = 3): DataPoint[] {
  if (data.length === 0) return [];

  // Calculate mean
  const values = data.map(item => Number(item[field]) || 0);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calculate standard deviation
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // If stdDev is 0, no anomalies
  if (stdDev === 0) return [];
  
  // Find anomalies
  return data.filter((item, i) => {
    const value = Number(item[field]) || 0;
    const zScore = Math.abs((value - mean) / stdDev);
    return zScore > threshold;
  });
}

// IQR method (interquartile range)
function detectAnomaliesWithIQR(data: DataPoint[], field: string, threshold = 1.5): DataPoint[] {
  if (data.length === 0) return [];
  
  // Extract and sort values
  const values = data.map(item => Number(item[field]) || 0).sort((a, b) => a - b);
  
  // Calculate quartiles
  const q1Index = Math.floor(values.length * 0.25);
  const q3Index = Math.floor(values.length * 0.75);
  
  const q1 = values[q1Index];
  const q3 = values[q3Index];
  
  const iqr = q3 - q1;
  
  // Define bounds
  const lowerBound = q1 - threshold * iqr;
  const upperBound = q3 + threshold * iqr;
  
  // Find anomalies
  return data.filter(item => {
    const value = Number(item[field]) || 0;
    return value < lowerBound || value > upperBound;
  });
}

// Moving average method
function detectAnomaliesWithMovingAverage(
  data: DataPoint[], 
  field: string, 
  threshold = 2, 
  windowSize = 5
): DataPoint[] {
  if (data.length <= windowSize) return [];
  
  const anomalies: DataPoint[] = [];
  
  for (let i = windowSize; i < data.length; i++) {
    // Calculate moving average of previous points
    let sum = 0;
    for (let j = i - windowSize; j < i; j++) {
      sum += Number(data[j][field]) || 0;
    }
    const movingAvg = sum / windowSize;
    
    // Get current value
    const currentValue = Number(data[i][field]) || 0;
    
    // Calculate deviation
    const deviation = Math.abs(currentValue - movingAvg);
    const avgDeviation = deviation / movingAvg;
    
    // Check if anomaly
    if (avgDeviation > threshold) {
      anomalies.push(data[i]);
    }
  }
  
  return anomalies;
}

export function detectAnomalies(
  data: DataPoint[], 
  config: AnomalyDetectionConfig
): DataPoint[] {
  switch (config.method) {
    case 'zscore':
      return detectAnomaliesWithZScore(data, config.field, config.threshold);
    case 'iqr':
      return detectAnomaliesWithIQR(data, config.field, config.threshold);
    case 'movingAverage':
      return detectAnomaliesWithMovingAverage(
        data, 
        config.field, 
        config.threshold, 
        config.windowSize || 5
      );
    default:
      return [];
  }
}

// Helper function to highlight anomalies in chart data
export function annotateAnomalies(
  data: DataPoint[], 
  anomalies: DataPoint[], 
  field: string
): DataPoint[] {
  // Create new array with isAnomaly property
  return data.map(item => {
    const isAnomaly = anomalies.some(anomaly => {
      // Check if all keys match except for derived properties
      return Object.keys(anomaly).every(key => {
        if (key === 'isAnomaly') return true;
        return anomaly[key] === item[key];
      });
    });
    
    return {
      ...item,
      isAnomaly,
      // Add visual indicators for anomalies
      ...(isAnomaly ? {
        fillColor: 'red',
        strokeColor: 'red',
        strokeWidth: 2
      } : {})
    };
  });
}

export function getAnomalyStats(data: DataPoint[], field: string): {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
} {
  if (data.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
  }
  
  const values = data.map(item => Number(item[field]) || 0);
  const sortedValues = [...values].sort((a, b) => a - b);
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;
  
  // Calculate median
  let median;
  const midpoint = Math.floor(sortedValues.length / 2);
  if (sortedValues.length % 2 === 0) {
    median = (sortedValues[midpoint - 1] + sortedValues[midpoint]) / 2;
  } else {
    median = sortedValues[midpoint];
  }
  
  return { mean, median, stdDev, min, max };
}
