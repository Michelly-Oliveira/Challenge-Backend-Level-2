import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransactions1593463199070
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Transactions table
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            // Id is generated automatically using uuid
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'int',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'category',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
