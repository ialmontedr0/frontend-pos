import { withFetchByRole } from '../../../hocs/withFetchByRole';
import { getAllPayments, getAllPaymentsForCurrentUser } from '../slices/paymentsSlices';
import { PaymentsTable } from '../components/PaymentsTable';

export default withFetchByRole(PaymentsTable, {
  adminFetchThunk: getAllPayments,
  selfFetchThunk: getAllPaymentsForCurrentUser,
});
