import Container, { Service } from "typedi";
import { userModel, IUser } from "../../models/user.model";
import { BaseRepository } from "../base.repository";
import { IUserRepository } from "../interface/user/user.IRepository";
import { GetUsersResult } from "../../dto/user/auth.dtos";
@Service()
export class UserRepository extends BaseRepository<IUser>implements IUserRepository{
  constructor() {
    super(userModel);
  }


  async findUserByEmail(email: string): Promise<IUser | null | never> {
    try {
      console.log('findUserByEmail+++++++',email)
      return await userModel.findOne({ email });
    } catch (error) {
      console.log('findUserByEmail catch error')
      return Promise.reject(new Error(`Error finding user by email: ${error}`));
    }
  }
  async findAllUsers(page:number,limit:number,userId:string):Promise<GetUsersResult> {
    console.log('findallusers')
     const skip = (page - 1) * limit;
       const users = await userModel.find({_id:{$ne:userId}}).select("-password").skip(skip).limit(limit);
     const totalUsers = await userModel.countDocuments();

  // return await userModel.find().select("-password");
  return {
    users,
    totalUsers
  }
}

async AllUsersfind(email: string): Promise<IUser[]> {
  return await userModel.find({ _id: { $ne: email } }).select("-password");
}

} 


export const userRepository = Container.get(UserRepository);
