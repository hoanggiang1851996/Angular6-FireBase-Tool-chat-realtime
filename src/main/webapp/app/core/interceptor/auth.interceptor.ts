import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loggedIn = localStorage.getItem('loggedIn');
        // const tokenServer = localStorage.getItem('tokenServer');
        if (loggedIn === 'true') {
            const cloned = req.clone({
                // headers: req.headers.set('Authorization', tokenServer).set('Content-type', 'application/json')
            });
            return next.handle(cloned).pipe(
                tap((event: any) => {
                    localStorage.setItem('statusCodeServer', event.ok);
                }),
                catchError((error: any) => {
                    this.notificationService.error('Error', `${error.status} ${error.statusText}`);
                    return error;
                })
            );
        } else {
            return next.handle(req).pipe(
                tap((event: any) => {
                    localStorage.setItem('statusCodeServer', event.ok);
                }),
                catchError((error: any) => {
                    this.notificationService.error('Error', `${error.status} ${error.statusText}`);
                    return error;
                })
            );
        }
    }

    constructor(private notificationService: NotificationsService) {}
}
