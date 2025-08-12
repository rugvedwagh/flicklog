# Reminisce

Reminisce is a **MERN stack** application designed for users to store and revisit their cherished memories. It provides a seamless and secure experience with JWT authentication, Redis caching, and a modern UI.

## Features
- 📝 **Create & Manage Memories** – Users can add, edit, and delete memories.
- 🔒 **Secure Authentication** – JWT-based auth with refresh tokens stored in HTTP-only cookies.
- ⚡ **Performance Boost** – Redis caching for faster data retrieval.
- 🎨 **Responsive UI** – A modern and intuitive user interface.

## Tech Stack
- **Frontend:** React, Redux, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cache:** Redis
- **Authentication:** JWT & HTTP-only cookies

## Installation

1. **Clone the Repository**
git clone https://github.com/yourusername/reminisce.git
cd reminisce

text
2. **Backend Setup**
cd server
npm install
npm start

text
3. **Frontend Setup**
cd client
npm install
npm start

text

## Environment Variables

Create a `.env` file in the `server` directory with:
PORT=your_port_no
DB_URL=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
REDIS_URL=your_redis_url

text

Create a `.env` file in the `client` directory with:
NODE_ENV=development/production
REACT_APP_API_URL=your_backend_url
REACT_APP_API_URL_DEV=your_local_backend_url

text

## Enable HTTPS in Development

### 1. Install OpenSSL

**Download OpenSSL:**  
👉 https://slproweb.com/products/Win32OpenSSL.html  
(Pick the latest Win64 OpenSSL v3.x Light)

**Install:**  
- Run the installer.
- When prompted, choose to install OpenSSL binaries to your system path.
- Accept default settings (typically `C:\Program Files\OpenSSL-Win64`).
- After installation, restart PowerShell or Git Bash.
- Confirm installation:
openssl version

text
You should see the OpenSSL version output.

### 2. Generate SSL Certificates

From your project root, run:
mkdir certs
openssl req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem

text
- Fill out the prompted certificate fields (you can use defaults or add your info).

### 3. Configure React to Run on HTTPS

From the `/client` directory, run:
$env:HTTPS = "true"; npm start

text
- For PowerShell or compatible terminal.  
- This command tells React to start the development server using HTTPS.

Alternatively, you may use this one liner:
($env:HTTPS = "true") -and (npm start)

text
This starts your React frontend at https://localhost:3000 with your self-signed certificate.

## Contributing

Feel free to open issues or submit pull requests to improve Reminisce! 🚀

## License

This project is licensed under the MIT License.