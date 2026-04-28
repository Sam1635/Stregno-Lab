🛡️ Medical Image Steganography using LSB (React + Python)
📌 Overview

This project implements a secure medical image steganography system that hides sensitive medical images inside cover images using k-bit LSB techniques.

The system focuses on confidentiality, integrity, and imperceptibility, ensuring that hidden data remains secure while maintaining high image quality.

A React.js frontend is developed to provide an interactive UI for embedding and extraction operations.

🚀 Features
🔐 Secure image-to-image steganography
🧠 Supports 1-bit, 2-bit, 3-bit LSB embedding (S-LSB, D-LSB, T-LSB)
🔄 Binary reversal & adjacent bit swapping for enhanced security
🧾 64-bit header structure (dimensions + session key)
✅ XOR-based hashing for data integrity verification
🌐 React.js frontend for user interaction
⚡ Fast and lightweight implementation
🖥️ Frontend (React.js)
Built using React.js
Provides:
Image upload (cover & secret image)
Embed & extract buttons
Display of output images
Designed for simple and user-friendly interaction
⚙️ Backend (Python)
Handles:
Image processing
Bit-level transformations
LSB embedding & extraction
Hash generation & verification
Uses:
OpenCV
NumPy
🏗️ Working Process
🔹 Embedding
Convert secret image → binary
Apply:
Bit reversal
Bit swapping
Add 64-bit header
Generate XOR hash
Embed using k-bit LSB
Output → Stego Image
🔹 Extraction
Read header
Extract embedded bits
Reverse transformations
Reconstruct image
Verify using hash
📊 Performance Metrics
PSNR (Image quality)
MSE / RMSE (Distortion)
NPCR, UACI (Security strength)
Correlation (R), SC
📂 Project Structure
/project
│── frontend/        # React App
│   ├── src/
│   ├── public/
│
│── backend/         # Python scripts
│   ├── embed.py
│   ├── extract.py
│
│── README.md
▶️ How to Run
Frontend
cd frontend
npm install
npm start
Backend
pip install opencv-python numpy
python app.py
🔍 Key Highlights
Lightweight alternative to heavy encryption-based models
High imperceptibility + capacity trade-off
Designed specifically for medical image security
Easy-to-use interface with React
📈 Future Improvements
Add AES encryption layer
Deploy as cloud/web app
Extend to video/audio steganography
