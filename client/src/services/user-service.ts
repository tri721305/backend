import { ApiService } from './api-service';

const SERVER_URL = 'http://localhost:3000/api';

export class UserService extends ApiService {
  login(requestBody: { email: string; password: string }) {
    return this.perform('POST', `${SERVER_URL}/user/login`, requestBody, null, null);
  }

  logout() {
    localStorage.removeItem('user');
    return this.perform('POST', `${SERVER_URL}/user/logout`, null, null, null);
  }

  register(requestBody: { username: string; email: string; password: string }) {
    return this.perform('POST', `${SERVER_URL}/user/register`, requestBody, null, null);
  }
}
