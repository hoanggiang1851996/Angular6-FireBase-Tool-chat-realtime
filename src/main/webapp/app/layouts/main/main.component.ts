import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./index.scss']
})
export class JhiMainComponent implements OnInit {
    public options = {
        position: ['top', 'right'],
        timeOut: 3000,
        lastOnBottom: true
    };
    constructor() {}

    ngOnInit() {}
}
