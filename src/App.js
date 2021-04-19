(function () {
    "use strict";

    // TODO: Add your ion access token from cesium.com/ion/
    // Cesium.Ion.defaultAccessToken = '<YOUR ACCESS TOKEN HERE>';

    //////////////////////////////////////////////////////////////////////////
    // Creating the Viewer
    //////////////////////////////////////////////////////////////////////////

    var viewer = new Cesium.Viewer('cesiumContainer', {
        scene3DOnly: true,
        selectionIndicator: false,
        baseLayerPicker: false
    });



    //////////////////////////////////////////////////////////////////////////
    // Configuring the Scene
    //////////////////////////////////////////////////////////////////////////

    // Enable lighting based on sun/moon positions
    viewer.scene.globe.enableLighting = true;

    // // Create an initial camera view
    // var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
    // var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
    // var homeCameraView = {
    //     destination : initialPosition,
    //     orientation : {
    //         heading : initialOrientation.heading,
    //         pitch : initialOrientation.pitch,
    //         roll : initialOrientation.roll
    //     }
    // };
    // Set the initial view
    // viewer.scene.camera.setView(homeCameraView);

    // Add some camera flight animation options
    homeCameraView.duration = 2.0;
    homeCameraView.maximumHeight = 2000;
    homeCameraView.pitchAdjustHeight = 2000;
    homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
    // Override the default home button
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true;
        viewer.scene.camera.flyTo(homeCameraView);
    });

    // Set up clock and timeline.
    // viewer.clock.shouldAnimate = true; // default
    // viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
    // viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
    // viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
    // viewer.clock.multiplier = 2; // sets a speedup
    // viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
    // viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
    // viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range

    //////////////////////////////////////////////////////////////////////////
    // Loading and Styling Entity Data
    //////////////////////////////////////////////////////////////////////////

    var kmlOptions = {
        camera : viewer.scene.camera,
        canvas : viewer.scene.canvas
    };
    

   

    //////////////////////////////////////////////////////////////////////////
    // Setup Camera Modes
    //////////////////////////////////////////////////////////////////////////

    // var freeModeElement = document.getElementById('freeMode');
    // var droneModeElement = document.getElementById('droneMode');

    // // Create a follow camera by tracking the drone entity
    // function setViewMode() {
    //     if (droneModeElement.checked) {
    //         viewer.trackedEntity = drone;
    //     } else {
    //         viewer.trackedEntity = undefined;
    //         viewer.scene.camera.flyTo(homeCameraView);
    //     }
    // }

    // freeModeElement.addEventListener('change', setViewMode);
    // droneModeElement.addEventListener('change', setViewMode);

    // viewer.trackedEntityChanged.addEventListener(function() {
    //     if (viewer.trackedEntity === drone) {
    //         freeModeElement.checked = false;
    //         droneModeElement.checked = true;
    //     }
    // });

    //////////////////////////////////////////////////////////////////////////
    // Setup Display Options
    //////////////////////////////////////////////////////////////////////////

    // var shadowsElement = document.getElementById('shadows');
    // var neighborhoodsElement =  document.getElementById('neighborhoods');

    // shadowsElement.addEventListener('change', function (e) {
    //     viewer.shadows = e.target.checked;
    // });

    // neighborhoodsElement.addEventListener('change', function (e) {
    //     neighborhoods.show = e.target.checked;
    // });

    // // Finally, wait for the initial city to be ready before removing the loading indicator.
    // var loadingIndicator = document.getElementById('loadingIndicator');
    // loadingIndicator.style.display = 'block';
    // city.readyPromise.then(function () {
    //     loadingIndicator.style.display = 'none';
    // });

}());
