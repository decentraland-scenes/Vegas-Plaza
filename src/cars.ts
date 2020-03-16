import { sceneState } from './music'

export const totalCarTime: number = 1800 / 30

export const totalWheelsTimer: number = 1200 / 30

export const totalElevatorTimer: number = 820 / 30

export class AnimsTimerSystem implements ISystem {
  update(dt: number) {
    sceneState.carTimer -= dt
    if (sceneState.carTimer < 0) {
      sceneState.carTimer = totalCarTime
      resetCarAnims()
      log('RESETTING CARS')
    }
    sceneState.wheelsTimer -= dt
    if (sceneState.wheelsTimer < 0) {
      sceneState.wheelsTimer = totalWheelsTimer
      resetWheelAnims()
      log('RESETTING WHEELS')
    }
    sceneState.elevatorTimer -= dt
    if (sceneState.elevatorTimer < 0) {
      sceneState.elevatorTimer = totalElevatorTimer
      resetElevatorAnims()
      log('RESETTING ELEVATOR')
    }
  }
}

/// Cars

//add SportCar_01
let SportCar_01 = new Entity()
SportCar_01.addComponent(new GLTFShape('models/SportCar_01.glb'))
SportCar_01.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const SportCar_01Animator = new Animator()
SportCar_01.addComponent(SportCar_01Animator)
let playSportCar_01 = new AnimationState('Sportcar_01_Action', {
  looping: false
})
SportCar_01Animator.addClip(playSportCar_01)
//playSportCar_01.play()
engine.addEntity(SportCar_01)

engine.addEntity(SportCar_01)

//add AstonMartin_01
let AstonMartin_01 = new Entity()
AstonMartin_01.addComponent(new GLTFShape('models/AstonMartin_01.glb'))
AstonMartin_01.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const AstonMartin_01Animator = new Animator()
AstonMartin_01.addComponent(AstonMartin_01Animator)
let playAstonMartin_01 = new AnimationState('AstonMartin_01_Action', {
  looping: false
})
AstonMartin_01Animator.addClip(playAstonMartin_01)
//playAstonMartin_01.play()
engine.addEntity(AstonMartin_01)

engine.addEntity(AstonMartin_01)

//add Lambo_01
let Lambo_01 = new Entity()
Lambo_01.addComponent(new GLTFShape('models/Lambo_01.glb'))
Lambo_01.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const Lambo_01Animator = new Animator()
Lambo_01.addComponent(Lambo_01Animator)
let playLambo_01 = new AnimationState('Lambo_01_Action', { looping: false })
Lambo_01Animator.addClip(playLambo_01)
//playLambo_01.play()
engine.addEntity(Lambo_01)

engine.addEntity(Lambo_01)

//add PoliceCar_01
let PoliceCar_01 = new Entity()
PoliceCar_01.addComponent(new GLTFShape('models/PoliceCar_01.glb'))
PoliceCar_01.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const PoliceCar_01Animator = new Animator()
PoliceCar_01.addComponent(PoliceCar_01Animator)
let playPoliceCar_01 = new AnimationState('PoliceCar_01_Action', {
  looping: false
})
PoliceCar_01Animator.addClip(playPoliceCar_01)
//playPoliceCar_01.play()
engine.addEntity(PoliceCar_01)

engine.addEntity(PoliceCar_01)

//add AstonMartin_02
let AstonMartin_02 = new Entity()
AstonMartin_02.addComponent(new GLTFShape('models/AstonMartin_02.glb'))
AstonMartin_02.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const AstonMartin_02Animator = new Animator()
AstonMartin_02.addComponent(AstonMartin_02Animator)
let playAstonMartin_02 = new AnimationState('AstonMartin_02_Action', {
  looping: false
})
AstonMartin_02Animator.addClip(playAstonMartin_02)
//playAstonMartin_02.play()
engine.addEntity(AstonMartin_02)

engine.addEntity(AstonMartin_02)

//////////////////////
//WHEEEL
/////////////////////

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
let playwheel = new AnimationState('Wheel_action')
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

///////////  ELEVATOR

//add Elevator
let Elevator = new Entity()
Elevator.addComponent(new GLTFShape('models/Elevator.glb'))
Elevator.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)
engine.addEntity(Elevator)
//add Lift
let Lift = new Entity()
Lift.addComponent(new GLTFShape('models/Lift.glb'))
const liftAnim = new AnimationState('Lift_Action', { looping: true })
Lift.addComponent(new Animator()).addClip(liftAnim)

Lift.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160)
  })
)
engine.addEntity(Lift)

export function resetCarAnims() {
  playSportCar_01.stop()
  playAstonMartin_01.stop()
  playLambo_01.stop()
  playPoliceCar_01.stop()
  playAstonMartin_02.stop()

  playSportCar_01.play()
  playAstonMartin_01.play()
  playLambo_01.play()
  playPoliceCar_01.play()
  playAstonMartin_02.play()
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

function resetElevatorAnims() {
  liftAnim.stop()
  liftAnim.play()
}
