# Video Pose Estimation and Classification Project

## Introduction
This project aims to utilize advanced computer vision and machine learning techniques to analyze video data for pose estimation. It leverages the Mediapipe library for extracting human pose landmarks from video sequences, processes these landmarks to generate a structured dataset, and employs a neural network model for classification tasks. The project demonstrates a comprehensive workflow from raw video processing to model training and evaluation.

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
### Running the Notebooks
1. Clone this repository to your local machine.
2. Open `data_preparation.ipynb` to start processing your videos and extracting pose landmarks.
3. Use `model_training.ipynb` to train the model on the extracted data.

## Usage
To process a new video, place it in the `videos/` directory and run the appropriate cells in `data_preparation.ipynb`. For training with new data, ensure your dataset follows the structured format expected by `model_training.ipynb`.

## Contributing
Contributions to this project are welcome. Please feel free to fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## Acknowledgments
- Thanks to the developers of Mediapipe and PyTorch for providing powerful tools for machine learning and computer vision.



# Pose Estimation Feature
## Introduction

## Run the code
```bash
pip install opencv-python
pip install numpy
pip install mediapipe
pip install torch
pip install flask
python3 pages.py
```

...
