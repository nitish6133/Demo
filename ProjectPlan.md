📘 Project Plan: Imran Pasha Wood Works – Static Website (No Backend)

Objective

Build a static, mobile-first, zero-maintenance website for a local carpenter, showcasing his work. Content should auto-update based on YouTube and Instagram uploads. Phone contact must always remain visible on the screen.

⸻

✅ Core Requirements

Functional Requirements
	1.	Static website hosted on a free/low-maintenance host (Netlify / Vercel / GitHub Pages).
	2.	No backend or server-side code. All content loaded on the client side.
	3.	Auto-pull:
	•	YouTube videos from a specific channel or playlist
	•	Instagram reels + images from business IG account
	4.	Always display phone number on screen (sticky / floating).
	5.	Pages:
	•	Home
	•	Services
	•	Gallery (YouTube + Instagram)
	•	About & Location
	•	Contact
	6.	Must look excellent and load fast on mobile (primary audience).
	7.	Extremely simple UX – targeted to non-English-speaking local customers.

⸻

🎨 UI/UX & Branding Guidelines

Visual Style
	•	Warm wood-based theme (browns, creams, off-white, textured wood background for sections).
	•	Large images, minimal text, visual storytelling.
	•	Icons instead of long text for service explanations.
	•	Use Telugu + English; default EN, allow language toggle.
	•	Large tap targets for mobile users.

Layout Principles
	•	Mobile-first design: 80% traffic expected via smartphones.
	•	Use vertical scrolling with visual sections.
	•	Phone number must always be visible (fixed bottom bar or floating button).
	•	Use lightweight animations; avoid performance-heavy scripts.

Components to Include
	•	Sticky WhatsApp + Call button
	•	Auto-carousel for YouTube
	•	IG feed grid with “Load More” button
	•	Reviews section with star visuals

⸻

🧱 Website Structure

1. Header
	•	Logo + Business Name
	•	Simple menu: Home | Services | Gallery | About | Contact
	•	Sticky call button or floating WhatsApp icon (bottom right)

2. Hero Section (Home)
	•	Workshop or furniture photo as hero image
	•	Tagline: “Handcrafted Woodwork in Manikonda”
	•	Quick CTAs:
	•	Call Now
	•	WhatsApp
	•	Auto-loading YouTube hero video preview

3. Services Section

Use icon-based cards with short text:
	•	Custom Furniture
	•	Modular Kitchen
	•	Wardrobes
	•	TV Units
	•	Pooja Units
	•	Office Interiors
	•	Wooden Repairs & Polish

Each card opens a simple modal with 3–6 sample images (loaded dynamically from IG by category hashtag if possible).

4. Gallery Page

Two tabs:
Photos | Videos

Photos Section (Instagram):
	•	3-column grid on mobile, 5-column on desktop
	•	Load most recent IG posts via API or approved widget
	•	Clicking a post opens lightbox (not redirect to IG unless required)
	•	Hashtags for filtering if possible:
	•	#Wardrobe #Kitchen #TVUnit #Bed #OfficeWork

Videos Section (YouTube):
	•	Horizontal scroll carousel with thumbnails
	•	Clicking opens a modal and plays embedded video

5. About + Location
	•	Photo of Imran + 3 lines about him
	•	Show:
	•	10+ years of experience
	•	Located in Manikonda
	•	Free site visit (optional)
	•	Add embedded Google Map pinned to the shop

6. Contact Page
	•	Large call button
	•	WhatsApp button
	•	Address + Google Map redirection
	•	Working hours
	•	Simple form that triggers WhatsApp message pre-filled (no backend)

⸻

🔗 External Integrations (No Backend)

YouTube Integration (Client-side)
	•	Fetch video list via YouTube Data API v3 (API key required).
	•	Use channel ID or playlist ID.
	•	Data to extract: video title, thumbnail, description, link/embed URL.

Fallback if quota is an issue:
Use embed playlist directly (no API) — static but auto-updates.

Instagram Integration (Client-side)

Instagram no longer allows easy public API without tokens. Choose one:

Option A: Free No-Code Instagram Feed Widgets
(Safest, zero maintenance)
Examples:
	•	Elfsight (recommended – elegant, auto-refresh)
	•	LightWidget
	•	TagEmbed

Widget is embedded as a script – no backend, updates automatically.

Option B: Official Instagram Graph API
Requires IG business account + short-lived tokens → must auto-refresh (requires some backend).
Not recommended if zero backend is the goal.

Google Reviews (Optional)
	•	Embed Place reviews widget via Google Places API or 3rd-party widget.

⸻

🧪 Performance Expectations

Performance Optimizations
	•	Use lazy loading for images & videos.
	•	Compress/optimize images.
	•	Prefetch hero image.
	•	Avoid multiple heavy libraries; keep bundle < 1MB.

Lighthouse Goals
	•	Mobile performance: 85+
	•	Accessibility: 90+
	•	Best Practices: 90+
	•	SEO: 95+

⸻

📍 Hosting & Deployment

Recommended Stack
	•	Static site built in React + Vite + Tailwind
	•	Hosted on Netlify or Vercel
	•	Domain mapped (e.g., manikondacarpenter.com)

CI/CD
	•	Auto-deploy from Git repo on push
	•	Use environment variables for YouTube API key

⸻

🧑‍🔧 Zero-Maintenance Workflow

Task	Who does it	Result
Uploads video to YouTube	Imran	Shows on website
Uploads photos to Instagram	Imran	Auto updates gallery
Customer leaves Google review	Customer	Auto updates reviews section

No login needed for site management.
