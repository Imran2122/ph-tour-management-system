import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../module/user/user.interface";
import { User } from "../module/user/user.model";
import bcryptjs from "bcryptjs";

export const seedSupperAdmin = async () => {
  try {
    const isSupperAdminExist = await User.findOne({
      email: envVars.SUPPER_ADMIN_EMAIL,
    });
    if (isSupperAdminExist) {
      console.log("supper admin exist");
      return;
    }

    console.log("Try To Create a  supper admin ");
    const hasPassword = await bcryptjs.hash(
      envVars.SUPPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    const authProvider: IAuthProvider = {
      provider: "credential",
      providerId: envVars.SUPPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Supper Admin",
      email: envVars.SUPPER_ADMIN_EMAIL,
      password: hasPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    const supperAdmin = User.create(payload);
    console.log("supperAdmin created successfully!!!\n");
    console.log(supperAdmin);
  } catch (error) {
    //
    console.log(error)
  }
};
