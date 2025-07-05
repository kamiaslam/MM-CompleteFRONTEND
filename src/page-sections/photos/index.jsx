import { useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import AllCalls from "./AllCalls";
import MediaDetails from "./MediaDetails";

export default function PhotoView() {
  const [openLeftDrawer, setOpenLeftDrawer] = useState(false);
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleOpen = () => setOpenLeftDrawer(true); // RECENT CONVERSATION LIST

  // const { callHistory } = useSelector((state) => state.family);

  const [singleCall, setSingleCall] = useState(null);
  const MESSAGE_CONTENT = (
    <Card
      sx={{
        height: "calc(100vh - 150px)",
        pb: 1,
      }}
    >
      <AllCalls {...{ singleCall, setSingleCall }} />
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
          <MediaDetails {...{ singleCall }} handleOpen={handleOpen} />
        </Grid>
      </Grid>
    </div>
  );
}
