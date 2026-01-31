// Edit this file only. Everything else pulls from here.
window.SITE = {
  bookingUrl: "#", // Paste Square booking URL
  phone: "+12175551234", // E.164 format recommended
  instagramUrl: "#", // https://instagram.com/...
  responseTime: "Within 24 hours",

  // Location strings used on the page
  locationShort: "Inside Cafe6 • By appointment",
  locationLong:
    "Inside Cafe6 • 113 Main St, Lewistown, MO 63452 • By appointment",
  mapsUrl: "#", // Optional: Google Maps link (share URL)

  // Hero collage images (3)
  heroImages: [
    "./assets/gallery/vivid-color.jpeg",
    "./assets/gallery/foil-brown.jpeg",
    "./assets/gallery/workspace.jpeg",
  ],

  stylistName: "Emma",
  stylistPhoto: "./assets/emma.jpeg",
};

// Gallery data:
// tags can include: "vivid", "foils", "cuts", "mens", "blonde", "brunette"
window.GALLERY = [
  {
    src: "./assets/gallery/vivid-color.jpeg",
    alt: "Vivid green panels",
    tag: "vivid",
    caption: "Vivid Color",
  },
  {
    src: "./assets/gallery/vivid-teal.jpeg",
    alt: "Teal vivid color",
    tag: "vivid",
    caption: "Vivid Color",
  },
  {
    src: "./assets/gallery/blonde-foil.jpeg",
    alt: "Blonde foils",
    tag: "foils",
    caption: "Foils",
  },
  {
    src: "./assets/gallery/foil-brown.jpeg",
    alt: "Brunette curls",
    tag: "foils",
    caption: "Dimension",
  },
  {
    src: "./assets/gallery/haircut01.jpeg",
    alt: "Haircut",
    tag: "cuts",
    caption: "Haircut",
  },
  {
    src: "./assets/gallery/mens-cut.jpeg",
    alt: "Men's fade haircut",
    tag: "mens",
    caption: "Men's Cut",
  },

  // Add more...
];

// Featured strip picks the first 8 items by default (or you can curate)
window.FEATURED_COUNT = 8;
