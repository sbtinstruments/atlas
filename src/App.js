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
    var options = {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
    };
    //////////////////////////////////////////////////////////////////////////
    // Configuring the Scene
    //////////////////////////////////////////////////////////////////////////

    // Enable lighting based on sun/moon positions
    viewer.scene.globe.enableLighting = true;

    // Set up 
    // Set up clock and timeline.

    viewer.clock.shouldAnimate = true; // default
    //viewer.clock.multiplier = 800;

    function icrf(scene, time) {
        if (scene.mode !== Cesium.SceneMode.SCENE3D) {
            return;
        }
        var icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
        if (Cesium.defined(icrfToFixed)) {
            var camera = viewer.camera;
            var offset = Cesium.Cartesian3.clone(camera.position);
            var transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
            camera.lookAtTransform(transform, offset);
        }
    }

    // function toDegrees(cartesian3Pos) {
    //     let pos = Cesium.Cartographic.fromCartesian(cartesian3Pos)
    //     return [pos.longitude / Math.PI * 180, pos.latitude / Math.PI * 180]
    // }

    // function clamp_selection_indicator_to_ground(selectionIndicator) {
    //     c3 = toDegrees(selectionIndicator.Cartesian3())
    // }
  

    function viewInICRF() {        
        //viewer.clock.multiplier = 60 * 60;
        viewer.scene.postUpdate.addEventListener(icrf);
        viewer.scene.globe.enableLighting = true;
    }

    viewInICRF()
    //clamp_selection_indicator_to_ground(viewer.selectionIndicator)

    viewer.dataSources.add(
        Cesium.KmlDataSource.load(
            "../data/kml/locations.kml",
            options
        )
    ).then(function (datasource) { 
        var new_point = datasource.entities.values[0];
        viewer.selectedEntity = new_point;
    });

    // Choose a new selection every rotation
    var armed = false;
    var index = 0;
    function select_new() {
        if (armed == true && Cesium.JulianDate.daysDifference(viewer.clock.currentTime, viewer.clock.startTime) % 1.0 < 0.01) {
            index = (index+1)%(viewer.dataSources.get(0).entities.values.length);
            viewer.selectedEntity = viewer.dataSources.get(0).entities.values[index];
            armed = false;
        }
        else if (Cesium.JulianDate.daysDifference(viewer.clock.currentTime, viewer.clock.startTime) % 1.0 >= 0.01)  {
            armed = true;
        }
    }
    var unsubscribe = viewer.clock.onTick.addEventListener(select_new);

}());
