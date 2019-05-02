import { Component, OnInit } from '@angular/core';
import { ChatsService } from 'app/modules/dashboard/services/chats.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { OpenPopupService } from 'app/shared/services/open-popup.service';
import { PopupConfirmDeleteMessageComponent } from 'app/modules/dashboard/components/popup-confirm-delete-message/popup-confirm-delete-message.component';
import { PopupEditGroupComponent } from 'app/modules/dashboard/components/popup-edit-group/popup-edit-group.component';
import { PopupAddMemberComponent } from 'app/modules/dashboard/components/popup-add-member/popup-add-member.component';
import { CONFIG } from 'app/core/config/config';
import * as moment from 'moment';
import { StatusUserService } from 'app/modules/dashboard/services/status-user.service';

@Component({
    selector: 'jhi-chat-content',
    templateUrl: './chat-detail.component.html',
    styleUrls: ['chat-detail.scss']
})
export class ChatDetailComponent implements OnInit {
    chatDetail: any = {};
    messageDetail: any = null;
    newMessage = new FormControl('', Validators.required);
    editMessageFocus;
    isEditMessage = false;
    totalMember;
    chatId;
    paramsSubscription;
    eventEditMessage = false;
    tempIdMessage = '';
    expandedSearch = false;
    searchHistoryValues = '';
    stateHandle = CONFIG;
    statusUser = false;

    constructor(
        private chatsService: ChatsService,
        private route: ActivatedRoute,
        private router: Router,
        private notificationsService: NotificationsService,
        private openPopup: OpenPopupService,
        private statusUserService: StatusUserService
    ) {}

    getChatDetail() {
        const uid = JSON.parse(localStorage.getItem('user')).uid;
        this.chatsService.getChatDetail(uid, this.chatId).subscribe((chatDetail: any) => {
            this.chatDetail = chatDetail;
            this.totalMember = chatDetail.uids.length;
            this.checkStatusUser();
        });
    }

    getMessage() {
        const uid = JSON.parse(localStorage.getItem('user')).uid;
        this.chatsService.getMessages(uid, this.chatId).subscribe(messages => {
            this.messageDetail = messages;
            this.convertTimeCreateMessage(this.messageDetail);
        });
    }

    convertTimeCreateMessage(messages) {
        for (let i = 0; i < messages.length; i++) {
            messages[i].createAt = moment(messages[i].createAt).format('DD-MM-YYYY hh:mm A');
        }
    }

    async sendMessage() {
        const uids = this.chatDetail.uids;
        await this.chatsService.sendMessage(uids, this.chatId, this.newMessage.value);
        this.newMessage.reset();
    }

    editMessage(message) {
        this.editMessageFocus = message;
        this.isEditMessage = true;
        this.newMessage.patchValue(message.content);
    }

    async sendEditedMessage() {
        this.isEditMessage = false;
        const uids = this.chatDetail.uids;
        await this.chatsService.editMessage(uids, this.chatId, this.editMessageFocus.messageId, this.newMessage.value);
        this.newMessage.reset();
    }

    openPopupConfirmDeleteMessage(message): void {
        const uids = this.chatDetail.uids;
        this.openPopup.openComponent(
            PopupConfirmDeleteMessageComponent as Component,
            {
                uids,
                id: this.chatId,
                idMess: message.messageId
            },
            { centered: true }
        );
    }

    onKey(event: any): void {
        this.searchHistoryValues = event.target.value;
        this.searchMessage(this.searchHistoryValues);
    }

    searchMessage(searchValues): void {
        const idChat = this.route.snapshot.paramMap.get('id');
        // this.chatsService.searchMessage(idChat, searchValues).subscribe(result => {
        //     this.messageDetail = result;
        // });
    }

    addMember() {
        this.openPopup.openComponent(
            PopupAddMemberComponent as Component,
            { groupInfo: this.chatDetail, messageInfo: this.messageDetail },
            { centered: true, size: 'md' }
        );
    }

    openPopupEditGroupChat() {
        this.openPopup.openComponent(PopupEditGroupComponent as Component, null, { size: 'md', centered: true });
    }

    checkStatusUser() {
        this.statusUserService.getStatusUser(this.chatDetail.uids.pop()).subscribe((res: any) => (this.statusUser = res.online));
    }

    ngOnInit() {
        this.paramsSubscription = this.route.params.subscribe(params => {
            this.chatId = params.id;
            this.getChatDetail();
            this.getMessage();
        });
    }
}
