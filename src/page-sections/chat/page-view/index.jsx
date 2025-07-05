import { useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import Conversation from "../conversation";
import SidebarCallHistory from "../../CallHistory/callHistorySidebar";

export default function ChatPageView() {
  const [openLeftDrawer, setOpenLeftDrawer] = useState(false);
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleOpen = () => setOpenLeftDrawer(true); // RECENT CONVERSATION LIST
  const [singleCall, setSingleCall] = useState(null);

  const MESSAGE_CONTENT = (
    <Card
      sx={{
        height: "100%",
        pb: 1,
      }}
    >
      <SidebarCallHistory {...{ singleCall, setSingleCall }} />
    </Card>
  );
  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {downMd ? (
          <Drawer
            anchor="left"
            open={openLeftDrawer}
            onClose={() => setOpenLeftDrawer(false)}
          >
            <Box width={300} padding={1}>
              {MESSAGE_CONTENT}
            </Box>
          </Drawer>
        ) : (
          <Grid
            size={{
              md: 4,
              xs: 12,
            }}
          >
            {MESSAGE_CONTENT}
          </Grid>
        )}

        <Grid
          size={{
            md: 8,
            xs: 12,
          }}
        >
          <Conversation {...{ singleCall }} handleOpen={handleOpen} />
        </Grid>
      </Grid>
    </div>
  );
}
