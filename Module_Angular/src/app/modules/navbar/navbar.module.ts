import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { LanguageDropdownComponent } from '../../components/language-dropdown/language-dropdown.component';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavbarComponent,
    SearchbarComponent,
    LanguageDropdownComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    FormsModule,
    MatToolbarModule,
    NgbDropdownModule,
  ],
  exports: [NavbarComponent], // This is needed to only import the module in the AppModule
})
export class NavBarModule {}
