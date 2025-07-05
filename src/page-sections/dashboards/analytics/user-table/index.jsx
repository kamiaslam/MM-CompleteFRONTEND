import { useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination"; // CUSTOM COMPONENTS
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound, TableToolbar } from "@/components/table"; // CUSTOM PAGE SECTION COMPONENTS
import useDebounce from "@/helper/useDebounce";

import useMuiTable from "@/hooks/useMuiTable"; // CUSTOM DUMMY DATA
import { useEffect } from "react";

import { fetchUserData } from "../../../../api/axiosApis/get";
import UserTableHead from "./UserTableHead";
import UserTableRow from "./UserTableRow";
import {
  PATIENT_HEAD_LIST,
  PATIENT_HEAD_LIST_DASHBOARD,
} from "../../../../helper/constant";
import { useLoader } from "../../../../contexts/LoaderContext";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteUserID, setDeleteUserID] = useState("");
  const [usersCount, setUsersCount] = useState(0);
  const [userFilter, setUserFilter] = useState({
    role: "",
    search: "",
  });
  const debounceSearch = useDebounce(userFilter?.search, 1000);
  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "name",
  });
  const { showLoader, hideLoader, loading } = useLoader();
  const getUserData = () => {
    fetchUserData(page + 1, rowsPerPage, debounceSearch, showLoader, hideLoader)
      .then((resp) => {
        setUsers(resp?.data || []); // Ensure users is always an array
        setUsersCount(resp?.count || 0);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUsers([]); // Set empty array on error
        setUsersCount(0);
      });
  };

  useEffect(() => {
    getUserData();
  }, [rowsPerPage, page, debounceSearch]);

  const handleChangeFilter = (key, value) => {
    setUserFilter((state) => ({ ...state, [key]: value?.trimStart() }));
    handleChangePage("", 0);
  };

  const handleChangeTab = (_, newValue) => {
    handleChangeFilter("role", newValue);
  };

  const handleDeleteUser = (id) => {
    // setUsers((state) => state.filter((item) => item.id !== id));
    modalToggle();
    setDeleteUserID(id);
  };

  const modalToggle = () => setDeleteModal(!deleteModal);
  const handleDelete = () => {
    deletePatient(deleteUserID).then((resp) => {
      getUserData();
      modalToggle();
    });
  };
  const handleAllUserDelete = () => {
    setUsers((state) => state.filter((item) => !selected.includes(item.id)));
    handleSelectAllRows([])();
  };
  const iconStyle = {
    color: "grey.500",
    fontSize: 18,
  };
  const [gridRoute, setGridRoute] = useState(false);
  const toggleRoute = () => setGridRoute(!gridRoute);

  return (
    <div className="pt-2 pb-4">
      <Card>
        {/* TABLE ROW SELECTION HEADER  */}
        {selected?.length > 0 && (
          <TableToolbar
            selected={selected.length}
            handleDeleteRows={handleAllUserDelete}
          />
        )}
        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <UserTableHead
                headList={PATIENT_HEAD_LIST_DASHBOARD}
                numSelected={selected?.length || 0}
                rowCount={(users || []).length}
                onRequestSort={handleRequestSort}
                onSelectAllRows={handleSelectAllRows(
                  (users || []).map((row) => row.id)
                )}
              />

              <TableBody>
                {loading ? (
                  <TableDataNotFound
                    customSentence={"Loading patient data, please wait ...."}
                  />
                ) : (users || []).length === 0 ? (
                  <TableDataNotFound
                    customSentence={"No Patient Data Found."}
                  />
                ) : (
                  users.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      isSelected={isSelected(user.id)}
                      handleSelectRow={handleSelectRow}
                      handleDeleteUser={handleDeleteUser}
                      keys={"patient"}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {/* PAGINATION SECTION */}
        <Box padding={1}>
          <TablePagination
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={usersCount}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Card>
    </div>
  );
}
