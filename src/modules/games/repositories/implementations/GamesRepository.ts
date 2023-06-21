import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder()
      .select("games")
      .from(Game, "games")
      .where("LOWER(games.title) like LOWER(:title)", { title: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) AS count FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const { users } = await this.repository
      .createQueryBuilder("game")
      .innerJoinAndSelect("game.users", "users")
      .where("game.id = :id", { id })
      .getOneOrFail();

    return users;
  }
}
