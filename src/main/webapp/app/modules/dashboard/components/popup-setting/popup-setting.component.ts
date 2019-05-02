import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OpenPopupService } from 'app/shared/services/open-popup.service';
import { PopupChangePasswordComponent } from 'app/modules/dashboard/components/popup-change-password/popup-change-password.component';
import { UserSettingService } from 'app/modules/dashboard/services/user-setting.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'jhi-popup-setting',
    templateUrl: './popup-setting.component.html',
    styleUrls: ['./popup-setting.scss']
})
export class PopupSettingComponent implements OnInit {
    @Input() closeModal: string;
    isChecked = false;
    sateTabs = {
        isTabSetting: true
    };
    defaultContentSelect = 'All languages';
    userInfoList = [];
    currentOrientation = 'vertical';

    settingProfileForm = new FormGroup({
        isTranslateConversations: new FormControl(),
        displayContentOption: new FormControl()
    });

    constructor(
        public activeModal: NgbActiveModal,
        private openPopup: OpenPopupService,
        private userSettingServices: UserSettingService,
        private notificationServices: NotificationsService
    ) {}

    ngOnInit() {
        this.showUserInfo();
    }

    showUserInfo() {
        this.userSettingServices.getSettingUser().subscribe(data => (this.userInfoList = data));
    }

    openTabSetting() {
        this.sateTabs['isTabSetting'] = true;
        this.sateTabs['isTabConversations'] = false;
    }

    openTabConversations() {
        this.sateTabs['isTabSetting'] = false;
        this.sateTabs['isTabConversations'] = true;
    }

    openPopupChangePassword() {
        const modal = this.openPopup.openComponent(PopupChangePasswordComponent as Component, null, { centered: true });
    }

    checkValue() {
        this.isChecked = !this.isChecked;
    }

    onSubmit() {
        this.notificationServices.success('Success', 'Save setting success', null);
        this.activeModal.close();
    }
}
