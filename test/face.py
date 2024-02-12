import cv2
import mediapipe as mp
import time

def process_frame(img):
    # 创建新的人脸检测模型实例
    with mp.solutions.face_detection.FaceDetection(min_detection_confidence=0.5, model_selection=1) as model:
        start_time = time.time()
        img_RGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = model.process(img_RGB)

        if results.detections:
            for detection in results.detections:
                mp.solutions.drawing_utils.draw_detection(img, detection)

        end_time = time.time()
        FPS = 1 / (end_time - start_time)
        processed_img = cv2.putText(img, 'FPS ' + str(int(FPS)), (25, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.25, (0, 0, 255), 1)

        return processed_img


# # 人脸检测模型设置
# mp_face_detection = mp.solutions.face_detection
# model = mp_face_detection.FaceDetection(min_detection_confidence=0.5, model_selection=1)

# mp_drawing = mp.solutions.drawing_utils
# keypoint_style = mp_drawing.DrawingSpec(thickness=5, circle_radius=3, color=(0, 255, 0))
# bbox_style = mp_drawing.DrawingSpec(thickness=5, circle_radius=3, color=(255, 0, 0))

# def process_frame(img):
#     start_time = time.time()
#     img_RGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     results = model.process(img_RGB)
#     if results.detections:
#         for detection in results.detections:
#             mp_drawing.draw_detection(img, detection, keypoint_drawing_spec=keypoint_style, bbox_drawing_spec=bbox_style)
#     end_time = time.time()
#     FPS = 1 / (end_time - start_time)
#     scaler = 1
#     processed_img = cv2.putText(img, 'FPS ' + str(int(FPS)), (25 * scaler, 50 * scaler), cv2.FONT_HERSHEY_SIMPLEX, 1.25 * scaler, (0, 0, 255), 1)

#     return processed_img

# def main():
#     # 使用摄像头捕获图像或读取本地图像
#     cap = cv2.VideoCapture(0)

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         # 调用 process_frame 函数
#         processed_frame = process_frame(frame)

#         # 显示原始图像和处理后的图像
#         cv2.imshow('Original', frame)
#         cv2.imshow('Processed', processed_frame)

#         # 按 'q' 键退出
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == '__main__':
#     main()

# import cv2
# import mediapipe as mp
# import sys
# import os

# # 人脸检测模型设置
# mp_face_detection = mp.solutions.face_detection
# model = mp_face_detection.FaceDetection(min_detection_confidence=0.5, model_selection=1)

# mp_drawing = mp.solutions.drawing_utils
# keypoint_style = mp_drawing.DrawingSpec(thickness=5, circle_radius=3, color=(0, 255, 0))
# bbox_style = mp_drawing.DrawingSpec(thickness=5, circle_radius=3, color=(255, 0, 0))

# def process_frame(img_path):
#     img = cv2.imread(img_path)
#     img_RGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     results = model.process(img_RGB)
#     if results.detections:
#         for detection in results.detections:
#             mp_drawing.draw_detection(img, detection, keypoint_drawing_spec=keypoint_style, bbox_drawing_spec=bbox_style)

#     processed_image_path = 'processed_' + img_path
#     cv2.imwrite(processed_image_path, img)
#     return processed_image_path

# if __name__ == '__main__':
#     if len(sys.argv) > 1:
#         image_path = sys.argv[1]
#         result = process_frame(image_path)
#         print(result)  # 输出处理后的图像文件路径
#     else:
#         print("No image path provided.")
