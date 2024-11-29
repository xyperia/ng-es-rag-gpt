import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { first } from 'rxjs/operators';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UserModel } from 'src/app/models/user.model';
import { UserManagementService } from '../user/user-management.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LocalService } from 'src/app/auth/helpers/local.service';
import { HttpClient } from '@angular/common/http';
import { ApmService } from '@elastic/apm-rum-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 800,
    responsive: {
      0: {
        items: 1
      },
    }
  }

  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 800,
    responsive: {
      0: {
        items: 3
      },
    }
  }

  private subs = new SubSink();
  // covidData: CovidData[] = [];
  // covidPenambahan: CovidPenambahan[] = [];
  // covidTotal: CovidTotal[] = [];
  // products = null;
  news=null;
  promo=null;
  event=null;
  isManaging = false;
  gridLayout = true;
  pageTitle: string;
  totalpercentage=0;
  badge=null;
  point=[];
  pointuser=[];
  currdate: string = new Date().toISOString();
  apiurl=environment.apiUrl+'/image/';
  imagebadge=null;
  private user: BehaviorSubject<UserModel>;
  users=null;

  constructor(
    apmService: ApmService,
    private userService: UserManagementService,
    private datePipe: DatePipe,
    private localService: LocalService,
    private http: HttpClient
  ) { 
    const apm = apmService.init({
      serviceName: environment.apmServerAppName,
      serverUrl: environment.apmServerUrl,
      environment: environment.apmServerEnv
    })

    let userObj = JSON.parse(this.localService.getKey('user'));
    apm.setUserContext({
      'username': userObj.USERNAME,
      'id': userObj.ID,
      'email': userObj.EMAIL
    })
  }

  ngOnInit(): void{
    //read local storage
    // this.user = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('1')));
    this.user = new BehaviorSubject<UserModel>(JSON.parse(this.localService.getKey('user')));
    
    this.subs.add(this.userService.getById(this.user.value.ID).pipe(first()).subscribe(data =>{
      this.updateUserLastLogin(data)
    } ))
    // this.subs.add(this.newseventService.getProduct().subscribe(data => this.products = data));
  }

  convertDate(val){
    val = new Date((typeof val === "string" ? new Date(val) : val).toLocaleString("en-US", {timeZone: "Asia/Jakarta"})).toString();
    return val.substring(0, val.indexOf('GMT'));
  }

  updateUserLastLogin(data){
    if(data!=null){
      this.currdate = this.datePipe.transform(this.currdate, 'yyyy-MM-dd h:mm');
      data.LAST_LOGIN=new Date(this.currdate)
      this.subs.add(this.userService.update(parseInt(data.ID),data).subscribe());
    }
  }

  ngOnDestroy(): void{
    this.subs.unsubscribe();
  }
}