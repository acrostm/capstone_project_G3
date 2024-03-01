// refer: https://medium.com/@jadomene99/integrating-your-opencv-project-into-a-react-component-using-flask-6bcf909c07f4

"use client"
import { CamProps } from "../../types";
import React, { useRef } from "react";
import { io, Socket } from 'socket.io-client';
import useState from 'react-usestateref';
import Image from 'next/image'
import { Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';


const DEV_HOST = "127.0.0.1:5001"
const PROD_HOST = "https://www.3cap.xyz"  // TODO: PRODUCT HOST
const HOST = process.env.NODE_ENV === 'development' ? DEV_HOST : PROD_HOST

const WIDTH = 640, HEIGHT = 360;

interface ServerToClientEvents {
  response: (image: string) => void;
}

interface ClientToServerEvents {
  image: () => void;
}

const STATUS_COLOR = {
  0: '#06fa22', // NORMAL
  1: '#f8c20e', // WARNING
  2: '#f21136',  // ERROR
};

const Cam = ({ containerStyles }: CamProps) => {
  const [stream, setStream] = useState<MediaStream>();
  const [imgSrc, setImgSrc] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [status, setStatus] = useState<0 | 1 | 2>(1);
  const [statusMsg, setStatusMsg] = useState('This is a warning');
  const [count, setCount] = useState(5);
  const [socket, setSocket, socketRef] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [recordingStatus, setRecordingStatus, statusRef] = useState(false)
  const [lastTimestamp, setLastTimestamp] = useState<number>(0); // 新增：用于存储最后一次发送的时间戳



  const connectSocket = () => {
    const crtSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(HOST);
    setSocket(crtSocket)

    // Listen for incoming messages
    crtSocket.on('connect', () => {
      startCapture();
    })
    crtSocket.on("disconnect", () => {
      console.log("success disconnect");
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
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia({
      video: true
    })
      .then((mediaStream: MediaStream) => {
        setStream(mediaStream)

        setRecordingStatus(true);

        videoRef.current && (videoRef.current.srcObject = mediaStream);
        videoRef.current.addEventListener('loadedmetadata', () => {
          captureScreenshot(videoRef.current.clientWidth, videoRef.current.clientHeight);
        });

      }).catch((err) => {
        console.log(err)
      });

  }

  const captureScreenshot = (width: number, height: number) => {

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const crtSocket = socketRef.current;

    // 确保视频元素和 Canvas 元素都已加载
    if (video && canvas) {
      // 在 Canvas 上绘制视频截图
      const ctx = canvas.getContext('2d');
      canvas.width = width / 2;
      canvas.height = height / 2;

      if (ctx) {
        loop(ctx, video, canvas, crtSocket);
        startInterval(ctx, video, canvas, crtSocket);
      }
    }

  };

  const loop = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, canvas: HTMLCanvasElement, crtSocket: Socket | undefined) => {
    if (!statusRef.current) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const newTimestamp = Math.max(Date.now(), lastTimestamp + 1); // 生成新的时间戳，确保递增
    setLastTimestamp(newTimestamp); // 更新状态中的时间戳
    canvas.toBlob(blob => {
      crtSocket && (crtSocket.emit('image', { blob, timestamp: newTimestamp }, socketRef.current && socketRef.current.id)); // 修改这里，发送blob和时间戳
    }, 'image/jpeg');

    // requestAnimationFrame(() => {
    //   if (statusRef.current) {
    //     console.log("----in requestAnimationFrame----")
    //     loop(ctx, video, canvas, crtSocket)
    //   }
    // }); // 继续下一帧的截图

  }

  const startInterval = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, canvas: HTMLCanvasElement, crtSocket: Socket | undefined) => {
    let timeInterval = setInterval(() => {
      if (statusRef.current) {
        loop(ctx, video, canvas, crtSocket)
      } else {
        clearTimeout(timeInterval)
      }
    }, 100)
  }

  const stopVideo = () => {
    setRecordingStatus(false);
    setLastTimestamp(0); // 重置时间戳

    const tracks = stream && stream.getTracks();
    tracks && (tracks.forEach(track => track.stop()));

    videoRef.current && (videoRef.current.srcObject = null);

    closeSocket();
  }

  return (
    <>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <Button variant="contained" style={{ marginRight: '1rem' }} onClick={startVideo} disabled={recordingStatus}>Start</Button>
          <Button variant="contained" onClick={stopVideo} disabled={!recordingStatus}>Stop</Button>
        </div>
        <div className="flex items-center justify-between  w-96">
          <div>Count:{count}</div>
          <div style={{ color: STATUS_COLOR[status] }}>
            <ErrorIcon className="align-middle" />
            <span className="align-middle">{statusMsg}</span>
          </div>
        </div>
      </div>
      <div style={{ width: WIDTH, margin: '0 auto' }}>
        <div className={`${containerStyles ? containerStyles : ''} relative`}>
          <video ref={videoRef} autoPlay playsInline muted width={WIDTH} height={HEIGHT}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1
          }}
          />
          {imgSrc && recordingStatus ? <Image src={imgSrc} alt="" width={WIDTH} height={HEIGHT} /> : null}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
      </div>

    </>

  );
};
export default Cam;
