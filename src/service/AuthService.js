import { api } from "./api";

class AuthService {
  async login(data) {
    return await api.post("/oauth/token", data);
  }
  async getUserInformationByMail(data) {
    return await api.post("/user/user-information", data);
  }
}

export default new AuthService();
