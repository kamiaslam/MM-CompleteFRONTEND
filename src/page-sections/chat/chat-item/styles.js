import styled from '@mui/material/styles/styled'; // STYLED COMPONENT

export const Wrapper = styled("div")(({ theme }) => ({
  gap: 12,
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  ".chat-info": {
    flexGrow: 1,
  },
}));
export const UnseenMsgWrapper = styled('div')(({
  theme
}) => ({
  width: 18,
  height: 18,
  color: 'white',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main
}));