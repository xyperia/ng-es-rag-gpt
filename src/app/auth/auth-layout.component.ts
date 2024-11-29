import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({ templateUrl: 'auth-layout.component.html' })
export class AuthLayoutComponent {
    constructor(
        private router: Router,
        private loginService: LoginService
    ) {
        // redirect to home if already logged in
        if (this.loginService.userValue) {
            this.router.navigate(['/']);
        }
    }
}