import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService } from 'app/modules/dashboard/services/contacts.service';
import { NotificationsService } from 'angular2-notifications';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChatsService } from 'app/modules/dashboard/services/chats.service';
import { ActivatedRoute } from '@angular/router';
import { CONFIG } from 'app/core/config/config';
import { UsersService } from 'app/modules/dashboard/services/users.service';
import { StatusUserService } from 'app/modules/dashboard/services/status-user.service';

@Component({
    selector: 'jhi-popup-add-member',
    templateUrl: './popup-add-member.component.html',
    styleUrls: ['./index.scss']
})
export class PopupAddMemberComponent implements OnInit {
    @Input() data: any;
    addMemberForm = this.fb.group({
        searchValue: new FormControl(),
        suggestedUsers: this.fb.array([]),
        users: this.fb.array([])
    });
    stateHandle = CONFIG;
    statusUsers = [];
    userInfo(name?): FormGroup {
        return this.fb.group({
            uid: new FormControl(),
            photoURL: new FormControl(),
            displayName: new FormControl(),
            status: new FormControl(),
            online: new FormControl(),
            attend: new FormControl()
        });
    }

    constructor(
        public activeModal: NgbActiveModal,
        private contactsService: ContactsService,
        private fb: FormBuilder,
        private notificationsService: NotificationsService,
        private chatService: ChatsService,
        private route: ActivatedRoute,
        private usersService: UsersService,
        private statusUserService: StatusUserService
    ) {}

    getSuggestedUsers() {
        const uid = JSON.parse(localStorage.getItem('user')).uid;
        this.contactsService.getContacts(uid).subscribe(res => {
            this.addFormControl('suggestedUsers', res);
            this.getStatusUsers(this.addMemberForm.controls.suggestedUsers.value);
        });
    }

    getUsers() {
        this.usersService.getUsers().subscribe(res => {
            this.addFormControl('users', res);
        });
    }

    addFormControl(formArray, res) {
        const array = <FormArray>this.addMemberForm.controls[`${formArray}`];
        for (const item of res) {
            array.push(this.userInfo(`${item}`));
            this.addMemberForm.patchValue({ [formArray]: res });
        }
    }

    removeFormControl(formArray) {
        const array = <FormArray>this.addMemberForm.controls[`${formArray}`];
        while (array.length !== 0) {
            array.removeAt(0);
        }
    }

    searchContacts() {
        if (this.addMemberForm.value.searchValue !== null) {
            // this.contactsService.searchContacts(this.addMemberForm.value.searchValue).subscribe(results => {
            //     this.removeFormControl('suggestedUsers');
            //     this.addFormControl('suggestedUsers', results);
            //     this.removeFormControl('users');
            //     this.addFormControl('users', results);
            // });
        }
    }

    resetSearchBox() {
        if (this.addMemberForm.value.searchValue !== null) {
            this.addMemberForm.patchValue({ searchValue: '' });
            this.removeFormControl('suggestedUsers');
            this.getSuggestedUsers();
            this.removeFormControl('users');
            this.getUsers();
        }
    }

    addMembers() {
        this.addMemberForm.addControl('members', new FormControl());
        this.addMemberForm.removeControl('searchValue');
        this.createListMember();
        this.activeModal.close();
        this.notificationsService.success('Success', 'Add members successfully');
        this.addChatId();
        this.requestCreateGroupChat(this.addMemberForm.value);
    }

    requestCreateGroupChat(newGroup) {
        if (this.data.groupInfo.isGroup === false) {
            this.chatService.createGroupChat(newGroup, this.data.groupInfo);
        } else {
            let listMember = [];
            for (const item of newGroup.members) {
                listMember.push(item.uid);
            }
            const arr = listMember.concat(this.data.groupInfo.uids);
            listMember = arr.filter((el, i, a) => i === a.indexOf(el));
            this.chatService.updateMemberGroup(this.data.groupInfo, this.data.groupInfo.createAt, listMember, this.data.messageInfo);
        }
    }

    createListMember() {
        const suggestedUsers = this.addMemberForm.get('suggestedUsers').value.filter(item => item.attend === true);
        const users = this.addMemberForm.get('users').value.filter(item => item.attend === true);
        const listMember = suggestedUsers.concat(users);
        this.getListMemberNotDuplicated(listMember, 'uid');
        this.addMemberForm.removeControl('suggestedUsers');
        this.addMemberForm.removeControl('users');
    }

    getListMemberNotDuplicated(arr, comp) {
        const unique = arr
            .map(e => e[comp])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => arr[e])
            .map(e => arr[e]);
        this.addMemberForm.get('members').patchValue(unique);
    }

    addChatId() {
        const idChat = this.route.snapshot['_urlSegment'].children.primary.children.chatDetail.segments[0].path;
        this.addMemberForm.addControl('idChat', new FormControl());
        this.addMemberForm.controls.idChat.patchValue(idChat);
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
