import cv2
import mediapipe as mp
import numpy as np
import time
import math

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# 计算两点之间角度的函数
def calculate_angle(a, b, c):
    a = np.array(a)  # First point
    b = np.array(b)  # Mid point
    c = np.array(c)  # End point
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle 

# For curls
def counting_curls(img, count, dir, pTime):
    with mp_pose.Pose(static_image_mode=False, model_complexity=1, enable_segmentation=False, min_detection_confidence=0.5) as pose:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = pose.process(img_rgb)
        
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # 获取关键点的坐标
            shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
            wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
            
            # 计算角度
            angle = calculate_angle(shoulder, elbow, wrist)
            
            # 根据角度更新计数和方向
            angle = calculate_angle(shoulder, elbow, wrist)

            # 假设卷曲动作的角度范围是从50度（几乎伸直）到160度（完全卷曲）
            if angle > 160:
                if dir == 0:
                    count += 0.5  # 开始卷曲，计数增加0.5
                    dir = 1  # 改变方向，表示哑铃正在被卷起

            if angle < 50:
                if dir == 1:
                    count += 0.5  # 完成卷曲，计数再增加0.5，总共增加1
                    dir = 0  # 改变方向，准备下一个卷曲动作
                        
            # 可视化
            #mp_drawing.draw_landmarks(img, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        return count, dir, pTime

# For Squats
def counting_squats(img, count, dir, pTime):
    with mp_pose.Pose(static_image_mode=False, model_complexity=1, enable_segmentation=False, min_detection_confidence=0.5) as pose:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = pose.process(img_rgb)
        
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # Squat angles calculation points
            hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
            
            # Calculate angle
            angle = calculate_angle(hip, knee, ankle)
            
            # Squat count logic based on the angle
            if angle < 90 and dir == 0:
                dir = 1
            elif angle > 160 and dir == 1:
                count += 1
                dir = 0

            #mp_drawing.draw_landmarks(img, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            
        # Display logic (similar to counting_curls)
        # Update FPS, count, and return values
        
        return count, dir, pTime

# For Bridges
def counting_bridges(img, count, dir, pTime):
    with mp_pose.Pose(static_image_mode=False, model_complexity=1, enable_segmentation=False, min_detection_confidence=0.5) as pose:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = pose.process(img_rgb)
        
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # Bridge angles calculation points
            shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            
            # Calculate angle
            angle = calculate_angle(shoulder, hip, knee)
            
            # Bridge count logic based on the angle
            if angle > 160 and dir == 0:
                dir = 1
            elif angle < 90 and dir == 1:
                count += 1
                dir = 0

            #mp_drawing.draw_landmarks(img, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            
        # Display logic (similar to counting_curls)
        # Update FPS, count, and return values
        
        return count, dir, pTime

    
# cap = cv2.VideoCapture(0)
# pTime = 0
# count = 0
# dir = 0

# if not cap.isOpened():
#     print("无法打开摄像头")
#     exit()

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("无法从摄像头读取帧")
#         break

#     count, dir, pTime = counting_curls(frame, count, dir, pTime)


#     # 显示处理后的帧
#     cv2.imshow('Frame', frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

