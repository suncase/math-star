const fs = require('fs');
const path = require('path');

// Supported file extensions
const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'm4v'];

function getGalleryFiles() {
    const galleryPath = path.join(__dirname, '../gallery');
    
    try {
        if (!fs.existsSync(galleryPath)) {
            throw new Error('Gallery directory not found');
        }
        
        const files = fs.readdirSync(galleryPath);
        const validFiles = files.filter(filename => {
            // Skip system files
            if (filename.startsWith('.') || filename === 'Thumbs.db') {
                return false;
            }
            
            // Check if file has supported extension
            const extension = path.extname(filename).toLowerCase().slice(1);
            return supportedExtensions.includes(extension);
        });
        
        // Sort files alphabetically
        validFiles.sort();
        
        return validFiles;
    } catch (error) {
        throw new Error(`Error reading gallery directory: ${error.message}`);
    }
}

// For Express.js
function galleryFilesHandler(req, res) {
    try {
        const files = getGalleryFiles();
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// For serverless functions (Vercel, Netlify, etc.)
function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'GET') {
        try {
            const files = getGalleryFiles();
            res.status(200).json(files);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

module.exports = { getGalleryFiles, galleryFilesHandler, handler };

// If running directly
if (require.main === module) {
    try {
        const files = getGalleryFiles();
        console.log(JSON.stringify(files, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}
