
from flask import Flask, render_template
from flask_socketio import SocketIO
import cv2
import base64
import numpy as np
import body

app = Flask(__name__)
socketio = SocketIO(app, port=5001, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def connected():
    print("======connected")

@socketio.on('image')
def handle_image(data, socketId):
    # 解码图像
    

    nparr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None or img.size == 0:
        print("Received an empty or invalid image.")
        return
    

    # 使用 face.py 处理图像
    processed_img = body.process_frame(img)

    # 将处理后的图像编码并发送回前端
    _, buffer = cv2.imencode('.jpg', processed_img)
    print("Encoded image size:", len(buffer), "bytes")
    # 将图像数据转换为 Base64 字符串
    encoded_image = base64.b64encode(buffer).decode('utf-8')

    #print("Encoded image:", encoded_image)

    socketio.emit('response', encoded_image, socketId)
  

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)
