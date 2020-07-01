import path from 'path';
// import fs from 'fs';
import csvRead from '../config/csv-parse';

class ImportTransactionsService {
  async execute(transactionFile: string): Promise<Array<[]>> {
    const csvFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      `${transactionFile}`,
    );

    const importedTransactions = await csvRead(csvFilePath);

    return importedTransactions;
  }
}

export default ImportTransactionsService;
