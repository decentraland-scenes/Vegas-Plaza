import { sceneState } from './game'

export const totalWheelsTimer: number = 1200 / 30

export class WheelsTimerSystem implements ISystem {
  update(dt: number) {
    sceneState.wheelsTimer -= dt
    if (sceneState.wheelsTimer < 0) {
      sceneState.wheelsTimer = totalWheelsTimer
      resetWheelAnims()
      log('RESETTING WHEELS')
    }
    // } else {
    //   log(sceneState.wheelsTimer)
    //}
  }
}

export function resetWheelAnims() {
  playwheel.stop()
  booth1AnimState.stop()
  booth2AnimState.stop()
  booth3AnimState.stop()
  booth4AnimState.stop()
  booth5AnimState.stop()
  booth6AnimState.stop()
  booth7AnimState.stop()
  booth8AnimState.stop()

  playwheel.play()
  booth1AnimState.play()
  booth2AnimState.play()
  booth3AnimState.play()
  booth4AnimState.play()
  booth5AnimState.play()
  booth6AnimState.play()
  booth7AnimState.play()
  booth8AnimState.play()
}

//add Wheel
let wheel = new Entity()
wheel.addComponent(new GLTFShape('models/Wheel.glb'))
wheel.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const wheelAnimator = new Animator()
wheel.addComponent(wheelAnimator)
let playwheel = new AnimationState('ObservationWheel_ArmatureAction')
wheelAnimator.addClip(playwheel)
//playwheel.play()
engine.addEntity(wheel)

engine.addEntity(wheel)

//add Lightwheel_01
let LightsWheel01 = new Entity()
LightsWheel01.addComponent(new GLTFShape('models/Lights_Wheel_01.glb'))
LightsWheel01.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const LightsWheel01Animator = new Animator()
LightsWheel01.addComponent(LightsWheel01Animator)
let playLightsWheel01 = new AnimationState('SpotLightWhell_Action')
LightsWheel01Animator.addClip(playLightsWheel01)
playLightsWheel01.play()
engine.addEntity(LightsWheel01)

engine.addEntity(LightsWheel01)

//add Lightwheel_02
let LightsWheel02 = new Entity()
LightsWheel02.addComponent(new GLTFShape('models/Lights_Wheel_02.glb'))
LightsWheel02.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const LightsWheel02Animator = new Animator()
LightsWheel02.addComponent(LightsWheel02Animator)
let playLightsWheel02 = new AnimationState('SpotLightWhell_02_Action')
LightsWheel02Animator.addClip(playLightsWheel02)
playLightsWheel02.play()
engine.addEntity(LightsWheel02)

engine.addEntity(LightsWheel02)

//add Booth_01
let Booth_01 = new Entity()
Booth_01.addComponent(new GLTFShape('models/Booth_01.glb'))
Booth_01.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

const booth1Anim = new Animator()
Booth_01.addComponent(booth1Anim)
let booth1AnimState = new AnimationState('Action.001')
booth1Anim.addClip(booth1AnimState)

engine.addEntity(Booth_01)
//add Booth_02
let Booth_02 = new Entity()
Booth_02.addComponent(new GLTFShape('models/Booth_02.glb'))
Booth_02.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

const booth2Anim = new Animator()
Booth_02.addComponent(booth2Anim)
let booth2AnimState = new AnimationState('Booth_02_Action')
booth2Anim.addClip(booth2AnimState)

engine.addEntity(Booth_02)
//add Booth_03
let Booth_03 = new Entity()
Booth_03.addComponent(new GLTFShape('models/Booth_03.glb'))
Booth_03.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

const booth3Anim = new Animator()
Booth_03.addComponent(booth3Anim)
let booth3AnimState = new AnimationState('Booth_03_Action')
booth3Anim.addClip(booth3AnimState)

engine.addEntity(Booth_03)
//add Booth_04
let Booth_04 = new Entity()
Booth_04.addComponent(new GLTFShape('models/Booth_04.glb'))
Booth_04.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

const booth4Anim = new Animator()
Booth_04.addComponent(booth4Anim)
let booth4AnimState = new AnimationState('Booth_04_Action')
booth4Anim.addClip(booth4AnimState)

engine.addEntity(Booth_04)
//add Booth_05
let Booth_05 = new Entity()
Booth_05.addComponent(new GLTFShape('models/Booth_05.glb'))
Booth_05.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)

const booth5Anim = new Animator()
Booth_05.addComponent(booth5Anim)
let booth5AnimState = new AnimationState('Booth_05_Action')
booth5Anim.addClip(booth5AnimState)

engine.addEntity(Booth_05)
//add Booth_06
let Booth_06 = new Entity()
Booth_06.addComponent(new GLTFShape('models/Booth_06.glb'))
Booth_06.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)
const booth6Anim = new Animator()
Booth_06.addComponent(booth6Anim)
let booth6AnimState = new AnimationState('Booth_06_Action')
booth6Anim.addClip(booth6AnimState)

engine.addEntity(Booth_06)
//add Booth_07
let Booth_07 = new Entity()
Booth_07.addComponent(new GLTFShape('models/Booth_07.glb'))
Booth_07.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)
const booth7Anim = new Animator()
Booth_07.addComponent(booth7Anim)
let booth7AnimState = new AnimationState('Booth_07_Action')
booth7Anim.addClip(booth7AnimState)
engine.addEntity(Booth_07)
//add Booth_08
let Booth_08 = new Entity()
Booth_08.addComponent(new GLTFShape('models/Booth_08.glb'))
Booth_08.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)
const booth8Anim = new Animator()
Booth_08.addComponent(booth8Anim)
let booth8AnimState = new AnimationState('Booth_08_Action')
booth8Anim.addClip(booth8AnimState)
engine.addEntity(Booth_08)
