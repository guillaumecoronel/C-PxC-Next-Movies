import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, of} from 'rxjs';
import {OmdbMovie, SupaBaseMovie} from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = '3c074b48';
  private apiUrl = 'https://www.omdbapi.com/';

  constructor(private http: HttpClient) {}

  searchMovies(query: string,yearQuery: string): Observable<SupaBaseMovie|null> {
    if (!query) return of(null);
    return this.http.get<OmdbMovie>(`${this.apiUrl}?apikey=${this.apiKey}&t=${query}&y=${yearQuery}`).pipe(
      map(response => {
        return this.transformOmdbToSupabase(response)
      })
    );
  }

  private transformOmdbToSupabase(external: OmdbMovie): SupaBaseMovie {
    return {
      title: external.Title,
      year: external.Year,
      released: new Date(external.Released),
      poster: external.Poster,
      imdbID: external.imdbID
    };
  }

  private getMonthNumber(dateStr: string): number {
    const date = new Date(dateStr);
    return date.getMonth() ;
  }
}
