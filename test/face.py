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
       
# 加载模型
n_hidden = 128
n_joints = 132
n_categories = 3
n_layer = 3
model = LSTM(n_joints, n_hidden, n_categories, n_layer)

model.load_state_dict(torch.load('lstm.pkl', map_location=torch.device('cpu')))
model.to(device)
model.eval()

# Mediapipe 模型初始化

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

sequence = []
sequence_length = 30
actions = np.array(['curl', 'squats', 'bridges'])

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    return pose


def process_frame(frame):
    global sequence
    
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
        #inputs = torch.tensor([sequence], dtype=torch.float32).to(device)
        sequence_array = np.array(sequence, dtype=np.float32)
        inputs = torch.tensor(sequence_array, dtype=torch.float32).unsqueeze(0).to(device)
    

        with torch.no_grad():
            outputs = model(inputs)
            probabilities = torch.softmax(outputs, dim=1)
            action_idx = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][action_idx].item() * 100

            # 当置信度高于90%时，更新动作名称
            if confidence >= 90:
                action_name = actions[action_idx]

        # 在视频右侧显示动作名称和置信度（百分比形式）
        cv2.putText(frame, f'Action: {action_name}', (frame.shape[1] - 250, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.putText(frame, f'Confidence: {confidence:.2f}%', (frame.shape[1] - 250, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

    return frame
