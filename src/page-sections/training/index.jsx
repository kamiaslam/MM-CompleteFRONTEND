import { useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound, TableToolbar } from "@/components/table";

import UserTableRow from "../users/UserTableRow";
import UserTableHead from "../users/UserTableHead"; // CUSTOM DEFINED HOOK
import useMuiTable from "@/hooks/useMuiTable"; // CUSTOM DUMMY DATA
import { useEffect } from "react";
import { TRAINING_LOGS_HEAD_LIST } from "../../helper/constant";
import { useLoader } from "../../contexts/LoaderContext";
import { fetchUserMedia } from "../../api/axiosApis/get";
import MediaTableRow from "./MediaTableRow";
import MediaTableHead from "./MediaTableHead";
import { Icon, Input, InputAdornment } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { SearchIcon } from "lucide-react";

export default function UserList1PageView() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  // const debounceSearch = useDebounce(search, 1000);

  const [usersCount, setUsersCount] = useState(0);

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

  const getUserData = async () => {
    try {
      showLoader(); // Show loader before API call
      const resp = await fetchUserMedia(page + 1, rowsPerPage, search);

      const formattedUsers = resp?.data.map((user) => ({
        ...user,
        file_url: user.file_url || [], // Ensure file_url is always an array
        file_type: user.file_type || "unknown", // Default file_type if not present
      }));

      setUsers(formattedUsers || []);
      setUsersCount(resp?.count || 0);
    } catch (error) {
      console.error("Error fetching user media:", error.message || error);
    } finally {
      hideLoader(); // Hide loader after API call completes
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getUserData();
    }, 500); // 500ms delay after user stops typing

    return () => clearTimeout(timeoutId);
  }, [search]); // Trigger when search changes

  // Remove duplicate useEffect
  useEffect(() => {
    getUserData();
  }, [rowsPerPage, page]);

  const iconStyle = {
    color: "grey.500",
    fontSize: 18,
  };
  const [gridRoute, setGridRoute] = useState(false);
  const toggleRoute = () => setGridRoute(!gridRoute);

  const handleSearchChange = (e) => {
    setSearch(e?.target?.value?.trimStart());
    // Remove setCurrentPage as it's not defined
    // Instead, reset to first page when searching
    handleChangePage(null, 0);
  };

  return (
    <div className="pt-2 pb-4">
      <Card>
        {/* <Box px={2} pt={2}>
          <HeadingArea value={userFilter.role} changeTab={handleChangeTab} />

          <SearchArea
            value={userFilter.search}
            onClear={(e) => handleChangeFilter("search", "")}
            toggleRoute={toggleRoute}
            listRoute={toggleRoute}
            onChange={(e) => handleChangeFilter("search", e.target.value)}
          />
        </Box> */}

        {/* TABLE ROW SELECTION HEADER  */}
        {selected.length > 0 && <TableToolbar selected={selected.length} />}
        <TableContainer>
          <Scrollbar autoHide={false}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "16px 24px",
              }}
            >
              <Input
                placeholder="Search by name or email"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                }
                endAdornment={
                  search && (
                    <InputAdornment position="end">
                      <Clear
                        sx={{
                          cursor: "pointer",
                          color: "text.secondary",
                        }}
                        onClick={() => setSearch("")}
                      />
                    </InputAdornment>
                  )
                }
                value={search}
                onChange={handleSearchChange}
                sx={{
                  maxWidth: "300px",
                  "& .MuiInput-input": {
                    padding: "8px 12px",
                  },
                  "&:before": {
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                  },
                }}
              />
            </Box>

            <Table>
              <MediaTableHead
                // order={order}
                // orderBy={orderBy}
                headList={TRAINING_LOGS_HEAD_LIST}
                numSelected={selected.length}
                rowCount={users.length}
                onRequestSort={handleRequestSort}
                onSelectAllRows={handleSelectAllRows(
                  users.map((row) => row.id)
                )}
              />

              <TableBody>
                {loading ? (
                  <TableDataNotFound
                    customSentence={"Loading patient data, please wait ...."}
                  />
                ) : users.length === 0 ? (
                  <TableDataNotFound customSentence={"No Media Found."} />
                ) : (
                  users.map((user) => (
                    <MediaTableRow
                      key={user.id}
                      user={{
                        ...user,
                        file_url: user.file_url || [],
                        file_type: user.file_type || "unknown",
                      }}
                      isSelected={isSelected(user.id)}
                      handleSelectRow={handleSelectRow}
                      keys={"patient"}
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
