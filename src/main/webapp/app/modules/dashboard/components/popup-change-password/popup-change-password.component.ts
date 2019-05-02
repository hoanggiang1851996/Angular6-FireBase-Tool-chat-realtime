import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'app/shared/validator/confirm-password.validator';

@Component({
    selector: 'jhi-popup-change-password',
    templateUrl: './popup-change-password.component.html',
    styles: []
})
export class PopupChangePasswordComponent implements OnInit {
    minLengthPassword = 6;
    modalService: NgbModal;
    changePasswordForm = this.fb.group(
        {
            current_password: new FormControl('', [Validators.required, Validators.minLength(this.minLengthPassword)]),
            password: new FormControl('', [Validators.required, Validators.minLength(this.minLengthPassword)]),
            confirm_password: new FormControl('', [Validators.required, Validators.minLength(this.minLengthPassword)])
        },
        {
            validator: ConfirmPasswordValidator.MatchPassword
        }
    );

    constructor(public activeModal: NgbActiveModal, private notificationsService: NotificationsService, private fb: FormBuilder) {}

    savePassWord() {
        this.activeModal.close();
        this.notificationsService.success('Success', 'Change successfully');
    }

    ngOnInit() {}

    open(content) {
        this.modalService.open(content);
    }

    onSubmit() {
        console.warn(this.changePasswordForm.value);
    }
}
