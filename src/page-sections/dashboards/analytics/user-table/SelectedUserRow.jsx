import { useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import FlexBox from "@/components/flexbox/FlexBox";
import { Paragraph } from "@/components/typography";
import Button from "@mui/material/Button";
import { giveAccessToUser } from "../../../../api/apiAnalysisRoutes";

// Optional: retain this function if you use it when isWaitingForAccess is false
const formatRemainingTime = (remainingTime) => {
  if (remainingTime === undefined || remainingTime === null) return "N/A";
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;
  return `${minutes}m ${seconds}s`;
};

export default function SelectedUserRow({ user, isWaitingForAccess, refreshList }) {
  const [loading, setLoading] = useState(false);

  const handleGiveAccess = async () => {
    setLoading(true);
    try {
      await giveAccessToUser(user.email);
      // Instead of showing "Access Granted", re-fetch the list to update the UI
      refreshList();
    } catch (error) {
      console.error("Error giving access", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableRow hover>
      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar
            src={user?.avatar || ""}
            alt={user.name}
            variant="rounded"
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
          <div>
            <Paragraph fontWeight={500} color="text.primary">
              {user.name ?? "Unknown"}
            </Paragraph>
          </div>
        </FlexBox>
      </TableCell>
      <TableCell padding="normal">{user.email}</TableCell>
      <TableCell padding="normal">{user.phone_number}</TableCell>
    </TableRow>
  );
}
