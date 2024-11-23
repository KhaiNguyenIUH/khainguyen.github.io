// server.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cors = require('cors');

const app = express();

const USERS = {
    admin: 'admin',
    user: 'admin',
  };

// Set up session middleware
app.use(
  session({
    secret: '123123', // Replace with a secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Enable parsing of JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to allow requests only from your site
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your site's URL in production
    credentials: true,
  })
);

// Authentication middleware
function authenticate(req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('videoFile');

// Check File Type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /mp4|mov|avi|wmv|flv|mkv|webm/;
  // Check extension
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only video files are allowed!');
  }
}

// Set static folder
app.use(express.static('./public'));

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Validate username and password
    if (USERS[username] && USERS[username] === password) {
      // Set session variables
      req.session.loggedIn = true;
      req.session.username = username;
  
      // Redirect to the index page after successful login
      res.redirect('/index.html');
    } else {
      // Respond with an error message for invalid credentials
      res.status(401).send('Invalid credentials');
      res.redirect('/login.html?error=invalid');
    }
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.loggedIn) {
    return next();
  }
  res.redirect('/login.html'); // Redirect to login if not authenticated
}

app.get('/index.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Upload route (protected)
app.post('/upload', authenticate, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send(`
        <p>${err}</p>
        <a href="/">Go Back</a>
      `);
    } else {
      if (req.file == undefined) {
        res.send(`
          <p>Error: No File Selected!</p>
          <a href="/">Go Back</a>
        `);
      } else {
        res.redirect('/');
      }
    }
  });
});

// API to get list of items in a folder (protected)
app.get('/api/items', authenticate, (req, res) => {
    const directoryPath = path.join(__dirname, 'public', 'uploads'); 
  
    // Optional query parameters
    const { fileType, page = 1, limit = 10 } = req.query; // Pagination and filtering
  
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err.message);
            return res.status(500).json({ error: 'Unable to fetch items', details: err.message });
        }
  
      // Get file details
      const items = files.map((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath); // Get file stats
        return {
          name: file,
          isDirectory: stats.isDirectory(),
          size: stats.size, // File size in bytes
          createdAt: stats.birthtime, // Creation date
          modifiedAt: stats.mtime, // Last modified date
        };
      });
  
      // Filter by file type if specified
      let filteredItems = items;
      if (fileType) {
        filteredItems = items.filter((item) =>
          path.extname(item.name).toLowerCase() === `.${fileType.toLowerCase()}`
        );
      }
  
      // Pagination logic
      const startIndex = (page - 1) * limit;
      const paginatedItems = filteredItems.slice(startIndex, startIndex + limit);
  
      // Send the response
      res.json({
        totalItems: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit),
        currentPage: parseInt(page, 10),
        items: paginatedItems,
      });
    });
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
