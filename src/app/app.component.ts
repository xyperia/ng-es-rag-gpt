import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { UserModel, RuleModel } from './models';
import { LoginService } from './auth/login.service';
import { UserManagementService } from './modules/user/user-management.service';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { LocalService } from './auth/helpers/local.service';
import { ApmService } from '@elastic/apm-rum-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  private subs = new SubSink();
  user: UserModel;
  rule: RuleModel;
  getTitle: string = environment.appTitle;
  devName: string = environment.devName;
  isProduction: boolean = environment.production;
  pageTitle: string;
  navActive = false;
  apiurl=environment.apiUrl+'/image/';
  title = 'af-notification';
  message:any = null;
  datatoken=null;
  companyBadge: string = "Loading...";
  companyRevenue: string = "Loading...";
  userrule;
  isSuperUser= false;

  public constructor(
      apmService: ApmService,
      private titleService: Title,
      private router: Router,
      location: Location,
      private loginService: LoginService,
      private usersService: UserManagementService,
      private localService: LocalService
      ){
        const apm = apmService.init({
          serviceName: environment.apmServerAppName,
          serverUrl: environment.apmServerUrl,
          environment: environment.apmServerEnv
        })

        console.log(this.user);

        this.titleService.setTitle(this.getTitle);
        this.subs.add(router.events.subscribe(() => {
          this.pageTitle = this.urlExtract(location.path());
          this.loginService.user.subscribe(x => {
            this.user = x;
          });
          this.loginService.rule.subscribe(x => this.rule = x);
        }));
      }

  ngOnInit(): void {
    // this.userrule = new BehaviorSubject<RuleModel>(JSON.parse(localStorage.getItem('2')));
    this.userrule = new BehaviorSubject<RuleModel>(JSON.parse(this.localService.getKey('rule')));
    if(this.userrule.ISSUPERADMIN){
      this.isSuperUser=true;
    }
    // this.listen();
  }
  // listen() {
  //   const messaging = getMessaging();
  //   onMessage(messaging, (payload) => {
  //     console.log('Message received. ', payload);
  //     this.message=payload;
  //   });
  // }

  menuToggle() {
    this.navActive=!this.navActive
  }

  viewProfile(id: string){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile/'+id]);
    });
  }

  logout() {
    this.subs.unsubscribe();
    this.loginService.logout();
  }

  private urlExtract(url: string){
    return url.split('/').join(' ').slice(1).replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
  }
}