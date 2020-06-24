import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Source } from '../../shared/source/source.model';
import { SourceService } from '../../shared/source/source.service';

@Injectable()
export class GeneralSourcePopupService {
    private isOpen = false;

    constructor(
            private modalService: NgbModal,
            private router: Router,
            private sourceService: SourceService,
    ) {
    }

    open(component: any, sourceName?: string): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (sourceName) {
            this.sourceService.find(sourceName).subscribe((source) => {
                this.sourceModalRef(component, source);
            });
        } else {
            return this.sourceModalRef(component, new Source());
        }
    }

    sourceModalRef(component: any, source: Source): NgbModalRef {
        const modalRef = this.modalService.open(component, {size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.source = source;
        modalRef.result.then((result) => {
            this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
            this.isOpen = false;
        });
        return modalRef;
    }
}
