/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        /* BEGIN code added to demo Estimote beacon plugin */
        // Look for beacons
        window.EstimoteBeacons.startRangingBeaconsInRegion(function () {

            // every 5 seconds get list of beacons
            setInterval(function () {
                window.EstimoteBeacons.getBeacons(function (beacons) {
                    if (beacons && beacons.length) {
                        // Display properties for first beacon in list.
                        var beacon = beacons[0];
                        document.getElementById("accuracy").innerHTML = beacon.accuracy.toString();
                        document.getElementById("debugDescription").innerHTML = beacon.debugDescription.toString();
                        document.getElementById("description").innerHTML = beacon.description.toString();
                        document.getElementById("isConnected").innerHTML = beacon.isConnected.toString();
                        document.getElementById("proximity").innerHTML = beacon.proximity.toString();
                        document.getElementById("proximityUUID").innerHTML = beacon.proximityUUID.toString();
                        document.getElementById("rssi").innerHTML = beacon.rssi.toString();
                    }
                });
            }, 5000);
        });
        /* END code added to demo Estimote beacon plugin */

    }

};
