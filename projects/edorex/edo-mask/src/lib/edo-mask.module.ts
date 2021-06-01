import { NgModule } from '@angular/core';
import { EdoMaskDirective } from './edo-mask.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    EdoMaskDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EdoMaskDirective
  ]
})
export class EdoMaskModule { }
