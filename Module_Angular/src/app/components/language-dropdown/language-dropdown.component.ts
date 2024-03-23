import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrl: './language-dropdown.component.scss',
})
export class LanguageDropdownComponent {
  constructor(private translateService: TranslateService) {}

  switchLanguage(language: string): void {
    this.translateService.use(language);
  }
}
