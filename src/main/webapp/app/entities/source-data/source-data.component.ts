import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, JhiLanguageService, AlertService } from 'ng-jhipster';

import { SourceData } from './source-data.model';
import { SourceDataService } from './source-data.service';
import { ITEMS_PER_PAGE } from '../../shared';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { PagingParams } from '../../shared/commons';

@Component({
    selector: 'jhi-source-data',
    templateUrl: './source-data.component.html'
})
export class SourceDataComponent implements OnInit, OnDestroy {
    pagingParams$: Observable<PagingParams>;

    sourceData: SourceData[];
    eventSubscriber: Subscription;
    itemsPerPage: number;
    links: any;
    page: any;
    predicate: any;
    queryCount: any;
    ascending: any;
    totalItems: number;
    routeData: any;
    previousPage: any;
    constructor(
        private jhiLanguageService: JhiLanguageService,
        private sourceDataService: SourceDataService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private parseLinks: ParseLinks,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.sourceData = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.pagingParams$ = this.activatedRoute.data.map<any, PagingParams>(data => {
            const fallback = { page: 1, predicate: 'id', ascending: true };
            return data['pagingParams'] || fallback;
        });
        this.routeData = this.pagingParams$.subscribe(params => {
            this.page = params.page;
            this.previousPage = params.page;
            this.ascending = params.ascending;
            this.predicate = params.predicate;
        });
        this.jhiLanguageService.setLocations(['sourceData', 'processingState']);
    }

    loadAll() {
        this.sourceDataService.query(
            {
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            }
        ).subscribe(
            (res: HttpResponse<SourceData[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.registerChangeInSourceData();

        this.pagingParams$.subscribe(() => {
            this.loadAll();
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.routeData.unsubscribe();
    }

    trackId(index: number, item: SourceData) {
        return item.id;
    }
    registerChangeInSourceData() {
        this.eventSubscriber = this.eventManager.subscribe('sourceDataListModification', () => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    sort() {
        const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        this.sourceData = data;
    }

    loadPage(page) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/source-data'], { queryParams:
            {
                page: this.page,
                sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }
}
