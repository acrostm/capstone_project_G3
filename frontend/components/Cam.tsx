// refer: https://medium.com/@jadomene99/integrating-your-opencv-project-into-a-react-component-using-flask-6bcf909c07f4

import { CamProps } from "@/types";
import React, { useState } from "react";

const DEV_HOST = "http://localhost:5001"
const PROD_HOST = ""  // TODO: PRODUCT HOST
const HOST = process.env.NODE_ENV === 'development' ? DEV_HOST : PROD_HOST

const Cam = ({containerStyles} : CamProps) => {
  return (
    <div className={containerStyles}>
      <img
        src={`${HOST}/video_feed`}
        alt="Video"
      />
    </div>
  );
};
export default Cam;