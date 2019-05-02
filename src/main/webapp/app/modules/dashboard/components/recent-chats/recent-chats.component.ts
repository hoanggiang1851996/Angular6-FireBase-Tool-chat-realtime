import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChatsService } from 'app/modules/dashboard/services/chats.service';
import { OpenPopupService } from 'app/shared/services/open-popup.service';
import { PopupCreateInvididualChatComponent } from 'app/modules/dashboard/components/popup-create-invididual-chat/popup-create-invididual-chat.component';
import { PopupCreateGroupChatComponent } from 'app/modules/dashboard/components/popup-create-group-chat/popup-create-group-chat.component';
import { CONFIG } from 'app/core/config/config';
import { ActivatedRoute } from '@angular/router';
import { StatusUserService } from 'app/modules/dashboard/services/status-user.service';

@Component({
    selector: 'jhi-recent-chats',
    templateUrl: './recent-chats.component.html',
    styleUrls: ['recent-chats.scss']
})
export class RecentChatsComponent implements OnInit, OnChanges {
    @Input() childSearchData: any;
    recentChats: any = [];
    stateHandle = CONFIG;
    arrayRecentChats = [];
    chatId;
    statusUsers = [];
    messages = [];

    constructor(
        private chatsService: ChatsService,
        private openPopup: OpenPopupService,
        private route: ActivatedRoute,
        private statusUserService: StatusUserService
    ) {
        this.getRecentChats();
    }

    getRecentChats(): void {
        const user = JSON.parse(localStorage.getItem('user'));
        this.showRecentChats(user.uid);
    }

    showRecentChats(uid) {
        this.chatsService.getRecentChat(uid).subscribe(recentChats => {
            this.recentChats = recentChats;
            this.arrayRecentChats.push(recentChats);
            this.getLastMessage();
            this.getStatusUser();
        });
    }

    searchRecentChats(): void {
        this.recentChats = this.arrayRecentChats[0].filter(x => x.name.toLowerCase().indexOf(this.childSearchData.toLowerCase()) !== -1);
    }

    openNewInvididualChat() {
        this.openPopup.openComponent(PopupCreateInvididualChatComponent as Component, null, {
            centered: true,
            size: 'md'
        });
    }

    getLastMessage() {
        const uid = JSON.parse(localStorage.getItem('user')).uid;
        for (let i = 0; i < this.recentChats.length; i++) {
            this.chatsService.getMessages(uid, String(this.recentChats[i].createAt)).subscribe(messages => {
                if (messages[0] === undefined) {
                    this.messages[i] = [{ content: '' }];
                } else {
                    this.messages[i] = messages;
                }
            });
        }
    }

    openNewGroupChat() {
        this.openPopup.openComponent(PopupCreateGroupChatComponent as Component, null, { centered: true, size: 'md' });
    }

    ngOnInit() {
        this.chatId = this.route.snapshot.paramMap.get('id');
    }

    getStatusUser() {
        for (let i = 0; i < this.recentChats.length; i++) {
            const partner = this.recentChats[i].uids.filter(x => ![JSON.parse(localStorage.getItem('user')).uid].includes(x));
            this.statusUserService.getStatusUser(partner).subscribe((res: any) => {
                if (res === undefined) {
                    this.statusUsers[i] = true;
                } else {
                    this.statusUsers[i] = res.online;
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.searchRecentChats();
    }
}
