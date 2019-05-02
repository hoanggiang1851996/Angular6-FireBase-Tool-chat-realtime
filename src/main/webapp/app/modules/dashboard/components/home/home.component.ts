import { Component, OnInit } from '@angular/core';
import { OpenPopupService } from 'app/shared/services/open-popup.service';
import { PopupCreateInvididualChatComponent } from 'app/modules/dashboard/components/popup-create-invididual-chat/popup-create-invididual-chat.component';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    user: any = {};
    constructor(private openPopupServices: OpenPopupService) {}

    openPopupConversation() {
        this.openPopupServices.openComponent(PopupCreateInvididualChatComponent as Component, null, { centered: true, size: 'md' });
    }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('user'));
        if (this.user.displayName === null) {
            this.user.displayName = this.user.email.substring(0, this.user.email.lastIndexOf('@'));
            this.user.photoURL =
                'https://institutogoldenprana.com.br/wp-content/uploads/2015/08/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg';
        }
    }
}
