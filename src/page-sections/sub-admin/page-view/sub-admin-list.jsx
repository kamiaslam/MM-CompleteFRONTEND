import { useState } from "react"; // MUI
import { deletePatient } from "../../../api/axiosApis/delete";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination"; // CUSTOM COMPONENTS
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound, TableToolbar } from "@/components/table"; // CUSTOM PAGE SECTION COMPONENTS
import useDebounce from "@/helper/useDebounce";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
// import SearchArea from "../SearchArea";
import HeadingArea from "../HeadingArea";
import SubAdminTableRow from "../SubAdminTableRow";
import SubAdminTableHead from "../SubAdminTableHead"; // CUSTOM DEFINED HOOK

import useMuiTable from "@/hooks/useMuiTable"; // CUSTOM DUMMY DATA
import { useEffect } from "react";

import { SUB_ADMIN_HEAD_LIST } from "../../../helper/constant";
import { useLoader } from "../../../contexts/LoaderContext";
import SearchArea from "../../users/SearchArea";

export default function SubAdminListPageView() {
  const [subAdmin, setSubAdmin] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSubAdminID, setDeleteSubAdminID] = useState("");
  const [subAdminCount, setSubAdminCount] = useState(0);
  const [subAdminFilter, setSubAdminFilter] = useState({
    role: "",
    search: "",
  });
  const debounceSearch = useDebounce(subAdminFilter?.search, 1000);
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

  //   const getUserData = () => {
  //     fetchUserData(page + 1, rowsPerPage, debounceSearch, showLoader, hideLoader)
  //       .then((resp) => {
  //         // Add null checks for the response
  //         setUsers(resp?.data || []);
  //         setUsersCount(resp?.count || 0);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user data:", error);
  //         setUsers([]);
  //         setUsersCount(0);
  //       });
  //   };

  //   useEffect(() => {
  //     getUserData();
  //   }, [rowsPerPage, page, debounceSearch]);

  const handleChangeFilter = (key, value) => {
    setSubAdminFilter((state) => ({ ...state, [key]: value?.trimStart() }));
    handleChangePage("", 0);
  };

  const handleChangeTab = (_, newValue) => {
    handleChangeFilter("role", newValue);
  };

  const handleDeleteSubAdmin = (id) => {
    // setUsers((state) => state.filter((item) => item.id !== id));
    modalToggle();
    setDeleteSubAdminID(id);
  };

  const modalToggle = () => setDeleteModal(!deleteModal);
  const handleDelete = () => {
    deletePatient(deleteSubAdminID).then((resp) => {
      getUserData();
      modalToggle();
    });
  };
  const handleAllSubAdminDelete = () => {
    setSubAdmin((state) => state.filter((item) => !selected.includes(item.id)));
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
        <Box px={2} pt={2}>
          <HeadingArea
            value={subAdminFilter.role}
            changeTab={handleChangeTab}
          />

          <SearchArea
            value={subAdminFilter.search}
            onClear={(e) => handleChangeFilter("search", "")}
            toggleRoute={toggleRoute}
            listRoute={toggleRoute}
            onChange={(e) => handleChangeFilter("search", e.target.value)}
          />
        </Box>

        {/* TABLE ROW SELECTION HEADER  */}
        {selected.length > 0 && (
          <TableToolbar
            selected={selected.length}
            handleDeleteRows={handleAllSubAdminDelete}
          />
        )}
        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <SubAdminTableHead
                // order={order}
                // orderBy={orderBy}
                headList={SUB_ADMIN_HEAD_LIST}
                numSelected={selected.length}
                rowCount={subAdmin.length}
                onRequestSort={handleRequestSort}
                onSelectAllRows={handleSelectAllRows(
                  subAdmin.map((row) => row.id)
                )}
              />

              <TableBody>
                {loading ? (
                  <TableDataNotFound
                    customSentence={"Loading patient data, please wait ...."}
                  />
                ) : !subAdmin || subAdmin.length === 0 ? (
                  <TableDataNotFound
                    customSentence={"No Sub Admin Data Found."}
                  />
                ) : (
                  subAdmin.map((sub) => (
                    <SubAdminTableRow
                      key={sub.id}
                      subAdmin={sub}
                      isSelected={isSelected(sub.id)}
                      handleSelectRow={handleSelectRow}
                      handleDeleteSubAdmin={handleDeleteSubAdmin}
                      keys={"sub-admin"}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        {/* {!gridRoute ? (
          <></>
        ) : (
          users.map((item, index) => (
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 6,
                xs: 12,
              }}
              key={index}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <FlexBetween mx={-1} mt={-1}>
                  <Checkbox size="small" />

                  <IconButton>
                    <MoreHorizontal sx={iconStyle} />
                  </IconButton>
                </FlexBetween>

                <Stack direction="row" alignItems="center" py={2} spacing={2}>
                  <Avatar
                    src={item.avatar}
                    sx={{
                      borderRadius: "20%",
                    }}
                  />

                  <div>
                    <Paragraph fontWeight={500}>{item.name}</Paragraph>
                    <Small color="grey.500">{item.username}</Small>
                  </div>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email sx={iconStyle} />
                  <Small color="grey.500">{item.email}</Small>
                </Stack>

                <Stack direction="row" alignItems="center" mt={1} spacing={1}>
                  <UserBigIcon sx={iconStyle} />
                  <Small color="grey.500">Status: {item.role}</Small>
                </Stack>

                <Stack direction="row" alignItems="center" mt={1} spacing={1}>
                  <Chat sx={iconStyle} />
                  <Small color="grey.500">Posts: 12</Small>
                </Stack>
              </Box>
            </Grid>
          ))
        )} */}

        {/* PAGINATION SECTION */}
        <Box padding={1}>
          <TablePagination
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={subAdminCount}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Card>
      {deleteModal && (
        <>
          <Dialog
            open={deleteModal}
            onClose={modalToggle}
            aria-labelledby="delete-confirmation-title"
            aria-describedby="delete-confirmation-description"
          >
            <DialogTitle id="delete-confirmation-title">
              Delete Confirmation
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-confirmation-description">
                Are you sure you want to delete this sub admin?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={modalToggle} variant="outlined" color="primary">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
}
