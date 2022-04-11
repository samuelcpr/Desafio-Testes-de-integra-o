import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "../getBalance/GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUserCase: GetBalanceUseCase;
let usersRepository: InMemoryUsersRepository;
describe("GetBalanceUserCase ", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUserCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      usersRepository
    );
  });

  it("dever se possivel extratos do usuario", async () => {
    const user = await usersRepository.create({
      name: "admin",
      email: "samuecpr",
      password: "123",
    });
    await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "saque",
    });
    const extratos = await getBalanceUserCase.execute({ user_id: user.id! });
    expect(extratos.balance).toBe(1000);
  });

  it("Não deve ser possivel trazer o extratos do usuario que não existe", async () => {
    await expect(
      getBalanceUserCase.execute({ user_id: "id" })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
