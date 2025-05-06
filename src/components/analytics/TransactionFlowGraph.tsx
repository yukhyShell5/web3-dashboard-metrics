
import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Node,
  Edge,
  ConnectionLineType,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AlertItemProps } from './RecentAlerts';

// Custom node types will be implemented if needed
// const nodeTypes = {};

interface TransactionData {
  id: string;
  source?: string;
  target?: string;
  amount?: string;
  currency?: string;
  timestamp?: string;
  label?: string;
  type?: string;
}

interface TransactionFlowGraphProps {
  alert: AlertItemProps;
}

const TransactionFlowGraph = ({ alert }: TransactionFlowGraphProps) => {
  // Mock transaction data - in a real app, this would come from the alert data
  const transactionData = useMemo(() => {
    // This is mock data that mimics what we see in the images
    const mockTransactions: TransactionData[] = [
      { id: 'wallet_central', label: alert.source || 'Central Wallet' },
      { id: 'uni_v2', label: 'UNI-V2' },
      { id: 'weth', label: 'WETH' },
      { id: 'builder', label: 'Builder', type: 'titan' },
      { id: 'uniswap', label: 'Uniswap V4 Pool Manager' },
    ];

    const mockFlows = [
      { id: 'flow-1', source: 'wallet_central', target: 'uni_v2', amount: '0.0509 WETH', index: 1 },
      { id: 'flow-3', source: 'wallet_central', target: 'weth', amount: '0.0495 WETH', index: 3, type: 'burn' },
      { id: 'flow-2', source: 'wallet_central', target: 'weth', amount: '0.0495 ETH', index: 2 },
      { id: 'flow-4', source: 'wallet_central', target: 'uniswap', amount: '0.0495 ETH', index: 4 },
      { id: 'flow-5', source: 'wallet_central', target: 'builder', amount: '0.0098 ETH', index: 5 },
      { id: 'flow-0', source: 'uni_v2', target: 'wallet_central', amount: '737,563.2048 Kobu$h', index: 0 },
    ];

    return { transactions: mockTransactions, flows: mockFlows };
  }, [alert]);

  // Generate nodes for ReactFlow
  const nodes: Node[] = useMemo(() => {
    return transactionData.transactions.map((tx, index) => {
      let nodeType = 'default';
      let style: React.CSSProperties = {
        background: '#1a1f2c',
        color: '#fff',
        border: '1px solid #333',
        borderRadius: tx.id === 'weth' ? '50%' : '4px',
        width: tx.id === 'weth' ? 100 : 'auto',
        height: tx.id === 'weth' ? 50 : 'auto',
        padding: 10,
      };
      
      // Style nodes based on type
      if (tx.id === 'weth') {
        style.background = '#22c55e';
      } else if (tx.id === 'builder' || tx.type === 'titan') {
        style.borderRadius = '0';
        style.border = '1px solid #f97316';
        style.transform = 'skew(-20deg)';
      } else if (tx.id === 'uniswap' || tx.id === 'uni_v2') {
        style.borderRadius = '40px';
        style.width = 180;
      }

      // Position nodes in a layout similar to the image
      let position = { x: 0, y: 0 };
      switch (tx.id) {
        case 'wallet_central':
          position = { x: 300, y: 200 };
          break;
        case 'uni_v2':
          position = { x: 100, y: 250 };
          break;
        case 'weth':
          position = { x: 500, y: 160 };
          break;
        case 'builder':
          position = { x: 500, y: 100 };
          break;
        case 'uniswap':
          position = { x: 500, y: 250 };
          break;
        default:
          position = { x: 300 + (index * 100), y: 200 + (index * 50) };
      }

      return {
        id: tx.id,
        data: { 
          label: tx.label,
        },
        position,
        style,
        type: nodeType,
      };
    });
  }, [transactionData]);

  // Generate edges for ReactFlow
  const edges: Edge[] = useMemo(() => {
    return transactionData.flows.map(flow => {
      let style: React.CSSProperties = {};
      let animated = false;
      let labelStyle: React.CSSProperties = { 
        fill: '#fff', 
        fontSize: '10px',
        fontWeight: 'bold',
        backgroundColor: '#1a1f2c',
        padding: '2px 5px',
        borderRadius: '2px',
      };
      
      // Style edges based on type
      if (flow.type === 'burn') {
        style = { stroke: '#22c55e', strokeDasharray: '5,5' };
      } else if (flow.amount?.includes('ETH')) {
        style = { stroke: '#f59e0b' };
      } else if (flow.amount?.includes('WETH')) {
        style = { stroke: '#22c55e' };
      } else {
        style = { stroke: '#3b82f6' };
      }

      return {
        id: flow.id,
        source: flow.source || '',
        target: flow.target || '',
        label: `${flow.index} ${flow.amount}`,
        labelStyle,
        style,
        animated,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: style.stroke as string,
        },
      };
    });
  }, [transactionData]);

  return (
    <div style={{ height: 400, background: '#0a0a0a' }} className="border rounded-md overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background color="#222" gap={16} variant={BackgroundVariant.Dots} />
        <Controls position="bottom-right" style={{ background: '#1a1f2c', border: 'none' }} />
        <MiniMap 
          nodeColor={(node) => {
            if (node.id === 'weth') return '#22c55e';
            if (node.id === 'builder') return '#f97316';
            return '#1a1f2c';
          }}
          maskColor="rgba(0, 0, 0, 0.5)"
          style={{ background: '#0a0a0a' }}
        />
      </ReactFlow>
    </div>
  );
};

export default TransactionFlowGraph;
