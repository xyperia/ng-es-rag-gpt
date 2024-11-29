import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login.service';
import { LocalService } from './local.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    datetime = new Date();
    constructor(
        private router: Router,
        private loginService: LoginService,
        private localService: LocalService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if(this.checkUserLogin(route, state)){
            const rule = this.loginService.ruleValue;
            // if (route.data.role && route.data.role.indexOf(userRole) === -1) {
            //     this.router.navigate(['/']);
            //     return false;
            // }

            switch(route.data.roles) {
                case "USER_MGMT":
                    if(!this.findCondition(rule, route.data.roles) && !rule.USER_MGMT){
                        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
                    }
                break;
            }
            

            return true;
        }
    }

    findCondition(arrays, val)
    {
        var keys = Object.keys(arrays);

        var filtered = keys.filter(function(key) {
            return arrays[key];
        });

        if(filtered.includes(val)){
            return true;
        }
        
        return false;
    }

    

    // canActivateChild(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     return this.canActivate(next, state);
    // }

    // canDeactivate(
    //     component: unknown,
    //     currentRoute: ActivatedRouteSnapshot,
    //     currentState: RouterStateSnapshot,
    //     nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     return true;
    // }

    // canLoad(
    //     route: Route,
    //     segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    //     return true;
    // }

    checkExpirationTime(){
        var nowtime = new Date(Date.now()).toString();
        var exptime = new Date(Date.now() + environment.sessionTimeout).toString();
        if(Date.parse(nowtime) < Date.parse(this.localService.getKey('expireTime'))){
            this.localService.setKey('expireTime', exptime);
            return true;
        }
        this.loginService.logout();
    }

    checkUserLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        
        const user = this.loginService.userValue;
        const rule = this.loginService.ruleValue;
        if (user || rule) {
            return this.checkExpirationTime();
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}