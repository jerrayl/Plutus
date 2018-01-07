package com.app.plutus;

import android.app.Application;
import android.content.Intent;
import android.os.RemoteException;
import android.util.Log;

import org.altbeacon.beacon.Beacon;
import org.altbeacon.beacon.BeaconConsumer;
import org.altbeacon.beacon.BeaconManager;
import org.altbeacon.beacon.BeaconParser;
import org.altbeacon.beacon.Identifier;
import org.altbeacon.beacon.RangeNotifier;
import org.altbeacon.beacon.Region;
import org.altbeacon.beacon.startup.BootstrapNotifier;
import org.altbeacon.beacon.startup.RegionBootstrap;

import java.util.Collection;

/**
 * Created by user on 30/7/2016.
 */
public class MainApplication extends Application implements BootstrapNotifier {
    private static final String BEACON_UUID = "0A39F473F54BC4A12F17D1AD07A96100000000C8";

    private RegionBootstrap regionBootstrap;
    private BeaconManager beaconManager;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    public void startScanning() {
        Region region = new Region("All", null, null, null);
        regionBootstrap = new RegionBootstrap(this, region);

        beaconManager = BeaconManager.getInstanceForApplication(this);
        beaconManager.getBeaconParsers().add(new BeaconParser().
                setBeaconLayout(BeaconParser.EDDYSTONE_UID_LAYOUT));
        beaconManager.setAndroidLScanningDisabled(true);
        beaconManager.setBackgroundBetweenScanPeriod(2000);
    }

    @Override
    public void didEnterRegion(Region region) {
        Intent i = new Intent(this, MainActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(i);
        Log.d("test", "Enterto");
        Log.d("test", region.getId1().toUuid().toString());
    }

    @Override
    public void didExitRegion(Region region) {
        Log.d("test", "Exito");
    }

    @Override
    public void didDetermineStateForRegion(int i, Region region) {

    }
}
