import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './auth-layout.component';
import { LoginComponent } from '../auth/login.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthRoutingModule
    ],
    declarations: [
        AuthLayoutComponent,
        LoginComponent
    ]
})
export class AuthModule { }