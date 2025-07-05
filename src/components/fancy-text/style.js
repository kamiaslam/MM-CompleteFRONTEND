import styled from '@mui/material/styles/styled';
export const StyledFancyText = styled("span")(({ theme }) => ({
  background: "linear-gradient(90deg, #FF6484 0%, #DF46C5 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));