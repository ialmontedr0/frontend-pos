import { withFetchByRole } from '../../../hocs/withFetchByRole';
import {
  getAllCashRegisters,
  getAssignedCashRegisterToUser,
} from '../slices/cashRegisterSlice';
import { CashRegistersTable } from '../components/CashRegistersTable';

export default withFetchByRole(CashRegistersTable, {
  adminFetchThunk: getAllCashRegisters,
  selfFetchThunk: getAssignedCashRegisterToUser,
});
