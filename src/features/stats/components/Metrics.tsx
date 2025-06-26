import { ArrowDownIcon, ArrowUpIcon } from '../../../assets/icons';
import Badge from '../../../components/UI/Badge/Badge';

export interface MetricItem {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  percentage: number;
  trend?: 'up' | 'down';
  badgeColor: 'success' | 'error';
}

interface MetricsProps {
  className?: string;
  items: MetricItem[];
}

export const Metrics: React.FC<MetricsProps> = ({ className = '', items = [] }) => {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 ${className}`}>
      {items.map((item, i) => {
        const color =
          item.badgeColor ??
          (item.trend === 'up' ? 'success' : item.trend === 'down' ? 'error' : 'neutral');
        return (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {item.icon}
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.title}</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {item.value}
                </h4>
              </div>
              <Badge color={color}>
                {item.trend === 'up' && <ArrowUpIcon />}
                {item.trend === 'down' && <ArrowDownIcon />}
                {Math.abs(item.percentage)}%
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};
