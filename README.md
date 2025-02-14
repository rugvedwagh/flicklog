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
   ```sh
   git clone https://github.com/yourusername/reminisce.git
   cd reminisce
   ```
2. **Backend Setup**
   ```sh
   cd server
   npm install
   npm start
   ```
3. **Frontend Setup**
   ```sh
   cd client
   npm install
   npm start
   ```

## Environment Variables
Create a `.env` file in the `server` directory with:
```env
PORT = your_port_no
DB_URL = your_mongodb_uri
ACCESS_TOKEN_SECRET = your_secret
REFRESH_TOKEN_SECRET = your_secret
REDIS_URL = your_redis_url
``` 

Create a `.env` file in the `client` directory with:
```env
NODE_ENV = development/production
REACT_APP_API_URL = your_backend_url
REACT_APP_API_URL_DEV = your_local_backend_url
``` 

## Contributing
Feel free to open issues or submit pull requests to improve Reminisce! 🚀

## License
This project is licensed under the MIT License.
