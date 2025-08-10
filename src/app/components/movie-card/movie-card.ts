import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OmdbMovie, SupaBaseMovie} from '../../models/movie.model';
import {DatePipe} from '@angular/common';
import {User} from '@supabase/supabase-js';
import {formatStringForPlaceholder} from '../../utils/movie.utils';
import {environment} from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-movie-card',
  imports: [
    DatePipe
  ],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCard {
  @Input() movie!: SupaBaseMovie;
  @Input() user: User | null = null;
  @Output() selected = new EventEmitter<SupaBaseMovie>();
  @Output() deletedMovie = new EventEmitter<SupaBaseMovie>();
  @Output() updatePoster = new EventEmitter<SupaBaseMovie>();

  public hoveringDelete: boolean = false;

  selectMovie(): void {
    this.selected.emit(this.movie);
  }

  deleteMovie(e:MouseEvent):void {
    e.stopPropagation();
    this.deletedMovie.emit(this.movie);
  }

  public updateMoviePoster(e:MouseEvent):void {
    e.stopPropagation();
    this.updatePoster.emit(this.movie);
  }

  protected readonly formatStringForPlaceholder = formatStringForPlaceholder;
  protected readonly environment = environment;
}
