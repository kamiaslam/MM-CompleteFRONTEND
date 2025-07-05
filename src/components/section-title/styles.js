import styled from '@mui/material/styles/styled'; // ==============================================================

// ==============================================================
export const Text = styled('h1', {
  shouldForwardProp: prop => prop !== 'centered' && prop !== 'fontSize'
})(({
  theme,
  centered,
  fontSize
}) => ({
  fontSize,
  fontWeight: 600,
  ...(centered && {
    textAlign: 'center'
  }),
  [theme.breakpoints.down('sm')]: {
    fontSize: 32
  },
  [theme.breakpoints.down(425)]: {
    fontSize: 27
  }
}));
export const Shape = styled("div", {
  shouldForwardProp: (prop) => prop !== "centered",
})(({ theme, centered }) => ({
  height: 4,
  width: 140,
  marginTop: theme.spacing(1),
  borderRadius: theme.spacing(4),
  background: "linear-gradient(90deg, #FF6484 0%, #DF46C5 100%)",
  ...(centered && {
    marginInline: "auto",
  }),
}));