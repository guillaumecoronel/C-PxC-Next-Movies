import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import {SupaBaseMovie} from "../../models/movie.model";
import {TmdbService} from "../../services/tmdb.service";
import {SupabaseService} from "../../services/supabase.service";
import {DatePipe} from "@angular/common";
import {MovieDetail, MovieVideo, TmdbCastMember, TmdbCrewMember} from "../../models/tmdb.model";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {MinutesToHoursPipe} from "../../pipes/minutes-to-hours.pipe";
import {formatStringForPlaceholder} from "../../utils/movie.utils";
import {YoutubePlayer} from "../youtube-player/youtube-player";

@Component({
  selector: 'app-movie-details',
    imports: [
        DatePipe,
        MatChipSet,
        MatChip,
        MinutesToHoursPipe,
        YoutubePlayer
    ],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss'
})
export class MovieDetails implements OnInit{
    @Input() movie!: SupaBaseMovie;
    @Output() closeDialog = new EventEmitter<boolean>();
    @ViewChild('dialogContent') dialogContentRef!: ElementRef;

    constructor(private tmdbService:TmdbService) {}

    public movieDetail: MovieDetail | null = null;
    public movieVideo: MovieVideo | null = null;
    public movieCast: TmdbCastMember[] | null = null;
    public movieCrew: TmdbCrewMember[] | null = null;
    public movieDetailPanel: string = "description";
    public scrollActors: boolean = false;
    public scrollTechnicals: boolean = false;

    ngOnInit() {
        this.tmdbService.getMovieDetails(this.movie.imdbID).subscribe(response => {
            this.movieDetail = response;
        })
        this.tmdbService.getTmdbLastYoutubeTrailer(this.movie.imdbID).subscribe(response => {
            this.movieVideo = response;
        })
        this.tmdbService.getTmdbCrewInfos(this.movie.imdbID).subscribe(response => {
          this.movieCrew = response.crew;
          this.movieCast = response.cast;
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

    public onScroll(el: HTMLElement,direction:string){
      // el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      el.scrollBy({ left: (direction === 'right' ? 450 : -450), behavior: 'smooth' });
    }

    public onMovieDetailPanelClick(e: string){
        this.movieDetailPanel = e;
    }

    public getActorsFromMovieCrew(){
      return this.movieCast!.filter(
        member => member.known_for_department.toLowerCase() === 'acting'
      ).sort((a, b) => a.order - b.order).slice(0, 10);
    }

  public getActorsFromMovieTechnicalsCrew(){
    let crew : TmdbCrewMember[] = [];

    crew.push(...this.movieCrew!.filter(
      member => member.job && member.job.toLowerCase() === 'director'
    ).sort((a, b) => a.id - b.id).slice(0, 10));

    crew.push(...this.movieCrew!.filter(
      member => member.known_for_department && member.known_for_department.toLowerCase() === 'writing' && member.job.toLowerCase() !== 'director'
    ).sort((a, b) => a.id - b.id).slice(0, 10))

    return crew;
  }

    protected readonly environment = environment;
    protected readonly formatStringForPlaceholder = formatStringForPlaceholder;
}
