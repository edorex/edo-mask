import { NgModule } from '@angular/core';
import { EdoMaskInputComponent } from './edo-mask-input.component';
import { EdoMaskDirective } from './edo-mask.directive';
import { BrowserModule } from '@angular/platform-browser';




@NgModule({
  declarations: [
    EdoMaskInputComponent,
    EdoMaskDirective
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    EdoMaskInputComponent,
    EdoMaskDirective
  ]
})
export class EdoMaskModule { }
