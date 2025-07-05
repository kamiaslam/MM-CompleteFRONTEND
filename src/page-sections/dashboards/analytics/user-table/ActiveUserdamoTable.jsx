import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table";
import { getAllActiveUsersWithRemainingTime } from "../../../../api/apiAnalysisRoutes";
import UserTableHead from "./UserTableHead";
import UserTableRowDemo from "./UserTableRowDemo"; // Use this for correct mapping
import IconWrapper from "@/components/icon-wrapper"; // Custom icon wrapper
import { Paragraph } from "@/components/typography"; // Custom Paragraph
import { FlexBox } from "@/components/flexbox"; // Custom flexbox container
import GroupSenior from "@/icons/GroupSenior"; // Custom icon for GroupSenior
import UserIcon from "@/icons/User"; // Custom icon for User
import { ArrowBackIosNew } from "@mui/icons-material"; // Back icon, if needed
import { useSelectedComponent } from "@/contexts/demoFilteringComponentContext";
export default function ActiveUsersTable() {
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { reloadTrigger } = useSelectedComponent();

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, reloadTrigger]);

  const fetchUsers = async () => {
    try {
      const response = await getAllActiveUsersWithRemainingTime();
      if (response?.status && Array.isArray(response.data)) {
        setUsers(response.data);
        setUsersCount(response.data.length);
      } else {
        setUsers([]);
        setUsersCount(0);
      }
    } catch (error) {
      console.error("Error fetching active users:", error);
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
            <Paragraph fontSize={16}>Active Users</Paragraph>
          </FlexBox>
        </Box>

        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <UserTableHead
                headList={[
                  { id: "name", label: "Name" },
                  { id: "email", label: "Email" },
                  { id: "phone_number", label: "Phone Number" },  // New column added here
                  { id: "remaining_time", label: "Remaining Time" },
                ]}
              />
              <TableBody>
                {users.length === 0 ? (
                  <TableDataNotFound customSentence="No Active Users Found." />
                ) : (
                  users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                      <UserTableRowDemo key={index} user={user} />
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
