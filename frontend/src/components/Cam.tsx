// refer: https://medium.com/@jadomene99/integrating-your-opencv-project-into-a-react-component-using-flask-6bcf909c07f4

"use client"
import React, { useRef } from "react";
import { io, Socket } from 'socket.io-client';
import useState from 'react-usestateref';
import Image from 'next/image'

import bicepIcon from '@/images/icons/bicep_color.png'
import squatsIcon from '@/images/icons/squats_color.png'
import bridgingIcon from '@/images/icons/bridging_color.png'

import { Button } from "./Button";
import { Icon } from "./Icon";
import SubmitDialog from "./SubmitDialog";
import { CamProps, MoodKeyType } from "../../types";
import request from "@/lib/fetchData";
import { showToast } from "@/lib/utils";
// import { useLeavePageConfirm } from "@/hooks/useLeavePageConfirm";

const DEV_HOST = "127.0.0.1:5001"
const PROD_HOST = "https://www.3cap.xyz"
const HOST = process.env.NODE_ENV === 'development' ? DEV_HOST : PROD_HOST

const WIDTH = 640, HEIGHT = 360;
interface ImageSocketResponseType {
  image: string;
  counts: {
    count_curls: number;
    count_squats: number;
    count_bridges: number;
    action: string; // 'curl' | 'squats' | 'bridges' | 'no action'
  }
}
interface SummarySocketResponseType {
  score: number;
  count_curls: number;
  count_squats: number;
  count_bridges: number;
}

interface ServerToClientEvents {
  response: (data: ImageSocketResponseType) => void;
  summary: (data: SummarySocketResponseType) => void;
}

interface ClientToServerEvents {
  image: () => void;
  stop: () => void;
}

const STATUS_COLOR = {
  0: '#06fa22', // NORMAL
  1: '#f8c20e', // WARNING
  2: '#f21136',  // ERROR
};

let MAX_CURLS_COUNT = 0, MAX_SQUATS_COUNT = 0, MAX_BRIDGES_COUNT = 0

