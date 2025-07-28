import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OmdbMovie, SupaBaseMovie} from '../../models/movie.model';

@Component({
  standalone: true,
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCard {
  @Input() movie!: SupaBaseMovie;
  @Output() selected = new EventEmitter<SupaBaseMovie>();

  selectMovie(): void {
    this.selected.emit(this.movie);
  }
}
