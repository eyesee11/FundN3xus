'use client';

import { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  PieChart,
  BarChart3,
  Activity,
  Target,
  Grip,
  Plus,
  Settings,
  Maximize2
} from 'lucide-react';
import { WelcomeBanner } from '@/components/shared/welcome-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'list' | 'progress';
  size: 'small' | 'medium' | 'large';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  content: React.ReactNode;
}

const initialWidgets: Widget[] = [
  {
    id: 'net-worth',
    title: 'Net Worth',
    type: 'metric',
    size: 'large',
    icon: DollarSign,
    color: 'text-green-600',
    content: (
      <div className="space-y-4">
        <div className="text-3xl font-bold text-green-600">$125,430</div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-green-600">+2.4% this month</span>
        </div>
        <div className="h-20 bg-gradient-to-r from-green-100 to-green-50 rounded-lg flex items-end justify-between p-3">
          {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
            <div
              key={i}
              className="bg-green-500 rounded-sm w-3"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'monthly-spending',
    title: 'Monthly Spending',
    type: 'chart',
    size: 'medium',
    icon: CreditCard,
    color: 'text-blue-600',
    content: (
      <div className="space-y-4">
        <div className="text-2xl font-bold text-blue-600">$3,240</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Food & Dining</span>
            <span>$890</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-3/4" />
          </div>
          <div className="flex justify-between text-sm">
            <span>Transportation</span>
            <span>$540</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-1/2" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'investments',
    title: 'Investment Portfolio',
    type: 'chart',
    size: 'medium',
    icon: BarChart3,
    color: 'text-purple-600',
    content: (
      <div className="space-y-4">
        <div className="text-2xl font-bold text-purple-600">$89,240</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Stocks</div>
            <div className="text-lg font-semibold">65%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Bonds</div>
            <div className="text-lg font-semibold">35%</div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500 w-2/3 rounded-lg" />
          <div className="absolute right-0 inset-y-0 bg-purple-300 w-1/3 rounded-r-lg" />
        </div>
      </div>
    ),
  },
  {
    id: 'goals',
    title: 'Financial Goals',
    type: 'progress',
    size: 'small',
    icon: Target,
    color: 'text-orange-600',
    content: (
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Emergency Fund</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full w-3/4" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>House Down Payment</span>
            <span>45%</span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full w-2/5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'recent-transactions',
    title: 'Recent Transactions',
    type: 'list',
    size: 'medium',
    icon: Activity,
    color: 'text-slate-600',
    content: (
      <div className="space-y-3">
        {[
          { name: 'Grocery Store', amount: '-$89.50', time: '2 hours ago' },
          { name: 'Salary Deposit', amount: '+$3,200.00', time: '1 day ago' },
          { name: 'Netflix', amount: '-$15.99', time: '2 days ago' },
          { name: 'Gas Station', amount: '-$45.20', time: '3 days ago' },
        ].map((transaction, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{transaction.name}</div>
              <div className="text-xs text-muted-foreground">{transaction.time}</div>
            </div>
            <div className={cn(
              "text-sm font-semibold",
              transaction.amount.startsWith('+') ? "text-green-600" : "text-red-600"
            )}>
              {transaction.amount}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'budget-overview',
    title: 'Budget Overview',
    type: 'chart',
    size: 'small',
    icon: PieChart,
    color: 'text-indigo-600',
    content: (
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-lg font-bold text-indigo-600">$1,760</div>
          <div className="text-xs text-muted-foreground">Remaining this month</div>
        </div>
        <div className="w-16 h-16 mx-auto relative">
          <div className="w-full h-full rounded-full bg-indigo-100">
            <div className="w-full h-full rounded-full bg-indigo-500 transform rotate-45" 
                 style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)' }} />
          </div>
        </div>
      </div>
    ),
  },
];

export function CommandCenterDashboard() {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const getGridCols = (size: string) => {
    switch (size) {
      case 'small': return 'md:col-span-1';
      case 'medium': return 'md:col-span-2';
      case 'large': return 'md:col-span-3';
      default: return 'md:col-span-1';
    }
  };

  return (
    <div className="space-y-6" data-tour="dashboard">
      {/* Welcome Banner for New Users */}
      <WelcomeBanner />

      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Financial Command Center
          </h1>
          <p className="text-muted-foreground">
            Drag and drop widgets to customize your dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isCustomizing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isCustomizing ? "Done" : "Customize"}
          </Button>
          
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* Widget Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-fr"
            >
              {widgets.map((widget, index) => (
                <Draggable 
                  key={widget.id} 
                  draggableId={widget.id} 
                  index={index}
                  isDragDisabled={!isCustomizing}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "group relative",
                        getGridCols(widget.size),
                        snapshot.isDragging && "z-50 rotate-3 scale-105"
                      )}
                    >
                      <Card className={cn(
                        "h-full transition-all duration-200",
                        isCustomizing && "ring-2 ring-primary/20",
                        snapshot.isDragging && "shadow-2xl ring-2 ring-primary/50"
                      )}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <widget.icon className={cn("w-5 h-5", widget.color)} />
                              <CardTitle className="text-base">{widget.title}</CardTitle>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {isCustomizing && (
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing"
                                >
                                  <Grip className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Maximize2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          {widget.content}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: '$156,890', change: '+5.2%', positive: true },
          { label: 'Monthly Income', value: '$7,200', change: '+2.1%', positive: true },
          { label: 'Monthly Expenses', value: '$4,650', change: '-1.8%', positive: true },
          { label: 'Savings Rate', value: '35.4%', change: '+0.9%', positive: true },
        ].map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className={cn(
                "text-xs flex items-center gap-1",
                stat.positive ? "text-green-600" : "text-red-600"
              )}>
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
