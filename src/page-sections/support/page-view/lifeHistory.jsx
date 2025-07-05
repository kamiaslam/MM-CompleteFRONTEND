import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useFormik } from "formik";
import * as Yup from "yup";

import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { getLifeHistory } from "../../../api/axiosApis/get";
import { UpdateLifeHistory } from "../../../api/axiosApis/Put";
import { createLifeHistory } from "../../../api/axiosApis/post";
import toast from "react-hot-toast";
import { useLoader } from "../../../contexts/LoaderContext";
export default function LifeHistoryPageView() {
  const [lifeHistory, setLifeHistory] = useState(null);
  const [isExistingHistory, setIsExistingHistory] = useState(false);
  const { showLoader, hideLoader } = useLoader(); // Add this line

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const patientId = authUser?.user_info?.patient_id;

  // Validation schema for formik
  const validationSchema = Yup.object({
    history: Yup.string().required("Life History is Required!"),
  });

  const initialValues = {
    history: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        showLoader();
        const payload = {
          patientId: patientId,
          history: values.history,
        };

        if (isExistingHistory) {
          await UpdateLifeHistory(patientId, payload);
          toast.success(data.message);
        } else {
          await createLifeHistory(payload);
          toast.success("Life History created successfully");
        }
        await fetchLifeHistory();
      } catch (error) {
        console.error("Full error:", error);
      } finally {
        hideLoader();
      }
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    formik;

  const fetchLifeHistory = async () => {
    try {
      showLoader();
      const data = await getLifeHistory(patientId);
      if (data && data.data) {
        setLifeHistory(data.data);
        setIsExistingHistory(true);
        formik.setValues({
          history: data.data.life_history || "",
        });
      } else {
        setIsExistingHistory(false);
        formik.setValues({ history: "" });
      }
    } catch (error) {
      console.error("Error fetching life history:", error);
      setIsExistingHistory(false);
    } finally {
      hideLoader();
    }

  };

  useEffect(() => {
    if (patientId) {
      fetchLifeHistory();
    }
  }, [patientId]);

  return (
    <Box py={3}>
      <Card sx={{ p: 3, maxWidth: 900, margin: "auto" }}>
        <H6 fontSize={18}>Life History</H6>

        <Paragraph color="text.secondary" mb={3}>
          Please include as many details as possible about your question or
          problem.
        </Paragraph>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                name="history"
                value={values.history}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                multiline
                rows={25}
                error={touched.history && Boolean(errors.history)}
                helperText={touched.history && errors.history}
              />
            </Grid>
            <Grid size={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit" variant="contained">
                  {isExistingHistory ? "Update" : "Create"} Life History
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}
