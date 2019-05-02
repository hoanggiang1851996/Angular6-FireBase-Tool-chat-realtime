import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService } from 'app/modules/dashboard/services/contacts.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { ChatsService } from 'app/modules/dashboard/services/chats.service';
import { CONFIG } from 'app/core/config/config';
import { UsersService } from 'app/modules/dashboard/services/users.service';
import { StatusUserService } from 'app/modules/dashboard/services/status-user.service';

@Component({
    selector: 'jhi-popup-create-group-chat',
    templateUrl: './index.html',
    styleUrls: ['./index.scss']
})
export class PopupCreateGroupChatComponent implements OnInit {
    stateHandle = CONFIG;
    arrayUsers = [];
    arraySuggestedUsers = [];
    searchValue: string;
    statusUsers = [];

    createGroupForm = this.fb.group({
        group_avatar: new FormControl('', [Validators.required]),
        group_name: new FormControl('', [Validators.required]),
        translate: new FormControl(),
        searchValue: new FormControl(),
        suggestedUsers: this.fb.array([]),
        users: this.fb.array([])
    });

    userInfo(name?): FormGroup {
        return this.fb.group({
            uid: new FormControl(),
            photoURL: new FormControl(),
            displayName: new FormControl(),
            online: new FormControl(),
            status: new FormControl(),
            attend: new FormControl()
        });
    }

    constructor(
        public activeModal: NgbActiveModal,
        private contactsService: ContactsService,
        private fb: FormBuilder,
        private usersService: UsersService,
        private notificationsService: NotificationsService,
        private chatService: ChatsService,
        private statusUserService: StatusUserService
    ) {}

    getSuggestedUsers() {
        const uid = JSON.parse(localStorage.getItem('user')).uid;
        this.contactsService.getContacts(uid).subscribe(res => {
            this.addFormControl('suggestedUsers', res);
            this.arraySuggestedUsers.push(res);
            this.getStatusUsers(this.createGroupForm.controls.suggestedUsers.value);
        });
    }

    getUsers() {
        this.usersService.getUsers().subscribe(res => {
            this.addFormControl('users', res);
            this.arrayUsers.push(res);
        });
    }

    searchContacts() {
        const searchResSugUsers = this.arraySuggestedUsers[0].filter(
            x => x.displayName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
        );

        const searchResUsers = this.arrayUsers[0].filter(x => x.displayName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1);

        this.removeFormControl('suggestedUsers');
        this.addFormControl('suggestedUsers', searchResSugUsers);
        this.removeFormControl('users');
        this.addFormControl('users', searchResUsers);
    }

    addFormControl(formArray, res) {
        const array = <FormArray>this.createGroupForm.controls[`${formArray}`];
        for (const item of res) {
            array.push(this.userInfo(`${item}`));
            this.createGroupForm.patchValue({ [formArray]: res });
        }
    }

    removeFormControl(formArray) {
        const array = <FormArray>this.createGroupForm.controls[`${formArray}`];
        while (array.length !== 0) {
            array.removeAt(0);
        }
    }

    resetSearchBox() {
        this.createGroupForm.patchValue({ searchValue: '' });
        this.removeFormControl('suggestedUsers');
        this.getSuggestedUsers();
        this.removeFormControl('users');
        this.getUsers();
    }

    createChat() {
        this.createGroupForm.addControl('members', new FormControl());
        this.createGroupForm.removeControl('searchValue');
        this.createListMember();
        this.activeModal.close();
        this.notificationsService.success('Success', 'Create group successfully');
        this.requestCreateGroupChat(this.createGroupForm.value);
    }

    requestCreateGroupChat(groupInfo) {
        this.chatService.createGroupChat(groupInfo, null);
    }

    createListMember() {
        const suggestedUsers = this.createGroupForm.get('suggestedUsers').value.filter(item => item.attend === true);
        const users = this.createGroupForm.get('users').value.filter(item => item.attend === true);
        const listMember = suggestedUsers.concat(users);
        this.getListMemberNotDuplicated(listMember, 'uid');
        this.createGroupForm.removeControl('suggestedUsers');
        this.createGroupForm.removeControl('users');
    }

    getListMemberNotDuplicated(arr, comp) {
        const unique = arr
            .map(e => e[comp])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => arr[e])
            .map(e => arr[e]);
        this.createGroupForm.get('members').patchValue(unique);
    }

    importAvatarGroup(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (element: any) => {
                this.createGroupForm.patchValue({ group_avatar: element.target.result });
            };
        }
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
