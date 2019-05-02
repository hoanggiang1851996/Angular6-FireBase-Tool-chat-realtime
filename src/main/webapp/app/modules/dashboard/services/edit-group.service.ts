import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EditGroupService {
    urlGroup = 'http://5c6931b6bad2070014abb4d3.mockapi.io/group';
    url = 'https://5cad6d2a01a0b80014dcd649.mockapi.io/listGroup';
    constructor(private http: HttpClient) {}
    getDataGroup(): Observable<any> {
        return this.http.get(this.urlGroup);
    }
    getListDataGroup(): Observable<any> {
        return this.http.get(this.url);
    }
    removeUserOutGroup(id): Observable<any> {
        return this.http.delete(`${this.url}/${id}`);
    }
}
