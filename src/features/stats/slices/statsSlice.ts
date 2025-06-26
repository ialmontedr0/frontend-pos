import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface MetricItem {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  percentage: number;
  trend?: 'up' | 'down';
  badgeColor: 'success' | 'error';
}

export interface MonthlyTarget {
  target: number;
  progress: number;
  revenue: number;
  diffLastMonth: number;
  sold: number;
}

export interface StatsState {
  metrics: MetricItem[];
  monthlySales: number[];
  monthlyTarget: MonthlyTarget | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  metrics: [],
  monthlySales: [],
  monthlyTarget: null,
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setCustomerStats(state, action: PayloadAction<MetricItem>) {
      state.metrics = [
        ...state.metrics.filter((m) => m.title !== action.payload.title),
        action.payload,
      ];
    },
    setSaleStats(state, action: PayloadAction<MetricItem>) {
      state.metrics = [
        ...state.metrics.filter((m) => m.title !== action.payload.title),
        action.payload,
      ];
    },
    setMonthlySales(state, action: PayloadAction<number[]>) {
      state.monthlySales = action.payload;
    },
    setMonthlyTarget(state, action: PayloadAction<StatsState['monthlyTarget']>) {
      state.monthlyTarget = action.payload;
    },
  },
});

export const { setCustomerStats, setSaleStats, setMonthlySales, setMonthlyTarget } =
  statsSlice.actions;

export default statsSlice.reducer;
