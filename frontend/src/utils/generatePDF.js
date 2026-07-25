import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFReport = (title, headers, rows, filename, metadata) => {
  const doc = new jsPDF('landscape');

  let currentY = 22;
  
  const addHeaderAndTable = () => {
    doc.setFontSize(10);
    doc.setTextColor(100);
    
    if (metadata) {
      if (metadata.vetName) {
        doc.text(`Downloaded by: ${metadata.vetName} (${metadata.vetPhone || ''})`, 14, currentY);
        currentY += 6;
      }
      const timeStr = metadata.timeDownloaded || new Date().toLocaleString();
      doc.text(`Time Downloaded: ${timeStr}`, 14, currentY);
      currentY += 6;
      doc.text(`Copyright Government of Rwanda`, 14, currentY);
      currentY += 8;
    } else {
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, currentY);
      currentY += 8;
    }

    // Table
    autoTable(doc, {
      startY: currentY,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' }, // reduced font size for better fit
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (metadata?.logoUrl) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        doc.addImage(img, 'PNG', 14, 10, 20, 20);
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text(title, 40, 22);
        currentY = 36;
      } catch (e) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text(title, 14, currentY);
        currentY += 10;
      }
      addHeaderAndTable();
    };
    img.onerror = () => {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text(title, 14, currentY);
      currentY += 10;
      addHeaderAndTable();
    };
    img.src = metadata.logoUrl;
  } else {
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(title, 14, currentY);
    currentY += 10;
    addHeaderAndTable();
  }
};
