
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon, EditIcon, EyeIcon, StarIcon, PlusIcon } from 'lucide-react';
import { useDashboardStore } from '@/services/dashboardStore';
import { DashboardLayout } from '@/types/dashboard';
import { toast } from "@/hooks/use-toast";

const Dashboards = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  const dashboards = useDashboardStore(state => state.dashboards);
  const setPrimaryDashboard = useDashboardStore(state => state.setPrimaryDashboard);
  const removeDashboard = useDashboardStore(state => state.removeDashboard);
  
  // Filter dashboards based on search query
  const filteredDashboards = dashboards.filter(dashboard => 
    dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort dashboards based on selected criteria
  const sortedDashboards = [...filteredDashboards].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      case 'widgets':
        return (b.widgets?.length || 0) - (a.widgets?.length || 0);
      default:
        return 0;
    }
  });
  
  const handleSetPrimary = (dashboardId: string) => {
    setPrimaryDashboard(dashboardId);
    toast({
      title: "Primary dashboard updated",
      description: "This dashboard will now appear on the home page"
    });
  };
  
  const handleDeleteDashboard = (dashboardId: string) => {
    if (confirm("Are you sure you want to delete this dashboard?")) {
      removeDashboard(dashboardId);
      toast({
        title: "Dashboard deleted",
        description: "The dashboard has been permanently removed"
      });
    }
  };
  
  const handleViewDashboard = (dashboardId: string) => {
    navigate(`/dashboards/view/${dashboardId}`);
  };
  
  const handleEditDashboard = (dashboardId: string) => {
    navigate(`/dashboards/edit/${dashboardId}`);
  };

  const handleCreateDashboard = () => {
    const addDashboard = useDashboardStore.getState().addDashboard;
    const id = addDashboard({
      title: 'New Dashboard',
      description: 'Click to edit dashboard details',
      isPrimary: dashboards.length === 0, // Make it primary if it's the first dashboard
    });
    
    navigate(`/dashboards/edit/${id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboards</h1>
          <p className="text-muted-foreground">Create and manage custom dashboards</p>
        </div>
        <Button onClick={handleCreateDashboard} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Create Dashboard
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dashboards..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Updated</SelectItem>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="widgets">Number of Widgets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDashboards.map((dashboard: DashboardLayout) => (
          <Card key={dashboard.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{dashboard.title}</CardTitle>
                {dashboard.isPrimary && (
                  <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <CardDescription>{dashboard.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground flex items-center gap-1">
                  {dashboard.widgets?.length || 0} widgets
                </div>
                <div className="text-muted-foreground">
                  Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${dashboard.isPrimary ? 'text-primary' : ''}`}
                  onClick={() => handleSetPrimary(dashboard.id)}
                  disabled={dashboard.isPrimary}
                >
                  {dashboard.isPrimary ? 'Primary' : 'Set as primary'}
                </Button>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleEditDashboard(dashboard.id)}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleViewDashboard(dashboard.id)}
                  className="flex items-center gap-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  View
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {sortedDashboards.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No dashboards found</p>
            <Button onClick={handleCreateDashboard} className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboards;
