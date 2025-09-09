const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash images for Bagster cargo marketplace
const images = [
  {
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    filename: 'hero-cargo.jpg',
    description: 'Cargo containers and logistics'
  },
  {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
    filename: 'hero-shipping.jpg',
    description: 'Shipping and transportation'
  },
  {
    url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80',
    filename: 'hero-truck.jpg',
    description: 'Truck transportation'
  },
  {
    url: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800&q=80',
    filename: 'dashboard-analytics.jpg',
    description: 'Analytics and dashboard'
  },
  {
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
    filename: 'team-collaboration.jpg',
    description: 'Team working together'
  },
  {
    url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80',
    filename: 'global-network.jpg',
    description: 'Global logistics network'
  },
  {
    url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80',
    filename: 'cargo-ship.jpg',
    description: 'Cargo ship at port'
  },
  {
    url: 'https://images.unsplash.com/photo-1578662015441-462b2dd660c3?w=600&q=80',
    filename: 'warehouse.jpg',
    description: 'Modern warehouse'
  },
  {
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
    filename: 'delivery-truck.jpg',
    description: 'Delivery truck'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    filename: 'avatar-1.jpg',
    description: 'Professional avatar 1'
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80',
    filename: 'avatar-2.jpg',
    description: 'Professional avatar 2'
  },
  {
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    filename: 'avatar-3.jpg',
    description: 'Professional avatar 3'
  }
];

function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('🚀 Starting image downloads for Bagster...');
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
      // Small delay to be respectful to Unsplash
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error downloading ${image.filename}:`, error.message);
    }
  }
  
  console.log('🎉 Image download complete!');
}

downloadAllImages();
