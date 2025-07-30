<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Path to gallery directory
$galleryPath = '../gallery/';

// Supported file extensions
$supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'm4v'];

try {
    if (!is_dir($galleryPath)) {
        throw new Exception('Gallery directory not found');
    }
    
    $files = [];
    $directory = new DirectoryIterator($galleryPath);
    
    foreach ($directory as $fileInfo) {
        if ($fileInfo->isDot() || $fileInfo->isDir()) {
            continue;
        }
        
        $filename = $fileInfo->getFilename();
        $extension = strtolower($fileInfo->getExtension());
        
        // Skip system files and unsupported formats
        if (strpos($filename, '.') === 0 || 
            $filename === 'Thumbs.db' || 
            $filename === '.DS_Store' ||
            !in_array($extension, $supportedExtensions)) {
            continue;
        }
        
        $files[] = $filename;
    }
    
    // Sort files alphabetically
    sort($files);
    
    echo json_encode($files);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
