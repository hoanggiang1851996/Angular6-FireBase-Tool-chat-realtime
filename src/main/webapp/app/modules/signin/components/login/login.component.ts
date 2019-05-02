import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'app/modules/signin/services/login.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'app/core/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
    selector: 'jhi-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
    userForm = this.fb.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    isRemember;
    currentAccount: any;
    public options = {
        position: ['top', 'right'],
        timeOut: 3000,
        lastOnBottom: true
    };

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private router: Router,
        private notificationsService: NotificationsService,
        public authService: AuthService,
        public af: AngularFireAuth
    ) {
        this.af.authState.subscribe(afAuth => {
            if (afAuth) {
                this.router.navigate(['/dashboard']);
            }
        });
    }

    logIn(user) {
        this.authService.login(user);
    }

    saveCurrentAccount() {
        if (this.isRemember === true && this.userForm.value.email !== '' && this.userForm.value.password !== '' && this.userForm.valid) {
            localStorage.setItem('currentAccount', JSON.stringify(this.userForm.value));
        } else {
            localStorage.removeItem('currentAccount');
        }
    }

    showSavedAccount() {
        if (localStorage.getItem('currentAccount') !== null) {
            this.userForm = this.fb.group({
                email: new FormControl(JSON.parse(localStorage.getItem('currentAccount')).email, [Validators.required, Validators.email]),
                password: new FormControl(JSON.parse(localStorage.getItem('currentAccount')).password, [
                    Validators.required,
                    Validators.minLength(6)
                ])
            });
            this.isRemember = true;
        }
    }

    ngOnInit() {
        this.showSavedAccount();
    }
}
