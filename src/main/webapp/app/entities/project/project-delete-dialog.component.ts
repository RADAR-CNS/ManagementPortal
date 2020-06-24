import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { ProjectPopupService } from './project-popup.service';

import { Project, ProjectService } from '../../shared';

@Component({
    selector: 'jhi-project-delete-dialog',
    templateUrl: './project-delete-dialog.component.html',
})
export class ProjectDeleteDialogComponent {

    project: Project;

    constructor(
            private projectService: ProjectService,
            public activeModal: NgbActiveModal,
            private eventManager: JhiEventManager,
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(projectName: string) {
        this.projectService.delete(projectName).subscribe(() => {
            this.eventManager.broadcast({
                name: 'projectListModification',
                content: 'Deleted an project',
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-project-delete-popup',
    template: '',
})
export class ProjectDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
            private route: ActivatedRoute,
            private projectPopupService: ProjectPopupService,
    ) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.projectPopupService
                    .open(ProjectDeleteDialogComponent, params['projectName']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
