#!/bin/bash

# Gallery build script
GALLERY_DIR="./gallery"
OUTPUT_FILE="./gallery-files.json"

echo "Building gallery index..."

# Check if gallery directory exists
if [ ! -d "$GALLERY_DIR" ]; then
    echo "Error: Gallery directory not found: $GALLERY_DIR"
    exit 1
fi

# Start JSON file
echo "{" > "$OUTPUT_FILE"
echo "  \"generated\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"," >> "$OUTPUT_FILE"
echo "  \"files\": [" >> "$OUTPUT_FILE"

# Supported extensions
IMAGE_EXTS="jpg jpeg png gif webp bmp svg"
VIDEO_EXTS="mp4 mov avi webm mkv flv m4v"

# Find all supported files
FILES=()
for ext in $IMAGE_EXTS $VIDEO_EXTS; do
    while IFS= read -r -d '' file; do
        FILES+=("$file")
    done < <(find "$GALLERY_DIR" -maxdepth 1 -type f -iname "*.$ext" -print0 2>/dev/null)
done

# Sort files
IFS=$'\n' FILES=($(sort <<<"${FILES[*]}"))

# Process files
TOTAL_FILES=0
IMAGE_COUNT=0
VIDEO_COUNT=0

for i in "${!FILES[@]}"; do
    file="${FILES[$i]}"
    filename=$(basename "$file")
    
    # Skip system files
    if [[ "$filename" == .* ]] || [[ "$filename" == "Thumbs.db" ]] || [[ "$filename" == ".DS_Store" ]]; then
        continue
    fi
    
    # Get file extension
    ext="${filename##*.}"
    ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    
    # Determine file type
    if [[ " $IMAGE_EXTS " =~ " $ext " ]]; then
        file_type="image"
        ((IMAGE_COUNT++))
    else
        file_type="video"
        ((VIDEO_COUNT++))
    fi
    
    # Get file size
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        file_size=$(stat -f%z "$file")
        file_modified=$(stat -f%m "$file")
        file_modified=$(date -r "$file_modified" -u +%Y-%m-%dT%H:%M:%S.000Z)
    else
        # Linux
        file_size=$(stat -c%s "$file")
        file_modified=$(stat -c%Y "$file")
        file_modified=$(date -d "@$file_modified" -u +%Y-%m-%dT%H:%M:%S.000Z)
    fi
    
    # Add comma if not first file
    if [ $TOTAL_FILES -gt 0 ]; then
        echo "," >> "$OUTPUT_FILE"
    fi
    
    # Add file entry
    echo "    {" >> "$OUTPUT_FILE"
    echo "      \"filename\": \"$filename\"," >> "$OUTPUT_FILE"
    echo "      \"extension\": \"$ext\"," >> "$OUTPUT_FILE"
    echo "      \"size\": $file_size," >> "$OUTPUT_FILE"
    echo "      \"modified\": \"$file_modified\"," >> "$OUTPUT_FILE"
    echo "      \"type\": \"$file_type\"" >> "$OUTPUT_FILE"
    echo -n "    }" >> "$OUTPUT_FILE"
    
    ((TOTAL_FILES++))
    echo "Added: $filename ($file_type, $(($file_size / 1024))KB)"
done

# Close JSON file
echo "" >> "$OUTPUT_FILE"
echo "  ]," >> "$OUTPUT_FILE"
echo "  \"totalFiles\": $TOTAL_FILES," >> "$OUTPUT_FILE"
echo "  \"images\": $IMAGE_COUNT," >> "$OUTPUT_FILE"
echo "  \"videos\": $VIDEO_COUNT" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo ""
echo "Gallery index built successfully!"
echo "- Total files: $TOTAL_FILES"
echo "- Images: $IMAGE_COUNT"
echo "- Videos: $VIDEO_COUNT"
echo "- Output: $OUTPUT_FILE"
