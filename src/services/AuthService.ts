import { IUser } from '../interfaces';
import ServiceClass from './ServiceClass';

interface Login {
  email: string;
  password: string;
}

interface Register {
  email: string;
  password: string;
  phoneNumber: string;
  name: string
}

interface TokenPayloadResponse {
  payload: IUser;
  token: string;
}
class AuthService extends ServiceClass {
  
  private path = 'auth';

  async login(body: Login) {
    return super.post<TokenPayloadResponse>({
      path: `${this.path}/login`,
      body,
    });
  }

  async register(body: Register) {
    return super.post<TokenPayloadResponse>({
      path: `${this.path}/register`,
      body,
    });
  }

  async validateToken() {
    return super.get<TokenPayloadResponse>({
      path: `${this.path}/validate-token`,
      hasToken: true
    })
  }
  
}

export default new AuthService();
