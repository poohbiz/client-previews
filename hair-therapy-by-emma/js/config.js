// Edit this file only. Everything else pulls from here.
window.SITE = {
  bookingUrl:
    "https://book.squareup.com/appointments/244yzus9olcycg/location/LVFXFPK4PHJ2E/services", // Paste Square booking URL
  phone: "+12174404062", // E.164 format recommended
  instagramUrl: "#", // https://instagram.com/...
  responseTime: "Within 24 hours",

  // Tracking (safe: leave ga4Id blank until ready)
  tracking: {
    ga4Id: "G-JYXB905G79", // e.g. "G-XXXXXXXXXX"
    debug: true, // set false after launch
  },
  moveBannerText:
    "Moving to Hannibal, MO — closed through February. Booking March now.",
  moveBannerCta: "Book March",

  // Location strings used on the page
  locationShort: "Inside Cafe6 • By appointment",
  locationLong:
    "Inside Cafe6 • 115 W Main St, Lewistown, MO 63452 • By appointment",
  mapsUrl: "https://maps.app.goo.gl/FpYpm4rcxw6qdVM56", // Optional: Google Maps link (share URL)
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3052.529474397562!2d-91.81463129999995!3d40.08590650000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87e779d3dc6e5eb9%3A0xf688c62a4849cf87!2sCafe%206%20Coffeehouse!5e0!3m2!1sen!2sus!4v1770041987115!5m2!1sen!2sus",

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
    caption: "Lowlights",
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
  {
    src: "./assets/gallery/blonde-foil2.jpeg",
    alt: "Bright blonde hair",
    tag: "foils",
    caption: "Blonde",
  },
  {
    src: "./assets/gallery/auburn.jpeg",
    alt: "Deep auburn hair color",
    tag: "vivid",
    caption: "Auburn",
  },
  {
    src: "./assets/gallery/highlights.jpeg",
    alt: "Brunette with subtle highlights",
    tag: "foils",
    caption: "Highlights",
  },
  {
    src: "./assets/gallery/bob.jpeg",
    alt: "Short bob haircut",
    tag: "cuts",
    caption: "Bob",
  },
  {
    src: "./assets/gallery/dimension.jpeg",
    alt: "Brunette hair with warm dimension",
    tag: "foils",
    caption: "Dimension",
  },

  // Add more...
];

// Featured strip picks the first 8 items by default (or you can curate)
window.FEATURED_COUNT = 8;
