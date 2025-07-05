import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // MUI ICON COMPONENT
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for the loader

import { useFormik } from "formik";
import * as Yup from "yup"; // CUSTOM COMPONENTS

import FlexBox from "@/components/flexbox/FlexBox";
import { H6 } from "@/components/typography";
import { useState } from "react";
import { createInstruction } from "../../../api/axiosApis/post";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function InstructionPageView() {
  const initialValues = {
    instruction: "",
    description: "",
  };

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    instruction: Yup.string(),
    description: Yup.string(),
  });

  const {
    values,
    errors,
    touched,
    resetForm,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async () => {
      setIsSubmitting(true);

      try {
        const data = {
          instruction: values.instruction.trim(),
          description: values.description.trim(),
        };

        let response;

        if (values.instruction && values.description) {
          response = await createInstruction({
            instruction: values.instruction.trim(),
          });

          response = await createInstruction({
            description: values.description.trim(),
          });
          toast.success("Instruction and Description submitted successfully!");
        } else if (values.instruction) {
          response = await createInstruction({
            instruction: values.instruction,
          });
          toast.success(response?.data?.message);
        } else if (values.description) {
          response = await createInstruction({
            description: values.description,
          });
          toast.success(response?.data?.message);
        }
        resetForm();
        navigate("/dashboard");
      } catch (error) {
        toast.error(
          error?.message || "There was an error submitting the instruction."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const isSubmitDisabled =
    values.instruction.trim() === "" && values.description.trim() === "";

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Box py={3}>
      <Card
        sx={{
          p: 3,
          maxWidth: 900,
          margin: "auto",
        }}
      >
        <H6 fontSize={18} mb={3}>
          Instruction & Description
        </H6>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                multiline
                rows={6}
                fullWidth
                name="instruction"
                value={values.instruction}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Instruction"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                multiline
                rows={6}
                fullWidth
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Description"
              />
            </Grid>

            <Grid item xs={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button
                  type="submit"
                  disabled={isSubmitDisabled || isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => resetForm()}
                >
                  Clear
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}
