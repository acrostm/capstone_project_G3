# from flask import Flask, render_template, Response
# import cv2
# import face  # 导入face模块

# app = Flask(__name__)

# def gen_frames():
#     cap = cv2.VideoCapture(0)
#     while True:
#         success, frame = cap.read()
#         if not success:
#             break
#         else:
#             frame = face.process_frame(frame)  # 使用face模块中的函数
#             ret, buffer = cv2.imencode('.jpg', frame)
#             frame = buffer.tobytes()
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/video_feed')
# def video_feed():
#     return Response(gen_frames(), 
#                     mimetype='multipart/x-mixed-replace; boundary=frame')

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)


# from flask import Flask, render_template, request
# from flask_socketio import SocketIO
# import cv2
# import base64
# import numpy as np
# import face

# app = Flask(__name__)
# socketio = SocketIO(app, port=5001, cors_allowed_origins="*")

# client_states = {}  # 客户端状态存储


# @app.route('/')
# def index():
#     return render_template('index.html')


# @socketio.on('connect')
# def connected():
#     print("======connected")
#     # 这里可以初始化客户端的状态
#     client_states[request.sid] = {"last_timestamp": 0}  # 举例初始化状态

# @socketio.on('disconnect')
# def handle_disconnect():
#     print(f'Client {request.sid} disconnected')
#     # 清理客户端状态
#     if request.sid in client_states:
#         del client_states[request.sid]  # 删除该客户端的状态信息



# @socketio.on('image')
# def handle_image(data, socketId):
#     if isinstance(data, dict) and 'blob' in data:
#         # 提取图像数据
#         image_data = data['blob']
#         # 提取时间戳（如果需要）
#         timestamp = data.get('timestamp')
#         # 这里可以检查并更新客户端状态，例如时间戳
#         if socketId in client_states:
#             client_states[socketId]["last_timestamp"] = timestamp

#     # 解码图像
#     nparr = np.frombuffer(image_data, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#     if img is None or img.size == 0:
#         print("Received an empty or invalid image.")
#         return
    

#     # 使用 face.py 处理图像
#     processed_img = face.process_frame(img)

#     # 将处理后的图像编码并发送回前端
#     _, buffer = cv2.imencode('.jpg', processed_img)
#     # print("Encoded image size:", len(buffer), "bytes")
#     # 将图像数据转换为 Base64 字符串
#     encoded_image = base64.b64encode(buffer).decode('utf-8')

#     #print("Encoded image:", encoded_image)

#     socketio.emit('response', encoded_image, to=socketId)



# if __name__ == '__main__':
#     socketio.run(app, debug=True, port=5001)

from flask import Flask, render_template, request
from flask_socketio import SocketIO
import cv2
import base64
import numpy as np
import face

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def connected():
    print("Client connected, SID:", request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected, SID:', request.sid)

@socketio.on('image')
def handle_image(data, socketId):
    try:
            nparr = np.frombuffer(data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None or img.size == 0:
                print("Received an empty or invalid image.")
                return

            processed_img, counts = face.process_frame(img)

            _, buffer = cv2.imencode('.jpg', processed_img)
            encoded_image = base64.b64encode(buffer).decode('utf-8')

            socketio.emit('response', {'image': encoded_image, 'counts': counts}, to=socketId)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)
