import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileController } from "./ShowUserProfileController";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";





let usersRepository: InMemoryUsersRepository

let showUserProfileUseCase: ShowUserProfileUseCase;

describe(" showUserProfileUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);

  });

  it("Deve ser possivel Buscar dados do usuario", async () => {

    const user = await usersRepository.create({ name: "admin", email: "samuecpr", password: "123" })
    const userShowprof = await showUserProfileUseCase.execute(user.id!)

    expect(userShowprof).toHaveProperty("id");


  });
  it("Não deve ser buscar os dados de um usuario que não existas", async () => {



    await expect(showUserProfileUseCase.execute("1")).rejects.toBeInstanceOf(ShowUserProfileError)



  });



});
