import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { ListComponent } from '../../components/list/list.component';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { ListRoutingModule } from './list-routing.module';
import { SpinnerModule } from '../shared/spinner.module';
import { SimpleDialogModule } from '../shared/dialog.module';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    SpinnerModule,
    CapitalizePipe,
    SimpleDialogModule,
    TranslateModule.forChild(),
    ListRoutingModule,
  ],
})
export class ListModule {}
