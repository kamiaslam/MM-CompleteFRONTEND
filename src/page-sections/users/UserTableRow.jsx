import { useState } from "react";
import { useNavigate } from "react-router-dom"; // MUI

import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell"; // MUI ICON COMPONENTS

import Edit from "@mui/icons-material/Edit";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Visibility from "@mui/icons-material/Visibility";

import FlexBox from "@/components/flexbox/FlexBox";
import { Paragraph } from "@/components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "@/components/table";
import moment from "moment";

export default function UserTableRow(props) {
  const {
    user,
    isSelected,
    handleSelectRow,
    handleDeleteUser,
    keys,
    openModal,
  } = props;
  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const handleOpenMenu = (event) => {
    setOpenMenuEl(event.currentTarget);
  };

  const handleCloseOpenMenu = () => setOpenMenuEl(null);

  return (
    <TableRow hover>
      {/* <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, user.id)} />
      </TableCell> */}

      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar
            src={
              user?.avatar || user.name?.charAt(0) || user.first_name?.charAt(0)
            }
            alt={user.name}
            variant="rounded"
          >
            {user?.avatar || user.name?.charAt(0) || user.first_name?.charAt(0)}
          </Avatar>

          <div>
            <Paragraph fontWeight={500} color="text.primary">
              {user.name ?? user.first_name + " " + user.last_name}
            </Paragraph>

            {/* <Paragraph fontSize={13}>#{user.id.substring(0, 11)}</Paragraph> */}
          </div>
        </FlexBox>
      </TableCell>
      <TableCell padding="normal">{user.email}</TableCell>

      <TableCell padding="normal">
        {moment(user?.birthdate ? user?.birthdate : user?.birth_date).format(
          "DD MMM YYYY"
        )}
      </TableCell>
      {keys == "patient" ? (
        <TableCell padding="normal">
          {moment(user?.created_at).format("DD MMM YYYY")}
        </TableCell>
      ) : (
        <TableCell padding="normal">{user.relation}</TableCell>
      )}
      {keys == "patient" ? (
        user?.is_active ? (
          <TableCell padding="normal">Active</TableCell>
        ) : (
          <TableCell padding="normal">De-Active</TableCell>
        )
      ) : (
        <TableCell padding="normal">{user.gender}</TableCell>
      )}

      <TableCell padding="normal">
        <TableMoreMenu
          open={openMenuEl}
          handleOpen={handleOpenMenu}
          handleClose={handleCloseOpenMenu}
        >
          <TableMoreMenuItem
            Icon={Edit}
            title="Edit"
            handleClick={() => {
              if (keys == "patient") {
                handleCloseOpenMenu();
                navigate(`/dashboard/add-patient?id=${user?.id}`);
              } else {
                handleCloseOpenMenu();
                openModal(user?.id);
              }
            }}
            sx={{ color: "primary.main" }}
          />
          {/* {keys == "patient" && (
            <TableMoreMenuItem
              Icon={Visibility}
              title="Overview"
              handleClick={() => {
                if (keys == "patient") {
                  handleCloseOpenMenu();
                  navigate(`/dashboard/patient-view?id=${user?.id}`);
                } else {
                  handleCloseOpenMenu();
                  openModal(user?.id);
                }
              }}
              sx={{ color: "primary.main" }}
            />
          )} */}

          <TableMoreMenuItem
            Icon={DeleteOutline}
            title="Delete"
            handleClick={() => {
              handleCloseOpenMenu();
              handleDeleteUser(user.id);
            }}
            sx={{ color: "error.main" }}  
          />
        </TableMoreMenu>
      </TableCell>
    </TableRow>
  );
}
