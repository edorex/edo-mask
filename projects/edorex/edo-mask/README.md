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

# Credits

The source is originally from https://stackoverflow.com/questions/37800841/mask-for-an-input

It follows that the Licence is CC BY-SA 3.0 judging by https://stackoverflow.com/help/licensing
