var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas);

var createScene = async function () {
  var scene = new BABYLON.Scene(engine);

  //scene.createDefaultCameraOrLight(true, false, true);
  var camera = new BABYLON.ArcRotateCamera(
    "camera1",
    Math.PI * 2,
    Math.PI * -1,
    6,
    new BABYLON.Vector3(0, 10, 0),
    scene
  );
  //camera.setTarget(BABYLON.Vector3.Zero());

  var light = new BABYLON.PointLight("light", new BABYLON.Vector3(1, 1, 0), scene);
  var envlight = new BABYLON.HemisphericLight("envlight", new BABYLON.Vector3(10, 10, 10), scene);

  light.intensity = 0.01;
  light.diffuse = new BABYLON.Color3(0,9,0);
  envlight.intensity = 0.1;

  var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("./gTexture.png", scene);
  groundMaterial.maxSimultaneousLights = 16;

  

  

  var ground = new BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "ground",
    "./maze16x16.png",
    {
      height: 16,
      width: 16,
      depth: 10,
      subdivisions: 384,
      maxHeight: 5
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



  var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  shadowGenerator.addShadowCaster(ground);

  ground.recieveShadows = true;


  class Enemy{
    constructor(name, position, scene){
      this.name = name;
      this.enemyLight = new BABYLON.PointLight("enemyLight", new BABYLON.Vector3(0, 10, 0), scene);
      this.enemyLight.diffuse = new BABYLON.Color3(9,0,0);
      
      this.mesh = new BABYLON.MeshBuilder.CreateBox(name,{
        size: 0.1,
        width: 0.1,
        height: 0.11,
        depth: 0.1
      }, scene);
      this.mesh.position.copyFrom(position);

      this.physics = new BABYLON.PhysicsAggregate(this.mesh, BABYLON.PhysicsShapeType.BOX,{mass: 1},scene)

      
      this.update()
      
    }

    update(){
      
      
      this.enemyLight.intensity = 0.1;
      
      this.enemyLight.position = this.mesh.position;
      if (box1.intersectsMesh(this.mesh, false)){
        console.log("AAA")
        this.enemyLight.diffuse = new BABYLON.Color3(0,0,9);
        light.diffuse = new BABYLON.Color3(0,0,0);
        //alert("Enemy hit");
        playerAggregate.body.applyForce(new BABYLON.Vector3(0, -1000 * speed,0),
        box1.absolutePosition
        );
        
      }
      
      
      
    }
  }

  


  function startPos(){
    const newPosition = new BABYLON.Vector3(-7.5, 2, 7.2)
    box1.position.copyFrom(newPosition)
  }
  startPos();

  var restart = true;
  async function gameOver(){
    var far = BABYLON.Vector3.Distance(box1.position, ground.position);
    console.log(far)
    //var restart = true;
    if (far > 20 && restart){
      playerAggregate.body.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
      startPos();
      playerAggregate.body.setLinearVelocity(new BABYLON.Vector3(0, -10, 0));
      startPos();
      //restart = false;
      far = 0;
      
      
    }
  }

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
  startPos();
  

  

  const enemy1 = new Enemy("enemy1", new BABYLON.Vector3(-7,2,7.2), scene);
  const enemy2 = new Enemy("enemy2", new BABYLON.Vector3(-6,2,7.2), scene);
  const enemy3 = new Enemy("enemy3", new BABYLON.Vector3(-7, 2, 4), scene);
  const enemy4 = new Enemy("enemy4", new BABYLON.Vector3(-4,2,7.2), scene);

  const enemyList = [enemy1, enemy2, enemy3, enemy4];

  const mazeAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.MESH,{
    mass: 0,
    friction: 1
  }, scene)

  


  scene.onBeforeRenderObservable.add(() => {

    var vel1 = playerAggregate.body;
    const vel = vel1.getLinearVelocity();
    console.log("vel:",new BABYLON.Vector3.Normalize((vel)));

    light.position = camera.position;
    gameOver();
    
    enemyList.forEach((enemy) => {
      enemy.update();
    })

    

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
