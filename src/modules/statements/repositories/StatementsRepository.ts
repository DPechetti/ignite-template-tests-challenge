import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    sender_id,
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      sender_id,
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: [
        {
          id: statement_id,
          user_id
        },
        {
          id: statement_id,
          sender_id: user_id
        }
      ]
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<{ balance: number } | { balance: number, statement: Statement[] }> {
    const statement = await this.repository.find({
      where: [{ user_id }, { sender_id: user_id }],
      relations: ['sender']
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.type === user_id)
        return acc + operation.amount

      return acc - operation.amount
    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }
}
