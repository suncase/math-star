# Math Star Website

This is a local development version of the Math Star website, a math tutoring service for grades 1-10.

## Project Structure

```
math-star-website/
├── css/
│   └── styles.css
├── images/
│   └── math-background.jpg (placeholder)
├── js/
│   └── script.js
├── index.html
├── 404.html
├── server.js
└── README.md
```

## Running the Website Locally

### Option 1: Using Node.js (Recommended)

1. Make sure you have Node.js installed on your computer.
2. Open a terminal and navigate to the project directory:
   ```
   cd ~/math-star-website
   ```
3. Run the local server:
   ```
   node server.js
   ```
4. Open your web browser and go to: http://localhost:3000

### Option 2: Using Python's built-in HTTP server

1. Open a terminal and navigate to the project directory:
   ```
   cd ~/math-star-website
   ```
2. If you have Python 3 installed, run:
   ```
   python3 -m http.server 3000
   ```
   If you have Python 2 installed, run:
   ```
   python -m SimpleHTTPServer 3000
   ```
3. Open your web browser and go to: http://localhost:3000

### Option 3: Open directly in browser

Simply open the `index.html` file in your web browser. Note that some features might not work correctly when opened this way.

## Next Steps for Development

1. Replace placeholder images with actual images
2. Set up a backend for the contact form
3. Add more content to each section
4. Implement responsive design improvements
5. Add SEO optimization
6. Set up hosting and domain configuration
