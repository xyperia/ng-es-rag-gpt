import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/auth/helpers';
import { UserManagementService } from '../user-management.service';
import { SubSink } from 'subsink';
import { RuleManagementService } from 'src/app/modules/rule-management/rule-management.service';
import { environment } from 'src/environments/environment';
import { ImagesService } from '../../images/images.service';
import { LocalService } from 'src/app/auth/helpers/local.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';
  constructor(public src: string, public file: File) {}
}

@Component({ 
    templateUrl: 'user-add-edit.component.html',
    styleUrls: ['./user-add-edit.component.scss'] 
})
export class UserAddEditComponent implements OnInit, OnDestroy {
    private subs = new SubSink();
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    selectedBPName = null;
    rules = null;
    bp = null;
    contact = null;
    selectedFile: ImageSnippet;
    apiurl=environment.apiUrl;
    selectemail=null;
    isVTI: boolean= false;
    isSuperUser: boolean= false;

    // rulelocal = JSON.parse(localStorage.getItem('2'));
    rulelocal = JSON.parse(this.localService.getKey('rule'));;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private usersService: UserManagementService,
        private alertService: AlertService,
        private ruleManagementService: RuleManagementService,
        private imageService: ImagesService,
        private localService: LocalService
    ) {}

    ngOnInit() {
        if(this.rulelocal.ISSUPERADMIN){
            this.isSuperUser=true;
        }
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            USERNAME: ['', Validators.required],
            PASSWORD: ['', passwordValidators],
            FIRST_NAME: ['', Validators.required],
            LAST_NAME: ['', Validators.required],
            COMPANY_NAME: ['', Validators.required],
            PHONE: ['', Validators.required],
            BIO: ['', Validators.required],
            PICTURE: ['', Validators.required],
            RULE_ID: ['', Validators.required],
            EMAIL: ['', Validators.required],
        });

        if (!this.isAddMode) {
            this.subs.add(this.usersService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    // this.selectedBPName = x.COMPANY_ID
                }));
        }

        this.subs.add(this.ruleManagementService.getAll().subscribe(data => this.rules = data));
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    
    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    onCompanySelected(value){
        if(parseInt(value.COMPANY_ID)===37891 && this.isSuperUser==true){
            this.isVTI=true
            this.form.get('COMPANY_ID').setValue(value.COMPANY_ID)
            this.form.get('COMPANY_NAME').setValue(value.COMPANY_NAME)
            this.setEmptyvalue();
        }else{
            this.isVTI=false
            this.form.get('COMPANY_ID').setValue(value.COMPANY_ID)
            this.form.get('COMPANY_NAME').setValue(value.COMPANY_NAME)
            this.setEmptyvalue();
        }
        
    }

    onSelection(event){
  
        if(event.CONTACT_NAME.split(' ').length == 1)
        {
            this.form.get("FIRST_NAME").setValue(event.CONTACT_NAME)
        }else{
            this.form.get("FIRST_NAME").setValue(event.CONTACT_NAME.substr(0,event.CONTACT_NAME.indexOf(' ')))
        }
        
        if(event.CONTACT_NAME.substr(event.CONTACT_NAME.indexOf(' ')+1) != "")
        {
            this.form.get("LAST_NAME").setValue(event.CONTACT_NAME.substr(event.CONTACT_NAME.indexOf(' ')+1))
        } else{
            this.form.get("LAST_NAME").setValue(event.CONTACT_NAME.substr(0,event.CONTACT_NAME.indexOf(' ')))
        }
        
        this.form.get("PASSWORD").setValue(event.EMAIL)
        this.form.get("USERNAME").setValue(event.EMAIL)
        this.form.get("PHONE").setValue(event.PHONE01)
       
      }

    private createUser() {
        this.alertService.loading();
        this.subs.add(this.usersService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success();
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            }));
    }

    private updateUser() {
        this.alertService.loading();
        this.subs.add(this.usersService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success();
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            }));
    }

    private onSuccess() {
        this.selectedFile.pending = false;
        this.selectedFile.status = 'ok';
      }
    
      private onError() {
        this.selectedFile.pending = false;
        this.selectedFile.status = 'fail';
        this.selectedFile.src = '';
      }
    
  
      processFile(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();
        if(this.form.value.PICTURE){
          //delete image local file
          this.imageService.deleteImage(this.form.value.PICTURE).pipe(first()).subscribe();
        }
    
        reader.addEventListener('load', (event: any) => {
          this.selectedFile = new ImageSnippet(event.target.result, file);
    
          this.imageService.uploadImage(this.selectedFile.file).subscribe(
            (res) => {
              this.form.get('PICTURE').setValue(res['filename'])
              this.onSuccess();
            },
            (err) => {
              this.onError();
            })
        });
    
        reader.readAsDataURL(file);
      }

    private setEmptyvalue(){
        this.form.get('FIRST_NAME').setValue('')
        this.form.get('LAST_NAME').setValue('')
        this.form.get('PHONE').setValue('')
        this.form.get('BIO').setValue('')
        // this.form.get('VIP_POINTS').setValue('')
        this.form.get('PASSWORD').setValue('')
        this.selectemail=''
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}