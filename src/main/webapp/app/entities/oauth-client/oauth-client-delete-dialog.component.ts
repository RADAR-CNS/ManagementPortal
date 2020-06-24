import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { OAuthClientPopupService } from './oauth-client-popup.service';

import { OAuthClient } from './oauth-client.model';
import { OAuthClientService } from './oauth-client.service';

@Component({
    selector: 'jhi-oauth-client-delete-dialog',
    templateUrl: './oauth-client-delete-dialog.component.html',
})
export class OAuthClientDeleteDialogComponent implements OnInit {

    client: OAuthClient;
    protectedClient: boolean;

    constructor(
            private jhiLanguageService: JhiLanguageService,
            private oauthClientService: OAuthClientService,
            public activeModal: NgbActiveModal,
            private eventManager: JhiEventManager,
    ) {}

    ngOnInit() {
        this.protectedClient = this.client.additionalInformation['protected'] === 'true';
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(clientId: string) {
        this.oauthClientService.delete(clientId).subscribe(() => {
            this.eventManager.broadcast({
                name: 'oauthClientListModification',
                content: 'Deleted OAuth Client',
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-oauth-client-delete-popup',
    template: '',
})
export class OAuthClientDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
            private route: ActivatedRoute,
            private oauthClientPopupService: OAuthClientPopupService,
    ) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.oauthClientPopupService
                    .open(OAuthClientDeleteDialogComponent, params['clientId']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
