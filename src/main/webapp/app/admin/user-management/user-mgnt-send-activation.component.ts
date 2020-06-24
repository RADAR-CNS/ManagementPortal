import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { User, UserService } from '../../shared';
import { UserModalService } from './user-modal.service';

@Component({
    selector: 'jhi-user-mgnt-send-activation-dialog',
    templateUrl: './user-mgnt-send-activation.component.html',
})
export class UserSendActivationLinkDialogComponent {

    user: User;

    constructor(
            private userService: UserService,
            public activeModal: NgbActiveModal,
            private eventManager: JhiEventManager,
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    sendActivationLink(login) {
        this.userService.sendActivation(login).subscribe(() => {
            this.eventManager.broadcast({
                name: 'userListModification',
                content: 'Sent activation link a user',
            });
            this.activeModal.dismiss(true);
        });
    }

}

@Component({
    selector: 'jhi-user-send-activation-dialog',
    template: '',
})
export class UserSendActivationLinkComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
            private route: ActivatedRoute,
            private userModalService: UserModalService,
    ) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.userModalService.open(UserSendActivationLinkDialogComponent, params['login']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
