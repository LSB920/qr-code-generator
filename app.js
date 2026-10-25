"use strict";

const form = document.querySelector("#qr-form");
const input = document.querySelector("#url");
const error = document.querySelector("#error");
const canvas = document.querySelector("#qr-canvas");
const empty = document.querySelector("#empty");
const status = document.querySelector("#status");
const encodedUrl = document.querySelector("#encoded-url");
const pngButton = document.querySelector("#download-png");
const svgButton = document.querySelector("#download-svg");
let svg = "";
let filename = "qr-code";

function showError(message) {
  error.textContent = message;
  error.hidden = false;
}

function clearResult() {
  canvas.hidden = true;
  empty.hidden = false;
  encodedUrl.hidden = true;
  encodedUrl.textContent = "";
  pngButton.disabled = true;
  svgButton.disabled = true;
  svg = "";
  status.textContent = "Add a link to create your code.";
}

input.addEventListener("input", () => {
  clearResult();
  error.hidden = true;
  input.removeAttribute("aria-invalid");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearResult();
  error.hidden = true;
  input.removeAttribute("aria-invalid");

  let url;
  try {
    url = new URL(input.value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Unsupported protocol");
    }
  } catch {
    input.setAttribute("aria-invalid", "true");
    showError("Enter a full website URL starting with https:// or http://.");
    input.focus();
    return;
  }

  try {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
    const code = qrcode(0, "M");
    code.addData(url.href);
    code.make();

    // Four modules of white space on every side keep the code scannable.
    const quietZone = 4;
    const modules = code.getModuleCount();
    const size = modules + quietZone * 2;
    const scale = Math.max(4, Math.floor(1024 / size));
    canvas.width = canvas.height = size * scale;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas is unavailable in this browser.");
    }
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000000";
    let path = "";
    for (let row = 0; row < modules; row += 1) {
      for (let column = 0; column < modules; column += 1) {
        if (code.isDark(row, column)) {
          const x = column + quietZone;
          const y = row + quietZone;
          context.fillRect(x * scale, y * scale, scale, scale);
          path += `M${x} ${y}h1v1h-1z`;
        }
      }
    }
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size * scale}" height="${size * scale}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#000"/></svg>`;
    filename = `qr-${url.hostname.replace(/[^a-z0-9.-]/gi, "-")}`;
    encodedUrl.textContent = url.href;
    encodedUrl.hidden = false;
    canvas.hidden = false;
    empty.hidden = true;
    pngButton.disabled = false;
    svgButton.disabled = false;
    status.textContent = "Ready! Scan with your camera or download below.";
  } catch (cause) {
    clearResult();
    console.error("QR generation failed:", cause);
    const tooLong = String(cause).includes("code length overflow");
    showError(tooLong
      ? "This URL is too long for a QR code. Try a shorter link."
      : "The QR code could not be created. Please try again or use a different browser.");
  }
});

function download(blob, extension) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `${filename}.${extension}`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

pngButton.addEventListener("click", () => {
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${filename}.png`;
    document.body.append(link);
    link.click();
    link.remove();
  } catch (cause) {
    console.error("PNG download failed:", cause);
    showError("The PNG could not be downloaded. Try downloading the SVG instead.");
  }
});

svgButton.addEventListener("click", () => {
  try {
    download(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), "svg");
  } catch (cause) {
    console.error("SVG download failed:", cause);
    showError("The SVG could not be downloaded. Try downloading the PNG instead.");
  }
});

if (typeof qrcode !== "function") {
  document.querySelector("#generate").disabled = true;
  showError("The QR library could not load. Reload the page and make sure vendor/qrcode.js is present.");
}
