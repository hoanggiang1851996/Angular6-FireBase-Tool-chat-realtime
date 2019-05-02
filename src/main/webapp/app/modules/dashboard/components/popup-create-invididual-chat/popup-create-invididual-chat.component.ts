import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService } from 'app/modules/dashboard/services/contacts.service';
import { Router } from '@angular/router';
import { CONFIG } from 'app/core/config/config';
import { UsersService } from 'app/modules/dashboard/services/users.service';
import { ChatsService } from 'app/modules/dashboard/services/chats.service';
import { StatusUserService } from 'app/modules/dashboard/services/status-user.service';

@Component({
    selector: 'jhi-popup-create-invididual-chat',
    templateUrl: './index.html',
    styleUrls: ['./index.scss']
})
export class PopupCreateInvididualChatComponent implements OnInit {
    @Input() closeModal: string;
    searchValue;
    suggestedUsers;
    users;
    stateHandle = CONFIG;
    arraySuggestedUsers = [];
    arrayUsers = [];
    checkIdChatFromContact;
    statusUsers = [];

    constructor(
        public activeModal: NgbActiveModal,
        private contactsService: ContactsService,
        private usersService: UsersService,
        private chatsService: ChatsService,
        private route: Router,
        private statusUserService: StatusUserService
    ) {}

    getSuggestedUsers() {
        const uid = JSON.parse(localStorage.getItem('user')).uid;
        this.contactsService.getContacts(uid).subscribe(res => {
            this.suggestedUsers = res;
            this.arraySuggestedUsers.push(res);
            this.getStatusUsers(this.suggestedUsers);
        });
    }

    async getUsers() {
        await this.usersService.getUsers().subscribe(res => {
            this.users = res;
            this.arrayUsers.push(res);
        });
    }

    searchContacts() {
        this.suggestedUsers = this.arraySuggestedUsers[0].filter(
            x => x.displayName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
        );

        this.users = this.arrayUsers[0].filter(x => x.displayName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1);
    }

    createNewChat(user) {
        this.chatsService.createChat(user);
        this.activeModal.close();
    }

    renderChatDetailFromContact() {
        this.route.navigate(['/dashboard', { outlets: { chatDetail: [this.checkIdChatFromContact] } }]);
    }

    redirectToChatDetailFromContacts(user) {
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
                        this.activeModal.close();
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

    resetSearchBox() {
        this.searchValue = '';
        this.getSuggestedUsers();
        this.getUsers();
    }

    getStatusUsers(users) {
        for (let i = 0; i < users.length; i++) {
            this.statusUserService.getStatusUser(users[i].uid).subscribe((res: any) => {
                this.statusUsers[i] = res.online;
            });
        }
    }

    ngOnInit() {
        this.getSuggestedUsers();
        this.getUsers();
    }
}
