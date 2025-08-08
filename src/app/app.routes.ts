import { Routes } from '@angular/router';
import {MovieList} from './components/movie-list/movie-list';
import {Login} from './components/login/login';
import {UserResolver} from './resolvers/user.resolver';

export const appRoutes: Routes = [
  {
    path: '',
    component: MovieList
  },
  {
    path:'login',
    component:Login,
    resolve: {
      user:UserResolver
    }
  }
];
