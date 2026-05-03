# 🛡️ Securing Confidential Medical Images using Triple layer of security Frameworks


# TECH STACK
```
REACT            - Frontend
PYTHON (FASTAPI) - Backend
```
## 📌 Overview
This project implements a secure **medical image steganography system** that hides sensitive medical images inside cover images using **k-bit LSB techniques**.

The system focuses on **confidentiality, integrity, and imperceptibility**, ensuring that hidden data remains secure while maintaining high image quality.

A **React.js frontend** is developed to provide an interactive UI for embedding and extraction operations.

---

## 🚀 Features
- 🔐 Secure image-to-image steganography  
- 🧠 Supports **1-bit, 2-bit, 3-bit LSB embedding (S-LSB, D-LSB, T-LSB)**  
- 🔄 **Binary transformation techniques** for enhanced security  
- 🧾 **Header structure** for information  
- ✅ **XOR-based hashing** for data integrity verification  
- 🌐 **React.js frontend** for user interaction  
- ⚡ Fast and lightweight implementation  

---

## 🖥️ Frontend (React.js)
Built using **React.js**

**Provides:**
- Image upload (cover & secret image)  
- Embed & extract functionality  
- Display and download output images  

Designed for **simple and user-friendly interaction**

---

## ⚙️ Backend (Python)

**Handles:**
- Image processing  
- Bit-level transformations  
- LSB embedding & extraction  
- Hash generation & verification  

**Libraries Used:**
- FastAPI
- NumPy
- Uvicorn
- Pillow

---

## 🏗️ Working Process

### 🔹 Embedding
1. Convert secret image → binary  
2. Apply:
   - Bit transformation
3. Add **Header**  
4. Generate **XOR hash**  
5. Embed using k-bit LSB  
6. Output → **Stego Image**

### 🔹 Extraction
1. Read header  
2. Extract embedded bits  
3. Reverse transformations  
4. Reconstruct image  
5. Verify using hash  

---

## 📊 Performance Metrics
- **PSNR** (Image quality)  
- **MSE / RMSE** (Distortion)  
- **NPCR, UACI** (Security strength)  
- **Entropy** (Randomness)
- **Correlation (R)**
- **SC**

---

## 📂 Project Structure
```
project-root/
│
├── backend/
│   ├── venv/                  # Python virtual environment
│   ├── __pycache__/           # Compiled Python files
│   ├── main.py                # FastAPI application entry point
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── node_modules/          # Installed npm packages
│   ├── public/                # Static assets
│   ├── src/                   # React source code
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── App.jsx            # Main React component
│   │   └── main.jsx           # Entry point
│   ├── build/                 # Production build files
│   ├── package.json           # Project metadata & dependencies
│   ├── package-lock.json      # Dependency lock file
│   └── .gitignore             # Ignored files
│
├── .vscode/                   # VS Code settings (optional)
├── README.md                 # Project documentation
└── .gitignore                # Global ignore rules
```
---

## ▶️ How to Run

Command Prompt Commands (Windows)
### Frontend
```
cd frontend
npm install
npm start
```
App: http://localhost:3000/

### Backend
```
cd backend
python -m venv myenv
myenv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn main:app --reload
```

App: http://127.0.0.1:8000

Docs (Swagger UI): http://127.0.0.1:8000/docs

Alternative docs: http://127.0.0.1:8000/redoc

**🔍 Key Highlights**
- Lightweight alternative to heavy encryption-based models
- High imperceptibility + capacity trade-off
- Designed specifically for medical image security
- Easy-to-use interface with React

**📈 Future Improvements**
- Add encryption layer
- Deploy as cloud/web app
- Extend to video/audio steganography
