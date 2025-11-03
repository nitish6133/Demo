# Imran Pasha Wood Works - Website

A beautiful, mobile-first static website for a local carpentry business built with React, Vite, and Tailwind CSS.

## Features

- **Mobile-First Design**: Optimized for mobile users with responsive layouts
- **Warm Wood Theme**: Custom color palette featuring wood tones and cream colors
- **5 Main Pages**: Home, Services, Gallery, About, and Contact
- **Interactive Service Cards**: Click to view detailed galleries with image carousels
- **Social Media Integration**: Auto-updating YouTube and Instagram feeds
- **Floating Contact Buttons**: Sticky WhatsApp and Call buttons for easy access
- **Performance Optimized**: Lazy loading images, smooth animations, and fast load times

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Configuration

All business information and social media links are configured in `src/config.ts`.

### Update Business Information

Edit `src/config.ts` and update:

```typescript
business: {
  name: 'Your Business Name',
  phone: '+919876543210',        // UPDATE THIS
  whatsapp: '+919876543210',     // UPDATE THIS
  address: 'Your Address',       // UPDATE THIS
  workingHours: 'Your Hours',    // UPDATE THIS
  mapUrl: 'Google Maps Embed URL', // UPDATE THIS
}
```

### Setup YouTube Integration

1. Create a YouTube playlist with your videos
2. Get the playlist ID from the URL (e.g., `PLxxx...`)
3. Update in `src/config.ts`:

```typescript
social: {
  youtubePlaylistUrl: 'https://www.youtube.com/embed/videoseries?list=YOUR_PLAYLIST_ID',
}
```

### Setup Instagram Integration

1. Go to [Elfsight](https://elfsight.com/instagram-feed-instashow/) or [LightWidget](https://lightwidget.com/)
2. Create an Instagram feed widget
3. Copy the embed code
4. Update in `src/config.ts`:

```typescript
social: {
  instagramWidgetScript: '<!-- PASTE YOUR EMBED CODE HERE -->',
}
```

Then update `src/pages/Gallery.tsx` to insert the script in the Photos tab section.

### Setup Google Maps

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your business location
3. Click "Share" → "Embed a map"
4. Copy the iframe src URL
5. Update in `src/config.ts`:

```typescript
business: {
  mapUrl: 'https://www.google.com/maps/embed?pb=YOUR_EMBED_URL',
}
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Footer with contact info
│   ├── FloatingButtons.tsx  # Sticky contact buttons
│   └── ServiceCard.tsx  # Service card with modal
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Services.tsx    # Services gallery
│   ├── Gallery.tsx     # Photo/video gallery
│   ├── About.tsx       # About page
│   └── Contact.tsx     # Contact page
├── config.ts           # Business configuration
├── App.tsx             # Main app with routing
└── main.tsx            # App entry point
```

## Deployment

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`

### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

## Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  wood: { ... },  // Wood tones
  cream: { ... }, // Cream tones
}
```

### Images

Replace placeholder images with your own:
- Use high-quality images (800x600 or larger)
- Optimize images before uploading (use tools like TinyPNG)
- Update image URLs in the respective page files

### Services

Edit `src/pages/Services.tsx` to add/remove/modify services:

```typescript
const services = [
  {
    title: 'Your Service',
    icon: <Icon className="w-12 h-12" />,
    description: 'Description',
    images: ['url1', 'url2', 'url3'],
  },
];
```

## Performance Tips

- All images use lazy loading
- Icons are from lucide-react (lightweight)
- CSS animations are hardware-accelerated
- Build size: ~220KB JS + 21KB CSS (gzipped: ~67KB + 4KB)

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Lucide React** - Icons

## License

Private project for Imran Pasha Wood Works.

## Support

For questions or issues, contact the developer.
