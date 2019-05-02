import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EditGroupService } from 'app/modules/dashboard/services/edit-group.service';
import { error } from 'util';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'jhi-popup-edit-group',
    templateUrl: './popup-edit-group.component.html',
    styleUrls: ['style.scss']
})
export class PopupEditGroupComponent implements OnInit {
    groupDataUserList = [];
    groupDataList = [];

    constructor(public activeModal: NgbActiveModal, private editGroupService: EditGroupService) {}

    ngOnInit() {
        this.getDataGroupEdit();
        this.getDataGroup();
    }

    getDataGroupEdit() {
        this.editGroupService.getListDataGroup().subscribe((data: any) => (this.groupDataUserList = data));
    }

    getDataGroup() {
        this.editGroupService.getDataGroup().subscribe((data: any) => (this.groupDataList = data));
    }

    addMemberToGroup() {
        console.error('1');
    }

    removeMember(id) {
        this.editGroupService.removeUserOutGroup(id).subscribe((data: any) => {
            if (data !== undefined) {
                this.getDataGroupEdit();
            }
        });
    }
}
