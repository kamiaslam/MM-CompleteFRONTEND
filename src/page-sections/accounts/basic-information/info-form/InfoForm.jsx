import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { handleSpaceKeyPress } from "@/utils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import { useFormik } from "formik"; // CUSTOM COMPONENTS
import './index.css'
import { H6 } from "@/components/typography";
import { isSuccessResp } from "../../../../api/base";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../../api/axiosApis/post";
import { UpdateCareHomeProfile } from "../../../../api/axiosApis/Put";
import { useLoader } from "../../../../contexts/LoaderContext";
import { useTheme } from "@mui/material";
export default function InfoForm({  adminData }) {
  const { showLoader, hideLoader } = useLoader();
  const theme = useTheme(); // Add this hook

  const initialValues = {
    phone_number: String(adminData?.phone_number) || "",
    countryCode: String(adminData?.phone_number) || "in",
    username: adminData?.username || "",
    carehome_name: adminData?.carehome_name || "",
    administrator_name: adminData?.administrator_name || "",
    email: adminData?.email || "",
    address: adminData?.address || "",
  };

  const validationSchema = Yup.object({
    carehome_name: Yup.string().required("Care home name is required!"),
    administrator_name: Yup.string().required(
      "Administrator name is required!"
    ),
    phone_number: Yup.string()
      .matches(/^\+?[0-9]{9,}$/, "Phone number must be at least 9 digits")
      .required("Phone number is required!"),
    address: Yup.string().required("Address is required!"),
  });
  const navigate = useNavigate();
  const {
    values,
    setFieldValue,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await UpdateCareHomeProfile(values, showLoader, hideLoader).then(
          async (res) => {
            if (isSuccessResp(res.status)) {
              navigate("/dashboard/profile");
            }
          }
        );
      } catch (error) {
      }
    },
  });

  const handlePhoneBlur = () => {
    setFieldValue("touched.phone_number", true); // Mark as touched
  };
  const handlePhoneChange = (value, country) => {
    const countryCode = country?.countryCode;
    setFieldValue("phone_number", value);
    setFieldValue("countryCode", countryCode); // Optional, if you need it
    setFieldValue("touched.phone_number", true, false);
  };
  return (
    <>
      <Card
        sx={{
          mt: 3,
        }}
      >
        <H6 fontSize={14} px={3} py={2}>
          Basic Information
        </H6>

        <Divider />

        <form onSubmit={handleSubmit}>
          <Box margin={3}>
            <Grid container spacing={3}>
              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  InputLabelProps={{
                    shrink: true, // Keeps the label above the input
                  }}
                  variant="outlined"
                  onBlur={handleBlur}
                  disabled
                  onChange={handleChange}
                  value={values.username}
                  helperText={touched.username && errors.username}
                  error={Boolean(touched.username && errors.username)}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "gray", // Color for the input text
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "#9ca3af", // Color for the label when disabled
                    },
                  }}
                />
              </Grid>

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  name="carehome_name"
                  onKeyDown={handleSpaceKeyPress}
                  label="Care home name"
                  variant="outlined"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.carehome_name}
                  helperText={touched.carehome_name && errors.carehome_name}
                  error={Boolean(touched.carehome_name && errors.carehome_name)}
                />
              </Grid>

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  name="administrator_name"
                  label="Administrator Name"
                  onKeyDown={handleSpaceKeyPress}
                  variant="outlined"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.administrator_name}
                  helperText={
                    touched.administrator_name && errors.administrator_name
                  }
                  error={Boolean(
                    touched.administrator_name && errors.administrator_name
                  )}
                />
              </Grid>

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <PhoneInput
                  country={"us"}
                  value={values.phone_number}
                  onBlur={handlePhoneBlur}
                  onChange={handlePhoneChange}
                  placeholder="Please enter phone number"
                  inputProps={{
                    name: "phone_number",
                  }}
                  inputStyle={{
                    width: "100%",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "#fff",
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.text.primary
                        : "#000",
                  }}
                  dropdownStyle={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "#fff",
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                  }}
                  containerStyle={{
                    width: "100%",
                  }}
                  buttonStyle={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "#fff",
                  }}
                  dropdownClass="custom-dropdown"
                />

                {touched.phone_number && errors.phone_number && (
                  <span style={{ color: "red", fontSize: "0.8em" }}>
                    {errors.phone_number}
                  </span>
                )}
              </Grid>

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  name="email"
                  variant="outlined"
                  disabled
                  label="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "gray",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "#9ca3af",
                    },
                  }}
                />
              </Grid>
              <Grid
                size={{
                  sm: 12,
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  variant="outlined"
                  onKeyDown={handleSpaceKeyPress}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  helperText={touched.address && errors.address}
                  error={Boolean(touched.address && errors.address)}
                  multiline
                  minRows={3}
                />
              </Grid>

              <Grid size={12}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>

                <Button
                  onClick={() => navigate("/dashboard/profile")}
                  variant="outlined"
                  sx={{
                    ml: 2,
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Card>
    </>
  );
}
