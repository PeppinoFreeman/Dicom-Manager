import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ToastType } from '../enums/toast-types';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly _horizontalPosition: MatSnackBarHorizontalPosition =
    'center';
  private readonly _verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private _snackBar: MatSnackBar,
    private _translate: TranslateService
  ) {}

  openToast(
    message: string,
    toastType: ToastType = ToastType.Error,
    horizontalPosition?: MatSnackBarHorizontalPosition,
    verticalPosition?: MatSnackBarVerticalPosition
  ): void {
    this._snackBar.open(message, this._translate.instant('DISMISS-TOAST'), {
      horizontalPosition: horizontalPosition || this._horizontalPosition,
      verticalPosition: verticalPosition || this._verticalPosition,
      panelClass: [`${toastType}-toast`],
    });
  }

  dismissToast(): void {
    this._snackBar.dismiss();
  }
}
