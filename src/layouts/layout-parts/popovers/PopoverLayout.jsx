import React from "react"; // MUI

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover"; // CUSTOM COMPONENT

import { H4 } from "@/components/typography"; // ===================================================================
import { useNavigate } from "react-router-dom";

export default function PopoverLayout({
  title,
  children,
  minWidth,
  maxWidth,
  anchorRef,
  popoverOpen,
  popoverClose,
  ViewButton,
}) {
  const navigate = useNavigate();
  return (
    <Popover
      open={popoverOpen}
      onClose={popoverClose}
      anchorEl={anchorRef.current}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            padding: "0.5rem 0",
            minWidth: minWidth || 250,
            maxWidth: maxWidth || 375,
            maxHeight: "400px",
          },
        },
      }}
    >
      <H4 fontSize={16} fontWeight="500" p={2} pt={1.5}>
        {title || "Notifications"}
      </H4>
      <Divider />

      {children}

      {ViewButton ? (
        <Box p={1} pb={0.5}>
          <Button
            variant="text"
            fullWidth
            disableRipple
            onClick={() => {
              popoverClose();
              navigate("/dashboard/account?tab=Notifications");
            }}
          >
            View all Notifications
          </Button>
        </Box>
      ) : null}
    </Popover>
  );
}
