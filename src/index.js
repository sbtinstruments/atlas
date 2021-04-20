
import { Cesium3DTileset, createWorldTerrain, IonResource, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import SceneMode from 'cesium/Source/Scene/SceneMode';
import "./css/main.css";
import Transforms from 'cesium/Source/Core/Transforms';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import Matrix4 from 'cesium/Source/Core/Matrix4';
// This is simplified version of Cesium's Getting Started tutorial.
// See https://cesium.com/docs/tutorials/getting-started/ for more details.

var viewer = new Viewer('cesiumContainer');

viewer.scene.mode = SceneMode.SCENE3D
//////////////////////////////////////////////////////////////////////////
// Configuring the Scene
//////////////////////////////////////////////////////////////////////////

// Enable lighting based on sun/moon positions
viewer.scene.globe.enableLighting = true;

// Set up 
function icrf(scene, time) {
    if (scene.mode !== SceneMode.SCENE3D) {
        return;
    }
    var icrfToFixed = Transforms.computeIcrfToFixedMatrix(time);
    if (icrfToFixed) {
        var camera = viewer.camera;
        var offset = Cartesian3.clone(camera.position);
        var transform = Matrix4.fromRotationTranslation(icrfToFixed);
        camera.lookAtTransform(transform, offset);
    }
}
// // Set up clock and timeline.

// viewer.clock.shouldAnimate = true; // default
// // viewer.clock.multiplier = 800;
// // viewer.scene.primitives.add(tileset);
// // viewer.zoomTo(tileset);


function viewInICRF() {        
    viewer.clock.multiplier = 60 * 60;
    viewer.scene.postUpdate.addEventListener(icrf);
    viewer.scene.globe.enableLighting = true;
}

viewInICRF()