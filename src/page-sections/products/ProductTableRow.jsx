import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // MUI
import Button from "@mui/material/Button"; // Import MUI Button

import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell"; // MUI ICON COMPONENTS

import Edit from "@mui/icons-material/Edit";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; // CUSTOM COMPONENTS

import FlexBox from "@/components/flexbox/FlexBox";
import { Paragraph } from "@/components/typography";
import moment from "moment";

export default function ProductTableRow({
  product,
  handleButtonClick,
  isSelected,
  handleSelectRow,
  handleDeleteProduct,
}) {
  return (
    <TableRow hover>
      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar
            variant="rounded"
            alt={product?.name}
            src={product?.image}
            sx={{
              width: 50,
              height: 50,
            }}
          >
            {product?.patient.first_name.charAt(0) || product?.patient.last_name.charAt(0)}
          </Avatar>

          <div>
            <Paragraph fontWeight={500} color="text.primary">
              {product.patient.first_name} {product.patient.last_name}
            </Paragraph>
            <Paragraph fontSize={13}>{product.category}</Paragraph>
          </div>
        </FlexBox>
      </TableCell>
      <TableCell
        padding="normal"
        sx={{
          width: {
            xs: "150px", // width for mobile
            sm: "200px", // width for tablet/desktop
          },
          minWidth: {
            xs: "150px",
            sm: "200px",
          },
          maxWidth: {
            xs: "150px",
            sm: "200px",
          },
        }}
      >
        <Paragraph
          fontWeight={500}
          color="text.primary"
          sx={{
            wordBreak: "break-word", // This will break long words
            whiteSpace: "normal", // This allows text to wrap
          }}
        >
          {product.title}
        </Paragraph>
      </TableCell>
      <TableCell padding="normal">
        <Paragraph fontWeight={500} color="text.primary">
          {Math.floor(product.call_duration)} minutes
        </Paragraph>
      </TableCell>
      <TableCell padding="normal">
        <Paragraph fontWeight={500} color="text.primary">
          {moment.utc(product?.call_time).local().format("ddd, MMM D, h:mm A")}

          {/* {moment.utc(product?.call_time).local().toDate()} */}
        </Paragraph>
      </TableCell>
      <TableCell padding="normal">
        <Button
          onClick={() => handleButtonClick(product)}
          sx={{ minWidth: "auto", p: 1 }}
        >
          <RemoveRedEye />
        </Button>
      </TableCell>
    </TableRow>
  );
}
