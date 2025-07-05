import React, { useState, useEffect } from "react";

import CallPopupMain from "./Callmodel/components/CallPopupMain";

  function Callmodelmain({  Patient_id, callPreData , callId , onClose}) {
    // return null
    return <>{callId&& <CallPopupMain  {...{ Patient_id, callPreData , callId ,onClose }}/>}</>;
  }

  export default Callmodelmain;
