// Quelle: https://stackoverflow.com/questions/37800841/mask-for-an-input
import { Directive, ElementRef, EventEmitter, HostListener, Injector, Input, Output } from '@angular/core';
import { EdoMaskGenerator } from './edo-mask.generator';
import { EdoMaskService, I18n, I18N_TOKEN } from './edo-mask.service';

/**
 *  HOW TO
 *
 *  =====================================================
 *  TypeScript:
 *  =====================================================
 *  public someNumber = 10.20;
 *  public phoneValue01 = '1231234567';
 *  public phoneMask01 = this.edoMaskService.PHONE_MASK_GENERATOR;
 *  public numberValue01 = '1231234567';
 *  public numberMask01: EdoMaskGenerator = {
 *    generateMask: () => 'Number0',
 *  };
 *  public numberValue02 = '987654321';
 *  public numberMask02: EdoMaskGenerator = {
 *    generateMask: () => 'Number2',
 *  };
 *  public getType(value: any): string {
 *    return typeof value;
 *  }
 *
 *  =====================================================
 *  HTML:
 *  =====================================================
 *  Value={{ someNumber }},Type={{getType(someNumber)}}):
 *  <input
 *    [(edoMaskValue)]="someNumber"
 *    [edoMask]="edoMaskService.GetNumberMask(6)"
 *  />
 *  Value={{ phoneValue01 }},Type={{getType(phoneValue01)}}):
 *  <input
 *    [(edoMaskValue)]="phoneValue01"
 *    [edoMask]="phoneMask01"
 *  >
 *  Value={{ numberValue01 }},Type={{getType(numberValue01)}}):
 *  <input
 *    [(edoMaskValue)]="numberValue01"
 *    [edoMask]="numberMask01"
 *  >
 *  Value={{ numberValue02 }},Type={{getType(numberValue02)}}):
 *  <input
 *    [(edoMaskValue)]="numberValue02"
 *    [edoMask]="numberMask02"
 *  >
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[edoMask]'
})
export class EdoMaskDirective {
  private modelValue: string | number = null;
  private maskGenerator: EdoMaskGenerator;
  public viewValue: string = null;
  private isInputFocused = false;
  private readonly i18n: I18n;

  // tslint:disable-next-line: no-input-rename
  @Input('edoMask') public set edoMask(maskGenerator: EdoMaskGenerator) {
    if (this.maskGenerator !== maskGenerator) {
      this.maskGenerator = maskGenerator;
      if (this.modelValue) {
        this.modelValueOrMaskChanged();
      }
    }
  }

  @Input('edoMaskWhileInput') public maskWhileInput = false; // if value always masked or is it unmasked while the input has the focus

  // tslint:disable-next-line: no-input-rename
  @Input('edoMaskDefaultValue') public edoMaskDefaultValue: any = null;

  // tslint:disable-next-line: no-input-rename
  @Input('edoKeepMask') public keepMask: boolean;

  // tslint:disable-next-line: no-output-rename
  @Output('edoMaskValueChange') public edoMaskValueChangeEmitter = new EventEmitter<string | number>();

  @Input('edoMaskValue') public set maskValue(modelValue: string | number) {
    if (this.modelValue !== modelValue) {
      this.modelValue = modelValue;
      this.modelValueOrMaskChanged();
    }
  }

  private modelValueOrMaskChanged(): void {
    if (!this.maskGenerator) {
      return;
    }
    const result = this.edoMaskService.processModelUpdate({
      modelValue: this.modelValue,
      cursorPosition: 0,
      isFocused: false,
      i18n: this.i18n,
      defaultValue: this.edoMaskDefaultValue,
      keepMask: this.keepMask,
      maskGenerator: this.maskGenerator
    });
    this.elementRef.nativeElement.value = result.viewValue;
    if (result.modelValue !== this.modelValue) {
      this.modelValue = result.modelValue;
      this.edoMaskService.delay().subscribe(() => {
        this.edoMaskValueChangeEmitter.emit(result.modelValue);
      });
    }
  }

  constructor(
    private edoMaskService: EdoMaskService,
    private elementRef: ElementRef,
    private injector: Injector) {
    this.i18n = this.injector.get(I18N_TOKEN);
  }

  @HostListener('input', ['$event'])
  public onInput(event: { target: { value?: string } }): void {
    const value = event.target.value;
    if (this.maskWhileInput) {
      this.updateInputField(value);
    }
  }

  @HostListener('focus', ['$event'])
  public onFocus(event: { target: { value?: string } }): void {
    this.isInputFocused = true;
    const value = event.target.value;
    this.updateInputField(value);
    this.elementRef.nativeElement.select();
  }

  @HostListener('blur', ['$event'])
  public onBlur(event: { target: { value?: string } }): void {
    this.isInputFocused = false;
    const value = event.target.value;
    this.updateInputField(value);
  }

  /**
   * Called on input/focus/blur, all of which may cause the display value to change
   */
  private updateInputField(viewValue: string): void {
    const cursorPosition = this.isInputFocused ? this.elementRef.nativeElement.selectionStart : null;
    const result = this.edoMaskService.processUserUpdate({
      cursorPosition,
      viewValue: this.elementRef.nativeElement.value,
      isFocused: this.isInputFocused,
      defaultValue: this.edoMaskDefaultValue,
      maskGenerator: this.maskGenerator,
      i18n: this.i18n,
      keepMask: this.keepMask
    });

    if (this.modelValue !== result.modelValue) {
      this.modelValue = result.modelValue;
      this.edoMaskValueChangeEmitter.emit(result.modelValue);
    }

    if (result.viewValue !== viewValue) {
      this.elementRef.nativeElement.value = result.viewValue;
      if (this.isInputFocused) {
        this.edoMaskService.delay().subscribe(() => {
          this.elementRef.nativeElement.selectionStart = result.cursorPosition;
          this.elementRef.nativeElement.selectionEnd = result.cursorPosition;
        });
      }
    }
  }
}
