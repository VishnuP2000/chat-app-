import Container, { Service } from "typedi";
import { userModel, IUser } from "../../models/user.model";
import { BaseRepository } from "../base.repository";
import { IUserRepository } from "../interface/user/user.IRepository";
@Service()
export class UserRepository extends BaseRepository<IUser>implements IUserRepository
{
  constructor() {
    super(userModel);
  }

  async findUserByEmail(email: string): Promise<IUser | null | never> {
    try {
      return await userModel.findOne({ email });
    } catch (error) {
      return Promise.reject(new Error(`Error finding user by email: ${error}`));
    }
  }
}

export const userRepository = Container.get(UserRepository);
