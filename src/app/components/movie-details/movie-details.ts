import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import {SupaBaseMovie} from "../../models/movie.model";
import {TmdbService} from "../../services/tmdb.service";
import {SupabaseService} from "../../services/supabase.service";
import {DatePipe} from "@angular/common";
import {MovieDetail} from "../../models/tmdb.model";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {MinutesToHoursPipe} from "../../pipes/minutes-to-hours.pipe";

@Component({
  selector: 'app-movie-details',
    imports: [
        DatePipe,
        MatChipSet,
        MatChip,
        MinutesToHoursPipe
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

    ngOnInit() {
        this.tmdbService.getMovieDetails(this.movie.imdbID).subscribe(response => {
            this.movieDetail = response;
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

    protected readonly environment = environment;
}
