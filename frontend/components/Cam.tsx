// refer: https://medium.com/@jadomene99/integrating-your-opencv-project-into-a-react-component-using-flask-6bcf909c07f4

"use client"
import { CamProps } from "@/types";
import React, { useEffect, useRef, } from "react";
import { io } from 'socket.io-client';
import useState from 'react-usestateref'

const DEV_HOST = "http://127.0.0.1:5001"
const PROD_HOST = ""  // TODO: PRODUCT HOST
const HOST = process.env.NODE_ENV === 'development' ? DEV_HOST : PROD_HOST

const WIDTH = 640, HEIGHT = 360;

const Cam = ({ containerStyles }: CamProps) => {
  const [stream, setStream] = useState(null);
  const [imgSrc, setImgSrc] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [socket, setSocket, socketRef] = useState(null);
  const [recordingStatus, setRecordingStatus, statusRef] = useState(false)


  const connectSocket = () => {
    const crtSocket = io(HOST);
    setSocket(crtSocket)

    // Listen for incoming messages
    crtSocket.on('connect', () => {
      console.log(crtSocket.id)
      startCapture();
    })
    crtSocket.on("disconnect", () => {
      console.log("success disconnect"); // undefined
    });
    crtSocket.on('response', (encoded_image) => {
      // 将接收到的 Base64 字符串转换为图像 URL
      const src = 'data:image/jpeg;base64,' + encoded_image;
      // 创建或更新图像元素以显示图像
      setImgSrc(src)
    });
  }

  const closeSocket = () => {

    socket && socket.disconnect();
  }

  const startVideo = () => {
    connectSocket();
  }

  const startCapture = () => {
    const crtSocket = socketRef.current;
    navigator.mediaDevices.getUserMedia({
      video: true
    })
      .then((mediaStream) => {
        setStream(mediaStream)

        setRecordingStatus(true);

        videoRef.current && (videoRef.current.srcObject = mediaStream);
        captureScreenshot();

      });

  }

  const captureScreenshot = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const crtSocket = socketRef.current;

    // 确保视频元素和 Canvas 元素都已加载
    if (video && canvas) {
      // 在 Canvas 上绘制视频截图
      const ctx = canvas.getContext('2d');
      loop(ctx, video, canvas, crtSocket)
    }

  };

  const loop = (ctx, video, canvas, crtSocket) => {
    console.log("statusRef.current===========", statusRef.current)
    if (!statusRef.current) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      crtSocket && (crtSocket.emit('image', blob));
    }, 'image/jpeg');
    requestAnimationFrame(() => {
      if (statusRef.current) {
        console.log("----in requestAnimationFrame----")
        loop(ctx, video, canvas, crtSocket)
      }
    }); // 继续下一帧的截图

  }

  const stopVideo = () => {
    setRecordingStatus(false);

    const tracks = stream && stream.getTracks();

    tracks && (tracks.forEach((track) => {
      track.stop();
    }));

    videoRef.current && (videoRef.current.srcObject = null);

    closeSocket();
  }

  return (
    <div className={containerStyles}>
      <video ref={videoRef} autoPlay playsInline muted width={WIDTH} height={HEIGHT} />
      {imgSrc ? <img src={imgSrc} alt="" className="mt-4" style={{ width: `${WIDTH}px`, height: `${HEIGHT}px`, }} /> : null}
      <canvas ref={canvasRef} style={{ display: 'none' }} width={WIDTH} height={HEIGHT}></canvas>

      <button className="custom-btn disabled:opacity-25" onClick={startVideo} disabled={recordingStatus}>Start</button>
      <button className="custom-btn disabled:opacity-25" onClick={stopVideo} disabled={!recordingStatus}>Stop</button>
    </div>
  );
};
export default Cam;