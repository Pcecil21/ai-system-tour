# Sharing images

`social-cards.html` is the editable layout for the two 1200 × 630 PNG sharing images. It uses the same local fonts, wordmark, colors, and unmodified family photograph as the site.

Run `npm run dev` and open `/design/social-cards.html`. After fonts and images finish loading, capture each `#social-home` and `#social-inventory` article at its native size with a device scale factor of 1. Save the images as `public/images/social-home.png` and `public/images/social-inventory.png`.

The Vite build publishes the exported PNGs; this design template is not a build entry. Metadata in `index.html` and `inventory.html` uses the existing production canonical host. Preview deployments can verify the images and metadata, while actual public sharing depends on publishing the pages and images together.

The metadata fields follow the [Open Graph specification](https://ogp.me/), including image type, dimensions, and descriptive alt text.
