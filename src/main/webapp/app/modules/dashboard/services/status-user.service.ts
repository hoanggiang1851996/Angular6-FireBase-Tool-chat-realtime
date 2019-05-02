import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
    providedIn: 'root'
})
export class StatusUserService {
    constructor(private angularFirestore: AngularFirestore) {}

    getStatusUser(uid) {
        return this.angularFirestore.doc('users/' + uid).valueChanges();
    }
}
