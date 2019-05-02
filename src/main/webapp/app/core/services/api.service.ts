import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'app/core/config/config';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) {}

    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.http.get(`${environment.api_url}${path}`, { params });
    }

    put(path: string, body: any = {}): Observable<any> {
        return this.http.put(`${environment.api_url}${path}`, body);
    }

    post(path: string, body: any = {}): Observable<any> {
        return this.http.post(`${environment.api_url}${path}`, body);
    }

    delete(path): Observable<any> {
        return this.http.delete(`${environment.api_url}${path}`);
    }
}
