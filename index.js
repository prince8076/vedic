const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI environment variable not set.");
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const videoSchema = new mongoose.Schema({
    videoUrl: String
});

const Product = mongoose.model('Product', videoSchema);

const videoUpload = multer({ dest: 'uploads/videos' });

app.post('/api/upload/video', videoUpload.single('video'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
            folder: 'videos',
        });

        fs.unlinkSync(req.file.path);

        const product = new Product({
            videoUrl: result.secure_url
        });
        await product.save();

        res.status(200).json({ message: 'Video uploaded and product saved successfully', product });
    } catch (error) {
        console.error('Error uploading video or saving product:', error);
        res.status(500).json({ error: 'Failed to upload video and save product' });
    }
});

app.get('/api/videos', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

app.get('/api/video/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Video not found' });
        }

        if (product.videoUrl) {
            return res.redirect(product.videoUrl);
        }


        const range = req.headers.range;
        if (!range) {
            return res.status(400).send('Range header is required');
        }

        const videoPath = path.resolve(product.videoUrl);
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ error: 'Video file not found' });
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const chunkSize = 10 ** 6;

        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + chunkSize, fileSize - 1);
        const contentLength = end - start + 1;

        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);

        const fileStream = fs.createReadStream(videoPath, { start, end });
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error streaming video:', error);
        res.status(500).json({ error: 'Failed to stream video' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
