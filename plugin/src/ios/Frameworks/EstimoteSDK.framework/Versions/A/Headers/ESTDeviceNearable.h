//
//   ______     _   _                 _          _____ _____  _  __
//  |  ____|   | | (_)               | |        / ____|  __ \| |/ /
//  | |__   ___| |_ _ _ __ ___   ___ | |_ ___  | (___ | |  | | ' /
//  |  __| / __| __| | '_ ` _ \ / _ \| __/ _ \  \___ \| |  | |  <
//  | |____\__ \ |_| | | | | | | (_) | ||  __/  ____) | |__| | . \
//  |______|___/\__|_|_| |_| |_|\___/ \__\___| |_____/|_____/|_|\_\
//
//
//  Copyright (c) 2015 Estimote. All rights reserved.

#import <Foundation/Foundation.h>
#import "ESTDeviceConnectable.h"

#define ESTDeviceNearableErrorDomain @"ESTDeviceNearableErrorDomain"

typedef NS_ENUM(NSInteger, ESTDeviceNearableError)
{
    ESTDeviceNearableErrorDeviceNotConnected,
    ESTDeviceNearableErrorConnectionOwnershipVerificationFail,
    ESTDeviceNearableErrorDisconnectDuringConnection,
    ESTDeviceNearableErrorConnectionVersionReadFailed,
    ESTDeviceNearableErrorSettingNotSupported,
    ESTDeviceNearableErrorSettingWriteValueMissing,
    ESTDeviceNearableErrorSettingCloudSaveFailed,
    ESTDeviceNearableErrorConnectionCloudConfirmationFailed,
    ESTDeviceNearableErrorUpdateNotAvailable,
    ESTDeviceNearableErrorFailedToDownloadFirmware
};

NS_ASSUME_NONNULL_BEGIN


@interface ESTDeviceNearable : ESTDeviceConnectable

- (void)checkFirmwareUpdateWithCompletion:(ESTObjectCompletionBlock)completion;

- (void)updateFirmwareWithData:(NSData *)data
                      progress:(ESTProgressBlock)progress
                    completion:(ESTCompletionBlock)completion;

- (void)updateFirmwareWithProgress:(ESTProgressBlock)progress
                        completion:(ESTCompletionBlock)completion;

@end

NS_ASSUME_NONNULL_END
