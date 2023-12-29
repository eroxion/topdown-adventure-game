var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas);

var createScene = async function () {
  var scene = new BABYLON.Scene(engine);

  //scene.createDefaultCameraOrLight(true, false, true);
  var camera = new BABYLON.ArcRotateCamera(
    "camera1",
    Math.PI * 2,
    Math.PI / 20,
    5,
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
      subdivisions: 384,
    },
    scene
  );

  const box1 = new BABYLON.MeshBuilder.CreateBox('box1', {
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

  const newPosition = new BABYLON.Vector3(-7.5, 10, 7.2);
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

  var speed = 4;

  var havokInstance = await HavokPhysics();
  var hk = new BABYLON.HavokPlugin(true, havokInstance);
  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);

  const playerAggregate = new BABYLON.PhysicsAggregate(box1, BABYLON.PhysicsShapeType.BOX, {
    mass: 1
  }, scene);

  const mazeAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.MESH,{
    mass: 0,
    friction: 1
  }, scene)


  scene.onBeforeRenderObservable.add(() => {
    if (inputMap["ArrowLeft"]){
      playerAggregate.body.applyForce(
        new BABYLON.Vector3(0, 0, -1 * speed),
        box1.absolutePosition
      );
    }
    if (inputMap["ArrowRight"]){
      playerAggregate.body.applyForce(
        new BABYLON.Vector3(0, 0, 1 * speed),
        box1.absolutePosition
      );
    }
    if (inputMap["ArrowUp"]){
      playerAggregate.body.applyForce(
        new BABYLON.Vector3(-1 * speed, 0, 0),
        box1.absolutePosition
      );
    }
    if (inputMap["ArrowDown"]){
      playerAggregate.body.applyForce(
        new BABYLON.Vector3(1 * speed, 0, 0),
        box1.absolutePosition
      );
    }
    else {
      playerAggregate.body.applyForce(
        new BABYLON.Vector3(0, 0, 0),
        box1.absolutePosition
      );
    }

    camera.position.x = box1.position.x;
    camera.position.z = box1.position.z;
  });




  


  ground.material = groundMaterial;
  return scene;
};

createScene().then((scene) => {
  engine.runRenderLoop(function () {
    if (scene) {
      scene.render();
    }
  });
});

window.addEventListener("resize", function () {
  engine.resize();
});
