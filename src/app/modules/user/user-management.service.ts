import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { UserModel } from 'src/app/models';
import { LocalService } from 'src/app/auth/helpers/local.service';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
    private userSubject: BehaviorSubject<UserModel>;
    public user: Observable<UserModel>;

    constructor(
        private http: HttpClient,
        private localService: LocalService
    ) {
        // this.userSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('1')));
        this.userSubject = new BehaviorSubject<UserModel>(JSON.parse(this.localService.getKey('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): UserModel {
        return this.userSubject.value;
    }

    register(user: UserModel) {
        return this.http.post(`${environment.apiUrl}/users`, user);
    }

    resendemail(user: UserModel) {
        return this.http.post(`${environment.apiUrl}/mail/resendemail`, user);
    }

    getAll() {
        return this.http.get<UserModel[]>(`${environment.apiUrl}/users`);
    }

    getTopTen() {
        return this.http.get<UserModel[]>(`${environment.apiUrl}/users/gettopten`);
    }

    getTopTenAllCompany(group_id) {
        return this.http.get<UserModel[]>(`${environment.apiUrl}/users/gettoptenallcompany/${group_id}`);
    }

    getTopTenAllUser(group_id) {
        return this.http.get<UserModel[]>(`${environment.apiUrl}/users/gettoptenalluser/${group_id}`);
    }

    getTopTenUser(companyid: number) {
        return this.http.get<UserModel[]>(`${environment.apiUrl}/users/gettoptenuser/${companyid}`);
    }

    getById(id: string) {
        return this.http.get<UserModel>(`${environment.apiUrl}/users/${id}`);
    }

    getByUsername(username: string){
        return this.http.get<any>(`${environment.apiUrl}/users/getbyusername/${username}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                try {
                    // update stored user if the logged in user updated their own record
                    if (id == this.userValue.ID) {
                        // update local storage
                        const user = { ...this.userValue, ...params };
                        // localStorage.setItem('1', JSON.stringify(user));
                        this.localService.setKey('user', JSON.stringify(user))

                        // publish updated user to subscribers
                        this.userSubject.next(user);
                    }
                    return x;
                } catch (error) {
                    
                }
                
            }));
    }

    delete(ID: string) {
        // return this.http.delete(`${environment.apiUrl}/users/delete/${ID}`)
        //     .pipe(map(x => {
        //         // auto logout if the logged in user deleted their own record
        //         if (ID == this.userValue.ID) {
        //             this.logout();
        //         }
        //         return x;
        //     }));
        return this.http.get<UserModel>(`${environment.apiUrl}/users/delete/${ID}`);
    }
}