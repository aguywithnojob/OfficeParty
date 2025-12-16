const express = require('express');
const path = require('path');
const cors = require('cors');
const { initializeFirebase, db } = require('./firebase');

// Initialize Firebase
initializeFirebase();

const app = express();
const PORT = 3008;

app.use(cors());
app.use(express.json());

// Admin credentials (in production, use environment variables and hashed passwords)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'nadia';

// Initialize Firebase data if needed
const initializeData = async () => {
  try {
    const guestsRef = db().ref('guests');
    const guestsSnapshot = await guestsRef.once('value');
    
    if (!guestsSnapshot.exists()) {
      const initialData = [
        { id: 1, name: 'Prajwal Dev', foodOption: 'Non-Veg', drink: 'Drinker', accepted: false },
        { id: 2, name: 'Gautam Rishi', foodOption: 'Non-Veg', drink: 'Drinker', accepted: false },
        { id: 3, name: 'Prateek Garg', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 4, name: 'Tushar Saxena', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 5, name: 'Gaurav Ahuja', foodOption: 'Non-Veg', drink: 'Drinker', accepted: false },
        { id: 6, name: 'Shivya Shukla', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 7, name: 'Ankit Grover', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 8, name: 'Shokin Ajiv', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 9, name: 'Mohit Kumar', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 10, name: 'Mohit Mahendru', foodOption: 'Veg', drink: 'Non Drinker', accepted: false },
        { id: 11, name: 'Gajendar Sharma', foodOption: 'Veg', drink: 'Non Drinker', accepted: false },
      ];
      await guestsRef.set(initialData);
      console.log('Initialized guest data in Firebase');
    }
    
    const partyRef = db().ref('partyDetails');
    const partySnapshot = await partyRef.once('value');
    
    if (!partySnapshot.exists()) {
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
      await partyRef.set(initialPartyDetails);
      console.log('Initialized party details in Firebase');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

initializeData();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// GET all guests
app.get('/api/guests', async (req, res) => {
  try {
    const snapshot = await db().ref('guests').once('value');
    const guests = snapshot.val() || [];
    res.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// UPDATE guests
app.post('/api/guests', async (req, res) => {
  try {
    const guests = req.body;
    await db().ref('guests').set(guests);
    res.json({ success: true, guests });
  } catch (error) {
    console.error('Error saving guests:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// UPDATE single guest
app.put('/api/guests/:id', async (req, res) => {
  try {
    const guestId = parseInt(req.params.id);
    const updatedGuest = req.body;
    
    const snapshot = await db().ref('guests').once('value');
    let guests = snapshot.val() || [];
    
    guests = guests.map(guest => 
      guest.id === guestId ? { ...guest, ...updatedGuest } : guest
    );
    
    await db().ref('guests').set(guests);
    res.json({ success: true, guests });
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// ADD new guest
app.post('/api/guests/add', async (req, res) => {
  try {
    const { name, foodOption, drink } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const snapshot = await db().ref('guests').once('value');
    let guests = snapshot.val() || [];
    
    const newGuest = {
      id: guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1,
      name,
      foodOption: foodOption || 'Veg',
      drink: drink || 'Non Drinker',
      accepted: false
    };
    
    guests.push(newGuest);
    await db().ref('guests').set(guests);
    res.json({ success: true, newGuest });
  } catch (error) {
    console.error('Error adding guest:', error);
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
app.get('/api/party-details', async (req, res) => {
  try {
    const snapshot = await db().ref('partyDetails').once('value');
    const partyDetails = snapshot.val() || {};
    res.json(partyDetails);
  } catch (error) {
    console.error('Error fetching party details:', error);
    res.status(500).json({ error: 'Failed to read party details' });
  }
});

// Update party details
app.put('/api/party-details', async (req, res) => {
  try {
    const partyDetails = req.body;
    await db().ref('partyDetails').set(partyDetails);
    res.json({ success: true, partyDetails });
  } catch (error) {
    console.error('Error updating party details:', error);
    res.status(500).json({ error: 'Failed to update party details' });
  }
});

// Serve static files from dist folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Serve index.html for all non-API routes (must be after API routes)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT_TO_USE = process.env.PORT || PORT;

app.listen(PORT_TO_USE, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT_TO_USE}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Also accessible on your network at http://10.196.13.227:${PORT_TO_USE}`);
  }
});
