import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {SupaBaseMovie} from '../../models/movie.model';
import {TmdbService} from '../../services/tmdb.service';
import {SupabaseService} from '../../services/supabase.service';

@Component({
  selector: 'app-details-dialog',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './details-dialog.html',
  styleUrl: './details-dialog.scss'
})
export class DetailsDialog implements OnInit {
  @Input() movie!: SupaBaseMovie;
  @Output() closeDialog = new EventEmitter<boolean>();

  public showPanel: boolean = false;

  public imgs: string[] = []

  constructor(private tmdbService:TmdbService,private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.tmdbService.getTmdbImages(this.movie.imdbID).subscribe(response => {
      this.imgs = response;
    })
  }

  public closeDetailsDialog(){
    this.closeDialog.emit(true)
  }

  public togglePanel(){
    this.showPanel = true;
  }

  public updatePoster(p:string){
    this.movie.poster = p;
    this.supabaseService.updateMovie(this.movie.id!,this.movie)
    this.showPanel = false;
  }


}
