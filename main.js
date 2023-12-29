var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas);

var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  //scene.createDefaultCameraOrLight(true, false, true);
  var camera = new BABYLON.ArcRotateCamera(
    "camera1",
    Math.PI * 2,
    Math.PI / 16,
    10,
    new BABYLON.Vector3(0, 10, 0),
    scene
  );
  //camera.setTarget(BABYLON.Vector3.Zero());

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

  const box1 = new BABYLON.MeshBuilder.CreateBox('mc', {
    size: 0.1,
    width: 0.1,
    height: 0.11,
    depth: 0.1,
    faceColors: [
      BABYLON.Color3.Green(),
      BABYLON.Color3.Blue(),
      BABYLON.Color3.Yellow(),
      BABYLON.Color3.Blue(),
      BABYLON.Color3.Red()
    ]
  });

  const newPosition = new BABYLON.Vector3(-8, 0.1, 7.2);
  box1.position.copyFrom(newPosition);

  camera.lockedTarget = box1;

  const inputMap = {};
  scene.actionManager = new BABYLON.ActionManager(scene);

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
    inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
  }));

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
    inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
  }));

  var speed = 2;

  scene.onBeforeRenderObservable.add(() => {
    if (inputMap["ArrowLeft"]){
      box1.position.z -= 0.01 * speed;
    }
    if (inputMap["ArrowRight"]){
      box1.position.z += 0.01 * speed;
    }
    if (inputMap["ArrowUp"]){
      box1.position.x -= 0.01 * speed;
    }
    if (inputMap["ArrowDown"]){
      box1.position.x += 0.01 * speed;
    }

    camera.position.x = box1.position.x;
    camera.position.z = box1.position.z;
  });

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
