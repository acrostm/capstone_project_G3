import cv2
import mediapipe as mp
import time

# 人脸检测模型设置
mp_face_detection = mp.solutions.face_detection
model = mp_face_detection.FaceDetection(min_detection_confidence=0.5, model_selection=1)

mp_drawing = mp.solutions.drawing_utils
keypoint_style = mp_drawing.DrawingSpec(thickness=5, circle_radius=3, color=(0, 255, 0))
bbox_style = mp_drawing.DrawingSpec(thickness=5, circle_radius=3, color=(255, 0, 0))

def process_frame(img):
    start_time = time.time()
    img_RGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = model.process(img_RGB)
    if results.detections:
        for detection in results.detections:
            mp_drawing.draw_detection(img, detection, keypoint_drawing_spec=keypoint_style, bbox_drawing_spec=bbox_style)
    end_time = time.time()
    FPS = 1 / (end_time - start_time)
    scaler = 1
    img = cv2.putText(img, 'FPS ' + str(int(FPS)), (25 * scaler, 50 * scaler), cv2.FONT_HERSHEY_SIMPLEX, 1.25 * scaler, (0, 0, 255), 1)
    return img
