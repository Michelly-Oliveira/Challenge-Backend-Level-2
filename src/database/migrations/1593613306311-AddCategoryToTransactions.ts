import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddCategoryToTransactions1593613306311
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete the column we want to change
    await queryRunner.dropColumn('transactions', 'category');

    // Create a column with the changes
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        // Allow the id to be null so that if the user(provider) is deleted the history of appointments from other users(clients) continues to exist, the clients won't lose that part of their log history
        isNullable: true,
      }),
    );

    // Create a reference on the table appointments of the provider id on the users table
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');

    await queryRunner.dropColumn('transactions', 'category_id');

    // Recreate the column without those changes
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category',
        type: 'varchar',
      }),
    );
  }
}
