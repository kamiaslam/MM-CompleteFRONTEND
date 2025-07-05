import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { handleSpaceKeyPress } from "@/utils";
import * as Yup from "yup";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { capitalizeValue, EMAIL_REGEX } from "../../../helper/constant";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { createFamilyMember } from "../../../api/axiosApis/post";
import { useLoader } from "../../../contexts/LoaderContext";

export default function AddFamilyMember({
  open,
  onClose,
  users,
  setUsers,
  userId,
  setUserId,
  isEdit,
  setIsEdit,
}) {
  const id = new URL(window.location).searchParams.get("id");
  function isEmpty(value) {
    return (
      value == null ||
      value == undefined ||
      value == 0 ||
      (typeof value === "string" && !value?.trim()) ||
      (Array?.isArray(value) && !value?.length)
    );
  }
  const { showLoader, hideLoader } = useLoader();
  const initialValues = {
    name: "",
    email: "",
    birth_date: "",
    relation: "",
    gender: "Female",
    otherRelation: "",
  };
  const validationSchema = Yup.object().shape({
    relation: Yup.string().required("Relation is required!"),
    name: Yup.string().required("Name is required!"),
    birth_date: Yup.date().required("Date of Birth is required!"),
    email: Yup.string()
      .required("Email is required!")
      .test("is-valid-email", "Invalid email format", (value) =>
        EMAIL_REGEX.test(value)
      ),
    otherRelation: Yup.string()
      .nullable()
      .when("relation", {
        is: "Other",
        then: (schema) => schema.required("Please specify the relation"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const submissionData = { ...values };

      // Adjust relation if it's "Other"
      if (values.relation !== "Other") {
        delete submissionData.otherRelation;
      } else {
        submissionData.relation = submissionData.otherRelation;
        delete submissionData.otherRelation;
      }

      if (!isEmpty(userId)) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...submissionData, id: userId } : user
          )
        );
        toast.success("Family member updated successfully");
      } else {
        if (id) {
          await createFamilyMember(submissionData, id , showLoader, hideLoader).then((res) => {
            if (res?.data?.success) {
              if (users?.length > 0) {
                setUsers((prevUsers) => [...prevUsers, res?.data?.data]);
              } else {
                setUsers([res?.data?.data]);
              }
              toast.success("Family member added successfully");
            }
          });
        } else {
          submissionData.id = uuidv4();
          if (users.length > 0) {
            setUsers((prevUsers) => [...prevUsers, submissionData]);
          } else {
            setUsers([submissionData]);
          }
        }
      }

      resetForm();
      onClose();
      handleClose();
    },
  });

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const userUpdateId = searchParams.get("id");
  useEffect(() => {
    if (!userUpdateId) {
      formik.resetForm();
    }
    if (userUpdateId === null) {
      resetForm();
    }
  }, [location, userUpdateId]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    validateField,
    setFieldTouched,
  } = formik;

  useEffect(() => {
    if (open) {
      if (userId) {
        const userToEdit = users.find((user) => user.id === userId);
        setIsEdit(true);
        if (userToEdit) {
          setFieldValue("name", userToEdit.name || "");
          setFieldValue("email", userToEdit.email || "");
          setFieldValue("birth_date", moment(userToEdit.birth_date).format("YYYY-MM-DD") || "");
          setFieldValue("gender", userToEdit.gender || "Female");
          const staticRelation = [
            "Father",
            "Mother",
            "Sibling",
            "Son",
            "Daughter",
            "Spouse",
          ];
          if (staticRelation.includes(userToEdit?.relation)) {
            setFieldValue("relation", userToEdit.relation || "");
          } else {
            setFieldValue("relation", "Other");
            setFieldValue("otherRelation", userToEdit.relation || "");
          }
        }
      } else {
        resetForm();
      }
    }
  }, [open, userId]);

  const handleClose = () => {
    resetForm(); // Reset form values when the dialog is closed
    setUserId("");
    onClose();
  };

  const handleRelationChange = (event) => {
    const selectedValue = event.target.value;
    setFieldValue("relation", selectedValue);

    if (selectedValue === "Other") {
      setFieldValue("otherRelation", ""); // Clear any previous value
      setFieldTouched("otherRelation", true); // Mark as touched
      validateField("otherRelation"); // Trigger validation
    } else {
      setFieldValue("otherRelation", ""); // Reset the field when not "Other"
      setFieldTouched("otherRelation", false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle display={"flex"} justifyContent={"space-between"}>
        {userId ? "Edit Family Member" : "Add Family Member"}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                style={{ marginTop: "10px" }}
                select
                fullWidth
                InputLabelProps={{
                  shrink: true, // Keeps the label above the input
                }}
                name="relation"
                variant="outlined"
                label="Relation"
                onChange={handleRelationChange}
                value={values.relation}
                helperText={touched.relation && errors.relation}
                error={Boolean(touched.relation && errors.relation)}
                SelectProps={{
                  native: true,
                  IconComponent: KeyboardArrowDown,
                }}
              >
                <option value="" disabled>
                  Select Relation
                </option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling">Sibling</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Spouse">Spouse</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>

            {values.relation === "Other" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  onKeyDown={handleSpaceKeyPress}
                  onChange={(e) => {
                    const sendValue = e.target.value?.trimStart();
                    setFieldValue("otherRelation", capitalizeValue(sendValue));
                  }}
                  name="otherRelation"
                  label="Specify Relation"
                  value={values.otherRelation}
                  helperText={touched.otherRelation && errors.otherRelation}
                  error={Boolean(touched.otherRelation && errors.otherRelation)}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                onKeyDown={handleSpaceKeyPress}
                fullWidth
                name="name"
                label="Name"
                value={values.name}
                onChange={(e) => {
                  const sendValue = e.target.value?.trimStart();
                  setFieldValue("name", capitalizeValue(sendValue));
                }}
                helperText={touched.name && errors.name}
                error={Boolean(touched.name && errors.name)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="birth_date"
                type="date"
                onClick={(e) => {
                  e.target.showPicker();
                }}
                label="Date of Birth"
                InputLabelProps={{
                  shrink: true, // Keeps the label above the input
                }}
                value={values.birth_date}
                onChange={handleChange}
                helperText={touched.birth_date && errors.birth_date}
                error={Boolean(touched.birth_date && errors.birth_date)}
                sx={{
                  "& input": {
                    cursor: "pointer", // Ensures the input cursor style is pointer
                  },
                }}
                inputProps={{
                  max: moment().format("YYYY-MM-DD"), // Today's date
                  min: moment().subtract(150, "years").format("YYYY-MM-DD"), // 150 years ago
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                onKeyDown={handleSpaceKeyPress}
                fullWidth
                disabled={isEdit}
                name="email"
                label="Email Address"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    // Use theme colors instead of hardcoded values
                    color: (theme) => theme.palette.text.primary,
                    WebkitTextFillColor: (theme) => theme.palette.text.secondary,
                    cursor: "not-allowed",
                  },
                  "& .MuiInputLabel-root.Mui-disabled": {
                    color: (theme) => theme.palette.text.secondary,
                  },
                  "& .MuiOutlinedInput-root.Mui-disabled": {
                    // Use theme colors for the outline
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: (theme) => theme.palette.divider,
                    },
                  },
                }}
                value={values.email}
                onChange={(e) => {
                  const lowercaseEmail = e.target.value.trim().toLowerCase();
                  setFieldValue("email", lowercaseEmail);
                }}
                // onChange={handleChange}
                helperText={touched.email && errors.email}
                error={Boolean(touched.email && errors.email)}
              />
            </Grid>

            <Grid item xs={12}>
              <RadioGroup
                row
                name="gender"
                value={values.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {userId ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
