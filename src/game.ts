import { AnimsTimerSystem } from './cars'
import utils from '../node_modules/decentraland-ecs-utils/index'

engine.addSystem(new AnimsTimerSystem())

//add Static Base
let plaza = new Entity()
plaza.addComponent(new GLTFShape('models/VegasPlaza.glb'))
plaza.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

engine.addEntity(plaza)

//add VegasPlaza Stage
let stage = new Entity()
stage.addComponent(new GLTFShape('models/VegasPlaza_Stage.glb'))
stage.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

engine.addEntity(stage)

//add SpiderWeb_Light_01
let spiderweb_01 = new Entity()
spiderweb_01.addComponent(new GLTFShape('models/SpiderWeb_Light_01.glb'))
spiderweb_01.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

engine.addEntity(spiderweb_01)

//add SpiderWeb_Light_02
let spiderweb_02 = new Entity()
spiderweb_02.addComponent(new GLTFShape('models/SpiderWeb_Light_02.glb'))
spiderweb_02.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

engine.addEntity(spiderweb_02)

//add Skeleton
let skeleton = new Entity()
skeleton.addComponent(new GLTFShape('models/skeleton.glb'))
skeleton.addComponent(
  new Transform({
    position: new Vector3(160, 1.7, 65),
    scale: new Vector3 (3,3,3)
  })
)

let animator = new Animator()
skeleton.addComponent(animator)
let clipThriller = new AnimationState("thriller_base", {speed: 0.5})

animator.addClip(clipThriller)
clipThriller.play()

engine.addEntity(skeleton)

//add skeleton2  2
let skeleton2 = new Entity()
skeleton2.addComponent(new GLTFShape('models/skeleton.glb'))
skeleton2.addComponent(
  new Transform({
    position: new Vector3(155, 1.7, 61),
    scale: new Vector3 (3,3,3)
  })
)

let animator2 = new Animator()
skeleton2.addComponent(animator)
let clipThriller2 = new AnimationState("thriller_base", {speed: 0.5})

animator.addClip(clipThriller2)
clipThriller2.play()

engine.addEntity(skeleton2)

//add skeleton3  2
let skeleton3 = new Entity()
skeleton3.addComponent(new GLTFShape('models/skeleton.glb'))
skeleton3.addComponent(
  new Transform({
    position: new Vector3(165, 1.75, 61),
    scale: new Vector3 (3,3,3)
  })
)

let animator3 = new Animator()
skeleton3.addComponent(animator)
let clipThriller3 = new AnimationState("thriller_base", {speed: 0.5})

animator.addClip(clipThriller3)
clipThriller3.play()

engine.addEntity(skeleton3)

//add skeleton_02
let skeleton_02 = new Entity()
skeleton_02.addComponent(new GLTFShape('models/skeleton_02.glb'))
skeleton_02.addComponent(
  new Transform({
    position: new Vector3(124, 7, 56),
    scale: new Vector3 (5,5,5)
  })
)

engine.addEntity(skeleton_02)

//add skeleton_03
let skeleton_03 = new Entity()
skeleton_03.addComponent(new GLTFShape('models/skeleton_02.glb'))
skeleton_03.addComponent(
  new Transform({
    position: new Vector3(196, 7, 56),
    scale: new Vector3 (5,5,5)
  })
)

engine.addEntity(skeleton_03)

//add ram
let ram = new Entity()
ram.addComponent(new GLTFShape('models/ram.glb'))
ram.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

engine.addEntity(ram)

//add light_bottom
let light_bottom = new Entity()
light_bottom.addComponent(new GLTFShape('models/lights_bottom.glb'))
light_bottom.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

engine.addEntity(light_bottom)


//add FortuneCat
let FortuneCat = new Entity()
FortuneCat.addComponent(new GLTFShape('models/FortuneCat.glb'))
FortuneCat.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const FortuneCatAnimator = new Animator()
FortuneCat.addComponent(FortuneCatAnimator)
let playFortuneCat = new AnimationState('Cat_Action')
FortuneCatAnimator.addClip(playFortuneCat)
playFortuneCat.play()
engine.addEntity(FortuneCat)

//add Ship
let Ship = new Entity()

Ship.addComponent(new GLTFShape('models/Ship.glb'))

Ship.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const ShipAnimator = new Animator()

Ship.addComponent(ShipAnimator)
let playShip = new AnimationState('Ship_ArmatureAction.001')
ShipAnimator.addClip(playShip)
playShip.play()
engine.addEntity(Ship)

engine.addEntity(Ship)

//add LightsShip

let LightsShip = new Entity()

LightsShip.addComponent(new GLTFShape('models/Lights_Center.glb'))

LightsShip.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const LightsShipAnimator = new Animator()

LightsShip.addComponent(LightsShipAnimator)
let playLightsShip = new AnimationState('LightsShip_Action')
LightsShipAnimator.addClip(playLightsShip)
playLightsShip.play()
engine.addEntity(LightsShip)

engine.addEntity(LightsShip)

//////////////////  MACHINES

import { overalyUI } from './modules/DecentralAPI'
import { Slots } from './slots/Slots'
import { Roulette } from './roulette/Roulette'

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// create the game instance and pass top bet amount and jackpot multiplication factors
// (in payout mode the top bet amount is obtained from the blockchain)
const instanceSlots = new Slots(20, [250, 15, 8, 4])

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// create the roulette table and roulette UI, and set the maximum bet amount
// (in payout mode the maximum bet amount is obtained from the blockchain)
const instanceRoulette = new Roulette(1000)

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// create the Overlay UI and pass it the game instances
overalyUI([instanceSlots, instanceRoulette])

//console.log(engine)

// const camera = Camera.instance

// class CameraTrackSystem {
//   update() {
//     log(camera.position)
//   }
// }

// engine.addSystem(new CameraTrackSystem())

////////  turn casino UI on or off

// //create entity
// const casinoUITrigger = new Entity()
// casinoUITrigger.addComponent(new BoxShape())
// casinoUITrigger.getComponent(BoxShape).withCollisions = false
// casinoUITrigger.addComponent(
//   new Transform({
//     position: new Vector3(150, 0, 30),
//     scale: new Vector3(20, 20, 20)
//   })
// )

// // create trigger area object, setting size and relative position
// let triggerBox = new utils.TriggerBoxShape(Vector3.One(), Vector3.Zero())

// //create trigger for entity
// casinoUITrigger.addComponent(
//   new utils.TriggerComponent(
//     triggerBox, //shape
//     0, //layer
//     0, //triggeredByLayer
//     null, //onTriggerEnter
//     null, //onTriggerExit
//     () => {
//       //onCameraEnter
// 	  overalyUI.show()

//     },
//     ()  => {
// 		//onCameraExit
// 		overalyUI.hide()
// 	}
//   )
// )

// //add entity to engine
// engine.addEntity(casinoUITrigger)

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(
    `new Vector3(`,
    Camera.instance.position.x,
    ',',
    Camera.instance.position.y,
    ',',
    Camera.instance.position.z,
    `),
	rotation: Quaternion.Euler(`,
    0,
    ',',
    Camera.instance.rotation.eulerAngles.y,
    ',',
    0,
    `),
    },`
  )
})