import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { ToolChatSharedLibsModule, ToolChatSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PopupSettingComponent } from 'app/modules/dashboard/components/popup-setting/popup-setting.component';
import { PopupCreateInvididualChatComponent } from 'app/modules/dashboard/components/popup-create-invididual-chat/popup-create-invididual-chat.component';
import { PopupCreateGroupChatComponent } from 'app/modules/dashboard/components/popup-create-group-chat/popup-create-group-chat.component';
import { PopupLogoutComponent } from 'app/modules/dashboard/components/popup-logout/popup-logout.component';

@NgModule({
    imports: [ToolChatSharedLibsModule, ToolChatSharedCommonModule, SimpleNotificationsModule.forRoot()],
    declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [
        JhiLoginModalComponent,
        PopupSettingComponent,
        PopupCreateInvididualChatComponent,
        PopupCreateGroupChatComponent,
        PopupLogoutComponent
    ],
    exports: [ToolChatSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToolChatSharedModule {
    static forRoot() {
        return {
            ngModule: ToolChatSharedModule
        };
    }
}
