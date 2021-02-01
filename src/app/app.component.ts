import { Component } from '@angular/core';
import { EdoMaskService } from '@edorex/edo-mask';
import { EdoMaskGenerator } from '@edorex/edo-mask';

@Component({
  selector: 'edo-mask-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public edoMaskService: EdoMaskService) {
  }

  public someNumber = 10.20;
  public phoneValue01 = '1231234567';
  public phoneMask01 = this.edoMaskService.PHONE_MASK_GENERATOR;
  public numberValue01 = '1231234567';
  public numberMask01: EdoMaskGenerator = {
    generateMask: () => 'Number0',
  };
  public numberValue02 = '987654321';
  public numberMask02: EdoMaskGenerator = {
    generateMask: () => 'Number2',
  };
  someNumber2: string;
  someNumber3: number;
  public getType(value: any): string {
    return typeof value;
  }
}
