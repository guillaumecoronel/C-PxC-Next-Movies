import { Injectable } from '@angular/core';
import { from, Observable, of} from 'rxjs';
import {AppUpdate, AppUpdateInfo} from '@capawesome/capacitor-app-update';
import {Capacitor} from '@capacitor/core';
import {ToastButton, ToastController} from '@ionic/angular';
import {DebugService} from './debug.service';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  private appUpdateSuggested : boolean = false;

  constructor(private debugService: DebugService,private toastService: ToastService) {}

  public getCurrentAppVersion():Observable<AppUpdateInfo|null> {
    this.debugService.addLog('Plateform: '+Capacitor.getPlatform());
    if (Capacitor.getPlatform() === 'android') {
      return from(AppUpdate.getAppUpdateInfo());
    }
    return of(null);
  };

  public checkForUpdate() {
    if(!this.appUpdateSuggested) {
      this.getCurrentAppVersion().subscribe(async (version: AppUpdateInfo | null) => {
        if (version) {
          this.debugService.addLog('Current App version: ' + version.currentVersionCode);
          this.debugService.addLog('available App version: ' + version.availableVersionCode);
        }
        if (version && (version.currentVersionCode < (version.availableVersionCode ? version.availableVersionCode : 0))) {
          await this.toastService.presentClickableToast('Nouvelle version disponible !', 0, 'bottom', this.getToastButtonsUpdate());
        }
      })
      this.appUpdateSuggested = true
    }
  }

  private getToastButtonsUpdate(){
    const buttonUpdate : ToastButton[] = [{
      text: 'Mettre à jour',
      role: 'update',
      handler: () => {
        this.debugService.addLog('Mise à jour lancée');
        AppUpdate.openAppStore()
      }
    },
    {
      text: 'Fermer',
      role: 'cancel'
    }]
    return buttonUpdate
  }

}
