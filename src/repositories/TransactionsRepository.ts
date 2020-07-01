import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findIncomeTransactions = await this.find({
      where: { type: 'income' },
    });

    const income = findIncomeTransactions.reduce(
      (total, transaction) => total + transaction.value,
      0,
    );

    const findOutcomeTransactions = await this.find({
      where: { type: 'outcome' },
    });

    const outcome = findOutcomeTransactions.reduce(
      (total, transaction) => total + transaction.value,
      0,
    );

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
