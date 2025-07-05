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
import { useLoader } from "../../../contexts/LoaderContext";
import toast from "react-hot-toast";

// Functions to handle API requests
import { getColdCallScript, updateColdCallScript } from "../../../api/apiAnalysisRoutes";

export default function ColdCallScriptPageView() {

  const [coldCallScript, setColdCallScript] = useState("");
  const [isExistingScript, setIsExistingScript] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  // Validation schema for formik
  const validationSchema = Yup.object({
    script: Yup.string().required("Cold Call Script is Required!"),
  });

  const initialValues = {
    script: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        showLoader();
        const payload = {
          script: values.script,
        };

        // Since we're only updating, use the update function
        if (isExistingScript) {
          await updateColdCallScript(payload);
          toast.success("Cold Call Script updated successfully");
        } else {
          toast.error("Cold Call Script does not exist.");
        }
        await fetchColdCallScript();
      } catch (error) {
        console.error("Error saving cold call script:", error);
        toast.error("Failed to save cold call script");
      } finally {
        hideLoader();
      }
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    formik;

  // Fetch the cold call script using the API
  const fetchColdCallScript = async () => {
    try {
      showLoader();
      const data = await getColdCallScript();
      if (data && data.cold_call_script) {
        setColdCallScript(data.cold_call_script);
        setIsExistingScript(true);
        formik.setValues({ script: data.cold_call_script });
      } else {
        setIsExistingScript(false);
        formik.setValues({ script: "" });
      }
    } catch (error) {
      console.error("Error fetching cold call script:", error);
      setIsExistingScript(false);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchColdCallScript();
  }, []);

  return (
    <Box py={3}>
      <Card sx={{ p: 3, maxWidth: 900, margin: "auto" }}>
        <H6 fontSize={18}>Cold Call Script</H6>

        <Paragraph color="text.secondary" mb={3}>
          Please include the script to follow when making a cold call.
        </Paragraph>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                name="script"
                value={values.script}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                multiline
                rows={25}
                error={touched.script && Boolean(errors.script)}
                helperText={touched.script && errors.script}
              />
            </Grid>
            <Grid size={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit" variant="contained">
                  {isExistingScript ? "Update" : "No Script Found"}
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}
