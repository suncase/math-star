// Dynamic Gallery Loader
document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('gallery-grid');
    
    // Supported file extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'm4v'];
    
    // Function to get file extension
    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }
    
    // Function to check if file is an image
    function isImageFile(filename) {
        const ext = getFileExtension(filename);
        return imageExtensions.includes(ext);
    }
    
    // Function to check if file is a video
    function isVideoFile(filename) {
        const ext = getFileExtension(filename);
        return videoExtensions.includes(ext);
    }
    
    // Function to generate a nice title from filename
    function generateTitle(filename) {
        // Remove extension and replace underscores/hyphens with spaces
        let title = filename.replace(/\.[^/.]+$/, "");
        title = title.replace(/[_-]/g, ' ');
        
        // Capitalize each word
        title = title.replace(/\b\w/g, l => l.toUpperCase());
        
        return title;
    }
    
    // Function to generate description based on filename or content
    function generateDescription(filename, isVideo) {
        const title = generateTitle(filename);
        
        if (isVideo) {
            return `Interactive video lesson: ${title}`;
        } else {
            return `Teaching moment: ${title}`;
        }
    }
    
    // Function to get video MIME type
    function getVideoMimeType(filename) {
        const ext = getFileExtension(filename);
        const mimeTypes = {
            'mp4': 'video/mp4',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo',
            'webm': 'video/webm',
            'mkv': 'video/x-matroska',
            'flv': 'video/x-flv',
            'm4v': 'video/mp4'
        };
        return mimeTypes[ext] || 'video/mp4';
    }
    
    // Function to create gallery item HTML
    function createGalleryItem(filename, isVideo) {
        const title = generateTitle(filename);
        const description = generateDescription(filename, isVideo);
        const filePath = `gallery/${filename}`;
        const itemType = isVideo ? 'video' : 'image';
        
        let mediaElement;
        if (isVideo) {
            const mimeType = getVideoMimeType(filename);
            mediaElement = `
                <video class="gallery-media" 
                       src="${filePath}" 
                       type="${mimeType}"
                       preload="metadata">
                    Your browser does not support the video tag.
                </video>
            `;
        } else {
            mediaElement = `
                <img class="gallery-media" 
                     src="${filePath}" 
                     alt="${title}"
                     loading="lazy">
            `;
        }
        
        return `
            <div class="gallery-item ${itemType}">
                ${mediaElement}
                <div class="gallery-caption">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
    }
    
    // Function to load gallery files dynamically
    async function loadGalleryFiles() {
        try {
            // Try to load from the generated JSON file first
            const response = await fetch('gallery-files.json');
            if (response.ok) {
                const data = await response.json();
                console.log(`Loading ${data.totalFiles} files from gallery index (${data.images} images, ${data.videos} videos)`);
                const filenames = data.files.map(file => file.filename);
                loadFilesIntoGallery(filenames);
                return;
            }
        } catch (error) {
            console.log('Gallery index not found, trying API endpoint');
        }
        
        try {
            // Try API endpoint
            const response = await fetch('/api/gallery-files');
            if (response.ok) {
                const files = await response.json();
                loadFilesIntoGallery(files);
                return;
            }
        } catch (error) {
            console.log('API not available, using fallback method');
        }
        
        // Final fallback
        await loadGalleryWithFallback();
    }
    
    // Fallback method - scan for known files
    async function loadGalleryWithFallback() {
        // List of files we know exist (you can update this list)
        const knownFiles = [
            'IntersectVsIntercept.mp4',
            'VolumeOfCyclinder.mov',
            'ActualClassMinimizedPhoto.jpeg'
        ];
        
        const validFiles = [];
        
        // Test each file to see if it exists
        for (const filename of knownFiles) {
            try {
                const response = await fetch(`gallery/${filename}`, { method: 'HEAD' });
                if (response.ok) {
                    validFiles.push(filename);
                }
            } catch (error) {
                console.log(`File not found: ${filename}`);
            }
        }
        
        loadFilesIntoGallery(validFiles);
    }
    
    // Function to load files into gallery
    function loadFilesIntoGallery(files) {
        if (!files || files.length === 0) {
            galleryGrid.innerHTML = '<p class="no-media">No media files found in gallery.</p>';
            return;
        }
        
        // Sort files - videos first, then images, alphabetically within each type
        files.sort((a, b) => {
            const aIsVideo = isVideoFile(a);
            const bIsVideo = isVideoFile(b);
            
            if (aIsVideo && !bIsVideo) return -1;
            if (!aIsVideo && bIsVideo) return 1;
            return a.localeCompare(b);
        });
        
        // Generate HTML for all files
        let galleryHTML = '';
        files.forEach(filename => {
            // Skip system files
            if (filename.startsWith('.') || filename.toLowerCase() === 'thumbs.db') {
                return;
            }
            
            if (isImageFile(filename) || isVideoFile(filename)) {
                galleryHTML += createGalleryItem(filename, isVideoFile(filename));
            }
        });
        
        if (galleryHTML) {
            galleryGrid.innerHTML = galleryHTML;
            
            // Reinitialize gallery functionality after loading new content
            initializeGalleryInteractions();
        } else {
            galleryGrid.innerHTML = '<p class="no-media">No supported media files found in gallery.</p>';
        }
    }
    
    // Function to initialize gallery interactions (modal, filters, etc.)
    function initializeGalleryInteractions() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Modal setup
        let modal = document.querySelector('.gallery-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.innerHTML = `
                <span class="modal-close">&times;</span>
                <div class="modal-content"></div>
            `;
            document.body.appendChild(modal);
        }

        // Filter functionality
        filterButtons.forEach(button => {
            // Remove existing listeners
            button.replaceWith(button.cloneNode(true));
        });
        
        // Re-add filter listeners
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter items
                const filterValue = button.getAttribute('data-filter');
                document.querySelectorAll('.gallery-item').forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Modal functionality for new items
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const mediaElement = item.querySelector('.gallery-media');
                const isVideo = item.classList.contains('video');
                
                const modalContent = modal.querySelector('.modal-content');
                if (isVideo) {
                    const videoElement = document.createElement('video');
                    videoElement.src = mediaElement.src;
                    videoElement.controls = true;
                    videoElement.autoplay = true;
                    videoElement.playsInline = true;
                    videoElement.style.maxWidth = '100%';
                    videoElement.style.maxHeight = '80vh';
                    
                    modalContent.innerHTML = '';
                    modalContent.appendChild(videoElement);
                } else {
                    modalContent.innerHTML = `<img src="${mediaElement.src}" alt="${mediaElement.alt}" style="max-width: 100%; max-height: 80vh;">`;
                }
                
                modal.classList.add('active');
            });
        });

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            const modalContent = modal.querySelector('.modal-content');
            modalContent.innerHTML = '';
        });

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                const modalContent = modal.querySelector('.modal-content');
                modalContent.innerHTML = '';
            }
        });
    }
    
    // Initialize the gallery
    loadGalleryFiles();
});
