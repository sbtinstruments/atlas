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
    viewer.clock.multiplier = 800;

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
  

    function viewInICRF() {        
        viewer.clock.multiplier = 60 * 60;
        viewer.scene.postUpdate.addEventListener(icrf);
        viewer.scene.globe.enableLighting = true;
    }

    viewInICRF()

    viewer.dataSources.add(
        Cesium.KmlDataSource.load(
            "../data/kml/testpoint.kml",
            options
        )
    );

}());
