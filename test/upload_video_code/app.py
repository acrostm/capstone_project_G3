# from flask import Flask, request, send_file
# import cv2
# import numpy as np
# import os
# import face  # 导入 face.py 中的相关函数

# app = Flask(__name__)

# @app.route('/process_video', methods=['POST'])
# def process_video():
#     # 获取 POST 请求中的视频文件
#     video_file = request.files['video']

#     # 将视频文件保存到临时文件中
#     video_path = 'temp_video.mp4'
#     video_file.save(video_path)

#     # 打开视频文件
#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         return '无法打开视频文件', 400

#     # 获取视频帧率和尺寸
#     fps = cap.get(cv2.CAP_PROP_FPS)
#     width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#     height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

#     # 创建 VideoWriter 对象，用于保存处理后的视频
#     fourcc = cv2.VideoWriter_fourcc(*'mp4v')
#     out = cv2.VideoWriter('processed_video.mp4', fourcc, fps, (width, height))

#     # 逐帧处理视频
#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break

#         # 调用 process_frame() 函数处理视频帧
#         processed_frame, _ = face.process_frame(frame)
        
#         # 将处理后的帧写入到 VideoWriter 对象中
#         out.write(processed_frame)

#     # 释放视频对象
#     cap.release()
#     out.release()

#     # 删除临时视频文件
#     os.remove(video_path)

#     # 提供处理后的视频文件给用户下载
#     return send_file('processed_video.mp4', as_attachment=True)

# if __name__ == '__main__':
#     app.run(port=5001)  # 启动 Flask 服务器，端口设为 5001
import cv2
import face

# 读取本地视频文件
video_path = 'video.mp4'
cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print('无法打开视频文件')
    exit()

# 创建 VideoWriter 对象，用于保存处理后的视频
fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('processed_video.mp4', fourcc, fps, (width, height))

# 逐帧处理视频
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # 调用 process_frame() 函数处理视频帧
    processed_frame, _ = face.process_frame(frame)
    
    # 将处理后的帧写入到 VideoWriter 对象中
    out.write(processed_frame)

# 释放视频对象
cap.release()
out.release()

print('视频处理完成，并保存为 processed_video.mp4 文件')
