import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './app.scss'
})
export class App  {
  protected readonly title = signal('CPC-Next');

}
