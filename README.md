# EdoMask

Enforces number and phone number formats

## Build

Run `ng build EdoMask` to build the library 

## Test locally

- `ng build EdoMask --prod`
- `ng start`

## Test in a Project

You can use `npm link` for this. Basically it lets you use an unpublished local version.

Here:
- `ng build EdoMask --prod`
- `cd dist/edorex/edo-mask`
- `npm link`

In the Project:
- `npm uninstall @edorex/edo-mask --no-save`
- `npm link @edorex/edo-mask`

After you're done testing (still in the Project):
- `npm uninstall @edorex/edo-mask --no-save`
- `npm install`

Here (again):
- `cd dist/edorex/edo-mask`
- `npm unlink`

## Publish

- `rm -r dist`
- `ng build EdoMask --prod`
- `cd dist/edorex/edo-mask`
- Check `npm whoami`
- Run `npm adduser` if needed
- `npm publish --access public`
