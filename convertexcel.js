const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to convert Excel to JSON
function convertExcelToJson(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile("C:/Users/vidiy/Downloads/copiedresults.xlsx");

    // Get the first sheet (or specify the sheet name if you know it)
    const sheetName = workbook.SheetNames[0]; // Change if needed
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Save the JSON data to a file
    const outputDir = path.join(__dirname, 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir); // Create 'data' directory if it doesn't exist
    }

    const outputPath = path.join(outputDir, 'results.json');
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));

    console.log('Excel successfully converted to JSON');
    return jsonData;
  } catch (error) {
    console.error('Error converting Excel to JSON:', error.message);
    return [];
  }
}

// Export the function
module.exports = convertExcelToJson;

// If run directly, execute the conversion
if (require.main === module) {
  const excelFilePath = path.join(__dirname, 'data', 'realresults.xlsx'); // Path to your Excel file
  convertExcelToJson(excelFilePath);
}
