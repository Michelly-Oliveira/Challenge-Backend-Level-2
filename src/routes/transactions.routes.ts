import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import multer from 'multer';

import Category from '../models/Category';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getRepository(Category);

  const allTransactions = await transactionsRepository.find();

  const transactions = [];

  for (let index = 0; index < allTransactions.length; index++) {
    const category = await categoriesRepository.findOne(
      allTransactions[index].category_id,
    );

    const transaction = {
      id: allTransactions[index].id,
      title: allTransactions[index].title,
      value: allTransactions[index].value,
      type: allTransactions[index].type,
      category,
    };

    transactions.push(transaction);
  }

  const balance = await transactionsRepository.getBalance();

  const account = {
    transactions,
    balance,
  };

  return response.json(account);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('transaction'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();
    const createTransaction = new CreateTransactionService();
    const transactionFile = request.file.filename;

    const transactionsList = await importTransactions.execute(transactionFile);

    const transactions = [];

    for (let index = 0; index < transactionsList.length; index++) {
      const [title, type, value, category] = transactionsList[index]
        .join()
        .split(',');

      const createImportedTransaction = await createTransaction.execute({
        title,
        value: Number(value),
        type: type === 'income' ? 'income' : 'outcome',
        category,
      });

      transactions.push(createImportedTransaction);
    }

    response.json({ transactions });
  },
);

export default transactionsRouter;
