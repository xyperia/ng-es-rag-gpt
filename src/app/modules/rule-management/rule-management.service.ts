import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RuleModel } from 'src/app/models';
import { map } from 'rxjs/operators';
import { LocalService } from 'src/app/auth/helpers/local.service';

@Injectable({
  providedIn: 'root'
})
export class RuleManagementService {
  private ruleSubject: BehaviorSubject<RuleModel>;
  public rule: Observable<RuleModel>;

  constructor(private http:HttpClient, private localService: LocalService) {
    // this.ruleSubject = new BehaviorSubject<RuleModel>(JSON.parse(localStorage.getItem('2')));
    this.ruleSubject = new BehaviorSubject<RuleModel>(JSON.parse(this.localService.getKey('rule')));
    this.rule = this.ruleSubject.asObservable();
  }

  public get ruleValue(): RuleModel {
    return this.ruleSubject.value;
  }

  getAll() {
    return this.http.get<RuleModel[]>(`${environment.apiUrl}/rules`);
  }

  getByID(id: string){
    return this.http.get<RuleModel[]>(`${environment.apiUrl}/rules/${id}`)
  }

  register(rule: RuleModel) {
    return this.http.post(`${environment.apiUrl}/rules/create`, rule);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/rules/${id}`, params).pipe(map(x => {
          // update stored role if the logged in user's role updated their own record
          if (id == this.ruleValue.RULE_ID) {
              // update local storage
              const role = { ...this.ruleValue, ...params };
              // localStorage.setItem('2', JSON.stringify(role));
              this.localService.setKey('rule', JSON.stringify(role));

              // publish updated role to subscribers
              this.ruleSubject.next(role);
          }
          return x;
      }));
  }

  delete(id: string) {
    return this.http.get<RuleModel>(`${environment.apiUrl}/rules/delete/${id}`);
  }
}