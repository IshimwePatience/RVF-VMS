import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = (title, headers, rows, filename) => {
  const doc = new jsPDF('landscape');

  // Title
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text(title, 14, 22);

  // Date Generated
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // Table
  doc.autoTable({
    startY: 36,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 4 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
