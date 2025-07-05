import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import { Paragraph, Span } from "@/components/typography";
import GradientBackground from "@/components/gradient-background";
import { MainContent, OtpInputField } from "./styles";
import { useNavigate } from "react-router-dom";
import { CircularProgress, LinearProgress, Typography } from "@mui/material";
import { SendOTP, VerifyForgotPasswordOTP } from "../../api/axiosApis/post";
import toast from "react-hot-toast";

export default function VerifyCodePageView() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(""); // OTP as a string
  const [activeInput, setActiveInput] = useState(0);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); // Add this new state

  const forgotPasswordInfo = JSON.parse(
    localStorage.getItem("forgotPasswordEmail")
  );

  useEffect(() => {
    const otpSentTime = new Date(forgotPasswordInfo?.time);
    const currentTime = new Date();
    const timeDiff = Math.floor((currentTime - otpSentTime) / 1000); // difference in seconds
    const remainingTime = 300 - timeDiff;

    if (remainingTime > 0) {
      setTimeLeft(remainingTime);
    } else {
      setIsVisible(true);
      setTimeLeft(0);
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timerInterval);
          setIsVisible(true);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [forgotPasswordInfo]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const validateOtp = (otpString) => {
    if (!otpString?.length) {
      setError("OTP is required");
      return false;
    } else if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return false;
    }
    setError(""); // Clear any existing error
    return true;
  };

  const handleOtpChange = (newOtp) => {
    if (newOtp === "" || /^\d+$/.test(newOtp)) {
      setOtp(newOtp);
      validateOtp(newOtp);
    }
  };

  const changeCodeAtFocus = (str) => {
    const updatedOtp =
      otp.substring(0, activeInput) + str + otp.substring(activeInput + 1);
    setOtp(updatedOtp);
    handleOtpChange(updatedOtp);
  };

  const focusInput = (inputIndex) => {
    const selectedIndex = Math.max(Math.min(5, inputIndex), 0);
    setActiveInput(selectedIndex);
  };

  const handleOnChange = (e) => {
    const val = e.target.value;
    if (/^\d$/.test(val)) {
      changeCodeAtFocus(val);
      focusInput(activeInput + 1);
    }
  };

  // const handleOnKeyDown = (e) => {
  //   const pressedKey = e.key;

  //   switch (pressedKey) {
  //     case "Backspace":
  //     case "Delete": {
  //       e.preventDefault();
  //       if (otp[activeInput]) {
  //         changeCodeAtFocus("");
  //       } else {
  //         focusInput(activeInput - 1);
  //       }
  //       break;
  //     }
  //     case "ArrowLeft": {
  //       e.preventDefault();
  //       focusInput(activeInput - 1);
  //       break;
  //     }
  //     case "ArrowRight": {
  //       e.preventDefault();
  //       focusInput(activeInput + 1);
  //       break;
  //     }
  //     case "Enter": {
  //       e.preventDefault();
  //       handleSubmit();
  //       break;
  //     }
  //     default: {
  //       if (pressedKey.match(/^[^a-zA-Z0-9]$/)) {
  //         e.preventDefault();
  //       }
  //       break;
  //     }
  //   }
  // };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, 6 - activeInput)
      .split("");
    if (pastedData) {
      let updatedOtp = otp;
      pastedData.forEach((char, index) => {
        updatedOtp =
          updatedOtp.substring(0, activeInput + index) +
          char +
          updatedOtp.substring(activeInput + index + 1);
      });
      setOtp(updatedOtp);
      handleOtpChange(updatedOtp);

      const lastFilledInput = Math.min(activeInput + pastedData.length - 1, 5);
      setActiveInput(lastFilledInput);
      focusInput(lastFilledInput + 1);
    }
  };

  const resendOtp = async () => {
    if (isResendDisabled) return; // Don't resend if disabled
    setIsResendDisabled(true); // Disable resend button
    setResendLoading(true); // Add loading state
    try {
      const res = await SendOTP({ email: forgotPasswordInfo?.email?.trim() });

      if (
        res?.status === "success" ||
        res?.message === "An OTP was already sent. Please check your email."
      ) {
        localStorage.setItem(
          "forgotPasswordEmail",
          JSON.stringify({
            email: forgotPasswordInfo?.email.trim(),
            time:
              res?.message !==
              "An OTP was already sent. Please check your email."
                ? new Date()
                : JSON.parse(localStorage.getItem("forgotPasswordEmail"))
                    ?.time || new Date(),
          })
        );
        toast.success(res?.message || "OTP has been resent");
        setIsVisible(false); // Hide "Resend OTP" and start timer again
        setTimeLeft(300); // Reset timer to 5 minutes
      } else {
        toast.error(res?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setResendLoading(false); // Reset loading state
    }
    setTimeout(() => setIsResendDisabled(false), 30000); // Re-enable after 30 seconds
  };

  const handleSubmit = () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter valid 6-digit OTP");
      return;
    }

    if (validateOtp(otp)) {
      setLoading(true);
      VerifyForgotPasswordOTP({
        email: forgotPasswordInfo?.email,
        otp_code: otp, // Directly using the OTP string here
      })
        .then((res) => {
          setLoading(false); // Stop loading
          if (res?.status === "success") {
            toast.success(res?.msg || "OTP verified successfully.");
            setOtp(""); // Clear OTP fields
            focusInput(0);
            navigate("/reset-password");
          } else {
            setOtp(""); // Clear OTP fields
            focusInput(0);
            toast.error(res?.detail || res?.message || "Something went wrong.");
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(
            "An error occurred: " + error?.message || "Please try again."
          );
        });
    }
  };

  return (
    <GradientBackground>
      <Container>
        <MainContent>
          <div className="img-wrapper">
            <img src="/static/pages/email.svg" alt="email" width="100%" />
          </div>

          <h6 className="title">Check your email!</h6>

          <p className="description">
            Please check your email inbox for a 6-digit verification code we
            have sent to your registered email address. Enter the code in the
            field below to confirm your email and complete the verification
            process.
          </p>

          <div className="form-wrapper">
            <OtpInput
              value={otp}
              numInputs={6}
              onPaste={handlePaste}
              onChange={setOtp}
              placeholder=""
              renderInput={(props) => <OtpInputField {...props} />}
              containerStyle={{
                gap: "1rem",
                justifyContent: "center",
                marginBottom: "3rem",
              }}
              inputType="tel"
            />

            <div
              sx={{
                userSelect: "none",
                textAlign: "center",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              {formatTime(timeLeft) &&
              formatTime(timeLeft) !== "00:00" &&
              !isVisible ? (
                <Typography variant="h6" my={3}>
                  {formatTime(timeLeft)}
                </Typography>
              ) : isVisible ? (
                <Typography variant="h6" my={3}>
                  Don’t have a code?{" "}
                  <span
                    className="resend"
                    onClick={resendOtp}
                    sx={{
                      textDecoration: isResendDisabled
                        ? "line-through"
                        : "none",
                      cursor: "pointer",
                    }}
                  >
                    {resendLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Resend code"
                    )}
                  </span>
                </Typography>
              ) : (
                <Typography variant="h6" my={3}>
                  OTP expired. Please request a new OTP.
                </Typography>
              )}
            </div>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                height: "50px",
                marginTop: "20px",
                textTransform: "none",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <LinearProgress size={24} color="inherit" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </MainContent>
      </Container>
    </GradientBackground>
  );
}
