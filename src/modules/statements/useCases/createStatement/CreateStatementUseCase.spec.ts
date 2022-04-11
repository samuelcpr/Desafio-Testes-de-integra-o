import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: InMemoryUsersRepository;
describe("createStatementUseCase ", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      inMemoryStatementsRepository
    );
  });

  it("deve ser possivel criar novo balanço", async () => {
    const user = await usersRepository.create({
      name: "admin",
      email: "samuecpr",
      password: "123",
    });
    const balanço = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "saque",
    });
    expect(balanço).toHaveProperty("id");
  });
  it("Não deve ser possivel fazer um deposito para um usuario que não existe", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "1",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "saque",
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
