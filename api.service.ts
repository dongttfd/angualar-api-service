import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParamsBuilder, ListResponse } from 'src/app/shared/models';
import { ResponseAdapter } from 'src/app/core/adapter/response.adapter';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export abstract class ApiService<T> {
    private readonly baseUrl = environment.baseApiUrl;
    private readonly apiVersion = environment.apiVersion;

    protected url: string;
    protected items$: Observable<T[]>;
    protected items: T[];

    constructor(public httpClient: HttpClient) {
        this.items$ = this.getItems()
            .pipe(
                tap(items => this.items = items)
            );
    }

    abstract getItems(): Observable<T[]>;

    get keyObject(): string {
        return 'id';
    }

    get listItems(): Observable<T[]> {
        return this.items$;
    }

    add(item: T): Observable<T[]> {
        this.items.push(item);

        return this.items$ = of(this.items);
    }

    edit(item: T): Observable<T[]> {
        this.items.forEach((e, i) => {
            if (e[this.keyObject] === item[this.keyObject]) {
                this.items[i] = { ...item };
                return;
            }
        });

        return this.items$ = of(this.items);
    }

    delete(id: string): Observable<T[]> {
        this.items = this.items.filter(e => e[this.keyObject] !== id);

        return this.items$ = of(this.items);
    }

    createUrl(uri: string, params?: ParamsBuilder): string {
        return this.url = [
            this.baseUrl,
            this.apiVersion,
            uri,
        ].join('/')
            + (params ? `?${params.toString()}` : '');
    }

    castResponse(response: Observable<T>): Observable<T> {
        return new ResponseAdapter<T>().handle(response);
    }

    castListResponse(response: Observable<ListResponse<T>>): Observable<T[]> {
        return new ResponseAdapter<ListResponse<T>>().handle(response).pipe(map(res => res.data));
    }
}
