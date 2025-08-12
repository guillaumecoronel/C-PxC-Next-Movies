import { Injectable } from '@angular/core';
import { from, Observable, of} from 'rxjs';
import {AppUpdate, AppUpdateInfo} from '@capawesome/capacitor-app-update';
import {Capacitor} from '@capacitor/core';
import {ToastButton, ToastController} from '@ionic/angular';
import {DebugService} from './debug.service';

export type ToastPosition = 'top' | 'middle' | 'bottom';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastPosition : ToastPosition = 'bottom'

  constructor(private toastController: ToastController,private debugService : DebugService) {}

  async presentClickableToast(message:string,duration:number=3000,position:ToastPosition=this.toastPosition,buttons:ToastButton[]) {
    try {
      const toast = await this.toastController.create({
        message: message,
        duration: duration, // reste affiché jusqu’à interaction
        position: position,
        buttons: buttons,
        cssClass: 'overrideToast'
      });
      await toast.present();
    } catch (err) {
      console.error('Erreur création ou affichage toast:', err)
      this.debugService.addLog('Erreur création ou affichage toast:'+ err);
    }
  }

}
