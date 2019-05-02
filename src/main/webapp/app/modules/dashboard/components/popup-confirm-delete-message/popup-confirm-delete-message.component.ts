import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatsService } from 'app/modules/dashboard/services/chats.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'jhi-popup-confirm-delete-message',
    templateUrl: './popup-confirm-delete-message.component.html',
    styleUrls: ['popup-confirm-delete.scss']
})
export class PopupConfirmDeleteMessageComponent implements OnInit {
    @Input() data: any;
    checkDeleteMessage = true;

    constructor(
        public activeModal: NgbActiveModal,
        private chatsService: ChatsService,
        private notificationsService: NotificationsService
    ) {}

    deleteMessage() {
        this.chatsService.deleteMessage(this.data.uids, this.data.id, this.data.idMess);
        this.activeModal.close();
    }

    closePopupDeleteMessage(): void {
        this.activeModal.close();
    }

    ngOnInit() {}
}
