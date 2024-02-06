// refer: https://medium.com/@jadomene99/integrating-your-opencv-project-into-a-react-component-using-flask-6bcf909c07f4

import React, { useState } from "react";

const DEV_HOST = "http://localhost:5001"
const PROD_HOST = ""  // TODO: PRODUCT HOST
const HOST = process.env.NODE_ENV === 'development' ? DEV_HOST : PROD_HOST

const Cam = () => {
  return (
    <div>
      <img
        src={`${DEV_HOST}/video_feed`}
        alt="Video"
      />
    </div>
  );
};
export default Cam;