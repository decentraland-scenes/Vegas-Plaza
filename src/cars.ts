import { sceneState } from './game'

export const totalCarTime: number = 1800 / 30

export class CarsTimerSystem implements ISystem {
  update(dt: number) {
    sceneState.carTimer -= dt
    if (sceneState.carTimer < 0) {
      sceneState.carTimer = totalCarTime
      resetCarAnims()
      log('RESETTING CARS')
    }
    // } else {
    //   log(sceneState.carTimer)
    //}
  }
}

engine.addSystem(new CarsTimerSystem())

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
