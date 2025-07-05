import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table";
import { getAllUsersNotAccessedByAdmin } from "../../../../api/apiAnalysisRoutes"; // New API function
import UserTableHead from "./UserTableHead";
import UserTableRowDemo from "./UserTableRowDemo"; // Use this for correct mapping
import IconWrapper from "@/components/icon-wrapper"; // Custom icon wrapper
import { Paragraph } from "@/components/typography"; // Custom Paragraph
import { FlexBox } from "@/components/flexbox"; // Custom flexbox container
import UserIcon from "@/icons/User"; // Custom icon for User

export default function UsersWaitingForAccessTable() {
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  // Fetch users who are waiting for access
  const fetchUsers = async () => {
    try {
      const response = await getAllUsersNotAccessedByAdmin();
      if (response?.status && Array.isArray(response.data)) {
        setUsers(response.data);
        setUsersCount(response.data.length);
      } else {
        setUsers([]);
        setUsersCount(0);
      }
    } catch (error) {
      console.error("Error fetching waiting users:", error);
      setUsers([]);
      setUsersCount(0);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="pt-2 pb-4">
      <Card>
        <Box padding={2}>
          {/* Header with Icon and Title */}
          <FlexBox alignItems="center" gap={1} mb={2}>
            <IconWrapper>
              <UserIcon sx={{ color: "primary.main" }} />
            </IconWrapper>
            <Paragraph fontSize={16}>Users Waiting for Access</Paragraph>
          </FlexBox>
        </Box>

        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <UserTableHead
                headList={[
                  { id: "name", label: "Name" },
                  { id: "email", label: "Email" },
                  { id: "phone_number", label: "Phone Number" },
                  { id: "allow_access", label: "Allow Access" },
                ]}
              />
              <TableBody>
                {users.length === 0 ? (
                  <TableDataNotFound customSentence="No Users Waiting for Access." />
                ) : (
                  users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                      <UserTableRowDemo
                        key={index}
                        user={user}
                        isWaitingForAccess
                        refreshList={fetchUsers} // Pass the fetch function as a callback
                      />
                    ))
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

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
