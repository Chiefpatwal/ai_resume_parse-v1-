import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Temporary in-memory user store
const users = [];

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Store user
    const newUser = { 
      id: users.length + 1,
      username, 
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    res.json({ 
      message: 'Login successful',
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (for testing - remove in production)
router.get('/users', (req, res) => {
  const safeUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    createdAt: user.createdAt
  }));
  res.json(safeUsers);
});

export default router;