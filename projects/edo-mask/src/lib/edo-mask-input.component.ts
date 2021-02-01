import { Component, forwardRef, Inject, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { L10nLocale, L10nTranslationService, L10N_LOCALE } from 'angular-l10n';
import { EdoMaskGenerator } from './edo-mask.generator';
import { EdoMaskService } from './edo-mask.service';

const noop = () => { }; /* tslint:disable-line */

/**
 *  HOW TO
 *
 *  <edo-mask-input #sampleEdomask="ngModel" name="sampleEdomask" [(ngModel)]="model.myvalue"
 *    [maskGenerator]="edoMaskService.GetNumberMask(2)" [maskDefaultValue]="model.myvalue" [keepMask]="false"
 *    [invalidInputTranslationKey]="'ERROR_FIELD_REQUIRED'"
 *    [isControlInvalidWithinForm]="f.submitted && !sampleEdomask.valid" required>
 *  </edo-mask-input>
 *
 */

export const EDOMASKINPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => EdoMaskInputComponent),
  multi: true,
};

@Component({
  selector: 'edo-mask-input',
  providers: [EDOMASKINPUT_VALUE_ACCESSOR],
  templateUrl: './edo-mask-input.component.html'
})

export class EdoMaskInputComponent implements ControlValueAccessor {
  private _model = null;
  @Input() public disabled: boolean;
  @Input() public required: boolean;
  @Input() public invalidInputTranslationKey;
  @Input() public keepMask: true;
  @Input() public maskWhileInput: false; // true: value is always masked even when typing, false: value is unmasked while the input has the focus
  @Input() public maskGenerator: EdoMaskGenerator;
  @Input() public maskDefaultValue: any = null;
  // tslint:disable-next-line: max-line-length
  @Input() public isControlInvalidWithinForm = false;

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private touchedCallback: () => void = noop;
  private changeCallback: (_: any) => void = noop;

  constructor(
    @Inject(L10N_LOCALE) public lang: L10nLocale,
    public localization: L10nTranslationService,
    public edoMaskService: EdoMaskService) {
  }

  set model(value: any) {
    this._model = value;
    this.changeCallback(this._model);
  }

  get model() {
    return this._model;
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.model = value;
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: any) {
    this.changeCallback = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: any) {
    this.touchedCallback = fn;
  }

  // Set touched on blur
  public onBlur() {
    this.touchedCallback();
  }

}
