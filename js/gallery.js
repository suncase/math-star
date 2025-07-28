document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Modal setup
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <span class="modal-close">&times;</span>
        <div class="modal-content"></div>
    `;
    document.body.appendChild(modal);

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter items
            const filterValue = button.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Modal functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const mediaElement = item.querySelector('.gallery-media');
            const isVideo = item.classList.contains('video');
            
            const modalContent = modal.querySelector('.modal-content');
            if (isVideo) {
                // Add support for both MP4 and MOV files
                const videoElement = document.createElement('video');
                videoElement.src = mediaElement.src;
                videoElement.controls = true;
                videoElement.autoplay = true;
                videoElement.playsInline = true; // Better mobile support
                
                // Add multiple source formats for better compatibility
                const sourceMP4 = document.createElement('source');
                const sourceMOV = document.createElement('source');
                
                // Get the base URL without extension
                const baseUrl = mediaElement.src.replace(/\.[^/.]+$/, "");
                
                sourceMP4.src = baseUrl + '.mp4';
                sourceMP4.type = 'video/mp4';
                sourceMOV.src = baseUrl + '.mov';
                sourceMOV.type = 'video/quicktime';
                
                videoElement.appendChild(sourceMP4);
                videoElement.appendChild(sourceMOV);
                
                modalContent.innerHTML = '';
                modalContent.appendChild(videoElement);
            } else {
                modalContent.innerHTML = `<img src="${mediaElement.src}" alt="${mediaElement.alt}">`;
            }
            
            modal.classList.add('active');
        });
    });

    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
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

    // Add support for .mov files in video elements
    document.querySelectorAll('video').forEach(video => {
        // Check if the video source is a .mov file
        if (video.src.toLowerCase().endsWith('.mov')) {
            // Add proper MIME type for QuickTime movies
            video.type = 'video/quicktime';
        }
    });
});
