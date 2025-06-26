import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import ChartTab, { type Frequency } from '../../../components/ChartTab/ChartTab';

export interface SalesAndRevenueDto {
  periods: string[];
  salesCounts: number[];
  revenueAmounts: number[];
}

export interface StatsChartProps {
  data: SalesAndRevenueDto;
  onChangeFrequency: (freq: Frequency) => void;
  currentFrequency: Frequency;
}

export const StatsChart: React.FC<StatsChartProps> = ({
  data,
  onChangeFrequency,
  currentFrequency,
}) => {
  const { periods, salesCounts, revenueAmounts } = data;
  const options: ApexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#465FFF', '#9CB9FF'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: 310,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'straight',
      width: [2, 2],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: 'dd MMM yyyy',
      },
    },
    xaxis: {
      type: 'category',
      categories: periods,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: ['#6b7280'],
        },
      },
    },
  };

  const series = [
    { name: 'Ventas', data: salesCounts },
    { name: 'Ganancias', data: revenueAmounts },
  ];

  return (
    <div className="rounede-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Estadisticas</h3>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab current={currentFrequency} onChange={onChangeFrequency} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
};
