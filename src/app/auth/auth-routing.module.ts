import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './auth-layout.component';
import { LoginComponent } from './login.component';

const routes: Routes = [
    {
        path: 'auth', component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }