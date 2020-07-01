import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // Have access to the categories table
    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // Check if type is outcome, if it is only create new transaction if the total of the balance is bigger than the value of the transaction to be created
    if (type === 'outcome') {
      const totalOfAccount = await transactionsRepository.getBalance();

      if (totalOfAccount.total < value) {
        throw new AppError('Cannot complete transaction of type outcome');
      }
    }

    const category_id = await categoriesRepository.checkExistentCategory(
      category,
    );

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
