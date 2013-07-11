# GLORIA Lightcurve

## Using this App

index.html requires params to work, either

-?sim=true which will loaod known data that should work
-?ra=XXXXX&dec=XXXXXX which loads data from LUIZA (a GLORIA central data processing pipeline)

The data is then parsed and loaded into a jQuery charting add-on called jqplot and jQueryUI is used to manipulate the display a little allowing the user to fold the light curve and change the phase of the guided sine wave.

## Dumb Fourier Transform

The app can also estimate the period of the lightcurve using the _createFT_ function that essentially does a dumb analysis to fit the best fit to a given period. It works sometimes!

## Things to Look Out at the Moment

There is legacy D3 code lying about which I need to clean up, as well as some not-very-optimised code. This was my first time using most of this stuff so I was driving blind. I need to drive back through the route again and pick up the casualties.

LUIZA itself is totally flaky and fails a lot, hence my use of sim data