const Cam = ({ containerStyles }: CamProps) => {
  // useLeavePageConfirm();

  const [stream, setStream, streamRef] = useState<MediaStream>();
  const [imgSrc, setImgSrc] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [status, setStatus] = useState<0 | 1 | 2>(1);
  const [statusMsg, setStatusMsg] = useState('This is a warning');
  const [curlsCount, setCurlsCount] = useState(0);
  const [squatsCount, setSquatsCount] = useState(0);
  const [bridgesCount, setBridgesCount] = useState(0);
  const [socket, setSocket, socketRef] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [recordingStatus, setRecordingStatus, statusRef] = useState(false)
  const [dialogOpen, setODialogOpen] = useState(false)
  const [summaryScore, setSummaryScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const postRecord = async (mood: MoodKeyType) => {
    try {
      const response = await request(true, '/api/record', {
        method: 'POST',
        body: JSON.stringify({ curls_count: curlsCount, squats_count: squatsCount, bridges_count: bridgesCount, score: summaryScore, mood })
      });
      if (response.code === 200) {
        handleDialogOpenStatus()
        resetCounts()
        showToast('🎉Successfully recorded!', 'success')
        window.location.reload()
      }
    } catch (error) {
      console.error("record fail")
    }
  }

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
    crtSocket.on('response', (data: ImageSocketResponseType) => {
      // 将接收到的 Base64 字符串转换为图像 URL
      const { image, counts } = data;
      const src = 'data:image/jpeg;base64,' + image;
      // 创建或更新图像元素以显示图像
      setImgSrc(src)

      // 总显示最新的 count
      if (counts.count_curls > MAX_CURLS_COUNT) {
        MAX_CURLS_COUNT = counts.count_curls
        setCurlsCount(counts.count_curls)
      }
      if (counts.count_squats > MAX_SQUATS_COUNT) {
        MAX_SQUATS_COUNT = counts.count_squats
        setSquatsCount(counts.count_squats)
      }
      if (counts.count_bridges > MAX_BRIDGES_COUNT) {
        MAX_SQUATS_COUNT = counts.count_bridges
        setBridgesCount(counts.count_bridges)
      }
    });

    crtSocket.on('summary', (data: SummarySocketResponseType) => {
      const { score, count_curls, count_squats, count_bridges } = data;
      setCurlsCount(count_curls)
      setSquatsCount(count_squats)
      setBridgesCount(count_bridges)
      setSummaryScore(score)
      stopVideo()
      handleDialogOpenStatus()
    })
  }

  const closeSocket = () => {
    const crtSocket = socketRef.current;
    crtSocket && crtSocket.disconnect();
  }

  const startVideo = () => {
    if(isLoading) return
    setIsLoading(true)
    connectSocket();
  }

  const startCapture = () => {
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia({
      video: true
    })
      .then((mediaStream: MediaStream) => {
        setStream(mediaStream)

        setRecordingStatus(true);
        setIsLoading(false)
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
    canvas.toBlob(blob => {
      crtSocket && (crtSocket.emit('image', blob, socketRef.current && socketRef.current.id)); // 修改这里，发送blob和时间戳
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
    const tracks = streamRef.current && streamRef.current.getTracks();
    tracks && (tracks.forEach(track => track.stop()));

    videoRef.current && (videoRef.current.srcObject = null);

    closeSocket();
  }

  const handleStopVideo = () => {
    const crtSocket: Socket | undefined = socketRef.current;
    crtSocket && (crtSocket.emit('stop', crtSocket.id))
  }

  const handleDialogOpenStatus = () => {
    setODialogOpen(!dialogOpen)
  }

  const handleDialogSubmit = (mood: MoodKeyType) => {
    postRecord(mood);
  }

  const resetCounts = () => {
    setCurlsCount(0)
    setSquatsCount(0)
    setBridgesCount(0)
    setSummaryScore(0)
  }

  return (
    <>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <Button className="mr-4" color={!recordingStatus ? "cyan" : "gray"} onClick={startVideo} disabled={recordingStatus || isLoading} isLoading={isLoading}>Start</Button>
          <Button className="mr-4" color={recordingStatus ? "cyan" : "gray"} onClick={handleStopVideo} disabled={!recordingStatus}>Stop</Button>

        </div>
        <div className="flex items-center justify-between  w-96">

          {[{ icon: bicepIcon, count: curlsCount, size: 50, color: '#ef5d43' }, { icon: squatsIcon, count: squatsCount, size: 60, color: '#87c7fa' }, { icon: bridgingIcon, count: bridgesCount, size: 70, color: '#b94497' }]
            .map((item, i) => <div className="flex-1" key={i}><Icon className='inline-block p-0.5 m-0.5 rounded' width={item.size} height={item.size} imgSrc={item.icon} />
              <span key={i} className="mr-4 text-3xl align-middle" style={{ color: item.color }}>{item.count}</span>
            </div>)}

          {/* <div style={{ color: STATUS_COLOR[status] }}>
            <ErrorIcon className="align-middle" />
            <span className="align-middle">{statusMsg}</span>
          </div> */}
        </div>
      </div>
      <div className="h-screen" style={{ width: WIDTH, margin: '0 auto' }}>
        <div className={`${containerStyles ? containerStyles : ''} relative`}>
          <video ref={videoRef} autoPlay playsInline muted width={WIDTH} height={HEIGHT}
          // style={{
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   zIndex: -1
          // }}
          />
          {imgSrc && recordingStatus ? <Image src={imgSrc} alt="" width={WIDTH} height={HEIGHT} /> : null}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
      </div>

      <SubmitDialog
        open={dialogOpen}
        countsSummary={{ curls: curlsCount, squats: squatsCount, bridges: bridgesCount }}
        score={summaryScore}
        handleClose={handleDialogOpenStatus}
        handleSubmit={handleDialogSubmit} />

    </>

  );
};
export default Cam;
