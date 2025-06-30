import { useCallback, useEffect, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { RecentSales } from '../../features/sales/components/RecentSales';
import { Metrics, type MetricItem } from '../../features/stats/components/Metrics';
import { MonthlySales } from '../../features/stats/components/MonthlySales';
import { MonthlyTarget } from '../../features/stats/components/MonthlyTarget';
import { StatsChart } from '../../features/stats/components/Stats';
import { BoxIconLine, GroupIcon } from '../../assets/icons';
import { type Frequency } from '../../components/ChartTab/ChartTab';
import io from 'socket.io-client';

interface SalesAndRevenue {
  periods: string[];
  salesCounts: number[];
  revenueAmounts: number[];
}

interface MonthlyTarget {
  target: number;
  progress: number;
  revenue: number;
  diffLastMonth: number;
  sold: number;
}

export const Dashboard: React.FC = () => {
  const [frequency, setFrequency] = useState<Frequency>('annually');
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [monthlySales, setMonthlySales] = useState<number[]>([]);
  const [monthlyTarget, setMonthlyTarget] = useState<MonthlyTarget>({
    target: 0,
    progress: 0,
    revenue: 0,
    diffLastMonth: 0,
    sold: 0,
  });
  const [salesRevenue, setSalesAndRevenue] = useState<SalesAndRevenue>({
    periods: [],
    salesCounts: [],
    revenueAmounts: [],
  });

  const setupSocket = useCallback(() => {
    const socket = io('http://localhost:3000');
    socket.on('customerStats', (customers: any) => {
      setMetrics((prev) => {
        const others = prev.filter((m) => m.title !== 'Clientes');
        const newMetric: MetricItem = {
          icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
          title: 'Clientes',
          value: customers.thisWeek,
          percentage: customers.percentage,
          trend: customers.trend,
          badgeColor: customers.trend === 'up' ? 'success' : 'error',
        };
        return [...others, newMetric];
      });
    });

    socket.on('saleStats', (sales: any) => {
      setMetrics((prev) => {
        const others = prev.filter((m) => m.title !== 'Ventas');
        const newMetric: MetricItem = {
          icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
          title: 'Ventas',
          value: sales.thisWeek,
          percentage: sales.percentage,
          trend: sales.trend,
          badgeColor: sales.trend === 'up' ? 'success' : 'error',
        };
        return [...others, newMetric];
      });
    });

    socket.on('monthlySales', (counts: number[]) => {
      setMonthlySales(counts);
    });

    socket.on('monthlyTarget', (data: MonthlyTarget) => {
      setMonthlyTarget(data);
    });

    socket.on('salesAndRevenue', (data: SalesAndRevenue) => {
      setSalesAndRevenue(data);
    });

    socket.emit('requestMetricStats');
    socket.emit('requestMonthlySales');
    socket.emit('requestMonthlyTarget');
    socket.emit('requestSalesAndRevenue', { frequency });

    return () => void socket.disconnect();
  }, [frequency]);

  useEffect(() => {
    const cleanup = setupSocket();
    return cleanup;
  }, [setupSocket]);

  const handleFrequencyChange = (freq: Frequency) => {
    setFrequency(freq);
  };

  return (
    <>
      <PageMeta title="Inicio - PoS v2" description="Pagina de inicio PoS v2" />
      <div className="grid grid-cols-12 p-4 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <Metrics items={metrics} />

          <MonthlySales data={monthlySales} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget
            target={monthlyTarget.target}
            progress={monthlyTarget.progress}
            revenue={monthlyTarget.revenue}
            diffLastMonth={monthlyTarget.diffLastMonth}
            sold={monthlyTarget.sold}
          />
        </div>

        <div className="col-span-12">
          <StatsChart
            data={salesRevenue}
            currentFrequency={frequency}
            onChangeFrequency={handleFrequencyChange}
          />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentSales />
        </div>
      </div>
    </>
  );
};
