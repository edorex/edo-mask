import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EdoMaskModule, I18N_TOKEN } from '@edorex/edo-mask';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EdoMaskModule
  ],
  providers: [
    { provide: I18N_TOKEN, multi: false, useValue: { language: 'de-CH' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
