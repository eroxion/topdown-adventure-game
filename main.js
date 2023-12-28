var canvas = document.getElementById("renderCanvas");

var engine = new BABYLON.Engine(canvas);

var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  scene.createDefaultCameraOrLight(true, false, true);

  var ground = new BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "",
    "./maze16x16.png",
    {
      height: 16,
      width: 16,
      depth: 10,
      subdivisions: 300,
    }
  );

  return scene;
};

var scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
