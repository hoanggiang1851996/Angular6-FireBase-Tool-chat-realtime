import { Injectable } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';

@Injectable()
export class LoginService {
    constructor(private apiService: ApiService) {}

    requestLogin(account) {
        return this.apiService.post('/login', account);
    }
}
