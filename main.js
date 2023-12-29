var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas);

var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  
  var camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 21, 0),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());

  scene.createDefaultLight(true);

  var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("./gTexture.png", scene);

  var ground = new BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "ground",
    "./maze16x16.png",
    {
      height: 16,
      width: 16,
      depth: 10,
      subdivisions: 1088,
    },
    scene
  );

  ground.material = groundMaterial;
  return scene;
};

var scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
