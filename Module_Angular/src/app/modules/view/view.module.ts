import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ViewComponent } from '../../components/view/view.component';
import { SpinnerModule } from '../shared/spinner.module';
import { ViewRoutingModule } from './view-routing.module';

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SpinnerModule,
    ViewRoutingModule,
  ],
})
export class ViewModule {}
