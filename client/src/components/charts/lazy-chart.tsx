import { lazy, Suspense } from 'react';
import { ChartSkeleton } from '@/components/ui/loading-skeletons';

// Lazy load Recharts components
const RechartsComponents = lazy(() => import('recharts'));

interface LazyChartProps {
  type: 'area' | 'line' | 'bar' | 'pie';
  data: any[];
  config: any;
  className?: string;
}

export const LazyChart = ({ type, data, config, className }: LazyChartProps) => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartRenderer type={type} data={data} config={config} className={className} />
    </Suspense>
  );
};

// Internal renderer component
const ChartRenderer = ({ type, data, config, className }: LazyChartProps) => {
  const {
    ResponsiveContainer,
    AreaChart,
    LineChart,
    BarChart,
    PieChart,
    Area,
    Line,
    Bar,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell
  } = require('recharts');

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={config.yKey}
              stroke={config.stroke}
              fill={config.fill}
            />
          </AreaChart>
        );
      
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={config.yKey}
              stroke={config.stroke}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={config.yKey} fill={config.fill} />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={config.dataKey}
              nameKey={config.nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      {renderChart()}
    </ResponsiveContainer>
  );
};
