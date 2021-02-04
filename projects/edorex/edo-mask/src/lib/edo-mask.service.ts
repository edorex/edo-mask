import {Injectable, InjectionToken} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EdoMaskGenerator } from './edo-mask.generator';

@Injectable({
  providedIn: 'root'
})
export class EdoMaskService {
  private readonly ALPHA = 'A';
  private readonly NUMERIC = '9';
  private readonly ALPHANUMERIC = '?';
  private readonly REGEX_MAP = new Map([
    [this.ALPHA, /\w/],
    [this.NUMERIC, /\d/],
    [this.ALPHANUMERIC, /\w|\d/],
  ]);
  private PHONE_SMALL = '(999) 999-9999';
  private PHONE_BIG = '(999) 9999-9999';
  private HOUR_MINUTES = '99:99';
  private NUMBER0 = 'Number0';
  private NUMBER1 = 'Number1';
  private NUMBER2 = 'Number2';
  private NUMBER3 = 'Number3';
  private NUMBER4 = 'Number4';
  private NUMBER5 = 'Number5';
  private NUMBER6 = 'Number6';

  public GetNumberMask(decimals: number): EdoMaskGenerator {
    switch (decimals) {
      case 0:
        return this.NUMBER_0_GENERATOR;
      case 1:
        return this.NUMBER_1_GENERATOR;
      case 2:
        return this.NUMBER_2_GENERATOR;
      case 3:
        return this.NUMBER_3_GENERATOR;
      case 4:
        return this.NUMBER_4_GENERATOR;
      case 5:
        return this.NUMBER_5_GENERATOR;
      case 6:
        return this.NUMBER_6_GENERATOR;
    }
  }

