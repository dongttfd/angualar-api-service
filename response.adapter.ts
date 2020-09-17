import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, mergeMap } from 'rxjs/operators';
import { BaseResponse } from 'src/app/shared/models';

@Injectable({
    providedIn: 'root'
})

export class ResponseAdapter<T> {
    handle(response: Observable<T>): Observable<T> {
        return response.pipe(
            mergeMap(resp => of(resp as unknown as T)),
            catchError(error => {
                const responseError = {
                    code: 500,
                    message: 'Unknow error at server'
                } as BaseResponse;

                if (error.error instanceof ErrorEvent) {
                    // Client-side errors
                    responseError.message = `Error: ${error.error.message}`;
                }

                if (error instanceof HttpErrorResponse) {
                    // Server-side errors
                    responseError.code = error.status;
                    responseError.message = error.statusText;
                }

                return throwError(responseError);
            })
        );
    }
}
