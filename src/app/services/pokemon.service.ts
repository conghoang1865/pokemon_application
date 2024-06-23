import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  get() {
    this.http.get(
      `${environment.api_endpoint}`
    )
  }
  
}