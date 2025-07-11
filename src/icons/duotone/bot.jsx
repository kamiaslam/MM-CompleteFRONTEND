import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

function BotIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32">
      <rect x="18" y="10" width="2" height="2" />
      <rect x="12" y="10" width="2" height="2" />
      <path d="M26,20H21V18h1a2.0023,2.0023,0,0,0,2-2V12h2V10H24V8a2.0023,2.0023,0,0,0-2-2H20V2H18V6H14V2H12V6H10A2.0023,2.0023,0,0,0,8,8v2H6v2H8v4a2.0023,2.0023,0,0,0,2,2h1v2H6a2.0023,2.0023,0,0,0-2,2v8H6V22H26v8h2V22A2.0023,2.0023,0,0,0,26,20ZM10,8H22v8H10Zm3,10h6v2H13Z" />
      <rect width="32" height="32" fill="none" />
    </SvgIcon>
  );
}

export default BotIcon;
