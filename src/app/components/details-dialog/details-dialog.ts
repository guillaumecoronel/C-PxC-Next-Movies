import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {SupaBaseMovie} from '../../models/movie.model';
import {TmdbService} from '../../services/tmdb.service';
import {SupabaseService} from '../../services/supabase.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-details-dialog',
    imports: [
        ReactiveFormsModule,
    ],
  templateUrl: './details-dialog.html',
  styleUrl: './details-dialog.scss'
})
export class DetailsDialog implements OnInit {
  @Input() movie!: SupaBaseMovie;
  @Output() closeDialog = new EventEmitter<boolean>();
  @ViewChild('panel') panelRef!: ElementRef;
  @ViewChild('detailDialog') dialogContentRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.showPanel && this.panelRef) {
      const clickedInside = this.panelRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.showPanel = false;
      }
    }
  }

  public showPanel: boolean = false;
  public imgs: string[] = []

  constructor(private tmdbService:TmdbService,private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.tmdbService.getTmdbImages(this.movie.imdbID).subscribe(response => {
      this.imgs = response;
    })
  }

  onBackdropClick(event: MouseEvent) {
    if (!this.dialogContentRef.nativeElement.contains(event.target)) {
      this.closeDetailsDialog();
    }
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


    protected readonly environment = environment;
}
