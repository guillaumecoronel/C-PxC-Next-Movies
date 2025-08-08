import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OmdbMovie, SupaBaseMovie} from '../../models/movie.model';
import {DatePipe} from '@angular/common';
import {User} from '@supabase/supabase-js';

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

  public hoveringDelete: boolean = false;

  selectMovie(): void {
    this.selected.emit(this.movie);
  }

  deleteMovie():void {
    this.deletedMovie.emit(this.movie);
  }
}
