import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/core/services/auth.service';

@Component({
    selector: 'jhi-popup-logout',
    templateUrl: './popup-logout.component.html',
    styleUrls: ['./index.scss']
})
export class PopupLogoutComponent implements OnInit {
    constructor(private route: Router, public activeModal: NgbActiveModal, private authService: AuthService) {}

    logOut() {
        this.authService.signOut();
        this.activeModal.close();
    }

    ngOnInit() {}
}
