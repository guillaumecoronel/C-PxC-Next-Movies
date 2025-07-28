import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {OmdbMovie, SupaBaseMovie} from './models/movie.model';
import {MovieService} from './services/movie.service';
import {MovieCard} from './components/movie-card/movie-card';
import {SearchDialog} from './components/search-dialog/search-dialog';
import {NgOptimizedImage} from '@angular/common';
import {SupabaseService} from './services/supabase.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MovieCard,
    SearchDialog,
    NgOptimizedImage
  ],
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('CPC-Next');

  movies: SupaBaseMovie[] = [];
  filteredMovies: SupaBaseMovie[] = [];
  categories: string[] = [];
  activeCategory = 'All';
  showSearchDialog = false;
  showMovieDetails = false;
  showFilterDialog = false;
  searchQuery = '';
  searchResults: SupaBaseMovie[] = [];
  selectedMovie: SupaBaseMovie | null = null;

  // Filter state
  yearFilter = {from: null, to: null};
  ratingFilter = {min: null, max: null};
  genreFilter: string[] = [];
  availableGenres: string[] = [];

  constructor(private movieService: MovieService, private supabaseService:SupabaseService) {
    // this.movies = this.movieService.getMovies();
    this.categories = this.movieService.getCategories();
    this.availableGenres = this.movieService.getAvailableGenres();
    // this.updateFilteredMovies();
  }

  ngOnInit(): void {
    this.supabaseService.getMovies().then(results => {
      this.movies = results.data as SupaBaseMovie[];
    })
  }

  public openSearchDialog(){
    this.showSearchDialog = true;
  }

  public openFilterDialog(){
    this.showFilterDialog = true;
  }

  public closeSearchDialog() {
    this.showSearchDialog = false;
  }
  public searchDialogComplete(om:SupaBaseMovie | null) {
    this.closeSearchDialog();
    if(om && !this.movies.find(m => m.imdbID === om.imdbID)) {
      this.movies.push(om)
      this.supabaseService.addMovie(om).then()
    }
  }

}
