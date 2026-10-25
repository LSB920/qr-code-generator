# QR Studio

A free, mobile-friendly QR design studio, built on the original QR code generator fork and its bundled `vendor/qrcode.js` library. No account, server, analytics, or external assets needed.

## Features

- Generate website, Wi-Fi, contact (vCard), email, SMS, and calendar event QR codes.
- Customize foreground/background colors, optional gradient, dot shapes, correction level, and small center logos.
- Download PNG and SVG, print QR codes as-is or in card/poster designs.
- Receive contrast and customization cautions; optional native `BarcodeDetector` decoding when the browser supports it.
- All processing stays on your device. Uploaded logo images are locally processed, never transmitted.

## Publish on GitHub Pages

Upload the *contents* of this folder to the repository's `main` branch, replacing existing `index.html`, `styles.css`, `app.js`, and `README.md`, while preserving `vendor/`. In repository Settings > Pages, select Deploy from a branch > main > /(root).

Expected URL: https://lsb920.github.io/qr-code-generator/

## Important scan notes

This tool cannot guarantee every scanner or printer will recognize every design. The safety check combines color-contrast rules and visual-design cautions. Some browsers also support a native decode test for the rendered output. A successful check is useful but never a substitute for testing the code with multiple phone cameras before printing. Wi-Fi security formats and calendar event compatibility can vary by device. Calendar dates are encoded as local wall-clock times (without a time-zone declaration).

## Credits

Based on https://github.com/jlavista/qr-code. Original QR generator dependency included in `vendor/`, with its license preserved in `vendor/LICENSE`. Inspect upstream licensing and attribution requirements before redistributing additional assets.
