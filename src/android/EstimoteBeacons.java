package com.evothings;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.Context;
import android.util.Log;
import java.io.InputStream;
import com.estimote.sdk.*;
import java.util.List;

public class EstimoteBeacons extends CordovaPlugin {
	private Context mContext;
	private BeaconManager mBeaconManager;
	//private static final Region ALL_ESTIMOTE_BEACONS_REGION = new Region("rid", null, null, null);
	private boolean mIsConnected = false;

	private static final String TAG = "EstimoteBeacons";

	@Override
	public void initialize(final CordovaInterface cordova, CordovaWebView webView) {
		Log.i(TAG, "initialize");
		super.initialize(cordova, webView);
		mContext = webView.getContext();
		if(mBeaconManager == null)
			mBeaconManager = new BeaconManager(mContext);
	}

	/**
	* Called when the WebView does a top-level navigation or refreshes.
	*
	* Plugins should stop any long-running processes and clean up internal state.
	*
	* Does nothing by default.
	*
	* Our version should stop any ongoing scan, and close any existing connections.
	*/
	@Override
	public void onReset() {
		Log.i(TAG, "onReset");
		if(mBeaconManager != null && mIsConnected) {
			mBeaconManager.disconnect();
			mIsConnected = false;
		}
	}

	@Override
	public boolean execute(String action, CordovaArgs args, final CallbackContext callbackContext)
		throws JSONException
	{
		if("startEstimoteBeaconsDiscoveryForRegion".equals(action)) {
			startEstimoteBeaconsDiscoveryForRegion(args, callbackContext);
			return true;
		}
		return false;
	}

	// Returns the value mapped by name if it exists and is a positive integer no larger than 0xFFFF.
	// Returns null otherwise.
	private static Integer optUInt16Null(JSONObject args, final String name) {
		int i = args.optInt(name, -1);
		if(i < 0 || i > (0xFFFF))
			return null;
		else
			return new Integer(i);
	}

/* * region format:
 *   {
 *     uuid: string,
 *     identifier: string,
 *     major: number,
 *     minor: number,
 *   }*/

	private void startEstimoteBeaconsDiscoveryForRegion(CordovaArgs ca, final CallbackContext callbackContext) throws JSONException {
		JSONObject args = ca.getJSONObject(0);
		Log.i(TAG, "startEstimoteBeaconsDiscoveryForRegion");

		final Region region = new Region(
			args.optString("identifier", ""),
			args.optString("uuid", null),
			optUInt16Null(args, "major"),
			optUInt16Null(args, "minor"));

/*
 * beaconInfo format:
 *   {
 *     region: region,
 *     beacons: array of beacon
 *   }
 *
*/
    mBeaconManager.setRangingListener(new BeaconManager.RangingListener() {
      @Override
      public void onBeaconsDiscovered(Region region, final List<Beacon> beacons) {
        // Note that results are not delivered on UI thread.

				// Note that beacons reported here are already sorted by estimated
				// distance between device and beacon.
				//getActionBar().setSubtitle("Found beacons: " + beacons.size());
				//adapter.replaceWith(beacons);

				Log.i(TAG, "onBeaconsDiscovered");

				JSONObject o = new JSONObject();
				try {
					o.put("region", makeJSONRegion(region));
					o.put("beacons", makeJSONBeacons(beacons));
				} catch(Exception e) {
					Log.e(TAG, "JSON", e);
					throw new Error(e);
				}

				PluginResult r = new PluginResult(PluginResult.Status.OK, o);
				r.setKeepCallback(true);
				callbackContext.sendPluginResult(r);
      }
    });
		if(mIsConnected) {
			try {
				Log.i(TAG, "startRanging");
				mBeaconManager.startRanging(region);
			} catch(android.os.RemoteException e) {
				Log.e(TAG, "startRanging", e);
				throw new Error(e);
			}
		} else {
			Log.i(TAG, "connect");
			mBeaconManager.connect(new BeaconManager.ServiceReadyCallback() {
				@Override public void onServiceReady() {
					try {
						mIsConnected = true;
						Log.i(TAG, "onServiceReady");
						mBeaconManager.startRanging(region);
					} catch(android.os.RemoteException e) {
						Log.e(TAG, "startRanging", e);
						throw new Error(e);
					}
				}
			});
		}
	}

	private static JSONObject makeJSONRegion(Region region)
	throws Error	// This function may not throw any Exceptions.
	{
		try {
			JSONObject o = new JSONObject();
			o.put("identifier", region.getIdentifier());
			o.put("uuid", region.getProximityUUID());
			o.put("major", region.getMajor());
			o.put("minor", region.getMinor());
			return o;
		} catch(Exception e) {
			Log.e(TAG, "JSON", e);
			// This hack bypasses the ban on normal exceptions in Estimote callbacks.
			// OK since any exception inside here is a programmer error.
			throw new Error(e);
		}
	}

/*
 * beacon format:
 *   {
Properties Available After CoreLocation Based Scan

      proximityUUID property
      distance property
      proximity property

Properties Available After CoreBluetooth Based Scan

      macAddress property
      rssi property
      measuredPower property
      firmwareState property
      peripheral property

Properties Available After Connecting

      name property
      motionProximityUUID property
      power property
      advInterval property
      batteryLevel property
      remainingLifetime property
      batteryType property
      hardwareVersion property
      firmwareVersion property
      firmwareUpdateInfo property
      isMoving property
      isAccelerometerAvailable property
      isAccelerometerEditAvailable property
      accelerometerEnabled property
      basicPowerMode property
      smartPowerMode property
 *   }
String 	getMacAddress()
int 	getMajor()
int 	getMeasuredPower()
int 	getMinor()
String 	getName()
String 	getProximityUUID()
int 	getRssi()
*/
	private static JSONArray makeJSONBeacons(final List<Beacon> beacons) throws Error {
		try {
			JSONArray a = new JSONArray();
			for(Beacon b : beacons) {
				JSONObject o = new JSONObject();
				o.put("major", b.getMajor());
				o.put("minor", b.getMinor());
				o.put("rssi", b.getRssi());
				o.put("measuredPower", b.getMeasuredPower());
				o.put("proximityUUID", b.getProximityUUID());
				o.put("name", b.getName());
				o.put("macAddress", b.getMacAddress());

				a.put(o);
			}
			return a;
		} catch(Exception e) {
			Log.e(TAG, "JSON", e);
			throw new Error(e);
		}
	}
}
