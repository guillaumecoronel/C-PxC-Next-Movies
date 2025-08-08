import { Routes } from '@angular/router';
import {MovieList} from './components/movie-list/movie-list';

export const appRoutes: Routes = [
  {
    path: '',
    component: MovieList
  }
];
