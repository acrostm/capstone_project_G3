import requests

video_url = "https://r2.3cap.xyz/2820_1710813261.mp4"
response = requests.post("http://127.0.0.1:5001/show_video", json={"video_url": video_url})

# 如果返回的是视频流，则可以直接打开播放
if response.status_code == 200:
    with open('video.mp4', 'wb') as f:
        f.write(response.content)
    print("视频已保存为 video.mp4")
else:
    print(response.text)