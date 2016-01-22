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
#import "ESTDefinitions.h"

NS_ASSUME_NONNULL_BEGIN

/**
 *  ESTConfig is used to configure Estimote Cloud API. It allows to authorize app using AppID and AppToken 
 *  and configure Estimote Analytics settings.
 */

@interface ESTConfig : NSObject

#pragma mark - Configuration

/**
 * Sets App ID and App Token, enabling communication with the Estimote Cloud API.
 *
 * You can find your API App ID and API App Token in the Account Settings section of the Estimote Cloud.
 *
 * @param appID The API App ID.
 * @param appToken The API App Token.
 */
+ (void)setupAppID:(NSString *)appID andAppToken:(NSString *)appToken;

/**
 * Returns currently used App ID.
 *
 * @return currently used App ID.
 */
+ (NSString * _Nullable)appID;

/**
 * Returns currently used App Token.
 *
 * @return currently used App Token.
 */
+ (NSString * _Nullable)appToken;

/**
 * Checks if App ID and App Token were set.
 */
+ (BOOL)isAuthorized;

/**
 *  Enables analytics requests on Enter/Exit monitoring events. Analytics data
 *  is collected in the Estimote Cloud.
 *
 *  @param enable flag indicating if analytics for monitoring should be enabled
 */
+ (void)enableMonitoringAnalytics:(BOOL)enable;

/**
 *  Enables analytics requests for ranging events.
 *  Information about beacons and their Proximity is collected
 *  in the Estimote Cloud.
 *
 *  @param enable flag indicating if analytics for ranging should be enabled
 */
+ (void)enableRangingAnalytics:(BOOL)enable;

/**
 *  When GPS Positioning is turned on analytics events
 *  contains information about GPS Location.
 *
 *  @param enable flag indicating if GPS Positioning should be enabled
 */
+ (void)enableGPSPositioningForAnalytics:(BOOL)enable;

/**
 *  Indicates current state of monitoring analytics.
 *
 *  @return flag that indicates if analytics is enabled
 */
+ (BOOL)isMonitoringAnalyticsEnabled;

/**
 *  Indicates current state of ranging analytics.
 *
 *  @return flag that indicates if analytics is enabled
 */
+ (BOOL)isRangingAnalyticsEnabled;

@end

NS_ASSUME_NONNULL_END
