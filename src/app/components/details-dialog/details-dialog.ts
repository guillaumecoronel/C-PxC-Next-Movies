import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-details-dialog',
  imports: [],
  templateUrl: './details-dialog.html',
  styleUrl: './details-dialog.scss'
})
export class DetailsDialog {

  @Output() closeDialog = new EventEmitter<boolean>();

  public closeDetailsDialog(){
    this.closeDialog.emit(true)
  }

}
