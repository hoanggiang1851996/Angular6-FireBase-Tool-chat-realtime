import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenPopupService } from 'app/shared/services/open-popup.service';
import { PopupSettingComponent } from 'app/modules/dashboard/components/popup-setting/popup-setting.component';
import { NotificationsService } from 'angular2-notifications';
import { PopupLogoutComponent } from 'app/modules/dashboard/components/popup-logout/popup-logout.component';
import { UsersService } from 'app/modules/dashboard/services/users.service';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['sidebar.scss']
})
export class SidebarComponent implements OnInit {
    searchValues = '';
    user: any = new Object();

    constructor(
        private route: Router,
        private openPopup: OpenPopupService,
        private notificationsService: NotificationsService,
        private usersService: UsersService
    ) {}

    logOut() {
        this.route.navigate(['/login']);
        this.notificationsService.success('Success', 'Logout successfully');
    }

    onKey(event: any) {
        this.searchValues = event.target.value;
    }

    open() {
        this.openPopup.openComponent(PopupSettingComponent as Component, null, { centered: true });
    }

    openPopupLogout() {
        this.openPopup.openComponent(PopupLogoutComponent as Component, null, { centered: true });
    }

    getInfoUser(id) {
        this.usersService.getUser(id).subscribe(res => {
            this.user = res;
        });
    }

    showUserInfo() {
        const id = JSON.parse(localStorage.getItem('user'));
        this.getInfoUser(id);
    }

    initUsers() {
        this.usersService.getUsers().subscribe();
    }

    ngOnInit() {
        this.showUserInfo();
        this.initUsers();
    }
}
