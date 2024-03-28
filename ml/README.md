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
### Installation
To set up the project on your local system, follow these steps:
1. Clone this repository to your local machine.
```
git clone https://github.com/acrostm/capstone_project_G3.git
```
2. Navigate to the cloned repository.
3. Install the required dependencies.
```
pip install -r requirements.txt

```

## Usage
This project is divided into several key sections:

1. **Video Processing and Pose Estimation**: Utilizes MediaPipe to process videos and extract pose landmarks. Refer to `trying.ipynb` for details.

2. **Feature Extraction**: Transforms pose landmarks into a structured format suitable for machine learning. Check the feature extraction section in the notebook.

3. **Model Training**: Trains a neural network model on the processed data for pose classification. See `trying.ipynb` for implementation.

To process new videos and extract pose data:
- Place your video files in the `videos/` directory.
- Run the cells in `data_preparation.ipynb`.

To train the model with new or existing data:
- Ensure your dataset is formatted correctly as per the structure expected by `trying.ipynb`.
- Execute the notebook to train the model.

## Acknowledgments
- MediaPipe for the pose estimation technology.
- PyTorch for the neural network framework.
- OpenCV for video processing capabilities.

