import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_RADIO_DEFAULT_OPTIONS,
  MatRadioModule,
} from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { CreateComponent } from '../../components/create/create.component';
import { SpinnerModule } from '../shared/spinner.module';
import { CreateRoutingModule } from './create-routing.module';

@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    CreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    SpinnerModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class CreateModule {}
