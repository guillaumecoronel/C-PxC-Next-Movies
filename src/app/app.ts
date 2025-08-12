import {Component, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AppUpdateService} from './services/app-update.service';
import {DebugService} from './services/debug.service';
import {ToastService} from './services/toast.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './app.scss'
})
export class App  implements OnInit {
  protected readonly title = signal('CPC-Next');

  constructor(public debugService: DebugService,private appUpdateService:AppUpdateService,private toast:ToastService) {}

  ngOnInit() {
    this.appUpdateService.checkForUpdate();
  }

}
