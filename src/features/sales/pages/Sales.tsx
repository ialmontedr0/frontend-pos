// src/features/sales/pages/Sales.tsx
import { withFetchByRole } from '../../../hocs/withFetchByRole';
import { getAllSales, getAllSalesForCurrentUser } from '../slices/salesSlice';
import { SalesTable } from '../components/SalesTable';

export default withFetchByRole(
  SalesTable,
  {
    adminFetchThunk: getAllSales,
    selfFetchThunk: getAllSalesForCurrentUser,
  }
);
