import cv2
import numpy as np
import mediapipe as mp
import torch
import torch.nn as nn
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
torch.set_num_threads(1)

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
actions = np.array(['curl', 'press', 'squat'])

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    return pose

def process_frame(frame):
    global sequence  # 使用全局变量来保持序列状态
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    keypoints = extract_keypoints(results)
    sequence.append(keypoints)
    sequence = sequence[-sequence_length:]

    action_name = ''
    if len(sequence) == sequence_length:
        inputs = torch.tensor([sequence], dtype=torch.float32).to(device)
        with torch.no_grad():
            output = model(inputs)
            action_idx = torch.argmax(output, dim=1).item()
            action_name = actions[action_idx]

        cv2.putText(frame, action_name, (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

    return frame
