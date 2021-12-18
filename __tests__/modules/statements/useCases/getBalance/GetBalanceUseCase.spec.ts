import { InMemoryStatementsRepository } from "../../../../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "../../../../../src/modules/statements/useCases/getBalance/GetBalanceError";
import { CreateUserUseCase } from "../../../../../src/modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "../../../../../src/modules/statements/useCases/getBalance/GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Modules :: Statements :: Use Cases :: Get Balance", () => {
 beforeEach(() => {
  inMemoryUsersRepository = new InMemoryUsersRepository();
  inMemoryStatementsRepository = new InMemoryStatementsRepository();
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
 });

 it("Should be able to get the balance", async () => {
  const userCreated = await createUserUseCase.execute({
    name: "Donovan",
    email: "dovi_pf@hotmail.com",
    password: "batatinha",
  });

  const balanceFound = await getBalanceUseCase.execute({ user_id: userCreated.id! })

  expect(balanceFound).toHaveProperty("statement")
  expect(balanceFound).toHaveProperty("balance")

  expect(balanceFound.balance).toBe(0)
 })

 it("should return user not found when id is invalid", async () => {
   try {
     await await getBalanceUseCase.execute({ user_id: 'invalid id' })
   } catch(error: any) {
     expect(error).toBeInstanceOf(GetBalanceError);
     expect(error.message).toBe('User not found');
     expect(error.statusCode).toBe(404);
   }
 });
})
