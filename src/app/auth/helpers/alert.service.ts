import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AlertModel, AlertType } from '../../models';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<AlertModel>();
    private defaultId = 'default-alert';

    // enable subscribing to alerts observable
    onAlert(id = this.defaultId): Observable<AlertModel> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    // // convenience methods
    // success(message: string, options?: any) {
    //     this.alert(new AlertModel({ ...options, type: AlertType.Success, message }));
    // }

    // error(message: string, options?: any) {
    //     this.alert(new AlertModel({ ...options, type: AlertType.Error, message }));
    // }

    info(message: string, options?: any) {
        this.alert(new AlertModel({ ...options, type: AlertType.Info, message }));
    }

    warning(message: string, options?: any) {
      Swal.fire({
        title: message,
        text: options,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            return true;
        }else{
            return false
        }
    })
    }

    // main alert method    
    alert(alert: AlertModel) {
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert);
    }

    success(){
        let timerInterval
        Swal.fire({
            icon: 'success',
            title: 'Success',
            html: 'I will close in <b></b> milliseconds.',
            timer: 1000,
            timerProgressBar: false,
            didOpen: () => {
              Swal.showLoading()
              const b = Swal.getHtmlContainer().querySelector('b')
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft().toString();
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              // console.log('I was closed by the timer')
            }
          })
        }

      error(err){
        Swal.fire({
            icon: 'error',
            title: 'Something went wrong!',
            text: err
          })
        }

    loading(){
        Swal.fire('Please wait')
        Swal.showLoading()
    }

    // clear alerts
    clear(id = this.defaultId) {
        this.subject.next(new AlertModel({ id }));
    }
}