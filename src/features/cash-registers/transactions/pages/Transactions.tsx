import { withFetchByRole } from '../../../../hocs/withFetchByRole';
import { getAllTransactions, getAllTransactionsForCurrentUser } from '../slices/transactionsSlice';
import { TransactionsTable } from '../components/TransactionsTable';

export default withFetchByRole(TransactionsTable, {
  adminFetchThunk: getAllTransactions,
  selfFetchThunk: getAllTransactionsForCurrentUser,
});
