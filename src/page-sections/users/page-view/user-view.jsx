import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react"; // MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import HeadingArea from "../HeadingArea";
import Grid from "@mui/material/Grid2";
import { TableDataNotFound } from "@/components/table"; // CUSTOM PAGE SECTION COMPONENTS
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { getEmotionFeaturesByPatient } from "../../../api/axiosApis/get";
import { useLoader } from "../../../contexts/LoaderContext";
import Sales from "../../dashboards/ecommerce/Sales";

export default function UserList1PageView() {
  const [dateValue, setDateValue] = useState(moment().format("YYYY-MM-DD"));
  const [emotionFeatures, setEmotionFeatures] = useState({});
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { loading, showLoader, hideLoader } = useLoader();

  useEffect(() => {
    getEmotionFeaturesByPatient(id, dateValue, showLoader, hideLoader)
      .then((res) => {
        setEmotionFeatures(res?.data);
      })
      .catch((error) => {
        console.error("Error fetching emotion features:", error);
      })
      .finally(() => {
        hideLoader(); // Ensure loader is hidden regardless of success/failure
      });
  }, [id, dateValue]);

  return (
    <div className="pt-2 pb-4">
      <Card>
        <Box px={2} pt={2} pb={3}>
          <HeadingArea
            backButton
            userIcon
            buttonNotShow
            differentName={"Patient Overview"}
          />
        </Box>
        <Grid container justifyContent="start">
          <Grid paddingBottom={2} px={2}>
            <TextField
              fullWidth
              sx={{
                "& input": {
                  cursor: "pointer",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                },
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              label="Date"
              type="date"
              value={dateValue}
              onClick={(e) => {
                e.target.showPicker();
              }}
              onChange={(e) => {
                const selectedDate = e.target.value;
                if (!selectedDate) {
                  setDateValue(moment().format("YYYY-MM-DD")); // Set to current date if cleared
                  return;
                }
                // Validate if the date is in the past
                const today = moment().startOf("day");
                const selected = moment(selectedDate);

                if (selected.isBefore(today) || selected.isSame(today)) {
                  setDateValue(selectedDate);
                } else {
                  alert("Please select a past or current date");
                }
              }}
              inputProps={{
                // Prevent paste
                onPaste: (e) => e.preventDefault(),
                // Prevent keyboard input
                onKeyDown: (e) => e.preventDefault(),

                max: moment().format("YYYY-MM-DD"), // Set maximum date to today
              }}
            />
          </Grid>
        </Grid>
        {loading ? (
          <Table>
            <TableBody>
              <TableDataNotFound customSentence={"Loading data..."} />
            </TableBody>
          </Table>
        ) : (
          <Box width="100%">
            {Object.keys(emotionFeatures || {}).length > 0 ? (
              <Grid
                size={{
                  md: 8,
                  xs: 12,
                }}
              >
                <Sales emotionFeatures={emotionFeatures} />
              </Grid>
            ) : (
              <Table>
                <TableBody>
                  <TableDataNotFound
                    customSentence={
                      "No overview available for the chosen date. Please select a different date."
                    }
                  />
                </TableBody>
              </Table>
            )}
          </Box>
        )}
      </Card>
    </div>
  );
}
