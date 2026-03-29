import AclModel from "../../core/security/AclModel";
import ApiService from "../../core/network/ApiService";

export class LoginService {


   static async handleLogin(
    username: string,
    password: string,
  ): Promise<AclModel>{
    try {
      const response = await ApiService.login({ username, password });

      if (password.length == 0) {
        return new AclModel(false, "Password is required");
      }

      if (!response.ok) {
        const error = await response.json();
        return new AclModel(false, error.detail ?? "Login failed");
      }

      const data = await response.json();
      return new AclModel(true, data.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new AclModel(false, err.message);
      } else {
        return new AclModel(false, "An unknown error occurred");
      }
    }
  };
}
