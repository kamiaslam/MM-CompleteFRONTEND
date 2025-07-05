import { useNavigate } from "react-router-dom"; // MUI
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // MUI ICON COMPONENT
import NavigateBefore from "@mui/icons-material/NavigateBefore"; // CUSTOM COMPONENTS
import { EMAIL_REGEX } from "../../../helper/constant";
import { H5, Paragraph } from "@/components/typography";
import FlexRowAlign from "@/components/flexbox/FlexRowAlign";
import { useState } from "react";
import { SendOTP } from "../../../api/axiosApis/post";
import toast from "react-hot-toast";
import LinearProgress from "@mui/material/LinearProgress";

const validateEmail = (email) => {
  if (!email?.trim()) {
    return "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email";
  }
  return "";
};

export default function ForgetPasswordPageView() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleEmailChange = (e) => {
    const value = e.target.value?.trim()?.toLowerCase();
    setEmail(value);
    setError(validateEmail(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email?.trim()?.toLowerCase());
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true); 

    try {
      const res = await SendOTP({ email: email.trim() });

      if (
        res?.status === "success" ||
        res?.message === "OTP has been sent to your email."
      ) {
        localStorage.setItem(
          "forgotPasswordEmail",
          JSON.stringify({
            email: email.trim(),
            time:
              res?.message !== "OTP has been sent to your email."
                ? new Date()
                : JSON.parse(localStorage.getItem("forgotPasswordEmail"))
                    ?.time || new Date(),
          })
        );
        toast.success(
          res?.message && !Array.isArray(res?.message)
            ? res?.message
            : res?.message
              ? res?.message
              : "Something went wrong"
        );
        navigate("/verify-code");
      } else {
        toast.error(
          res?.detail && !Array.isArray(res?.detail)
            ? res?.detail
            : res?.detail
              ? res?.message
              : "Something went wrong"
        );
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <FlexRowAlign height="100%" bgcolor="background.paper">
      <Box textAlign="center" maxWidth={550} width="100%" padding={4}>
        <img src="/static/lockimage.png" alt="Logo" />

        <H5 mt={2}>Forgot your password?</H5>

        <Paragraph color="text.secondary" mt={1} px={4}>
          Please enter the email address associated with your account and we
          will email you an OTP to reset your password.
        </Paragraph>

        <form>
          <Stack gap={3} mt={5}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              onChange={handleEmailChange}
              error={!!error}
              onKeyDown={(e) => {
                if (e?.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
            <span
              className="error"
              style={{
                color: "red",
                display: "flex",
                marginTop: "-25px",
                fontSize: "12px",
                justifyContent: "start",
              }}
            >
              {error && error}
            </span>

            <Box sx={{ width: "100%", position: "relative" }}>
              <Button
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                variant="contained"
                color="primary"
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
                  "Send"
                )}
              </Button>

              {/* Show linear progress bar inside the button */}
            </Box>

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
