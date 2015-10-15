cordova-imagePicker
===================

Cordova Plugin For Multiple Image Selection - implemented for iOS and Android 4.0 and above.

## Installing the plugin

The plugin conforms to the Cordova plugin specification, it can be installed
using the Cordova / Phonegap command line interface.

    cordova plugin add cordova-plugin-imagepicker

## Using the plugin

The plugin creates the object `window.imagePicker` with the method `getPictures(success, fail, options)`

Example - Get Full Size Images (all default options):
```javascript
window.imagePicker.getPictures(
	function(results) {
		for (var i = 0; i < results.length; i++) {
			console.log('Image URI: ' + results[i]);
		}
	}, function (error) {
		console.log('Error: ' + error);
	}
);
```

Example - Get at most 10 images scaled to width of 800:
```javascript
window.imagePicker.getPictures(
	function(results) {
		for (var i = 0; i < results.length; i++) {
			console.log('Image URI: ' + results[i]);
		}
	}, function (error) {
		console.log('Error: ' + error);
	}, {
		maximumImagesCount: 10,
		width: 800
	}
);
```

### Options

    options = {
        // max images to be selected, defaults to 15. If this is set to 1, upon
    	// selection of a single image, the plugin will return it.
    	maxImages: int,
    	
    	// max width and height to allow the images to be.  Will keep aspect
    	// ratio no matter what.  So if both are 800, the returned image
    	// will be at most 800 pixels wide and 800 pixels tall.  If the width is
    	// 800 and height 0 the image will be 800 pixels wide if the source
    	// is at least that wide.
    	width: int,
    	height: int,
    	
    	// quality of resized image, defaults to 100
    	quality: int (0-100)
    };
    
### Note for Android Use

The plugin returns images that are stored in a temporary directory.  These images will often not be deleted automatically though.  The files should be moved or deleted after you get their filepaths in javascript.

## Libraries used

#### QBImagePicker

For iOS this plugin uses the QBImagePicker
https://github.com/questbeat/QBImagePicker

#### MultiImageChooser

For Android this plugin uses MultiImageChooser, with modifications.
https://github.com/derosa/MultiImageChooser

#### FakeR

Code(FakeR) was also taken from the phonegap BarCodeScanner plugin.  This code uses the MIT license.

https://github.com/wildabeast/BarcodeScanner

## License
MIT