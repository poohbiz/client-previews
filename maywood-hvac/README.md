# brewing-hvac (client-previews demo folder)

This folder is a **self-contained** concept system page:
**Busy-Line HVAC Service Link** (missed-call catcher + request form) with basic tracking logs.

## Files
- `index.html` — the full page
- `styles.css` — self-contained styling (no dependencies)
- `app.js` — tracking + form behavior
- `Bruening_Activation_Assets.txt` — captions, pinned post, missed-call script, install checklist

## Deploy
If you're using GitHub Pages on `client-previews`, put this folder at:
`client-previews/brewing-hvac/`

Then the URL will be:
`.../brewing-hvac/`

## Proof-of-life (Launch SOP)
Open DevTools Console:
- Click **Call Now** → logs `[track] call_click`
- Submit the form once → logs `[track] form_submit`
- Change Service Needed dropdown → logs `[track] service_needed_select` (optional)

## Notes
- The phone number is a demo number. Replace the `tel:+15555550100` with a real client number on deployment.
- The hero image is loaded from Unsplash. Replace if needed.
- Page is set to `noindex,nofollow` by default for demos.


## Image
Add a hero image file named `hvac-tech.jpg` inside this folder, or change the `<img src>` in `index.html`.
