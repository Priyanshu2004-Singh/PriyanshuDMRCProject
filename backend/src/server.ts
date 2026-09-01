import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import materialRoutes from './routes/materialRoutes';
import applicationRoutes from './routes/applicationRoutes';
import adminRoutes from './routes/adminRoutes';
import { uploadPDF } from './middleware/uploadMiddleware';
import { storageService } from './services/storageService';
import { seedDatabase } from './services/seedService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// File Upload Endpoint (PDF only)
app.post('/api/upload', uploadPDF.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No PDF file uploaded' });
      return;
    }
    const fileUrl = await storageService.saveFile(req.file);
    res.json({
      message: 'File uploaded successfully',
      filePath: fileUrl,
      fileName: req.file.originalname,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(400).json({ error: error.message || 'File upload failed' });
  }
});

// Initialize DB and Seed
seedDatabase();

app.listen(PORT, () => {
  console.log(`DMRC Vendor Portal Backend running on http://localhost:${PORT}`);
});
