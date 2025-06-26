import { withFetchByRole } from "../../../hocs/withFetchByRole";
import { getAllCashRegisters, getAllCashRegistersForCurrentUser } from "../slices/cashRegisterSlice";
import { CashRegistersTable } from "../components/CashRegistersTable";

export default withFetchByRole(CashRegistersTable, {
  adminFetchThunk: getAllCashRegisters,
  selfFetchThunk: getAllCashRegistersForCurrentUser
})