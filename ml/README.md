# Video Pose Estimation and Machine Learning Classification 

## Project Overview
This project leverages advanced computer vision techniques to perform pose estimation from video data, extract meaningful features from these estimations, and subsequently train a machine learning model to classify different poses. Utilizing the MediaPipe library for pose estimation, the project demonstrates how to process video data to extract pose landmarks, prepare this data for machine learning, and apply a neural network for pose classification.

## Project Structure
- `trying.ipynb`: Notebook containing code for video processing and pose landmarks extraction using Mediapipe.Notebook detailing the training of a neural network on the processed pose data.
- `videos/`: Sample videos used for extracting pose data.

## Getting Started

### Prerequisites
Ensure you have Python 3.6+ installed. You'll also need the following libraries:
- OpenCV
- Mediapipe
- NumPy
- PyTorch

Install them using pip:
```
pip install opencv-python mediapipe numpy torch
```
### Running the Notebooks
1. Clone this repository to your local machine.
2. Open `data_preparation.ipynb` to start processing your videos and extracting pose landmarks.
3. Use `model_training.ipynb` to train the model on the extracted data.

## Usage
To process a new video, place it in the `videos/` directory and run the appropriate cells in `trying.ipynb`. For training with new data, ensure your dataset follows the structured format expected by `trying.ipynb`.

## Acknowledgments
- Thanks to the developers of Mediapipe and PyTorch for providing powerful tools for machine learning and computer vision.



