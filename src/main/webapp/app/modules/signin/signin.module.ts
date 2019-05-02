import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoginService } from 'app/modules/signin/services/login.service';

@NgModule({
    declarations: [LoginComponent, RegisterComponent],
    imports: [CommonModule, SigninRoutingModule, FormsModule, ReactiveFormsModule, SimpleNotificationsModule],
    providers: [LoginService]
})
export class SigninModule {}
