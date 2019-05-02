import { Injectable } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    register(newUser) {
        return this.apiService.post('/register', newUser);
    }

    constructor(private apiService: ApiService) {}
}
