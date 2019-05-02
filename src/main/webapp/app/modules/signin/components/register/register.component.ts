import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'app/modules/signin/services/register.service';
import { NotificationsService } from 'angular2-notifications';
import { ConfirmPasswordValidator } from 'app/shared/validator/confirm-password.validator';
import { AuthService } from 'app/core/services/auth.service';

@Component({
    selector: 'jhi-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
    registerForm = this.fb.group(
        {
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirm_password: new FormControl('', [Validators.required]),
            language: new FormControl('', [Validators.required])
        },
        {
            validator: ConfirmPasswordValidator.MatchPassword
        }
    );

    constructor(
        private fb: FormBuilder,
        private registerService: RegisterService,
        private router: Router,
        private notificationsService: NotificationsService,
        private authService: AuthService
    ) {}

    tryRegister(value) {
        const registerData: any = new Object();
        registerData.email = value.email;
        registerData.password = value.password;
        this.authService.doRegister(registerData);
    }

    ngOnInit() {}
}
