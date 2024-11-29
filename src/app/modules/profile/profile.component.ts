import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserManagementService } from '../user/user-management.service';
import { first } from 'rxjs/operators';
import { RuleModel, UserModel } from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/auth/helpers';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/auth/login.service';
import { LocalService } from 'src/app/auth/helpers/local.service';
import { ApmService } from '@elastic/apm-rum-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  profileView: UserModel;
  user: UserModel;
  rule: RuleModel;
  uname: string;
  editMode: boolean;
  form: FormGroup;
  submitted = false;
  loading = false;
  apiurl=environment.apiUrl+'/image/';
  fieldMobileMode;

  constructor(
      private apmService: ApmService,
      private userService: UserManagementService,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private alertService: AlertService,
      private router: Router,
      private localService: LocalService
    ) {
      
      const apm = apmService.init({
        serviceName: environment.apmServerAppName,
        serverUrl: environment.apmServerUrl,
        environment: environment.apmServerEnv
      })

    this.user = JSON.parse(this.localService.getKey('user'));
    this.rule = JSON.parse(this.localService.getKey('rule'));

    apm.setUserContext({
      'username': this.user.USERNAME,
      'id': this.user.ID,
      'email': this.user.EMAIL
    })
  }

  ngOnInit(): void {
    this.fieldMobileMode = JSON.parse(localStorage.getItem('mobileMode'));

  try {

    this.uname = this.route.snapshot.params['username'];

    const passwordValidators = [Validators.minLength(6)];

    this.form = this.formBuilder.group({
      USERNAME: ['', Validators.required],
      PASSWORD: ['', passwordValidators],
      FIRST_NAME: ['', Validators.required],
      LAST_NAME: ['', Validators.required],
      COMPANY_NAME: ['', Validators.required],
      EMAIL: ['', Validators.required],
      PHONE: ['', Validators.required],
      BIO: ['', Validators.required],
      PICTURE: ['', Validators.required],
      RULE_ID: ['', Validators.required],
    });

    this.subs.add(this.userService.getById(this.user.ID).pipe(first()).subscribe(x => this.form.patchValue(x)));

    this.subs.add(this.userService.getByUsername(this.uname).pipe(first()).subscribe(users => {
      this.profileView = users;
      if(this.profileView[0].ID == this.user.ID){
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    }));
  } catch (error) { }
    
  }

  get f() { return this.form.controls; }

  onSubmit() {
      localStorage.setItem('mobileMode', this.fieldMobileMode);
      this.submitted = true;


      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      // if (this.form.invalid) {
      //   console.log(this.form.invalid);
      //     return;
      // }

      this.loading = true;
      this.updateUser();
  }

  onChange(val){
    this.fieldMobileMode = val;
  }

  private updateUser() {
    this.alertService.loading();
    this.subs.add(this.userService.update(this.user.ID, this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success();

                this.router.navigate(['/'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
