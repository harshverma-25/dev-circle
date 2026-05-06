import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export const generatePDF = async (elementId, fileName = "resume.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    // ── Capture element using html-to-image ──
    // html-to-image is more compatible with modern CSS (Tailwind v4 / oklch)
    // than html2canvas as it uses a different rendering approach.
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 3, // Higher quality
      backgroundColor: "#ffffff",
      style: {
        // Ensure the element is fully expanded and visible
        transform: "scale(1)",
        transformOrigin: "top left",
      }
    });
    
    // ── Create PDF ──
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add the image to the PDF
    // We use "FAST" for performance, but the quality is high due to pixelRatio: 3
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Fallback or alert user
    return false;
  }
};
