import { AnimsTimerSystem } from './cars'
import utils from '../node_modules/decentraland-ecs-utils/index'

engine.addSystem(new AnimsTimerSystem())

//add Static Base
let plaza = new Entity()
plaza.addComponent(new GLTFShape('models/VegasPlaza.glb'))
plaza.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
  })
)

engine.addEntity(plaza)

//add FortuneCat
let FortuneCat = new Entity()
FortuneCat.addComponent(new GLTFShape('models/FortuneCat.glb'))
FortuneCat.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0),
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
    rotation: Quaternion.Euler(0, 0, 0),
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
    rotation: Quaternion.Euler(0, 0, 0),
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
import { addScreen } from './modules/video'

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

/// VIDEO SCEREEN

addScreen()

//////// HACK TO LOG POSITIONS

class CameraTrackSystem implements ISystem {
  update() {
    log(Camera.instance.position)
  }
}
engine.addSystem(new CameraTrackSystem())
