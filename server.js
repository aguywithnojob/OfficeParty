const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3008;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'guests-data.json');
const PARTY_DETAILS_FILE = path.join(__dirname, 'party-details.json');

// Admin credentials (in production, use environment variables and hashed passwords)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'nadia';

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const initialData = [
    { id: 1, name: 'Prajwal Dev', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 2, name: 'Gautam Rishi', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 3, name: 'Prateek Garg', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 4, name: 'Tushar Saxena', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 5, name: 'Gaurav Ahuja', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 6, name: 'Shivya Shukla', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 7, name: 'Ankit Grover', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 8, name: 'Shokin Ajiv', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 9, name: 'Mohit Kumar', foodOption: 'Veg', drink: 'Drinker', accepted: false },
    { id: 10, name: 'Mohit Mhendru', foodOption: 'Veg', drink: 'Non Drinker', accepted: false },
    { id: 11, name: 'Gajendar Sharma', foodOption: 'Veg', drink: 'Non Drinker', accepted: false },
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Initialize party details file if it doesn't exist
if (!fs.existsSync(PARTY_DETAILS_FILE)) {
  const initialPartyDetails = {
    venue: 'TBD',
    date: '2025-12-17',
    startTime: '16:00',
    endTime: '23:00',
    timing: '4:00 PM - 11:00 PM',
    totalBill: '',
    paidBy: '',
    paymentMobile: '',
    paymentUPI: ''
  };
  fs.writeFileSync(PARTY_DETAILS_FILE, JSON.stringify(initialPartyDetails, null, 2));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// GET all guests
app.get('/api/guests', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// UPDATE guests
app.post('/api/guests', (req, res) => {
  try {
    const guests = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(guests, null, 2));
    res.json({ success: true, guests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// UPDATE single guest
app.put('/api/guests/:id', (req, res) => {
  try {
    const guestId = parseInt(req.params.id);
    const updatedGuest = req.body;
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    let guests = JSON.parse(data);
    
    guests = guests.map(guest => 
      guest.id === guestId ? { ...guest, ...updatedGuest } : guest
    );
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(guests, null, 2));
    res.json({ success: true, guests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// ADD new guest
app.post('/api/guests/add', (req, res) => {
  try {
    const { name, foodOption, drink } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    let guests = JSON.parse(data);
    
    const newGuest = {
      id: guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1,
      name,
      foodOption: foodOption || 'Veg',
      drink: drink || 'Non Drinker',
      accepted: false
    };
    
    guests.push(newGuest);
    fs.writeFileSync(DATA_FILE, JSON.stringify(guests, null, 2));
    res.json({ success: true, newGuest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add guest' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get party details
app.get('/api/party-details', (req, res) => {
  try {
    const data = fs.readFileSync(PARTY_DETAILS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read party details' });
  }
});

// Update party details
app.put('/api/party-details', (req, res) => {
  try {
    const partyDetails = req.body;
    fs.writeFileSync(PARTY_DETAILS_FILE, JSON.stringify(partyDetails, null, 2));
    res.json({ success: true, partyDetails });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update party details' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Also accessible on your network at http://10.196.13.227:${PORT}`);
});
