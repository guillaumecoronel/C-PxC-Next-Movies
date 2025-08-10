import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SupaBaseMovie} from '../../models/movie.model';

@Component({
  selector: 'app-youtube-player',
  imports: [],
  templateUrl: './youtube-player.html',
  styleUrl: './youtube-player.scss'
})
export class YoutubePlayer implements OnInit {
  @Input() videoId: string | undefined = undefined;
  public videoUrl: SafeResourceUrl |null = null;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    if(this.videoId) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.videoId}`
      );
    }
  }
}
