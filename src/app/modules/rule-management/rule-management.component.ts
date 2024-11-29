import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { RuleManagementService } from './rule-management.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AlertService } from 'src/app/auth/helpers';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from 'src/app/models';
import { LocalService } from 'src/app/auth/helpers/local.service';
import { ApmService } from '@elastic/apm-rum-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rule-management',
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.scss']
})
export class RuleManagementComponent implements OnInit, OnDestroy {

  rules = null;
  private subs = new SubSink();
   // Pagination parameters.
   p: number = 1;
   count: number = 10;
   countdata=null;
   filterdata: string;

   user;
   mobileMode: boolean;

  constructor(
    private apmService: ApmService,
    private service: RuleManagementService,
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

  ngOnInit(): void {
    this.mobileMode = JSON.parse(localStorage.getItem('mobileMode'));
    // this.user = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('1')));
    this.user = new BehaviorSubject<UserModel>(JSON.parse(this.localService.getKey('user')));
    this.subs.add(this.service.getAll().subscribe(data =>{
      this.rules = data
      this.countdata = this.rules.length;
    } ));
  }

  deleteRule(data) {
    this.alertService.loading();
    const rule = this.rules.find(x => x.RULE_ID === data.RULE_ID);
    this.subs.add(this.service.delete(data.RULE_ID).subscribe(
      () => {
        rule.isDeleting = true;
        this.rules = this.rules.filter(x => x.RULE_ID !== data.RULE_ID);
        this.countdata = this.rules.length;
        this.alertService.success();
        },
        (err)=>{
          this.alertService.error(err);
        }
        ));
  }

  confirmBox(type,data){
    if(type=='delete'){
        Swal.fire({
            title: 'Are you sure want to delete?',
            text: data.RULE_NAME,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.value) {
                this.deleteRule(data)
            } 
        })
    }
  }

  ngOnDestroy(): void{
    this.subs.unsubscribe();
  }

}

