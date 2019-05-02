import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'app/core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user$: Observable<any>;

    constructor(
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore,
        private router: Router,
        private notificationsService: NotificationsService
    ) {
        this.user$ = this.angularFireAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.angularFirestore.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }

    async googleSignin() {
        const provider = new auth.GoogleAuthProvider();
        const credential = await this.angularFireAuth.auth
            .signInWithPopup(provider)
            .then(res => {
                this.notificationsService.success('Success', 'Login successfully');
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(res.user));
                this.router.navigate(['/dashboard']);
                const data: any = res.user;
                data.online = true;
                if (res.user !== undefined) {
                    return this.updateUserData(data);
                }
            })
            .catch(err => {
                return err;
            });
    }

    async login(data) {
        const result = await this.angularFireAuth.auth.signInWithEmailAndPassword(data.email, data.password).then(
            res => {
                this.checkLoginResponse(res, result, data);
            },
            err => {
                this.notificationsService.error('Error', `${err.message}`);
            }
        );
    }

    checkLoginResponse(res, result, data) {
        if (res.user !== undefined) {
            this.notificationsService.success('Success', 'Login successfully');
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigate(['/dashboard']);
            this.createNewUser(data);
        } else {
            this.notificationsService.error('Error', `${res.message}`);
        }
    }

    createNewUser(data) {
        const newUser: any = new Object();
        newUser.displayName = data.email.substring(0, data.email.lastIndexOf('@'));
        newUser.uid = JSON.parse(localStorage.getItem('user')).uid;
        newUser.photoURL = 'https://institutogoldenprana.com.br/wp-content/uploads/2015/08/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg';
        newUser.email = data.email;
        newUser.online = true;
        return this.updateUserData(newUser);
    }

    async doRegister(value) {
        await this.angularFireAuth.auth
            .createUserWithEmailAndPassword(value.email, value.password)
            .then((res: any) => {
                this.checkRegisterResponse(res);
            })
            .catch(err => this.notificationsService.error('Error', `${err.message}`));
    }

    checkRegisterResponse(res) {
        if (res.user !== undefined) {
            this.router.navigate(['/login']);
            this.notificationsService.success('Success', 'Registration  successfully');
        } else {
            this.notificationsService.error('Error', `${res.message}`);
        }
    }

    async signOut() {
        this.changeStatusUserLogout();
        await this.angularFireAuth.auth.signOut();
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user');
        this.notificationsService.success('Success', 'Logout successfully');
        return this.router.navigate(['/login']);
    }

    changeStatusUserLogout() {
        const uid = JSON.parse(localStorage.getItem('user')).uid;
        const logoutMessage = this.angularFirestore.doc(`users/${uid}`);
        logoutMessage.update({
            online: false
        });
    }

    private updateUserData({ uid, email, displayName, photoURL, online }: User) {
        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${uid}`);
        const data = {
            uid,
            email,
            displayName,
            photoURL,
            online
        };
        return userRef.set(<User>data, { merge: true });
    }
}
