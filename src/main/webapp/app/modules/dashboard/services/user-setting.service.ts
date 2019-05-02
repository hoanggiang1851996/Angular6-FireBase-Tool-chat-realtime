import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
    providedIn: 'root'
})
export class UserSettingService {
    url = 'https://5c46b8161ef6050014d21d1c.mockapi.io/api/contact';

    constructor(private http: HttpClient, private notification: NotificationsService) {}

    getSettingUser(): Observable<any> {
        return this.http.get(this.url).pipe(
            tap(data => data),
            catchError(error => {
                this.notification.error('Error', '');
                return error;
            })
        );
    }
}
