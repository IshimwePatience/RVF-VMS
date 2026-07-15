import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

export const exportToExcelWithValidation = async (data, filename, validationRules = {}) => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Get columns from the first object
  const columns = Object.keys(data[0]).map(key => ({
    header: key,
    key: key,
    width: 20
  }));
  worksheet.columns = columns;

  // Add data rows
  data.forEach(row => {
    worksheet.addRow(row);
  });

  // Apply validation
  Object.keys(validationRules).forEach(columnName => {
    const colIndex = columns.findIndex(c => c.header === columnName);
    if (colIndex !== -1) {
      const colLetter = worksheet.getColumn(colIndex + 1).letter;
      const rule = validationRules[columnName];
      
      // Apply validation to rows 2 to 50000
      for (let row = 2; row <= 50000; row++) {
        worksheet.getCell(`${colLetter}${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${rule.join(',')}"`],
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'Invalid Selection',
          error: 'Please select a value from the dropdown list.'
        };
      }
    }
  });

  // Style headers
  worksheet.getRow(1).font = { bold: true };

  // Write to buffer and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
