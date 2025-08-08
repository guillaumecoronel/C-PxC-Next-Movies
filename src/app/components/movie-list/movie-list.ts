import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {MovieCard} from '../movie-card/movie-card';
import {SearchDialog} from '../search-dialog/search-dialog';
import {FormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSelectModule} from '@angular/material/select';
import {Platform} from '@ionic/angular';
import { App as CapApp } from '@capacitor/app';
import {DetailsDialog} from '../details-dialog/details-dialog';
import {SupaBaseMovie} from '../../models/movie.model';
import {SupabaseService} from '../../services/supabase.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {User} from '@supabase/supabase-js';

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
  selector: 'app-movie-list',
  imports: [
    MovieCard,
    SearchDialog,
    FormsModule,
    MatBadgeModule,
    MatSelectModule,
    DetailsDialog,
  ],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss'
})
export class MovieList implements OnInit,OnDestroy {
  private backListener:any;

  movies: SupaBaseMovie[] = [];
  filteredMovies: SupaBaseMovie[] = [];
  showSearchDialog = false;
  showMovieDetails = false;
  selectedMovie: SupaBaseMovie| null = null;

  public user: User | null = null;

  // Filter state
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  availableYears: number[] = [];
  availableMonth: {id: number,label:string}[] = MONTHS_FR;

  constructor(private router: Router,private supabaseService:SupabaseService,private ngZone: NgZone,private platform: Platform) {
  }

  ngOnInit(): void {
    if(environment.mobile) {
      this.androidHandleBackButton();
    }

    this.supabaseService.getUser().then(e=>{
      this.user = e.data.user;
    });

    this.supabaseService.getMovies().then((results:any) => {
      this.movies = results.data as SupaBaseMovie[];
      this.extractAvailableYears();
      this.restoreFilter()
      this.filterMovies(this.selectedYear,this.selectedMonth)
    })
  }

  ngOnDestroy() {
    if(this.backListener) {
      this.backListener.remove();
    }
  }

  public onYearsChange(e : any) {
    this.filterMovies(this.selectedYear,this.selectedMonth)
  }

  public onMonthChange(e: any) {
    this.filterMovies(this.selectedYear,this.selectedMonth)
  }

  public onDblClick() {
    this.router.navigate(['login']);
  }


  public androidHandleBackButton(){
    this.platform.ready().then(() => {
      this.backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
        this.ngZone.run(() => {
          if(this.showMovieDetails) {
            this.showMovieDetails = false
          } else if(this.showSearchDialog){
            this.showSearchDialog = false
          } else {
            CapApp.minimizeApp();
          }
        });
      });
    });
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
    this.saveFilter();
  }

  public saveFilter() {
    const filters = {
      selectedYear: this.selectedYear,
      selectedMonth: this.selectedMonth,
    };
    localStorage.setItem('movieFilters', JSON.stringify(filters));
  }

  public restoreFilter() {
    const savedFilters = localStorage.getItem('movieFilters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      this.selectedYear = filters.selectedYear || null;
      this.selectedMonth = filters.selectedMonth || -1;
    }
  }

  public onDeleteMovie(movie: SupaBaseMovie) {
    this.supabaseService.deleteMovie(movie.id!).then((result:any) => {
      this.movies.splice(this.movies.indexOf(movie), 1)
      this.extractAvailableYears();
      this.filterMovies(this.selectedYear,this.selectedMonth);
    })
  }

  public onCloseDetailsDialog() {
    this.showMovieDetails = false;
    document.body.classList.remove('overflow-hidden');
  }

  public openSearchDialog(){
    this.showSearchDialog = true;
    document.body.classList.add('overflow-hidden');
  }

  public closeSearchDialog() {
    this.showSearchDialog = false;
    document.body.classList.remove('overflow-hidden');
  }

  public searchDialogComplete(om:SupaBaseMovie | null) {
    this.closeSearchDialog();
    if(om && !this.movies.find(m => m.imdbID === om.imdbID)) {
      this.supabaseService.addMovie(om).then((reponse:any) => {
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
    if(this.user) {
      this.selectedMovie = m;
      this.showMovieDetails = true;
      document.body.classList.add('overflow-hidden');
    }
  }

  protected readonly environment = environment;
}
