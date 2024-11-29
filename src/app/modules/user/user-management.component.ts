import { Component, OnDestroy, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserManagementService } from './user-management.service';
import { SubSink } from 'subsink';
import { RuleManagementService } from '../rule-management/rule-management.service';
import { ImagesService } from '../images/images.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AlertService } from 'src/app/auth/helpers';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { RuleModel, UserModel } from 'src/app/models';
import { LocalService } from 'src/app/auth/helpers/local.service';
import { ApmService } from '@elastic/apm-rum-angular';

@Component({ templateUrl: 'user-management.component.html' })
export class UserManagementComponent implements OnInit, OnDestroy {
    private subs = new SubSink();
    users = null;
    rules = null;
    user = null;
    rule = null;
    bp = null;
    // Pagination parameters.
    p: number = 1;
    count: number = 10;
    countdata=null;
    filterdata: string;
    apiurl=environment.apiUrl+'/image/';
    mobileMode: boolean;

    constructor(
        private apmService: ApmService,
        private usersService: UserManagementService,
        private rulesService: RuleManagementService,
        private imageService: ImagesService,
        private alertService: AlertService,
        private localService: LocalService
        ) {
        const apm = apmService.init({
            serviceName: environment.apmServerAppName,
            serverUrl: environment.apmServerUrl,
            environment: environment.apmServerEnv
            })
    
        this.user = JSON.parse(this.localService.getKey('user'));
    
        apm.setUserContext({
                'username': this.user.USERNAME,
                'id': this.user.ID,
                'email': this.user.EMAIL
            })
        }

    ngOnInit() {
        this.mobileMode = JSON.parse(localStorage.getItem('mobileMode'));
        this.subs.add(this.usersService.getAll().pipe(first()).subscribe(data => {
            this.users = data
            this.countdata=this.users.length
        }));
        this.subs.add(this.rulesService.getAll().pipe(first()).subscribe(data => this.rules = data));

        // this.user = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('1')));
        // this.rule = new BehaviorSubject<RuleModel>(JSON.parse(localStorage.getItem('2')));

        this.user = new BehaviorSubject<UserModel>(JSON.parse(this.localService.getKey('user')));
        this.rule = new BehaviorSubject<RuleModel>(JSON.parse(this.localService.getKey('rule')));
    }

    deleteUser(data) {
        // let temp=this.alertService.warning('Are you sure want to delete?', data.USERNAME)
        this.alertService.loading();
        const user = this.users.find(x => x.ID === data.ID);
        this.subs.add(this.usersService.delete(data.ID).pipe(first()).subscribe(
            () => {
                user.isDeleting = true;
                this.users = this.users.filter(x => x.ID !== data.ID);
                this.countdata=this.users.length
                this.alertService.success();
                // for delete image
                this.subs.add(this.imageService.deleteImage(user.PICTURE).pipe(first()).subscribe());
            },
            (err)=>{
                this.alertService.error(err);
            }
        ));
    }

    roleIdToName(id){
        let val;
        try{
            val = this.rules.find(data => data.ROLE_ID == id).ROLE_NAME;
        } catch (Exception){

        } finally {
            return val;
        }
    }

    companyIdToName(id){
        let val;
        try{
            val = this.bp.find(data => data.COMPANY_ID = id).COMPANY_NAME;
        } catch (Exception){

        } finally {
            return val;
        }
    }

    resendEmail(user){
        user.PASSWORD=user.USERNAME
        this.alertService.loading();
        this.subs.add(this.usersService.resendemail(user).pipe(first()).subscribe(
            ()=>{
                this.alertService.success();
            },
            (err)=> {
                this.alertService.error(err)
            }
        ));
    }

    confirmBox(type,data){
        if(type=='delete'){
            Swal.fire({
                title: 'Are you sure want to delete?',
                text: data.USERNAME,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.value) {
                    this.deleteUser(data)
                } 
            })
        }

        if(type=='confirm'){
            Swal.fire({
                title: 'Are you sure want to resend email?',
                text: 'this action will reset password ' + data.USERNAME,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, send email!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.value) {
                    this.resendEmail(data)
                } 
            })
        }
      }

    ngOnDestroy(): void{
        this.subs.unsubscribe();
    }
}