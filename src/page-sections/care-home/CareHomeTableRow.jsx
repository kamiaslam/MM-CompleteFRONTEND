import { useState } from "react";
import { useNavigate } from "react-router-dom"; // MUI

import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import Edit from "@mui/icons-material/Edit";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Visibility from "@mui/icons-material/Visibility";

import FlexBox from "@/components/flexbox/FlexBox";
import { Paragraph } from "@/components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "@/components/table";
import moment from "moment";

export default function CareHomeTableRow(props) {
  const { careHome, isSelected, handleSelectRow, handleDeleteCareHome, keys, openModal } = props;
  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuEl(event.currentTarget);
  };

  const handleCloseOpenMenu = () => setOpenMenuEl(null);

  return (
    <TableRow hover>
      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar
            src={careHome?.avatar || undefined}
            alt={careHome.carehome_name}
            variant="rounded"
          >
            {careHome.carehome_name?.charAt(0)}
          </Avatar>
          <div>
            <Paragraph fontWeight={500} color="text.primary">
              {careHome.carehome_name}
            </Paragraph>
            <Paragraph fontSize={13}>
              {careHome.username}
            </Paragraph>
          </div>
        </FlexBox>
      </TableCell>
      
      <TableCell padding="normal">{careHome.email}</TableCell>
      
      {/* <TableCell padding="normal">{careHome.administrator_name}</TableCell> */}
      
      <TableCell padding="normal">{careHome.phone_number}</TableCell>
      
      <TableCell padding="normal">{careHome.address}</TableCell>
      
      <TableCell padding="normal">
        {moment(careHome.created_at).format("DD MMM YYYY")}
      </TableCell>
      
      <TableCell padding="normal">{careHome.patients_count}</TableCell>

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
              handleCloseOpenMenu();
              // Calling openModal here for editing with careHome id
              navigate(`/dashboard/add-care-home?id=${careHome.id}`);
            }}
            sx={{ color: "primary.main" }}
          />
          {/* <TableMoreMenuItem
            Icon={Visibility}
            title="Overview"
            handleClick={() => {
              handleCloseOpenMenu();
              navigate(`/dashboard/carehome-view?id=${careHome.id}`);
            }}
            sx={{ color: "primary.main" }}
          /> */}
          <TableMoreMenuItem
            Icon={DeleteOutline}
            title="Delete"
            handleClick={() => {
              handleCloseOpenMenu();
              handleDeleteCareHome(careHome.id);
            }}
            sx={{ color: "error.main" }}
          />
        </TableMoreMenu>
      </TableCell>
    </TableRow>
  );
}
