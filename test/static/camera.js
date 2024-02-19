document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
                video.play();
            };
        })
        .catch(err => {
            console.error('Error accessing camera:', err);
        });

    

    video.addEventListener('play', () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let frameCount = 0;
        const frameRate = 10;  // Limit to 10 frames per second

        function sendFrame() {
            if (video.paused || video.ended) {
                return;
            }
            // Limit the frame rate
            if (frameCount++ % frameRate === 0) {
                canvas.width = video.videoWidth /2;  // Reduce resolution
                canvas.height = video.videoHeight/2;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob(blob => {
                    socket.emit('image', blob);
                }, 'image/jpeg');
            }
            // canvas.width = video.videoWidth;
            // canvas.height = video.videoHeight;
            // context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // canvas.toBlob(blob => {
            //     socket.emit('image', blob);
            // }, 'image/jpeg');

            requestAnimationFrame(sendFrame);
        }

        sendFrame();
    });
    socket.on('response', function(encoded_image) {
        
        // 将接收到的 Base64 字符串转换为图像 URL
        var imgSrc = 'data:image/jpeg;base64,' + encoded_image;
    
        // 创建或更新图像元素以显示图像
        var img = document.getElementById('processed_img');
        if (!img) {
            img = document.createElement('img');
            img.id = 'processed_img';
            document.body.appendChild(img);
        }
         // Update image width and height to fit the desired size
        img.style.width = '50%';  // Adjust to your desired width
        img.style.height = 'auto';  // Maintain aspect ratio
        img.src = imgSrc;
    });
    
    
});
