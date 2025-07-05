import { Fragment } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import { H3, H6, Paragraph } from "@/components/typography";
import FlexRowAlign from "@/components/flexbox/FlexRowAlign";
import cover from "../../../public/assets/cover.png";

export default function Layout({ children, login }) {
  return (
    <Grid container height="100%">
      <Grid
        size={{
          md: 6,
          xs: 12,
        }}
      >
        <FlexRowAlign
          height="100%"
          sx={{
            // background: `linear-gradient(rgba(255, 92, 180, 0.9), rgba(159, 90, 140, 0.9)), url(${cover})`,
            background: `linear-gradient(rgb(255 92 180 / 14%), rgb(159 90 140 / 20%)) center center / cover, url(${cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Box my={4}>
            <Box
              component="img"
              src="/static/logo/logo-svg-white.svg"
              alt="Mind Meta AI Logo"
              sx={{
                display: "block",
                margin: "20px auto",
                width: "150px",
                height: "auto",
              }}
            />
            <H6
              sx={{
                textAlign: "center",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              Mind Meta AI
            </H6>
            <Paragraph
              sx={{
                textAlign: "center",
                mt: 2,
                color: "white",
                fontSize: "1.1rem",
              }}
            >
              Revolutionizing Dementia Care
            </Paragraph>
          </Box>
        </FlexRowAlign>
      </Grid>

      <Grid
        size={{
          md: 6,
          xs: 12,
        }}
      >
        <FlexRowAlign bgcolor="background.paper" height="100%">
          {children}
        </FlexRowAlign>
      </Grid>
    </Grid>
  );
}
