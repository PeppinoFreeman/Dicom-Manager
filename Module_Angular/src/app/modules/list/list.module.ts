import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ListComponent } from '../../components/list/list.component';
import { ListRoutingModule } from './list-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, TranslateModule.forChild(), ListRoutingModule],
})
export class ListModule {}
