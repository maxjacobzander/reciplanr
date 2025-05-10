import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import download from "downloadjs";

export async function DownloadList(shoppingList) {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();

  // Embed the font
  const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

  const fontSize = 16;
  const lineHeight = fontSize + 10;
  const margin = 50;

  // Add a blank page to the document
  let page = pdfDoc.addPage();
  let { height } = page.getSize();
  let y = height - margin;

  const addTitle = (currentPage) => {
    currentPage.drawText("Your Shopping List", {
      x: margin,
      y,
      size: fontSize + 4,
      font: courierFont,
      color: rgb(0, 0.53, 0.71),
    });
    y -= lineHeight * 2;
  };

  addTitle(page);

  for (const item of shoppingList) {
    // Add a new page if there's not enough space left
    if (y < margin) {
      page = pdfDoc.addPage();
      height = page.getSize().height;
      y = height - margin;
      addTitle(page);
    }

    const line = `[ ] ${item.quantity} ${item.unit} ${item.name}`;
    page.drawText(line, {
      x: margin,
      y,
      size: fontSize,
      font: courierFont,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, "todays_shopping_list.pdf", "application/pdf");
}
