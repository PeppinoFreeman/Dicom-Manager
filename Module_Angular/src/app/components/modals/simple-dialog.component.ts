import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  hasConfirm?: boolean;
  hasCancel?: boolean;
}

@Component({
  selector: 'simple-dialog',
  templateUrl: 'simple-dialog.component.html',
  styleUrl: 'simple-dialog.component.scss',
})
export class SimpleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
