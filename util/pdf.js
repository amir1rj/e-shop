const PDFDocument = require("pdfkit");

module.exports.generatePDF = function generatePDF(orderItemsArray, res) {
  const doc = new PDFDocument();

  // Set margins and font for a cleaner layout
  const margin = 40;
  doc.fontSize(12);

  // Header with title and date
  const title = "Order Details";
  const date = new Date().toLocaleDateString();
  doc.text(title, { align: "center" }).moveDown(0.5);
  doc.text(`Date: ${date}`, { align: "right" });

  // Table header
  const columnTitles = ["Title", "Price"];
  const columnWidth = 200;
  const yStart = doc.y + 15;
  const xStart = margin;

  // Draw table header
  doc.rect(xStart, yStart, columnWidth, 20).fillAndStroke("#f2f2f2", "#000");
  doc.rect(xStart + columnWidth, yStart, columnWidth / 2, 20).fillAndStroke("#f2f2f2", "#000");
  doc.fillColor("#000").text(columnTitles[0], xStart + 5, yStart + 5);
  doc.text(columnTitles[1], xStart + columnWidth + 5, yStart + 5);

  let totalPrice = 0;
  orderItemsArray.forEach((item, index) => {
    const yPosition = yStart + 20 + index * 15;

    // Format item details with proper alignment
    const formattedTitle = item.Product.title;
    const formattedPrice = `$${parseInt(item.Product.price).toFixed(2)}`;
    doc.text(formattedTitle, xStart + 5, yPosition);
    doc.text(formattedPrice, xStart + columnWidth + 5, yPosition);

    totalPrice += parseFloat(item.Product.price);
  });

  // Draw total price
  const yTotalPrice = doc.y + 20;
  doc.rect(xStart, yTotalPrice, columnWidth, 20).fillAndStroke("#f2f2f2", "#000");
  doc.fillColor("#000").text("Total Price:", xStart + 5, yTotalPrice + 5);
  doc.text(`$${totalPrice.toFixed(2)}`, xStart + columnWidth + 5, yTotalPrice + 5);

  doc.pipe(res); // Stream the PDF to the response
  doc.end();
};