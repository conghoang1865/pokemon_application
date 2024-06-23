import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BaseResponse, Meta, PokemonDetail, PokemonItem, ResponseData, TypeData, types } from "../models/pokemon.model";
import { BehaviorSubject, Observable, catchError, map, of, pluck, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class Store {
    public _isLoading$ = new BehaviorSubject(true);

    isLoading$ = this._isLoading$.asObservable();

    private _meta$ = new BehaviorSubject<Meta>({
        "per_page": 10,
        "current_page": 1,
        "from": 1,
        "to": 751,
        "total": 751,
        "last_page": 1,
        "path": "https://api.vandvietnam.com/api/pokemon-api/pokemons"
    })

    meta$ = this._meta$.asObservable();


    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    private subject = new BehaviorSubject<PokemonItem[]>([]);

    pokemon$: Observable<PokemonItem[]> = this.subject.asObservable();

    getListPokemon(page: number = 1, pageSize: number, direction: string = 'asc', sortState: string = 'number', type?: number): Observable<PokemonItem[]> {
        const typeFilter = type !== undefined ? `&filter[type]=${type}` : '';

        this._isLoading$.next(true);
        const http$ = this.http.get<ResponseData>(
            `${environment.api_endpoint}/pokemons?page[number]=${page}${typeFilter}&page[size]=${pageSize / 10}0&sort=${direction === 'asc' ? '' : '-'}${sortState}`
        )

        return http$
            .pipe(
                tap((res) => {
                    console.log(res.meta)
                    this._meta$.next(res.meta)
                }),
                map((res) => res.data),
                tap(() => this._isLoading$.next(false)),
            )
    }

    getListTypeData(): Observable<TypeData[]> {
        return this.http.get<types>(
            `${environment.api_endpoint}/types`
        ).pipe(
            tap((res) => localStorage.setItem('types', JSON.stringify(res.data))),
            map((res) => res.data)
        )
    }

    getPokemonDetail(id: string): Observable<PokemonItem | undefined> {
        this._isLoading$.next(true);
        return this.http.get<PokemonDetail>(
            `${environment.api_endpoint}/pokemons/${id}`
        ).pipe(
            map(res => {
                switch (res.status) {
                    case 200:
                        return res.data;
                    case 404:
                        throwError('Error 404: Pokemon not found')
                            .pipe(catchError((err) => of(err)))
                }
            }),
            tap(() => this._isLoading$.next(false)),
        )
    }

    getPokemonSprite(id: string) {
        return `${environment.api_endpoint}/pokemons/${id}/sprite`
    }

}
