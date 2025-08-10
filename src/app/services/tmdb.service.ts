import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable, of} from 'rxjs';
import {OmdbMovie, SupaBaseMovie} from '../models/movie.model';
import {Injectable} from '@angular/core';
import {MovieDetail, MovieVideo, MovieVideoResponse, tmdbImages} from '../models/tmdb.model';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDhkMTk3MDRjNzkwODM1N2M5ZTA1ZGFkOTI2ZWNmNSIsIm5iZiI6MTc1Mzk0OTk5NS43ODksInN1YiI6IjY4OGIyNzJiYjllNWM0MTNiNjUxZDJkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6SFoK8aagQ446Tl4VhRwKVeWKC7OcuvYk-ecaa3aYLs';
  private apiUrl = 'https://api.themoviedb.org/3/movie/';
  private imageUrl:string = 'https://image.tmdb.org/t/p/w300/'

  constructor(private http: HttpClient) {}

  getTmdbImages(imdbId:string): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`,
    });
    // return this.http.get<tmdbImages>(`${this.apiUrl}${imdbId}/images?language=en,fr`,{headers}).pipe(
    return this.http.get<tmdbImages>(`${this.apiUrl}${imdbId}/images`,{headers}).pipe(
      map(ti => {
        return ti.posters.map(p => {
          return this.imageUrl+p.file_path
        })
      })
    );
  }

  getMovieDetails(imdbId:string): Observable<MovieDetail> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`,
    });
    // return this.http.get<tmdbImages>(`${this.apiUrl}${imdbId}/images?language=en,fr`,{headers}).pipe(
    return this.http.get<MovieDetail>(`${this.apiUrl}${imdbId}?language=fr`,{headers}).pipe(
      map(e => {
        e.backdrop_path = this.imageUrl + e.backdrop_path
        return e;
      })
    );
  }

  getTmdbLastYoutubeTrailer(imdbId:string): Observable<MovieVideo> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`,
    });
    // return this.http.get<tmdbImages>(`${this.apiUrl}${imdbId}/images?language=en,fr`,{headers}).pipe(
    return this.http.get<MovieVideoResponse>(`${this.apiUrl}${imdbId}/videos?language=fr`,{headers}).pipe(
      map(res =>
        res.results
          .filter(v => v.site === 'YouTube' && v.type === 'Trailer')
          .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0] || null
      )
    );
  }
}
