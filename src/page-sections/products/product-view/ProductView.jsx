import { useRef, useState } from "react"; // MUI

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup"; // CUSTOM COMPONENTS

import Counter from "@/components/counter";
import ChevronDown from "@/icons/ChevronDown";
import Facebook from "@/icons/social/Facebook";
import Instagram from "@/icons/social/Instagram"; // STYLED COMPONENTS
import Carousel from "@/components/carousel";
import ColorRadio from "@/components/color-radio";
import FlexBox from "@/components/flexbox/FlexBox";
import { H2, H6, Paragraph } from "@/components/typography"; // CUSTOM ICON COMPONENTS

import Heart from "@/icons/Heart";
import Twitter from "@/icons/social/Twitter";

import { CarouselRoot, SlideThumb, StyledIconButton } from "./styles";
import { functionGetTime } from "../../../helper/constant";
export default function ProductViewCard({ details, setDetails }) {
  const options = {
    weekday: "short", // Fri
    month: "short", // Nov
    day: "numeric", // 22
    hour: "numeric", // 1
    minute: "2-digit", // 03
    hour12: true, // AM/PM format
  };
  return (
    <>
      <Card sx={{ padding: 2 }}>
        <H6 fontSize={16}>Call Details</H6>
        <div className="call-details">
          <div className="call-details call-details-box-light">
            <div className="call-details-box" style={{ maxWidth: "100%" }}>
              <div
                className="call-details-box-text-alignment"
                style={{ display: "flex", margin: "8px 0" }}
              >
                <H6
                  fontSize={14}
                  fontWeight={400}
                  sx={{
                    width: "100px",
                    textAlign: "left",
                    marginRight: "16px",
                  }}
                >
                  Title<b>:</b>
                </H6>
                <span>{details.title}</span>
              </div>

              <div
                className="call-details-box-text-alignment"
                style={{ display: "flex", margin: "8px 0" }}
              >
                <H6
                  fontSize={14}
                  fontWeight={400}
                  sx={{
                    width: "100px",
                    textAlign: "left",
                    marginRight: "16px",
                  }}
                >
                  Patient Name<b>:</b>
                </H6>
                <span>
                  {details.patient.first_name} {details.patient.last_name}
                </span>
              </div>

              <div
                className="call-details-box-text-alignment"
                style={{ display: "flex", margin: "8px 0" }}
              >
                <H6
                  fontSize={14}
                  fontWeight={400}
                  sx={{
                    width: "100px",
                    textAlign: "left",
                    marginRight: "16px",
                  }}
                >
                  Call Duration<b>:</b>
                </H6>
                <span>{Math.floor(details.call_duration)} minutes</span>
              </div>

              <div
                className="call-details-box-text-alignment"
                style={{ display: "flex", margin: "8px 0" }}
              >
                <H6
                  fontSize={14}
                  fontWeight={400}
                  sx={{
                    width: "100px",
                    textAlign: "left",
                    marginRight: "16px",
                  }}
                >
                  Call Time<b>:</b>
                </H6>
                <span>{functionGetTime(details?.call_time)}</span>
              </div>

              <div
                className="call-details-box-text-alignment"
                style={{ display: "flex", margin: "8px 0" }}
              >
                <H6
                  fontSize={14}
                  fontWeight={400}
                  sx={{
                    textAlign: "left",
                    marginRight: "36px",
                  }}
                >
                  Description<b>:</b>
                </H6>
                <span style={{ maxHeight: "150px", overflow: "auto" }}>
                  {details?.description}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <FlexBox
        flexWrap="wrap"
        gap={2}
        sx={{
          my: 3,
        }}
      >
        <Button
          onClick={() => {
            setDetails(null);
          }}
          type="submit"
          variant="contained"
        >
          Go Back
        </Button>
      </FlexBox>
    </>
  );
}
