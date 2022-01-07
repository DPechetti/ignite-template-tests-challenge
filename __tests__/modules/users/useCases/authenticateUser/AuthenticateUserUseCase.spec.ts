import { InMemoryUsersRepository } from "../../../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../../../src/modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../../../src/modules/users/useCases/createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../../../../src/modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { ShowUserProfileUseCase } from "../../../../../src/modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Modules :: Users :: Use Cases :: Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate user", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "Donovan",
      email: "dovi_pf@hotmail.com",
      password: "batatinha",
    });

    const authorization = await authenticateUserUseCase.execute({
      email: userCreated.email,
      password: "batatinha"
    })

    expect(authorization).toHaveProperty("token")
    expect(authorization).toHaveProperty("user")

    expect(authorization.user).toHaveProperty("id")
    expect(authorization.user.id).toBe(userCreated.id)
    expect(authorization.user).toHaveProperty("name")
    expect(authorization.user.name).toBe(userCreated.name)
    expect(authorization.user).toHaveProperty("email")
    expect(authorization.user.email).toBe(userCreated.email)
  });

  it("should return incorrect email or password when email is not found", async () => {
    try {
      await authenticateUserUseCase.execute({
        email: 'any_email',
        password: 'batatinha'
      });
    } catch(error: any) {
      expect(error).toBeInstanceOf(IncorrectEmailOrPasswordError);
      expect(error.message).toBe('Incorrect email or password');
      expect(error.statusCode).toBe(401);
    }
  });

  it("should return incorrect email or password when password not match", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "Donovan",
      email: "dovi_pf@hotmail.com",
      password: "batatinha",
    });

    try {
      await authenticateUserUseCase.execute({
        email: userCreated.email,
        password: 'batatinha frita'
      })
    } catch(error: any) {
      expect(error).toBeInstanceOf(IncorrectEmailOrPasswordError);
      expect(error.message).toBe('Incorrect email or password');
      expect(error.statusCode).toBe(401);
    }
  });
});
