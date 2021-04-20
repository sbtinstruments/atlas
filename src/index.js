
import { Cesium3DTileset, createWorldTerrain, IonResource, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./css/main.css";

// This is simplified version of Cesium's Getting Started tutorial.
// See https://cesium.com/docs/tutorials/getting-started/ for more details.

var viewer = new Viewer('cesiumContainer');
//////////////////////////////////////////////////////////////////////////
// Configuring the Scene
//////////////////////////////////////////////////////////////////////////

// Enable lighting based on sun/moon positions
viewer.scene.globe.enableLighting = true;

// Set up 
// Set up clock and timeline.

viewer.clock.shouldAnimate = true; // default
viewer.clock.multiplier = 800;
viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);

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
    viewer.clock.multiplier = 3 * 60 * 60*100;
    viewer.scene.postUpdate.addEventListener(icrf);
    viewer.scene.globe.enableLighting = true;
}

viewInICRF()