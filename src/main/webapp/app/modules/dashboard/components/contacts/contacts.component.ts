import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContactsService } from 'app/modules/dashboard/services/contacts.service';
import { OpenPopupService } from 'app/shared/services/open-popup.service';
import { PopupAddContactsComponent } from 'app/modules/dashboard/components/popup-add-contacts/popup-add-contacts.component';
import { User } from 'app/core/models/user.model';
import { CONFIG } from 'app/core/config/config';
import { ChatsService } from 'app/modules/dashboard/services/chats.service';
import { Router } from '@angular/router';
import { StatusUserService } from 'app/modules/dashboard/services/status-user.service';

@Component({
    selector: 'jhi-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['contacts.scss']
})
export class ContactsComponent implements OnInit, OnChanges {
    @Input() childSearchData: any;
    arrayContacts = [];
    contacts: User[] = [];
    stateHandle = CONFIG;
    checkIdChatFromContact;
    selectedIndex: number = null;
    statusUsers = [];

    constructor(
        private contactsService: ContactsService,
        private openPopup: OpenPopupService,
        private chatsService: ChatsService,
        private route: Router,
        private statusUserService: StatusUserService
    ) {
        this.getContact();
    }

    getContact() {
        const myId = JSON.parse(localStorage.getItem('user')).uid;
        this.contactsService.getContacts(myId).subscribe(contacts => {
            this.contacts = contacts as User[];
            this.arrayContacts.push(contacts);
            this.getStatusUsers(this.contacts);
        });
    }

    searchContacts(): void {
        this.contacts = this.arrayContacts[0].filter(x => x.displayName.toLowerCase().indexOf(this.childSearchData.toLowerCase()) !== -1);
    }

    addContacts() {
        this.openPopup
            .openComponent(PopupAddContactsComponent as Component, null, { centered: true, size: 'md' })
            .result.then(() => this.getContact());
    }

    redirectToChatDetailFromContacts(user, index) {
        this.selectedIndex = index;
        const uids = [];
        uids.push(JSON.parse(localStorage.getItem('user')).uid);
        uids.push(user.uid);
        this.chatsService.getRecentChat(JSON.parse(localStorage.getItem('user')).uid).subscribe((res: any) => {
            if (res[0] === undefined) {
                this.createNewChat(user);
            } else {
                let check = true;
                for (let i = 0; i < res.length; i++) {
                    if (JSON.stringify(res[i].uids) === JSON.stringify(uids)) {
                        this.checkIdChatFromContact = res[i].createAt;
                        this.renderChatDetailFromContact();
                        check = true;
                        break;
                    }
                    check = false;
                }
                if (check === false) {
                    this.createNewChat(user);
                }
            }
        });
    }

    createNewChat(user) {
        this.chatsService.createChat(user);
    }

    renderChatDetailFromContact() {
        this.route.navigate(['/dashboard', { outlets: { chatDetail: [this.checkIdChatFromContact] } }]);
    }

    getStatusUsers(users) {
        for (let i = 0; i < users.length; i++) {
            this.statusUserService.getStatusUser(users[i].uid).subscribe((res: any) => {
                this.statusUsers[i] = res.online;
            });
        }
    }

    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges): void {
        this.searchContacts();
    }
}
