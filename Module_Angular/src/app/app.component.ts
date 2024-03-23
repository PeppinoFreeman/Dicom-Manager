import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(environment.defaultLanguage);
  }
}
