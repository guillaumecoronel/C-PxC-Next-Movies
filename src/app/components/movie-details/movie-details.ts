import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import {SupaBaseMovie} from "../../models/movie.model";
import {TmdbService} from "../../services/tmdb.service";
import {SupabaseService} from "../../services/supabase.service";
import {DatePipe} from "@angular/common";
import {MovieDetail, MovieVideo} from "../../models/tmdb.model";
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
    public youtubePlayer: boolean = false;

    ngOnInit() {
        this.tmdbService.getMovieDetails(this.movie.imdbID).subscribe(response => {
            this.movieDetail = response;
        })
        this.tmdbService.getTmdbLastYoutubeTrailer(this.movie.imdbID).subscribe(response => {
            this.movieVideo = response;
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

    public onYoutubePlayerClick(e: boolean){
        this.youtubePlayer = e;
    }

    protected readonly environment = environment;
    protected readonly formatStringForPlaceholder = formatStringForPlaceholder;
}
