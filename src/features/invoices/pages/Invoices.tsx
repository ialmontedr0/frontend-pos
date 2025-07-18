import { withFetchByRole } from '../../../hocs/withFetchByRole';
import { getAllInvoices, getAllInvoicesForCurrentUser } from '../slices/invoicesSlice';
import { InvoicesTable } from '../components/InvoicesTable';

export default withFetchByRole(InvoicesTable, {
  adminFetchThunk: getAllInvoices,
  selfFetchThunk: getAllInvoicesForCurrentUser,
});
