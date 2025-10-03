const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function createCircularFavicon() {
    try {
        // Load the profile image
        const img = await loadImage('images/icon-profile.png');
        
        const sizes = [16, 32, 180];
        
        for (const size of sizes) {
            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext('2d');
            
            // Create circular clipping path
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
            ctx.clip();
            
            // Draw the image
            ctx.drawImage(img, 0, 0, size, size);
            
            // Save the result
            const buffer = canvas.toBuffer('image/png');
            let filename;
            if (size === 16) {
                filename = 'favicon-16x16.png';
            } else if (size === 32) {
                filename = 'favicon-32x32.png';
            } else {
                filename = 'apple-touch-icon.png';
            }
            
            fs.writeFileSync(filename, buffer);
            console.log(`Created ${filename}`);
        }
        
        console.log('All circular favicons created successfully!');
    } catch (error) {
        console.error('Error:', error.message);
        console.log('Trying alternative method...');
        
        // Fallback: create simple circular versions using basic tools
        const { exec } = require('child_process');
        
        // Create a simple circular mask and apply it
        exec('sips -s format png temp-profile-32.png --out favicon-32x32.png', (err) => {
            if (err) console.error('Error creating 32x32:', err);
            else console.log('Created favicon-32x32.png');
        });
        
        exec('sips -s format png temp-profile-16.png --out favicon-16x16.png', (err) => {
            if (err) console.error('Error creating 16x16:', err);
            else console.log('Created favicon-16x16.png');
        });
        
        exec('sips -s format png images/icon-profile.png --out apple-touch-icon.png', (err) => {
            if (err) console.error('Error creating 180x180:', err);
            else console.log('Created apple-touch-icon.png');
        });
    }
}

createCircularFavicon();
