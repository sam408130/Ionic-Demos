//
//  CTPicker.m
//
//  Created by Christopher Sullivan on 10/25/13.
//  Updated by Jeduan Cornejo on 07/06/15
//

#import "CTPicker.h"
#import <ImageIO/ImageIO.h>
#import <MobileCoreServices/MobileCoreServices.h>

#define CDV_PHOTO_PREFIX @"cdv_photo_"

@interface CTPicker ()

@property (copy) NSString* callbackId;

@end

@implementation CTPicker

@synthesize callbackId;

- (void) getPictures:(CDVInvokedUrlCommand *)command {
	NSDictionary *options = [command.arguments objectAtIndex: 0];
    [self.commandDelegate runInBackground:^{
        NSInteger maxImages = [options[@"maxImages"] integerValue];
        NSInteger minImages = [options[@"minImages"] integerValue];
        self.width = [options[@"width"] integerValue] ?: 0;
        self.height = [options[@"height"] integerValue] ?: 0;
        self.quality = [options[@"quality"] integerValue] ?: 100;
        BOOL sharedAlbums = [options[@"sharedAlbums"] boolValue] ?: false;
        NSString *mediaType = (NSString *)options[@"mediaType"];

        // Create the an album controller and image picker
        QBImagePickerController *imagePicker = [[QBImagePickerController alloc] init];
        imagePicker.allowsMultipleSelection = (maxImages >= 2);
        imagePicker.showsNumberOfSelectedAssets = YES;
        imagePicker.maximumNumberOfSelection = maxImages;
        imagePicker.minimumNumberOfSelection = minImages;

        NSMutableArray *collections = [imagePicker.assetCollectionSubtypes mutableCopy];
        if (sharedAlbums) {
            [collections addObject:@(PHAssetCollectionSubtypeAlbumCloudShared)];
        }

        if ([mediaType isEqualToString:@"image"]) {
            imagePicker.mediaType = QBImagePickerMediaTypeImage;
            [collections removeObject:@(PHAssetCollectionSubtypeSmartAlbumVideos)];
        } else if ([mediaType isEqualToString:@"video"]) {
            imagePicker.mediaType = QBImagePickerMediaTypeVideo;
        } else {
            imagePicker.mediaType = QBImagePickerMediaTypeAny;
        }

        imagePicker.assetCollectionSubtypes = collections;

        imagePicker.delegate = self;
        self.callbackId = command.callbackId;
        [self.viewController presentViewController:imagePicker animated:YES completion:NULL];
    }];
}

#pragma mark - QBImagePickerControllerDelegate

- (void)qb_imagePickerController:(QBImagePickerController *)imagePickerController didFinishPickingAssets:(NSArray *)assets
{
    NSLog(@"Selected assets:");
    NSLog(@"%@", assets);
    PHImageManager *manager = [PHImageManager defaultManager];
    PHImageRequestOptions *options = [[PHImageRequestOptions alloc] init];
    options.synchronous = YES;

    __block NSMutableArray *resultStrings = [[NSMutableArray alloc] init];

    for (PHAsset *asset in assets) {
        NSString *filePath = [self tempFilePath:@"jpg"];
        NSURL *fileURL = [NSURL fileURLWithPath:filePath isDirectory:NO];

        CGSize targetSize;
        if (self.width == 0 && self.height == 0) {
            targetSize = PHImageManagerMaximumSize;
        } else {
            targetSize = CGSizeMake(self.width, self.height);
        }

        void (^handler)(UIImage *image, NSDictionary *info) = ^void(UIImage *image, NSDictionary *info) {
            UIImage *rotatedImage = [self imageByRotatingImage:image];

            NSDictionary *options = @{
                                      (__bridge id)kCGImageDestinationLossyCompressionQuality: @(self.quality / 100),
                                      (__bridge id)kCGImageMetadataShouldExcludeGPS: @(YES),
                                      };
            CGImageDestinationRef imageDestinationRef =
            CGImageDestinationCreateWithURL((__bridge CFURLRef)fileURL,
                                            kUTTypeJPEG,
                                            1,
                                            NULL);

            CGImageDestinationAddImage(imageDestinationRef, rotatedImage.CGImage, (__bridge CFDictionaryRef)options);
            if (CGImageDestinationFinalize(imageDestinationRef)) {
                [resultStrings addObject:[fileURL absoluteString]];
                if ([resultStrings count] == [assets count]) {
                    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:resultStrings];
                    [self didFinishImagesWithResult:pluginResult];
                }
            }
            CFRelease(imageDestinationRef);
        };

        [manager requestImageForAsset:asset
                           targetSize:targetSize
                          contentMode:PHImageContentModeAspectFill
                              options:options
                        resultHandler:handler];
    }

    [self.viewController dismissViewControllerAnimated:YES completion:NULL];
}

- (void) didFinishImagesWithResult: (CDVPluginResult *)pluginResult
{
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
    self.callbackId = nil;
}

- (void)qb_imagePickerControllerDidCancel:(QBImagePickerController *)imagePickerController
{
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"User cancelled."];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
    self.callbackId = nil;
    [self.viewController dismissViewControllerAnimated:YES completion:NULL];
}

- (NSString*)tempFilePath:(NSString*)extension
{
    NSString* docsPath = [NSTemporaryDirectory()stringByStandardizingPath];
    NSFileManager* fileMgr = [[NSFileManager alloc] init]; // recommended by Apple (vs [NSFileManager defaultManager]) to be threadsafe
    NSString* filePath;

    // generate unique file name
    int i = 1;
    do {
        filePath = [NSString stringWithFormat:@"%@/%@%03d.%@", docsPath, CDV_PHOTO_PREFIX, i++, extension];
    } while ([fileMgr fileExistsAtPath:filePath]);

    return filePath;
}

- (UIImage *)imageByRotatingImage:(UIImage *)image
{
    NSLog(@"Original Image Size %lu x %lu, orientation %ld", CGImageGetWidth(image.CGImage), CGImageGetHeight(image.CGImage), (long)image.imageOrientation);

    CGImageRef imageRef = image.CGImage;

    CGSize origImageSize = CGSizeMake(CGImageGetWidth(imageRef), CGImageGetHeight(imageRef));
    CGFloat bitmapWidth = CGImageGetWidth(imageRef);
    CGFloat bitmapHeight = CGImageGetHeight(imageRef);

    CGFloat tmpSwap = 0;
    switch (image.imageOrientation) {
        case UIImageOrientationLeft:
        case UIImageOrientationLeftMirrored:
        case UIImageOrientationRight:
        case UIImageOrientationRightMirrored:
            tmpSwap = bitmapWidth;
            bitmapWidth = bitmapHeight;
            bitmapHeight = tmpSwap;
            break;

        default:
            break;
    }

    CGColorSpaceRef colorSpaceRef = CGColorSpaceCreateDeviceRGB();
    CGContextRef bitmapRef = CGBitmapContextCreate(NULL,
                                                   bitmapWidth,
                                                   bitmapHeight,
                                                   8,
                                                   0,
                                                   colorSpaceRef,
                                                   kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);
    CGContextSetRGBFillColor (bitmapRef, 0, 0, 0, 1);// 3
    CGContextFillRect (bitmapRef, CGRectMake (0, 0, bitmapWidth, bitmapHeight ));// 4
    CGColorSpaceRelease(colorSpaceRef);

    CGAffineTransform transform = CGAffineTransformIdentity;
    switch (image.imageOrientation)
    {
        case UIImageOrientationDown:           // EXIF = 3
        case UIImageOrientationDownMirrored:   // EXIF = 4
            transform = CGAffineTransformTranslate(transform, bitmapWidth, bitmapHeight);
            transform = CGAffineTransformRotate(transform, M_PI);
            break;

        case UIImageOrientationLeft:           // EXIF = 6
        case UIImageOrientationLeftMirrored:   // EXIF = 5
            transform = CGAffineTransformTranslate(transform, bitmapWidth, 0);
            transform = CGAffineTransformRotate(transform, M_PI_2);
            break;

        case UIImageOrientationRight:          // EXIF = 8
        case UIImageOrientationRightMirrored:  // EXIF = 7
            transform = CGAffineTransformTranslate(transform, 0, bitmapHeight);
            transform = CGAffineTransformRotate(transform, -M_PI_2);
            break;
        default:
            break;
    }

    switch (image.imageOrientation) {
        case UIImageOrientationUpMirrored:     // EXIF = 2
        case UIImageOrientationDownMirrored:   // EXIF = 4
            transform = CGAffineTransformTranslate(transform, bitmapWidth, 0);
            transform = CGAffineTransformScale(transform, -1, 1);
            break;

        case UIImageOrientationLeftMirrored:   // EXIF = 5
        case UIImageOrientationRightMirrored:  // EXIF = 7
            transform = CGAffineTransformTranslate(transform, bitmapHeight, 0);
            transform = CGAffineTransformScale(transform, -1, 1);
            break;
        default:
            break;
    }

    CGContextConcatCTM(bitmapRef, transform);

    // Draw into the context; this scales the image
    CGContextDrawImage(bitmapRef, CGRectMake(0, 0, origImageSize.width, origImageSize.height), imageRef);

    // Get the resized image from the context and a UIImage
    CGImageRef newImageRef = CGBitmapContextCreateImage(bitmapRef);
    UIImage *newImage = [UIImage imageWithCGImage:newImageRef];

    // Clean up
    CGContextRelease(bitmapRef);
    CGImageRelease(newImageRef);

    NSLog(@"Oriented Image Size %lu x %lu, orientation %ld", CGImageGetWidth(newImage.CGImage), CGImageGetHeight(newImage.CGImage), (long)newImage.imageOrientation);

    return newImage;

}

@end
