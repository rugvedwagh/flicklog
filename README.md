# Flicklog 🎬

A modern, full-stack movie logging platform built with React, Node.js, Express, and MongoDB. Track the movies you watch, share reviews, and connect with other film enthusiasts.

![Flicklog Demo](https://img.shields.io/badge/Flicklog-Movie%20Logging-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-16.0%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0%2B-green)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-blue)

## 🌟 Features

### ✨ Core Functionality
- **🎥 Movie Tracking** – Log and organize all the movies you watch
- **⭐ Reviews & Ratings** – Share your thoughts and rate movies
- **📸 Image Uploads** – Upload movie posters and screenshots with Cloudinary integration
- **🔍 Discover** – Find new movies and see what others are watching

### 🔐 Security & Performance
- **Secure Authentication** – JWT-based auth with refresh tokens stored in HTTP-only cookies
- **Performance Boost** – Redis caching for faster data retrieval
- **Image Optimization** – Cloudinary CDN for fast image delivery and transformations

### 🎨 User Experience
- **Responsive UI** – Modern and intuitive interface that works on all devices
- **Dark/Light Mode** – Theme switching for comfortable viewing
- **Real-time Updates** – Instant like, comment, and bookmark interactions

## 🛠 Tech Stack

- **Frontend:** React, Redux, Material-UI, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Cache:** Redis
- **Authentication:** JWT, CSRF & HTTP-only cookies
- **Image Storage:** Cloudinary CDN
- **Deployment:** Ready for production deployment

## 📦 Installation

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/flicklog.git
cd flicklog
2. Backend Setup
bash
cd server
npm install
3. Frontend Setup
bash
cd client
npm install
⚙️ Environment Variables
Server Environment (.env in server directory)
env
PORT=5000
DB_URL=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REDIS_URL=your_redis_url
CLOUDINARY_CLOUD_NAME=dt66i6boi
CLOUDINARY_API_KEY=565775757698443
CLOUDINARY_API_SECRET=2s3otrgg77YINw2VdS9v8SJ-gOA
Client Environment (.env in client directory)
env
NODE_ENV=development
REACT_APP_API_URL=your_production_backend_url
REACT_APP_API_URL_DEV=http://localhost:5000
🚀 Running the Application
Start Backend Server
bash
cd server
npm start
Start Frontend Development Server
bash
cd client
npm start
The application will be available at:

Frontend: http://localhost:3000

Backend API: http://localhost:5000

🔒 Enable HTTPS in Development
1. Install OpenSSL
Download OpenSSL:
👉 https://slproweb.com/products/Win32OpenSSL.html
(Pick the latest Win64 OpenSSL v3.x Light)

Install:

Run the installer

Choose to install OpenSSL binaries to your system path

Accept default settings (typically C:\Program Files\OpenSSL-Win64)

Restart PowerShell or Git Bash after installation

Verify installation:

bash
openssl version
2. Generate SSL Certificates
From your project root directory:

bash
mkdir certs
openssl req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem
Fill out the certificate fields when prompted.

3. Configure React to Run on HTTPS
From the /client directory:

bash
# PowerShell
$env:HTTPS = "true"; npm start

# Or as a one-liner
($env:HTTPS = "true") -and (npm start)
This will start your React frontend at https://localhost:3000 with your self-signed certificate.

📁 Project Structure
text
flicklog/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and actions
│   │   └── utils/         # Utility functions
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── utils/            # Server utilities
└── certs/                # SSL certificates (for development)
🎯 Key Features Implementation
Cloudinary Integration
Secure image uploads with signed URLs

Automatic image optimization and transformations

CDN delivery for fast loading times

Authentication System
JWT access tokens for API authorization

Refresh tokens stored in HTTP-only cookies

Automatic token refresh before expiration

Real-time Interactions
Instant like/unlike functionality

Live comment updates

Bookmark synchronization across devices

🤝 Contributing
We welcome contributions to Flicklog! Feel free to:

Open issues for bugs or feature requests

Submit pull requests with improvements

Suggest new features or enhancements

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Material-UI for the component library

Cloudinary for image storage and CDN services

MongoDB Atlas for database hosting

Redis for caching solutions

Happy movie logging! 🎥✨

text

This README maintains all your previous content from Reminisce while updating it for Flicklog, adding the Cloudinary configuration, and keeping the HTTPS setup instructions. It's now tailored for a movie logging application with all the technical details developers would need.