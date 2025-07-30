import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MovieService} from '../../services/movie.service';
import {OmdbMovie, SupaBaseMovie} from '../../models/movie.model';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-search-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule, MatInputModule
  ],
  templateUrl: './search-dialog.html',
  styleUrl: './search-dialog.scss'
})
export class SearchDialog {
  @Output() closeDialog = new EventEmitter<boolean>();
  @Output() searchDialogComplete = new EventEmitter<SupaBaseMovie |null>();

  public searchQuery: string = "";
  public yearQuery: string = "";
  public searchResult: SupaBaseMovie |null = null;
  public dateSortie: Date |null = null;

  constructor(private movieService:MovieService) {

  }

  public closeSearchDialog(){
    this.closeDialog.emit(true)
  }

  public searchMovies() {
    this.movieService.searchMovies(this.searchQuery,this.yearQuery).subscribe((movie : SupaBaseMovie | null) => {
      this.searchResult = movie;
    })
  }

  public addMovie(){
    if(this.dateSortie){
      this.searchResult!.released = new Date(this.dateSortie)
    }
    this.searchDialogComplete.emit(this.searchResult)
  }
}
