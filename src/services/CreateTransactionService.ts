import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

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
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // Check if type is outcome, if it is only create new transaction if the total of the balance is bigger than the value of the transaction to be created
    if (type === 'outcome') {
      const totalOfAccount = await transactionsRepository.getBalance();

      if (totalOfAccount.total < value) {
        throw new AppError('Cannot complete transaction of type outcome');
      }
    }

    // Find category on database by name
    const findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    let category_id = findCategory?.id;

    // If that category doesn't exist, create it
    if (!findCategory) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      category_id = newCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    // const formattedTransaction = {
    //   id: transaction.id,
    //   title: transaction.title,
    //   value: transaction.value,
    //   type: transaction.type,
    //   category,
    // };

    return transaction;
  }
}

export default CreateTransactionService;
