import * as BABYLON from '@babylonjs/core';

const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2,Math.PI / 2, 2, new BABYLON.Vector3(0,0,0),scene);
  camera.attachControl(canvas, true);

  scene.createDefaultCameraOrLight(true, false, true);

  const box = new BABYLON.MeshBuilder.CreateBox('myBox', {
    size: 5,
    width: 1,
    height: 0.05,
    depth: 1,
    faceColors: [
      new BABYLON.Color4(1, 0, 0, 1),
      BABYLON.Color3.Green(),
      BABYLON.Color3.Blue(),
      BABYLON.Color3.Yellow(),
      BABYLON.Color3.Blue(),
      BABYLON.Color3.Red()
    ]
  });

  const box1 = new BABYLON.MeshBuilder.CreateBox('mc', {
    size: 0.1,
    width: 0.1,
    height: 0.05,
    depth: 0.1,
  });

  // New position (shifting from the center)
  const newPosition = new BABYLON.Vector3(0, 0.05, 0);
  box1.position.copyFrom(newPosition);

  camera.lockedTarget = box1;

  //input handling
  const inputMap = {};
  scene.actionManager = new BABYLON.ActionManager(scene);

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
    inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
  }));

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
    inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
  }));

  //Update function to move the box
  scene.onBeforeRenderObservable.add(() => {
    if (inputMap["ArrowLeft"]){
      box1.position.x -= 0.01;
    }
    if (inputMap["ArrowRight"]){
      box1.position.x += 0.01;
    }
    if (inputMap["ArrowUp"]){
      box1.position.z += 0.01;
    }
    if (inputMap["ArrowDown"]){
      box1.position.z -= 0.01;
    }

    camera.position.x = box1.position.x;
    camera.position.z = box1.position.z;
  });

  return scene;
}

const scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener('resize', function () {
  engine.resize();
});