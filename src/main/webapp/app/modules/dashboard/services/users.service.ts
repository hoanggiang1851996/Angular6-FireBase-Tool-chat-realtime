import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from 'app/core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    userCollection: AngularFirestoreCollection<User>;
    user;
    constructor(private angularFirestore: AngularFirestore) {}

    getUsers() {
        return this.angularFirestore.collection('users').valueChanges();
    }

    getUser(id) {
        this.user = this.angularFirestore.doc('users/' + id.uid).valueChanges();
        return this.user;
    }
}
