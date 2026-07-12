import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Create a new workbook and add the worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Download the file
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
