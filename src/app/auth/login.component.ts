import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'] 
})

export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    devName: string = environment.devName;
    isProduction: boolean = environment.production;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private loginService: LoginService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    getRule(){
        // console.log(localStorage.getItem('2'));
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.loginService.login(this.f.username.value, this.f.password.value).pipe(first()).subscribe(data => {
                    this.router.navigate([this.returnUrl]);
                }, error => {
                    this.notifCredential('The Username or Password is incorrect!')
                    this.loading = false;
                });
    }

    notifCredential(message: string){
        Swal.fire({
            title: 'Login Failed',
            text: message,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }
}