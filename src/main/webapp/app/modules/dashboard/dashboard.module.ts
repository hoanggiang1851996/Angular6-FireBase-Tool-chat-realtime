import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { PopupSettingComponent } from './components/popup-setting/popup-setting.component';
import { PopupLogoutComponent } from './components/popup-logout/popup-logout.component';
import { PopupCreateInvididualChatComponent } from './components/popup-create-invididual-chat/popup-create-invididual-chat.component';
import { PopupCreateGroupChatComponent } from './components/popup-create-group-chat/popup-create-group-chat.component';
import { ChatDetailComponent } from './components/chat-detail/chat-detail.component';
import { RecentChatsComponent } from './components/recent-chats/recent-chats.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactsComponent } from './components/contacts/contacts.component';
import { PopupChangePasswordComponent } from './components/popup-change-password/popup-change-password.component';
import { ToolChatSharedCommonModule } from 'app/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupAddContactsComponent } from './components/popup-add-contacts/popup-add-contacts.component';
import { PopupConfirmDeleteMessageComponent } from './components/popup-confirm-delete-message/popup-confirm-delete-message.component';
import { PopupAddMemberComponent } from './components/popup-add-member/popup-add-member.component';
import { PopupEditGroupComponent } from 'app/modules/dashboard/components/popup-edit-group/popup-edit-group.component';

@NgModule({
    declarations: [
        DashboardComponent,
        SidebarComponent,
        HomeComponent,
        PopupSettingComponent,
        PopupLogoutComponent,
        PopupCreateInvididualChatComponent,
        PopupCreateGroupChatComponent,
        ChatDetailComponent,
        RecentChatsComponent,
        ContactsComponent,
        PopupChangePasswordComponent,
        PopupAddContactsComponent,
        PopupConfirmDeleteMessageComponent,
        PopupAddMemberComponent,
        PopupEditGroupComponent
    ],
    imports: [CommonModule, DashboardRoutingModule, NgbModule, ToolChatSharedCommonModule, ReactiveFormsModule, FormsModule],
    entryComponents: [
        PopupChangePasswordComponent,
        PopupConfirmDeleteMessageComponent,
        PopupAddContactsComponent,
        PopupAddMemberComponent,
        PopupEditGroupComponent
    ]
})
export class DashboardModule {}
