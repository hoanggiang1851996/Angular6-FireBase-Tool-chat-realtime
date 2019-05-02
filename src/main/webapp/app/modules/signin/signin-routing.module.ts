import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'app/modules/signin/components/login/login.component';
import { RegisterComponent } from 'app/modules/signin/components/register/register.component';
import { CanDeactivateGuard } from 'app/core/guard/can-deactivate-guard';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', canActivate: [CanDeactivateGuard], component: LoginComponent },
    { path: 'register', canActivate: [CanDeactivateGuard], component: RegisterComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SigninRoutingModule {}
