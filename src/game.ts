import { FloatingTextShape } from './ui'
import { song1, song2, song3, playSong } from './music'

export const sceneMessageBus = new MessageBus()

//export const screenSpaceUI = new UICanvas()
//screenSpaceUI.visible = true

type syncData = {
  carTimer: number
  wheelsTimer: number
  songPlaying: number
  bannerText: string
}

export let sceneState: syncData = {
  carTimer: 1800 / 30,
  wheelsTimer: 1200 / 30,
  songPlaying: 0,
  bannerText: 'Write something'
}

log(sceneState)

//add Static Base
let plaza = new Entity()
plaza.addComponent(new GLTFShape('models/VegasPlaza.glb'))
plaza.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
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

//// Wheeel booths

//// SYNC CARS AND MUSIC

let isSynced: boolean = false

//let timesToShareData = 5 // after sharing w 3 others, no longer shares state?

// To get the initial state of the scene when joining
sceneMessageBus.emit('askGameState', {})

// To return the initial state of the scene to new players
sceneMessageBus.on('askGameState', () => {
  //   if (timesToShareData > 0) {
  //     timesToShareData -= 1
  const state: syncData = {
    carTimer: sceneState.carTimer,
    wheelsTimer: sceneState.wheelsTimer,
    songPlaying: sceneState.songPlaying,
    bannerText: sceneState.bannerText
  }
  sceneMessageBus.emit('sendGameState', state)
  //   }
})

// adjust state
sceneMessageBus.on('sendGameState', (state: syncData) => {
  if (!isSynced) {
    isSynced = true
    sceneState.carTimer = state.carTimer
    sceneState.wheelsTimer = state.wheelsTimer
    sceneState.songPlaying = state.songPlaying
    sceneState.bannerText = state.bannerText
    //FloatingTextShape.value = state.bannerText
    if (state.songPlaying > 0) {
      let songClip =
        state.songPlaying == 1 ? song1 : state.songPlaying == 1 ? song2 : song3
      playSong(songClip, state.songPlaying)
    }
  }
})

//////////  Roulettes

import { overalyUI } from './modules/DecentralAPI'
import { Slots } from './slots/Slots'
import { Roulette } from './roulette/Roulette'

// /////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////
// // create the game instance and pass top bet amount and jackpot multiplication factors
// // (in payout mode the top bet amount is obtained from the blockchain)
const instanceSlots = new Slots(20, [250, 15, 8, 4])

// /////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////
// // create the roulette table and roulette UI, and set the maximum bet amount
// // (in payout mode the maximum bet amount is obtained from the blockchain)
const instanceRoulette = new Roulette(1000)

// /////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////
// // create the Overlay UI and pass it the game instances
overalyUI([instanceSlots, instanceRoulette])
