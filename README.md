# Hemanth Raj & Malavika — Wedding Invitation

This is a responsive, static invitation website. Open `index.html` in a browser, or publish the contents of this folder to any static web host.

## Editing the invitation

Update `data.js` to change the couple and parents' names, invitation copy, wedding and reception details, map links, assets, and palette. The supplied photographs and music are in `assets/`; the large JPEG photos are optimized WebP copies for faster loading.

## Sharing preview

The Open Graph and Twitter metadata uses the temple portrait as its preview image. After publishing, set `og:image` to the absolute public URL for `assets/temple-couple.webp` in `index.html` so WhatsApp and other crawlers can retrieve it. Social crawlers generally do not run page JavaScript, so the metadata in the HTML head should include the public title, description, and image URL.

QR codes are generated in the browser from the exact map URLs in `data.js` with QRCode.js (loaded from cdnjs). The font families are loaded from Google Fonts; system serif and sans-serif fallbacks are defined for offline use.
