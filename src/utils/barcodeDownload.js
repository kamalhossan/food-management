/**
 * Helper utilities for exporting and printing barcodes
 */

export const downloadBarcodePNG = (svgSelector, filename = "barcode") => {
  try {
    const svgElement = document.querySelector(svgSelector);
    if (!svgElement) {
      console.error("Barcode SVG element not found");
      return false;
    }

    const svgXml = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const scale = 3; // High resolution for clear scanning
      const rect = svgElement.getBoundingClientRect();
      const width = rect.width > 0 ? rect.width : 340;
      const height = rect.height > 0 ? rect.height : 120;

      const padding = 24 * scale;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale + padding * 2);
      canvas.height = Math.round(height * scale + padding * 2);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Crisp background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw SVG onto canvas
      ctx.drawImage(img, padding, padding, width * scale, height * scale);
      URL.revokeObjectURL(url);

      // Trigger automatic file download
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, "_");
      a.download = `${safeFilename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    img.onerror = (e) => {
      console.error("Failed to load SVG into image for PNG export", e);
      URL.revokeObjectURL(url);
    };

    img.src = url;
    return true;
  } catch (error) {
    console.error("Error exporting barcode PNG:", error);
    return false;
  }
};

export const downloadBarcodeSVG = (svgSelector, filename = "barcode") => {
  try {
    const svgElement = document.querySelector(svgSelector);
    if (!svgElement) return false;

    const svgXml = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, "_");
    a.download = `${safeFilename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error exporting barcode SVG:", error);
    return false;
  }
};

export const printBarcode = (worker, svgSelector = "#barcode-container svg") => {
  try {
    const svgElement = document.querySelector(svgSelector);
    if (!svgElement) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const svgHtml = svgElement.outerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode - ${worker.name || "Worker"}</title>
          <style>
            @page {
              size: auto;
              margin: 10mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 90vh;
              margin: 0;
              background: #fff;
              color: #0f172a;
            }
            .card {
              border: 2px solid #0284c7;
              border-radius: 14px;
              padding: 24px 28px;
              text-align: center;
              max-width: 360px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .title {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #0284c7;
              font-weight: 700;
              margin-bottom: 8px;
            }
            h2 {
              margin: 0 0 4px 0;
              font-size: 22px;
              color: #0f172a;
            }
            .company {
              font-size: 14px;
              color: #475569;
              margin: 0 0 8px 0;
            }
            .badge {
              display: inline-block;
              background: #e0f2fe;
              color: #0369a1;
              padding: 4px 12px;
              border-radius: 9999px;
              font-weight: 700;
              font-size: 13px;
              margin-bottom: 16px;
            }
            .barcode-wrap {
              margin: 12px 0;
            }
            .barcode-wrap svg {
              max-width: 100%;
              height: auto;
            }
            .code-text {
              font-family: monospace;
              font-size: 11px;
              color: #64748b;
              word-break: break-all;
              margin-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">Worker Food Identification</div>
            <h2>${worker.name || "Worker"}</h2>
            <div class="company">${worker.company || "General"}</div>
            <span class="badge">Serial: ${worker.serial_no || "N/A"}</span>
            <div class="barcode-wrap">${svgHtml}</div>
            <div class="code-text">${worker.barcode || ""}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch (err) {
    console.error("Print error:", err);
    window.print();
  }
};
