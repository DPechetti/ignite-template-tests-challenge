import { User } from "../../../../../src/modules/users/entities/User";
import { InMemoryUsersRepository } from "../../../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../../src/modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileError } from "../../../../../src/modules/users/useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../../../../../src/modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Modules :: Users :: Use Cases :: Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able show an user profile", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "Donovan",
      email: "dovi_pf@hotmail.com",
      password: "batatinha",
    });

    const userProfile = await showUserProfileUseCase.execute(userCreated.id as string);

    expect(userProfile).toBeInstanceOf(User);
    expect(userProfile).toHaveProperty("id");

    expect(userProfile.name).toBe(userCreated.name);
    expect(userProfile.email).toBe(userCreated.email);
  });

  it("should return user not found when id is invalid", async () => {
    try {
      await showUserProfileUseCase.execute("invalid id");
    } catch(error: any) {
      expect(error).toBeInstanceOf(ShowUserProfileError);
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    }
  });
});
