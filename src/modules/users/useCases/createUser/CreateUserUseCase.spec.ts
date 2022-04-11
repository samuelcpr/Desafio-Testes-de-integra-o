import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";
import { CreateUserError } from "./CreateUserError";

let usersRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;

describe("createUserSever ", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Deve ser possivel criar um usuario", async () => {
    const user = await createUserUseCase.execute({
      name: "admin",
      email: "samuecpr",
      password: "123",
    });

    expect(user).toHaveProperty("id");
  });
  it("deve Deve ser possivel criar um usuario com mesmo email", async () => {
    await createUserUseCase.execute({
      name: "admin",
      email: "samuecpr",
      password: "123",
    });

    await expect(
      createUserUseCase.execute({
        name: "admin",
        email: "samuecpr",
        password: "123",
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
