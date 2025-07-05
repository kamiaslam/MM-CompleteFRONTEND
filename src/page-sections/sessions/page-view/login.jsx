import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { handleSpaceKeyPress } from "@/utils";
// MUI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import LoadingButton from "@mui/lab/LoadingButton";
import styled from "@mui/material/styles/styled";

// MUI Icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Custom Hook
import useAuth from "@/hooks/useAuth";

// Custom Components
import Layout from "../Layout";
import Link from "@/components/link";
import { H5, H6, Paragraph } from "@/components/typography";
import { FlexBetween, FlexBox } from "@/components/flexbox";

// Social Icons
import { loginUser } from "../../../api/axiosApis/post";
import { isSuccessResp } from "../../../api/base";
import { useNavigate } from "react-router-dom";
import { EMAIL_REGEX } from "../../../helper/constant";
import { useWebSocketContext } from "../../../api/WebSocketProvider";

// Styled Component
const StyledButton = styled(ButtonBase)(({ theme }) => ({
  padding: 12,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
}));

export default function LoginPageView() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    remember: false,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .required("Email is required!")
      .test("is-valid-email", "Invalid email format", (value) => EMAIL_REGEX.test(value)),

    password: Yup.string().min(8, "Password must be at least 8 characters long").required("Password is required"),
  });
  const { initializeWebSocket } = useWebSocketContext();

  const { errors, values, touched, isSubmitting, handleBlur, setFieldValue, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await loginUser({
          username: values.username?.trimStart(),
          email: values.email.trim(),
          password: values.password?.trim(),
        }).then(async (res) => {
          if (res?.data?.success) {
            localStorage.setItem("authUser", JSON.stringify({ ...res?.data?.data }));
            initializeWebSocket(res?.data?.data?.access_token);

            navigate("/dashboard");
          }
        });
      } catch (error) {}
    },
  });

  return (
    <Layout login>
      <Box maxWidth={550} p={4}>
        <H5 fontSize={{ sm: 30, xs: 25 }} mb={6}>
          Sign In
        </H5>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Username Field */}
            <Grid size={12}>
              <TextField
                fullWidth
                onKeyDown={handleSpaceKeyPress}
                placeholder="Username"
                name="username"
                onBlur={handleBlur}
                value={values.username}
                onChange={handleChange}
                helperText={touched.username && errors.username}
                error={Boolean(touched.username && errors.username)}
              />
            </Grid>

            {/* Email Field */}
            <Grid size={12}>
              <TextField
                fullWidth
                placeholder="Email"
                onKeyDown={handleSpaceKeyPress}
                onChange={(e) => {
                  const lowercaseEmail = e.target.value.trim().toLowerCase();
                  setFieldValue("email", lowercaseEmail);
                }}
                name="email"
                onBlur={handleBlur}
                value={values.email}
                // onChange={(e) => {
                //   e.target.value = e.target.value?.toLowerCase();
                //   handleChange(e);
                // }}
                helperText={touched.email && errors.email}
                error={Boolean(touched.email && errors.email)}
              />
            </Grid>

            {/* Password Field */}
            <Grid size={12}>
              <TextField
                fullWidth
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                onKeyDown={handleSpaceKeyPress}
                name="password"
                onBlur={handleBlur}
                value={values.password}
                onChange={handleChange}
                helperText={touched.password && errors.password}
                error={Boolean(touched.password && errors.password)}
                InputProps={{
                  endAdornment: (
                    <ButtonBase disableRipple disableTouchRipple onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </ButtonBase>
                  ),
                }}
              />
            </Grid>

            {/* Remember Me Checkbox */}
            <Grid size={12}>
              <FlexBetween justifyContent="flex-end" my={1}>
                <Box fontSize={13} component={Link} fontWeight={500} color="secondary.400" href="/forget-password">
                  Forgot Password?
                </Box>
              </FlexBetween>
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
              <LoadingButton loading={isSubmitting} type="submit" variant="contained" fullWidth>
                Sign In
              </LoadingButton>
            </Grid>
          </Grid>
        </form>

        {/* <Divider
          sx={{
            my: 4,
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          OR
        </Divider>

        <FlexBox justifyContent="center" flexWrap="wrap" gap={2}>
          <StyledButton onClick={handleGoogle}>
            <GoogleIcon sx={{ fontSize: 18 }} />
          </StyledButton>
          <StyledButton>
            <Facebook sx={{ color: "#2475EF", fontSize: 18 }} />
          </StyledButton>
          <StyledButton>
            <Twitter sx={{ color: "#45ABF7", fontSize: 18 }} />
          </StyledButton>
        </FlexBox> */}
      </Box>
    </Layout>
  );
}
