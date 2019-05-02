import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable({
    providedIn: 'root'
})
export class ContactsService {
    constructor(private angularFirestore: AngularFirestore) {}

    getContacts(myId) {
        return this.angularFirestore
            .doc('users/' + myId)
            .collection('contacts')
            .valueChanges();
    }

    addContact(myId, user) {
        const contactRef: AngularFirestoreDocument = this.angularFirestore.doc(`users/${myId}/contacts/${user.uid}`);
        return contactRef.set(user, { merge: true });
    }
}
