#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const galleryPath = path.join(__dirname, 'gallery');
const outputPath = path.join(__dirname, 'gallery-files.json');

// Supported file extensions
const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'm4v'];

function buildGalleryIndex() {
    try {
        console.log('Building gallery index...');
        
        if (!fs.existsSync(galleryPath)) {
            throw new Error(`Gallery directory not found: ${galleryPath}`);
        }
        
        const files = fs.readdirSync(galleryPath);
        const validFiles = [];
        
        files.forEach(filename => {
            // Skip system files
            if (filename.startsWith('.') || filename === 'Thumbs.db' || filename === '.DS_Store') {
                console.log(`Skipping system file: ${filename}`);
                return;
            }
            
            // Check if file has supported extension
            const extension = path.extname(filename).toLowerCase().slice(1);
            if (!supportedExtensions.includes(extension)) {
                console.log(`Skipping unsupported file: ${filename}`);
                return;
            }
            
            // Get file stats
            const filePath = path.join(galleryPath, filename);
            const stats = fs.statSync(filePath);
            
            const fileInfo = {
                filename: filename,
                extension: extension,
                size: stats.size,
                modified: stats.mtime.toISOString(),
                type: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension) ? 'image' : 'video'
            };
            
            validFiles.push(fileInfo);
            console.log(`Added: ${filename} (${fileInfo.type}, ${Math.round(stats.size / 1024)}KB)`);
        });
        
        // Sort files - videos first, then images, alphabetically within each type
        validFiles.sort((a, b) => {
            if (a.type === 'video' && b.type === 'image') return -1;
            if (a.type === 'image' && b.type === 'video') return 1;
            return a.filename.localeCompare(b.filename);
        });
        
        // Create the output object
        const output = {
            generated: new Date().toISOString(),
            totalFiles: validFiles.length,
            images: validFiles.filter(f => f.type === 'image').length,
            videos: validFiles.filter(f => f.type === 'video').length,
            files: validFiles
        };
        
        // Write to JSON file
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        
        console.log(`\\nGallery index built successfully!`);
        console.log(`- Total files: ${output.totalFiles}`);
        console.log(`- Images: ${output.images}`);
        console.log(`- Videos: ${output.videos}`);
        console.log(`- Output: ${outputPath}`);
        
        return output;
        
    } catch (error) {
        console.error('Error building gallery index:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    buildGalleryIndex();
}

module.exports = { buildGalleryIndex };
