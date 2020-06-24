import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { PasswordResetInit } from './password-reset-init.service';

@Component({
    selector: 'jhi-password-reset-init',
    templateUrl: './password-reset-init.component.html',
})
export class PasswordResetInitComponent implements OnInit, AfterViewInit {
    error: string;
    errorEmailNotExists: string;
    resetAccount: any;
    success: string;
    @ViewChild('emailRef', {read: ElementRef}) emailRef: ElementRef;

    constructor(
            private passwordResetInit: PasswordResetInit,
    ) {}

    ngOnInit() {
        this.resetAccount = {};
    }

    ngAfterViewInit() {
        this.emailRef.nativeElement.focus();
    }

    requestReset() {
        this.error = null;
        this.errorEmailNotExists = null;

        this.passwordResetInit.save(this.resetAccount.email).subscribe(() => {
            this.success = 'OK';
        }, (response) => {
            this.success = null;
            if (response.status === 400 ) {
                this.errorEmailNotExists = 'ERROR';
            } else {
                this.error = 'ERROR';
            }
        });
    }
}
