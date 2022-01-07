import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement, OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferenceOperationDTO } from "./ITransferOperationDTO";

@injectable()
export class TransferOperationUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, sender_id, description, amount }: ITransferenceOperationDTO): Promise<Statement> {
    const sender = await this.usersRepository.findById(sender_id)

    if (!sender) {
      throw new AppError("User not found")
    }

    const receiver = await this.usersRepository.findById(user_id)

    if (!receiver) {
      throw new AppError("Receiver not found")
    }

    let { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id })

    if (balance < amount) {
      throw new AppError("Insufficient Funds For Transference")
    }

    const transfer = await this.statementsRepository.create({
      sender_id,
      user_id,
      amount,
      description,
      type: OperationType.TRANSFER
    })

    return transfer;
  }
}
