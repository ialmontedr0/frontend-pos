import { withFetchByRole } from '../../../hocs/withFetchByRole';
import {
  getAllCashRegisters,
  getAssignedCashRegisterForCurrentUser,
} from '../slices/cashRegisterSlice';
import { CashRegistersTable } from '../components/CashRegistersTable';

export default withFetchByRole(CashRegistersTable, {
  adminFetchThunk: getAllCashRegisters,
  selfFetchThunk: getAssignedCashRegisterForCurrentUser,
});
