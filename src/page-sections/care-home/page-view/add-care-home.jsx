import { useEffect } from "react"; // 🔥 import useEffect
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import { useFormik } from "formik";
import HeadingArea from "../HeadingArea.jsx";
import FlexBox from "@/components/flexbox/FlexBox";

import {
  capitalizeValue,
  EMAIL_REGEX,
} from "../../../helper/constant";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoader } from "../../../contexts/LoaderContext";
import { createCarehome } from "../../../api/axiosApis/post";
import { fetchSingleCarehome } from "../../../api/axiosApis/get"; 
import { updateCarehome } from "../../../api/axiosApis/Put";

export default function AddCareHomePageView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const initialValues = {
    username: "",
    email: "",
    careHomeName: "",
    administratorName: "",
    phoneNumber: "",
    address: "",
  };

  const { showLoader, hideLoader } = useLoader();

  // Conditionally add username validation if in edit mode.
  const validationSchema = Yup.object().shape({
    ...(id && {
      username: Yup.string()
        .required("Username is Required!")
        .min(3, "Username must be at least 3 characters"),
    }),
    email: Yup.string()
      .required("Email is required!")
      .test("is-valid-email", "Invalid email format", (value) =>
        EMAIL_REGEX.test(value)
      ),
    careHomeName: Yup.string().required("Care Home Name is Required!"),
    administratorName: Yup.string().required("Administrator Name is Required!"),
    phoneNumber: Yup.string()
      .required("Phone Number is Required!")
      .matches(/^\d+$/, "Phone Number must contain only digits"),
    address: Yup.string().required("Address is Required!"),
  });

  const navigate = useNavigate();

  const {
    values,
    setFieldValue,
    errors,
    handleSubmit,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Build payload (username is excluded in both modes)
        const payload = {
          email: values.email.trim(),
          carehome_name: values.careHomeName.trim(),
          administrator_name: values.administratorName.trim(),
          phone_number: String(values.phoneNumber).trim(), // Convert to string to avoid trim errors
          address: values.address.trim(),
        };

        if (id) {
          // Edit mode: update care home details
          await updateCarehome(
            payload,
            id,
            showLoader,
            hideLoader
          ).then((res) => {
            if (res?.data?.success) {
              resetForm();
              navigate("/dashboard/care-home-list");
            }
          });
        } else {
          // Add mode: create a new care home
          await createCarehome(
            payload,
            showLoader,
            hideLoader
          ).then((res) => {
            if (res?.data?.success) {
              resetForm();
              navigate("/dashboard/care-home-list");
            }
          });
        }
      } catch (error) {
        console.error("Error creating/updating care home:", error);
      }
    },
  });

  useEffect(() => {
    const loadCarehomeDetails = async () => {
      if (id) {
        try {
          const res = await fetchSingleCarehome(id, showLoader, hideLoader);
          const data = res?.data;
          if (data) {
            setFieldValue("username", data.username);
            setFieldValue("email", data.email);
            setFieldValue("careHomeName", data.carehome_name);
            setFieldValue("administratorName", data.administrator_name);
            // Ensure phone number is a string if the API returns a numeric value.
            setFieldValue("phoneNumber", data.phone_number?.toString() || "");
            setFieldValue("address", data.address);
          }
        } catch (error) {
          console.error("Failed to load care home details", error);
        }
      }
    };

    loadCarehomeDetails();
  }, [id]);

  const handleClear = () => {
    resetForm();
  };

  return (
    <>
      <div className="pt-2 pb-4">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ md: 12, xs: 12 }}>
              <Card className="p-3">
                <Box pb={3}>
                  <HeadingArea
                    backButton={!!id}
                    userIcon
                    buttonNotShow
                    differentName={id ? "Edit Care Home" : "Add Care Home"}
                  />
                </Box>

                <Grid
                  size={12}
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pb: 2 }}
                >
                  <span>General Information</span>
                </Grid>
                <Grid container spacing={3}>
                  {id && (
                    <Grid size={{ sm: 6, xs: 12 }}>
                      <TextField
                        fullWidth
                        name="username"
                        label="Username"
                        value={values.username}
                        onChange={(e) => {
                          const sendValue = e.target.value?.trimStart();
                          setFieldValue("username", sendValue);
                        }}
                        helperText={touched.username && errors.username}
                        error={Boolean(touched.username && errors.username)}
                        disabled={true} // Always disabled in edit mode
                      />
                    </Grid>
                  )}

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      value={values.email}
                      onChange={(e) => {
                        const lowercaseEmail = e.target.value.trim().toLowerCase();
                        setFieldValue("email", lowercaseEmail);
                      }}
                      helperText={touched.email && errors.email}
                      error={Boolean(touched.email && errors.email)}
                      disabled={!!id} // Disabled in edit mode
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="careHomeName"
                      label="Care Home Name"
                      value={values.careHomeName}
                      onChange={(e) => {
                        const sendValue = e.target.value?.trimStart();
                        setFieldValue("careHomeName", capitalizeValue(sendValue));
                      }}
                      helperText={touched.careHomeName && errors.careHomeName}
                      error={Boolean(touched.careHomeName && errors.careHomeName)}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="administratorName"
                      label="Administrator Name"
                      value={values.administratorName}
                      onChange={(e) => {
                        const sendValue = e.target.value?.trimStart();
                        setFieldValue("administratorName", capitalizeValue(sendValue));
                      }}
                      helperText={touched.administratorName && errors.administratorName}
                      error={Boolean(touched.administratorName && errors.administratorName)}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="phoneNumber"
                      label="Phone Number"
                      value={values.phoneNumber}
                      onChange={(e) => {
                        const sendValue = e.target.value.replace(/\D/g, "");
                        setFieldValue("phoneNumber", sendValue);
                      }}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="address"
                      label="Address"
                      value={values.address}
                      onChange={(e) => {
                        const sendValue = e.target.value?.trimStart();
                        setFieldValue("address", capitalizeValue(sendValue));
                      }}
                      helperText={touched.address && errors.address}
                      error={Boolean(touched.address && errors.address)}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <FlexBox flexWrap="wrap" gap={2}>
              <Button type="submit" variant="contained">
                {id ? "Update" : "Add"}
              </Button>
              {!id && (
                <Button onClick={handleClear} variant="outlined" color="secondary">
                  Clear
                </Button>
              )}
            </FlexBox>
          </Grid>
        </form>
      </div>
    </>
  );
}
