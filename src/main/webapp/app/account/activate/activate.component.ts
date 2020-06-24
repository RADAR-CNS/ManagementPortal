import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalService } from '../../shared';

import { Activate } from './activate.service';

@Component({
    selector: 'jhi-activate',
    templateUrl: './activate.component.html',
})
export class ActivateComponent implements OnInit {
    error: string;
    success: string;
    modalRef: NgbModalRef;

    constructor(
            private activate: Activate,
            private loginModalService: LoginModalService,
            private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.activate.get(params['key']).subscribe(() => {
                this.error = null;
                this.success = 'OK';
            }, () => {
                this.success = null;
                this.error = 'ERROR';
            });
        });
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
