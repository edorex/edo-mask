# EdoMask

Enforces number and phone number formats

Example:
```angular2html
<input
  [(edoMaskValue)]="someNumber"
  [edoKeepMask]="true"
  [edoMaskWhileInput]="true"
  [edoMask]="edoMaskService.GetNumberMask(6)"
/>
```
