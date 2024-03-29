# import cv2
# import mediapipe as mp
# import time

# def process_frame(img):
#     # 创建新的人脸检测模型实例
#     with mp.solutions.face_detection.FaceDetection(min_detection_confidence=0.5, model_selection=1) as model:
#         start_time = time.time()
#         img_RGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#         results = model.process(img_RGB)

#         if results.detections:
#             for detection in results.detections:
#                 mp.solutions.drawing_utils.draw_detection(img, detection)

#         end_time = time.time()
#         FPS = 1 / (end_time - start_time)
#         processed_img = cv2.putText(img, 'FPS ' + str(int(FPS)), (25, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.25, (0, 0, 255), 1)

#         return processed_img


# import cv2
# import mediapipe as mp
# import time


import cv2
import numpy as np
import mediapipe as mp
import torch
import torch.nn as nn
import time
import counting
should_stop_processing = False
def reset_mediapipe():
    global pose, should_stop_processing
    should_stop_processing = True  # 通知帧处理逻辑停止或快速完成
    # 可以选择这里稍作等待，给正在处理的帧一些时间来快速完成
    time.sleep(0.5)  # 等待示例，具体时间根据实际情况调整
    pose.close()  # 安全地关闭 mediapipe 实例
    pose = mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    should_stop_processing = False  # 重要：重置为 False 以恢复帧处理
    print("Mediapipe has been reset and frame processing is resumed.")


device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

class LSTM(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, layer_num):
        super(LSTM, self).__init__()
        self.hidden_dim = hidden_dim
        self.output_dim = output_dim
        self.lstm = torch.nn.LSTM(input_dim, hidden_dim, layer_num, batch_first=True)
        self.fc = torch.nn.Linear(hidden_dim, output_dim)
        self.bn = nn.BatchNorm1d(30)
        
    def forward(self, inputs):
        x = self.bn(inputs)
        lstm_out, (hn, cn) = self.lstm(x)
        out = self.fc(lstm_out[:, -1, :])
        return out
    
# 初始化计数器和方向变量
count_curls = 0
dir_curls = 0
count_squats = 0
dir_squats = 0
count_bridges = 0
dir_bridges = 0
       
# 加载模型
n_hidden = 128
n_joints = 132
n_categories = 3
n_layer = 3
model = LSTM(n_joints, n_hidden, n_categories, n_layer)

model.load_state_dict(torch.load('lstm_model.pkl', map_location=torch.device('cpu')))
model.to(device)
model.eval()

# Mediapipe 模型初始化
confidence_scores = []


mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

sequence = []
sequence_length = 30
actions = np.array(['curl', 'squat', 'bridge'])

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    return pose
    
def reset_counters():
    global count_curls, count_squats, count_bridges
    count_curls = 0
    count_squats = 0
    count_bridges = 0

is_processing_frame = False
def get_average_confidence():
    if confidence_scores:
        average_confidence = sum(confidence_scores) / len(confidence_scores)
        return round(average_confidence, 2)
    else:
        return 0  # 如果没有置信度分数，返回0

