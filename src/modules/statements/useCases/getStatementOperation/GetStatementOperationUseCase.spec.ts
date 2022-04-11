import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepository: InMemoryUsersRepository;
describe("GetStatementOperationUseCase ", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Recebe um registro de segurança", async () => {
    const user = await usersRepository.create({
      name: "admin",
      email: "samuecpr",
      password: "123",
    });
    const balanço = await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "saque",
    });
    const result = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: balanço.id!,
    });
    expect(result).toHaveProperty("id");
  });
  it("Não deve ser possivel trazer o extratos do usuario que não existe", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "id",
        statement_id: "id",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("Não deve ser possivel trazer o extratos do usuario que não existe", async () => {
    const user = await usersRepository.create({
      name: "admin",
      email: "samuecpr",
      password: "123",
    });
    const balanço = await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: -1000,
      description: "saque",
    });
    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "id",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
