import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarModule } from './modules/navbar/navbar.module';

const HttpLoaderFactory = (http: HttpClient) => {
  return new TranslateHttpLoader(http);
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
    NavBarModule,
  ],
  providers: [provideHttpClient(withFetch()), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