  // tslint:disable-next-line: member-ordering
  public NUMBER_0_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.NUMBER0,
  };

  // tslint:disable-next-line: member-ordering
  public NUMBER_1_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.NUMBER1,
  };

  // tslint:disable-next-line: member-ordering
  public NUMBER_2_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.NUMBER2,
  };

  // tslint:disable-next-line: member-ordering
  public NUMBER_3_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.NUMBER3,
  };

  // tslint:disable-next-line: member-ordering
  public NUMBER_4_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.NUMBER4,
  };

  // tslint:disable-next-line: member-ordering
  public NUMBER_5_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.NUMBER5,
  };

  // tslint:disable-next-line: member-ordering
  public NUMBER_6_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.NUMBER6,
  };

  // tslint:disable-next-line: member-ordering
  public PHONE_MASK_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.PHONE_SMALL,
  };

  // tslint:disable-next-line: member-ordering
  public HOUR_MINUTES_GENERATOR: EdoMaskGenerator = {
    generateMask: () => this.HOUR_MINUTES,
  };

  // tslint:disable-next-line: member-ordering
  public DYNAMIC_PHONE_MASK_GENERATOR: EdoMaskGenerator = {
    generateMask: (value: string) => {
      return this.hasMoreDigits(value, this.PHONE_SMALL) ?
        this.PHONE_BIG :
        this.PHONE_SMALL;
    },
  };

  // tslint:disable-next-line: member-ordering
  private hasMoreDigits(v01: string, v02: string): boolean {
    const d01 = this.onlyDigits(v01);
    const d02 = this.onlyDigits(v02);
    const len01 = (d01 && d01.length) || 0;
    const len02 = (d02 && d02.length) || 0;
    const moreDigits = (len01 > len02);
    return moreDigits;
  }

  // tslint:disable-next-line: member-ordering
  private onlyDigits(value: string): string {
    const onlyDigits = (value != null) ? value.replace(/\D/g, '') : null;
    return onlyDigits;
  }

  // tslint:disable-next-line: member-ordering
  private mask(value: string | number, mask: string, languageCode: string): string {
    if (this.isEmptyOrNull(value)) {
      value = '';
    }
    if (mask.startsWith('Number')) {
      return this.maskNumber(value, mask, languageCode);
    } else {
      return this.maskStandard(value as string, mask);
    }
  }

  // tslint:disable-next-line: member-ordering
  private maskNumber(value: string | number, numberFormatMask: string, languageCode: string): string {
    const precision = parseInt(numberFormatMask.replace('Number', ''), 10);
    const decimalSeparatorChar = this.getDecimalSeparator(languageCode);
    const thousandSeparatorChar = this.getThousandSeparator(languageCode);
    const valueAsString = value.toString().replace('.', decimalSeparatorChar);
    const leftPart: string[] = [];
    const rightPart: string[] = [];
    let decimalSeparatorFound = false;
    let isNegative = false;
    for (const c of valueAsString.split('')) {
      if (leftPart.length === 0 && rightPart.length === 0 && c === '-') {
        isNegative = true;
      } else if (decimalSeparatorChar === c) {
        decimalSeparatorFound = true;
      } else if (/^[0-9]$/.test(c)) {
        if (decimalSeparatorFound) {
          rightPart.push(c);
        } else {
          if (leftPart.length !== 0 || c !== '0') {
            leftPart.push(c);
          }
        }
      }
    }

    const allParts: string[] = [];
    for (let i = 0; i < leftPart.length; ++i) {
      const reversePos = leftPart.length - i - 1;
      const addSeparator = reversePos % 3 === 0 && reversePos !== 0;
      allParts.push(leftPart[i]);
      if (addSeparator) {
        allParts.push(thousandSeparatorChar);
      }
    }
    if (allParts.length === 0) {
      allParts.push('0');
    }
    if (isNegative) {
      allParts.unshift('-');
    }
    if (precision > 0) {
      allParts.push(decimalSeparatorChar);
    }
    for (let i = 0; i < precision; ++i) {
      allParts.push(i < rightPart.length ? rightPart[i] : '0');
    }

    return allParts.join('');
  }

  // tslint:disable-next-line: member-ordering
  private maskStandard(value: string, mask: string): string {
    value = value.toString();

    let len = value.length;
    const maskLen = mask.length;
    let missingDigits = maskLen - len;
    let pos = 0;
    let newValue = '';

    for (let i = 0; i < Math.min(len, maskLen); i++) {
      const maskChar = mask.charAt(i);
      const newChar = value.charAt(pos);
      const regex: RegExp = this.REGEX_MAP.get(maskChar);

      if (regex) {
        pos++;

        if (regex.test(newChar)) {
          newValue += newChar;
        } else {
          i--;
          len--;
        }
      } else {
        if (maskChar === newChar) {
          pos++;
        } else {
          missingDigits--;
          len++;
        }

        newValue += maskChar;
      }
    }

    return newValue;
  }

  // tslint:disable-next-line: member-ordering
  private unmask(maskedValue: string, mask: string, languageCode: string): string | number {
    if (mask.startsWith('Number')) {
      return this.unmaskNumber(maskedValue, languageCode);
    } else {
      return this.unmaskStandard(maskedValue, mask);
    }
  }

  // tslint:disable-next-line: member-ordering
  private unmaskNumber(maskedValue: string, languageCode: string): number {
    const decimalSeparatorChar = this.getDecimalSeparator(languageCode);
    const keep: string[] = [];
    let foundDecimalSeparator = false;
    for (let i = 0; i < maskedValue.length; ++i) {
      const c = maskedValue.charAt(i);
      if (i === 0 && c === '-') {
        keep.push(c);
      } else if (/[0-9]/.test(c)) {
        keep.push(c);
      } else if (c === decimalSeparatorChar && !foundDecimalSeparator) {
        foundDecimalSeparator = true;
        keep.push(c);
      }
    }
    return parseFloat(keep.join(''));
  }

  // tslint:disable-next-line: member-ordering
  private unmaskStandard(maskedValue: string, mask: string): string {
    const maskLen = (mask && mask.length) || 0;
    return maskedValue.toString().split('').filter(
      (currChar, idx) => (idx < maskLen) && this.REGEX_MAP.has(mask[idx])
    ).join('');
  }

  // tslint:disable-next-line: member-ordering
  private getDecimalSeparator(languageCode: string): string {
    switch (languageCode) {
      case 'en':
        return '.';
      case 'de-CH':
      case 'de':
        return '.';
      case 'fr-CH':
      case 'fr':
        return ',';
      default:
        return '.';
    }
  }

  // tslint:disable-next-line: member-ordering
  private getThousandSeparator(languageCode: string): string {
    switch (languageCode) {
      case 'en':
        return ',';
      case 'de-CH':
      case 'de':
        return '\'';
      case 'fr-CH':
      case 'fr':
        return ' ';
      default:
        return ',';
    }
  }

  // tslint:disable-next-line: member-ordering
  delay(ms: number = 0): Observable<void> {
    return of(null).pipe(
      delay(ms)
    );
  }

  private updateCursorPositionByTakingSeparatorCharsIntoAccount(oldViewValue: string, newViewValue: string, cursorPos: number, mask: string): number {
    if (cursorPos === 0) {
      return 0;
    }
    if (cursorPos === oldViewValue.length) {
      return newViewValue.length;
    }
    cursorPos = Math.min(oldViewValue.length, cursorPos);
    const cOld = oldViewValue.charAt(cursorPos - 1);
    cursorPos = Math.min(newViewValue.length, cursorPos);
    for (let i = cursorPos - 1; i < newViewValue.length - 1; ++i) {
      const cNew = newViewValue.charAt(i);
      if (cNew === cOld) {
        return i + 1;
      }
    }
    return newViewValue.length;
  }

  private updateCursorPositionByTakingThousandSeparatorIntoAccount(oldViewValue: string, newViewValue: string, cursorPos: number, languageCode: string): number {
    const thousandSeparatorChar = this.getThousandSeparator(languageCode);
    let thousandSeparatorsCount = 0;
    cursorPos = Math.min(oldViewValue.length, cursorPos);
    for (let i = 0; i < cursorPos; ++i) {
      if (oldViewValue.charAt(i) === thousandSeparatorChar) {
        ++thousandSeparatorsCount;
      }
    }
    cursorPos -= thousandSeparatorsCount;
    thousandSeparatorsCount = 0;
    cursorPos = Math.min(newViewValue.length, cursorPos);
    for (let i = 0; i < cursorPos + thousandSeparatorsCount; ++i) {
      if (newViewValue.charAt(i) === thousandSeparatorChar) {
        ++thousandSeparatorsCount;
      }
    }
    cursorPos += thousandSeparatorsCount;
    return cursorPos;
  }

  processUserUpdate(data: EdoMaskData): { viewValue: string, modelValue: string | number, cursorPosition: number } {
    let cursorPosition = data.cursorPosition;
    let unmaskedValue: string | number;
    let maskedValue: string;

    const mask = data.maskGenerator.generateMask(data.viewValue);

    if (!this.isEmptyOrNull(data.viewValue)) {
      maskedValue = this.mask(data.viewValue, mask, data.i18n.language);
      unmaskedValue = this.unmask(maskedValue, mask, data.i18n.language);

      if (mask.startsWith('Number')) {
        cursorPosition = this.updateCursorPositionByTakingThousandSeparatorIntoAccount(data.viewValue, maskedValue, cursorPosition, data.i18n.language);
      } else {
        cursorPosition = this.updateCursorPositionByTakingSeparatorCharsIntoAccount(data.viewValue, maskedValue, cursorPosition, mask);
      }
    } else {
      maskedValue = data.viewValue;
      if (mask.startsWith('Number') && !data.keepMask) {
        unmaskedValue = null;
      } else {
        unmaskedValue = '';
      }
    }

    return {
      viewValue: maskedValue,
      modelValue: data.keepMask ? maskedValue : unmaskedValue,
      cursorPosition
    };
  }

  private isEmptyOrNull(value: string | number): boolean {
    return value === null || value === undefined || value.toString().trim() === '';
  }

  processModelUpdate(data: EdoMaskData): { viewValue: string, modelValue: string | number, cursorPosition: number } {
    // use default value if no value is present yet and a default is defined
    const shouldUseDefaultValue = this.isEmptyOrNull(data.modelValue) && data.defaultValue !== null;
    const initialModelValue = shouldUseDefaultValue ? data.defaultValue : data.modelValue;

    const cursorPosition = data.cursorPosition;
    let unmaskedValue: string | number;
    let maskedValue: string;

    if (!this.isEmptyOrNull(data.modelValue)) {
      const mask = data.maskGenerator.generateMask(initialModelValue);
      maskedValue = this.mask(initialModelValue, mask, data.i18n.language);
      unmaskedValue = this.unmask(maskedValue, mask, data.i18n.language);
    } else {
      maskedValue = '';
      unmaskedValue = data.modelValue;
    }

    return {
      viewValue: maskedValue,
      modelValue: data.keepMask ? maskedValue : unmaskedValue,
      cursorPosition
    };
  }
}

export interface EdoMaskData {
  viewValue?: string;
  modelValue?: string | number;
  defaultValue: string | number;
  isFocused: boolean;
  cursorPosition: number;
  keepMask: boolean;
  i18n: I18n;
  maskGenerator: EdoMaskGenerator;
}

// originally I18n from customdatepickeri18n.ts but we cannot import it here, example values for language are de-CH, fr, ...
export interface I18n {
  language: string;
}

export const I18N_TOKEN = new InjectionToken<I18n>('I18N_TOKEN');
