import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'app/modules/dashboard/components/dashboard/dashboard.component';
import { HomeComponent } from 'app/modules/dashboard/components/home/home.component';
import { ChatDetailComponent } from 'app/modules/dashboard/components/chat-detail/chat-detail.component';
import { AuthGuard } from 'app/core/guard/auth.guard';

const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                outlet: 'chatDetail'
            },
            {
                path: ':id',
                component: ChatDetailComponent,
                outlet: 'chatDetail'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
