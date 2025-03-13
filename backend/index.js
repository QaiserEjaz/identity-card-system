import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Card from './models/Card.js';
import authRoutes from './routes/auth.js';
// Fix these imports to match the exact filename case
import { errorHandler } from './middleware/errorHandler.js';
import { limiter } from './middleware/rateLimiter.js';

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://identity-card-system.vercel.app', process.env.CORS_ORIGIN]
        : 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Modify the multer setup to use memory storage instead of disk storage
// Remove the disk storage configuration
const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage instead
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]);

app.post('/api/cards', upload, async (req, res) => {
    try {
        const photoFile = req.files?.photo?.[0];
        const signatureFile = req.files?.signature?.[0];

        if (!photoFile) {
            return res.status(400).json({ error: 'Photo is required' });
        }

        const photoBase64 = `data:${photoFile.mimetype};base64,${photoFile.buffer.toString('base64')}`;
        const signatureBase64 = signatureFile 
            ? `data:${signatureFile.mimetype};base64,${signatureFile.buffer.toString('base64')}`
            : null;

        const card = new Card({
            ...req.body,
            photo: photoBase64,
            signature: signatureBase64
        });

        await card.save();
        res.status(201).json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Similar updates for the PUT route
app.put('/api/cards/:id', upload, async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.files?.photo?.[0]) {
            const photoFile = req.files.photo[0];
            updateData.photo = `data:${photoFile.mimetype};base64,${photoFile.buffer.toString('base64')}`;
        }
        
        if (req.files?.signature?.[0]) {
            const signatureFile = req.files.signature[0];
            updateData.signature = `data:${signatureFile.mimetype};base64,${signatureFile.buffer.toString('base64')}`;
        }

        const card = await Card.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add pagination to GET cards endpoint
app.get('/api/cards', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const total = await Card.countDocuments();
        
        // Get all cards with proper skip and limit
        const cards = await Card.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            cards,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNextPage: (page * limit) < total, // Fixed next page logic
                hasPrevPage: page > 1,
                itemsPerPage: limit,
                remainingItems: total - (page * limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add at the end of the file, before app.listen
app.use(errorHandler);

app.get('/api/cards/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/cards/:id', async (req, res) => {
    try {
        await Card.findByIdAndDelete(req.params.id);
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a root route for basic testing
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Identity Card System API is running' });
});

// This should be the very last part of your file
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});



