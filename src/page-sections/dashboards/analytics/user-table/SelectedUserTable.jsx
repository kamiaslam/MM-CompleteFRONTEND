import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table";
import UserTableHead from "./UserTableHead";
import UserTableRowDemo from "./UserTableRowDemo"; // Use this for correct mapping
import IconWrapper from "@/components/icon-wrapper"; // Custom icon wrapper
import { Paragraph } from "@/components/typography"; // Custom Paragraph
import { FlexBox } from "@/components/flexbox"; // Custom flexbox container
import UserIcon from "@/icons/User"; // Custom icon for User
import { useSelectedComponent } from "@/contexts/demoFilteringComponentContext"; // Import the context hook
import SelectedUserRow from "./SelectedUserRow";

export default function SelectedUserTable() {
  const { selectedUserList } = useSelectedComponent(); // Get selected user list from context
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Check if the selectedUserList is valid and not "not Selected"
  if (selectedUserList === "not Selected") {
    return null; // Don't render anything if no users are selected
  }

  const users = selectedUserList || []; // If no users in context, use empty array
  const usersCount = users.length; // Count the number of users

  // Handle page changes
  const handleChangePage = (_, newPage) => setPage(newPage);

  // Handle changes in rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dynamically generate headers based on the keys of the first user object
  const headers = users.length > 0 ? Object.keys(users[0]) : [];

  return (
    <div className="pt-2 pb-4">
      <Card>
        <Box padding={2}>
          {/* Header with Icon and Title */}
          <FlexBox alignItems="center" gap={1} mb={2}>
            <IconWrapper>
              <UserIcon sx={{ color: "primary.main" }} />
            </IconWrapper>
            <Paragraph fontSize={16}>Selected Users</Paragraph> {/* Change title to indicate selected users */}
          </FlexBox>
        </Box>

        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <UserTableHead headList={headers.map(header => ({ id: header, label: header }))} /> {/* Dynamically render headers */}
              <TableBody>
                {users.length === 0 ? (
                  <TableDataNotFound customSentence="No Selected Users Found." />
                ) : (
                  users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                      <SelectedUserRow key={index} user={user} headers={headers} /> 
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