def process_frame(frame):
    global sequence, count_curls, dir_curls, count_squats, dir_squats, count_bridges, dir_bridges, is_processing_frame, should_stop_processing
    if should_stop_processing:
        return frame, {'action': 'no action', 'count_curls': count_curls, 'count_squats': count_squats, 'count_bridges': count_bridges}
    

    is_processing_frame = True
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    keypoints = extract_keypoints(results)
    sequence.append(keypoints)
    sequence = sequence[-sequence_length:]

    action_name = 'no action'  # 默认情况下显示为“没有动作检测到”
    confidence = 0
    if len(sequence) == sequence_length:
        sequence_array = np.array(sequence, dtype=np.float32)
        inputs = torch.tensor(sequence_array, dtype=torch.float32).unsqueeze(0).to(device)
    

        with torch.no_grad():
            outputs = model(inputs)
            probabilities = torch.softmax(outputs, dim=1)
            action_idx = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][action_idx].item() * 100
            confidence_scores.append(confidence)

            # 当置信度高于90%时，更新动作名称
            if confidence >= 50:
                action_name = actions[action_idx]
                # 根据识别出的动作调用相应的计数函数
                if action_name == 'curl':
                    count_curls, dir_curls, _ = counting.counting_curls(frame, count_curls, dir_curls, time.time())
                    #print(f'curls: {int(count_curls)}')
                elif action_name == 'squat':
                    count_squats, dir_squats, _ = counting.counting_squats(frame, count_squats, dir_squats, time.time())
                    #print(f'squats: {int(count_squats)}')
                elif action_name == 'bridge':
                    count_bridges, dir_bridges, _ = counting.counting_bridges(frame, count_bridges, dir_bridges, time.time())
                    #print(f'bridges: {int(count_bridges)}')
        # 在视频右侧显示动作名称和置信度（百分比形式）
        cv2.putText(frame, f'Action: {action_name}', (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2, cv2.LINE_AA)
        # cv2.putText(frame, f'Confidence: {confidence:.2f}%', (frame.shape[1] - 250, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    else:
        pass

    is_processing_frame = False
    # 在face.py的process_frame函数末尾修改返回值：
    return frame, {'action': action_name, 'count_curls': int(count_curls), 'count_squats': int(count_squats), 'count_bridges': int(count_bridges)}


# cap = cv2.VideoCapture(0)

# if not cap.isOpened():
#     print("无法打开摄像头")
#     exit()

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("无法从摄像头读取帧")
#         break

#     # 处理每一帧
#     frame,count = process_frame(frame)
#     # 显示处理后的帧及动作次数
#     action_text = f"Action: {count['action']}"
#     curls_text = f"curls: {count['count_curls']}"
#     squats_text = f"squats: {count['count_squats']}"
#     bridges_text = f"bridges: {count['count_bridges']}"

#     cv2.putText(frame, action_text, (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3)
#     cv2.putText(frame, curls_text, (10, 75), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3)
#     cv2.putText(frame, squats_text, (10, 115), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3)
#     cv2.putText(frame, bridges_text, (10, 155), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3)


#     # 显示处理后的帧
#     cv2.imshow('Frame', frame)
#     #print(f"动作: {count['action']}, curls次数: {count['count_curls']}, squats次数: {count['count_squats']}, bridges次数: {count['count_bridges']}")


#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# # 释放摄像头并关闭所有窗口
# cap.release()
# cv2.destroyAllWindows()

# # 从视频文件读取而非摄像头
# video_path = '/Users/brubby/Desktop/tensio/project/body/videos/123.mp4' # 替换为你的视频文件路径
# cap = cv2.VideoCapture(video_path)

# if not cap.isOpened():
#     print("无法打开视频文件")
#     exit()

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("无法从视频文件读取帧，可能是视频已结束")
#         break

#     # 处理每一帧
#     frame, count = process_frame(frame)
#     # 显示处理后的帧及动作次数
#     # 省略了显示动作次数和名称的代码
    
#     action_text = f"Action: {count['action']}"
#     curls_text = f"curls: {count['count_curls']}"
#     squats_text = f"squats: {count['count_squats']}"
#     bridges_text = f"bridges: {count['count_bridges']}"

#     cv2.putText(frame, action_text, (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3)
#     cv2.putText(frame, curls_text, (10, 75), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3)
#     cv2.putText(frame, squats_text, (10, 115), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3)
#     cv2.putText(frame, bridges_text, (10, 155), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3)


#     cv2.imshow('Frame', frame)

#     # 为了让视频播放看起来自然，调整等待时间
#     if cv2.waitKey(25) & 0xFF == ord('q'): # 可以根据视频的帧率调整这里的等待时间
#         break

# # 释放视频文件并关闭所有窗口
# cap.release()
# cv2.destroyAllWindows()
