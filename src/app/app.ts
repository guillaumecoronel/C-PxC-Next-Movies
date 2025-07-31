import {Component, ElementRef, HostListener, OnInit, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {OmdbMovie, SupaBaseMovie} from './models/movie.model';
import {MovieService} from './services/movie.service';
import {MovieCard} from './components/movie-card/movie-card';
import {SearchDialog} from './components/search-dialog/search-dialog';
import {NgOptimizedImage} from '@angular/common';
import {SupabaseService} from './services/supabase.service';
import {FormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSelectModule} from '@angular/material/select';
import {DetailsDialog} from './components/details-dialog/details-dialog';

export const MONTHS_FR = [
  { id: 0, label: 'Janvier' },
  { id: 1, label: 'Février' },
  { id: 2, label: 'Mars' },
  { id: 3, label: 'Avril' },
  { id: 4, label: 'Mai' },
  { id: 5, label: 'Juin' },
  { id: 6, label: 'Juillet' },
  { id: 7, label: 'Août' },
  { id: 8, label: 'Septembre' },
  { id: 9, label: 'Octobre' },
  { id: 10, label: 'Novembre' },
  { id: 11, label: 'Décembre' }
];

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    MovieCard,
    SearchDialog,
    FormsModule,
    MatBadgeModule,
    MatSelectModule,
    DetailsDialog
  ],
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('CPC-Next');

  movies: SupaBaseMovie[] = [];
  filteredMovies: SupaBaseMovie[] = [];
  showSearchDialog = false;
  showMovieDetails = false;
  showFilterDialog = false;
  selectedMovie: SupaBaseMovie| null = null;

  // Filter state
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  availableYears: number[] = [];
  availableMonth: {id: number,label:string}[] = MONTHS_FR;

  constructor(private supabaseService:SupabaseService) {
  }

  ngOnInit(): void {
    this.supabaseService.getMovies().then(results => {
      this.movies = results.data as SupaBaseMovie[];
      this.extractAvailableYears();
      this.filterMovies(this.selectedYear,this.selectedMonth)
    })
  }

  public onYearsChange(e : any) {
    this.filterMovies(this.selectedYear,this.selectedMonth)
  }

  public onMonthChange(e: any) {
    this.filterMovies(this.selectedYear,this.selectedMonth)
  }

  public filterMovies(year?:number, month?:number) {
    this.filteredMovies = this.movies.filter(movie => movie.year === year?.toString())
    if(month != undefined && month > -1) {
      this.filteredMovies = this.filteredMovies.filter(movie => {
        const temp:Date = new Date(movie.released)
        if(temp.getMonth() === Number(month)) {
          return true;
        }
        return false;
      })
    }
    this.filteredMovies.sort((a, b) => new Date(a.released).getTime() - new Date(b.released).getTime());
  }

  public onDeleteMovie(movie: SupaBaseMovie) {
    this.supabaseService.deleteMovie(movie.id!).then(result => {
      this.movies.splice(this.movies.indexOf(movie), 1)
      this.extractAvailableYears();
      this.filterMovies(this.selectedYear,this.selectedMonth);
    })
  }

  public onCloseDetailsDialog() {
    this.showMovieDetails = false;
  }

  public openSearchDialog(){
    this.showSearchDialog = true;
  }

  public closeSearchDialog() {
    this.showSearchDialog = false;
  }

  public searchDialogComplete(om:SupaBaseMovie | null) {
    this.closeSearchDialog();
    if(om && !this.movies.find(m => m.imdbID === om.imdbID)) {
      this.supabaseService.addMovie(om).then(reponse => {
        this.movies.push(reponse.data![0] as SupaBaseMovie)
        this.extractAvailableYears();
        this.filterMovies(this.selectedYear,this.selectedMonth)
      })
    }
  }

  private extractAvailableYears() {
    const years = this.movies
      .map(m => parseInt(m.year))
      .filter(year => !isNaN(year))
      .sort((a, b) => b - a);

    this.availableYears = [...new Set(years)];

    if(!this.availableYears.find(y => y == this.selectedYear) && this.availableYears.length > 0){
      this.selectedYear = this.availableYears[0]
    }
  }

  public getMoviesPerYear(y: number) {
    return this.movies.filter(m => m.year === y.toString()).length
  }

  public getMoviesPerYearAndMonth(y:number,m: number) {
    return this.movies.filter(mo => {
      const temp:Date = new Date(mo.released)
      return temp.getMonth()===m && temp.getFullYear()===y
    }).length
  }

  public getMonthForId(id:number){
    return this.availableMonth.find(m => m.id === id)
  }

  public onSelectMovie(m: SupaBaseMovie) {
    this.selectedMovie = m;
    this.showMovieDetails = true;
  }

}
