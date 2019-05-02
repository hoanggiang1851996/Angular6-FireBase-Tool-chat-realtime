import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService } from 'app/modules/dashboard/services/contacts.service';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'app/shared/models/user';
import { UsersService } from 'app/modules/dashboard/services/users.service';

@Component({
    selector: 'jhi-popup-add-contacts',
    templateUrl: './popup-add-contacts.component.html',
    styleUrls: ['./index.scss']
})
export class PopupAddContactsComponent implements OnInit {
    users: User[];
    searchValue: string;
    arrayUsers = [];
    arrayContacts = [];
    contacts: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private contactService: ContactsService,
        private userService: UsersService,
        private notificationsService: NotificationsService
    ) {}

    getListUser() {
        const myId = JSON.parse(localStorage.getItem('user')).uid;
        this.userService.getUsers().subscribe(data => {
            this.users = data.filter(x => x['uid'] !== myId) as User[];
            this.arrayUsers.push(data);
        });
    }

    getListContact() {
        const myId = JSON.parse(localStorage.getItem('user')).uid;
        this.contactService.getContacts(myId).subscribe(data => {
            this.arrayContacts.push(data);
        });
    }

    searchUsers() {
        this.users = this.arrayUsers[0].filter(x => x.displayName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1);
    }

    resetSearchBox() {
        this.searchValue = '';
        this.getListUser();
    }

    addContact(user: User) {
        const myId = JSON.parse(localStorage.getItem('user')).uid;
        const filterUserInContact = this.arrayContacts[0].filter(x => JSON.stringify(x) === JSON.stringify(user))[0];
        if (JSON.stringify(user) === JSON.stringify(filterUserInContact)) {
            this.notificationsService.error('Error', 'Contact already exists');
        } else {
            this.contactService.addContact(myId, user).then(() => {
                this.arrayContacts[0].push(user);
                this.notificationsService.success('Success', 'Add contact successfully');
            });
        }
    }

    ngOnInit() {
        this.getListUser();
        this.getListContact();
    }
}
