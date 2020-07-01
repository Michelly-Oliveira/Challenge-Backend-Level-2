// Read csv files
import csvParse from 'csv-parse';
// Deal with physical files
import fs from 'fs';

// Create an async function so we can use await
async function loadCSV(filePath: string): Promise<Array<[]>> {
  // Create stream using fs - read files by pieces
  const readCSVStream = fs.createReadStream(filePath);

  // Another reading stream
  const parseStream = csvParse({
    // Start reading from line 2
    from_line: 2,
    // Remove spaces from left/right
    ltrim: true,
    rtrim: true,
  });

  // pipe = present in every stream - transfers data from one stream to another. Pass data from readCSVStream to parseStream
  const parseCSV = readCSVStream.pipe(parseStream);

  // csv-parse always returns a complete line
  // Each line is returned as an array, and each position on the array is a column on the csv file
  // Stores the result
  const lines: Array<[]> = [];

  // Save communication between the streams
  // 'Listening' to new data obtained from CSV file, line by line and adding it to the array
  parseCSV.on('data', line => {
    lines.push(line);
  });

  // Create a promise and when the communication of streams is over, receive the event end and mark the promise as resolved
  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

export default loadCSV;
