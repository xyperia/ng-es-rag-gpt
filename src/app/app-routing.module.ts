import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/helpers';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';

const accountModule = () => import('./auth/auth.module').then(x => x.AuthModule);
const usersModule = () => import('./modules/user/user-management.module').then(x => x.UserManagementModule);
const ruleManagementModule = () => import('./modules/rule-management/rule-management.module').then(x => x.RuleManagementModule);

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'myprofile/:username', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: '', loadChildren: accountModule },
    {
        path: '',
        loadChildren: usersModule,
        canActivate: [AuthGuard],
        data: {
            roles: 'USER_MGMT'
        }
    },
    {
        path: '',
        loadChildren: ruleManagementModule,
        canActivate: [AuthGuard],
        data: {
            roles: 'USER_MGMT'
        }
    },
    { path: '', loadChildren: accountModule },
    { path: '', loadChildren: usersModule, canActivate: [AuthGuard]},
    { path: '', loadChildren: ruleManagementModule, canActivate: [AuthGuard]},
    { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }