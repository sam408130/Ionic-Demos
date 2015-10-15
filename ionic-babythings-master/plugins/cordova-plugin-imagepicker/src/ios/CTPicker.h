//
//  CTPicker.h
//
//  Created by Christopher Sullivan on 10/25/13.
//  Updated by Jeduan Cornejo on 07/06/15
//

#import <Cordova/CDVPlugin.h>
#import "QBImagePickerController.h"

@interface CTPicker : CDVPlugin <QBImagePickerControllerDelegate>

- (void) getPictures:(CDVInvokedUrlCommand *)command;

@property (nonatomic, assign) NSInteger width;
@property (nonatomic, assign) NSInteger height;
@property (nonatomic, assign) NSInteger quality;

@end
