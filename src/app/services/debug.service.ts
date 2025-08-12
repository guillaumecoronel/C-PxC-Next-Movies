// debug.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DebugService {
  private _visibility: boolean = false;
  logs: string[] = [];

  addLog(message: string) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
  }

  clearLogs() {
    this.logs = [];
  }

  get visibility(): boolean {
    return this._visibility;
  }

  set visibility(value: boolean) {
    this._visibility = value;
  }

}
