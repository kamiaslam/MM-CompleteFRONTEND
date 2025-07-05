import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import { H5, Paragraph } from "@/components/typography";
import FlexRowAlign from "@/components/flexbox/FlexRowAlign";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ButtonBase } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import { ResetPassword } from "../../../api/axiosApis/post";
import LinearProgress from "@mui/material/LinearProgress"; 

export default function ResetPasswordPageView() {
  const navigate = useNavigate();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const forgotPasswordInfo = JSON.parse(
    localStorage.getItem("forgotPasswordEmail")
  );

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true); 

        const response = await ResetPassword({
          email: forgotPasswordInfo?.email,
          new_password: values.newPassword,
        });

        

        const resPayload = response;

        if (resPayload?.status === "success") {
          toast.success(resPayload.message);
          navigate("/login"); 
          formik.resetForm();
          localStorage.clear();
        } else {
          toast.error(
            !Array.isArray(resPayload?.detail)
              ? resPayload?.detail
              : "Something went wrong"
          );
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      formik.handleBlur(e);
      if (!formik.errors[fieldName]) {
        if (fieldName === "newPassword") {
          document.getElementById("confirmPassword").focus(); 
        } else if (fieldName === "confirmPassword") {
          formik.handleSubmit();
        }
      }
    }
  };

  return (
    <FlexRowAlign height="100%" bgcolor="background.paper">
      <Box textAlign="center" maxWidth={550} width="100%" padding={4}>
        <img src="/static/forget-passwod.svg" alt="Logo" />
        <H5 mt={2}>Reset your password</H5>
        <Paragraph color="text.secondary" mt={1} px={4}>
          Please reset the new password.
        </Paragraph>

        {/* Form to handle form submission properly */}
        <form onSubmit={formik.handleSubmit}>
          <Stack gap={3} mt={5}>
            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && !!formik.errors.newPassword}
              onKeyDown={(e) => handleKeyDown(e, "newPassword")}
              InputProps={{
                endAdornment: (
                  <ButtonBase
                    disableRipple
                    disableTouchRipple
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </ButtonBase>
                ),
              }}
            />
            <span
              style={{
                color: "red",
                display: "flex",
                marginTop: "-25px",
                fontSize: "12px",
                justifyContent: "start",
              }}
            >
              {formik.errors.newPassword &&
                formik.touched.newPassword &&
                formik.errors.newPassword}
            </span>

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                !!formik.errors.confirmPassword
              }
              onKeyDown={(e) => handleKeyDown(e, "confirmPassword")}
              InputProps={{
                endAdornment: (
                  <ButtonBase
                    disableRipple
                    disableTouchRipple
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </ButtonBase>
                ),
              }}
            />
            <span
              style={{
                color: "red",
                display: "flex",
                marginTop: "-25px",
                fontSize: "12px",
                justifyContent: "start",
              }}
            >
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword}
            </span>

            {/* Reset button with linear progress loader */}
            <Button
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                height: "50px",

                textTransform: "none",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <LinearProgress
                  sx={{
                    width: "50%",
                    color: "inherit",
                  }}
                />
              ) : (
                "Reset"
              )}
            </Button>

            <Button
              disableRipple
              variant="text"
              color="primary.main"
              onClick={() => navigate("/login")}
            >
              <NavigateBefore fontSize="small" /> Back to Sign In
            </Button>
          </Stack>
        </form>
      </Box>
    </FlexRowAlign>
  );
}
