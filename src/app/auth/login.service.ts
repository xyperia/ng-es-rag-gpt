import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { environment } from 'src/environments/environment';
import { UserModel, RuleModel } from '../models';
import { LocalService } from './helpers/local.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
    private subs = new SubSink();

    private userSubject: BehaviorSubject<UserModel>;
    private ruleSubject: BehaviorSubject<RuleModel>;

    public user: Observable<UserModel>;
    public rule: Observable<RuleModel>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private localService: LocalService
    ) {

        // User = 1, Rule = 2

        // this.userSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('1')));
        // this.ruleSubject = new BehaviorSubject<RuleModel>(JSON.parse(localStorage.getItem('2')));

        this.userSubject = new BehaviorSubject<UserModel>(JSON.parse(this.localService.getKey('user')));
        this.ruleSubject = new BehaviorSubject<RuleModel>(JSON.parse(this.localService.getKey('rule')));

        this.user = this.userSubject.asObservable();
        this.rule = this.ruleSubject.asObservable();
    }

    public get userValue(): UserModel {
        return this.userSubject.value;
    }

    public get ruleValue(): RuleModel {
        return this.ruleSubject.value;
    }

    login(USERNAME, PASSWORD) {
        if(!localStorage.getItem('mobileMode')){
            localStorage.setItem('mobileMode', 'false');
        }

        return this.http.post<UserModel>(`${environment.apiUrl}/auth`, { USERNAME, PASSWORD })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('1', JSON.stringify(user));
                this.localService.setKey('user', JSON.stringify(user));
                // localStorage.setItem('expireTime', new Date(Date.now() + environment.sessionTimeout).toString());
                this.localService.setKey('expireTime', new Date(Date.now() + environment.sessionTimeout).toString());

                this.getRuleByID(user.RULE_ID).pipe(first()).subscribe( data => {
                    // localStorage.setItem('2', JSON.stringify(data))
                    this.localService.setKey('rule', JSON.stringify(data));
                    this.ruleSubject.next(data)
                    // console.log(data);

                    this.userSubject.next(user);
                    return user;
                  });
            }));
    }

    public getRuleByID(rule_id: string): Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}/rules/` + rule_id);
    }

    logout() {
        // remove user from local storage and set current user to null
        this.localService.clearToken('user');
        this.localService.clearToken('rule');
        this.localService.clearToken('expireTime');
        this.userSubject.next(null);
        this.ruleSubject.next(null);
        this.router.navigate(['/account/login']);
    }
}