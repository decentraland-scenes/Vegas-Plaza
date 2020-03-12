import { background } from './music_ui'
import { FloatingTextShape } from './music_ui'

export var UIOpenTime = 0

export const sceneMessageBus = new MessageBus()

type syncData = {
  carTimer: number
  wheelsTimer: number
  elevatorTimer: number
  songPlaying: number
  bannerText: string
}

export let sceneState: syncData = {
  carTimer: 1800 / 30,
  wheelsTimer: 1200 / 30,
  elevatorTimer: 820 / 30,
  songPlaying: 0,
  bannerText: 'Write something'
}

log(sceneState)

///// Sound clips

let scratch1 = new AudioClip('sounds/dj-scratch.mp3')
let scratch2 = new AudioClip('sounds/dj-scratch_04.mp3')

let button1 = new AudioClip('sounds/bass-drop.mp3')
let button2 = new AudioClip('sounds/wilhem-scream.mp3')
let button3 = new AudioClip('sounds/electric-sound.mp3')
let button4 = new AudioClip('sounds/horn.mp3')
let button5 = new AudioClip('sounds/laser.mp3')
let button6 = new AudioClip('sounds/oh-yeah.mp3')
let button7 = new AudioClip('sounds/orchestra-hit.mp3')
let button8 = new AudioClip('sounds/wasa-wasa-wasa.mp3')
let button9 = new AudioClip('sounds/bitconnect-sound.mp3')

let fireEffect = new AudioClip('sounds/fire-sound.mp3')

export let song1 = new AudioClip('sounds/Vexento.mp3')
export let song2 = new AudioClip('sounds/Vexento.mp3')
export let song3 = new AudioClip('sounds/Vexento.mp3')

export enum Songs {
  song1,
  song2,
  song3
}

///// FIXED OBJECTS

//add SpotLightBackConcert
let SpotLightBackConcert = new Entity()
SpotLightBackConcert.addComponent(
  new GLTFShape('models/SpotLightBackConcert.glb')
)
SpotLightBackConcert.getComponent(GLTFShape).visible = false
SpotLightBackConcert.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const SpotLightBackConcertAnimator = new Animator()
SpotLightBackConcert.addComponent(SpotLightBackConcertAnimator)
let playSpotLightBackConcert = new AnimationState('SpotLightBackConcert_Action')
SpotLightBackConcertAnimator.addClip(playSpotLightBackConcert)
playSpotLightBackConcert.stop()
engine.addEntity(SpotLightBackConcert)

engine.addEntity(SpotLightBackConcert)

//add LightsUpConcertStage
let LightsUpConcertStage = new Entity()
LightsUpConcertStage.addComponent(
  new GLTFShape('models/LightsUpConcertStage.glb')
)
LightsUpConcertStage.getComponent(GLTFShape).visible = false
LightsUpConcertStage.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const LightsUpConcertStageAnimator = new Animator()
LightsUpConcertStage.addComponent(LightsUpConcertStageAnimator)
let playLightsUpConcertStage = new AnimationState('LightsUpConcertStage_Action')
LightsUpConcertStageAnimator.addClip(playLightsUpConcertStage)
playLightsUpConcertStage.stop()
engine.addEntity(LightsUpConcertStage)

engine.addEntity(LightsUpConcertStage)

//add LightsDownConcertStage
let LightsDownConcertStage = new Entity()
LightsDownConcertStage.addComponent(
  new GLTFShape('models/LightsDownConcertStage.glb')
)
LightsDownConcertStage.getComponent(GLTFShape).visible = false
LightsDownConcertStage.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const LightsDownConcertStageAnimator = new Animator()
LightsDownConcertStage.addComponent(LightsDownConcertStageAnimator)
let playLightsDownConcertStage = new AnimationState(
  'LightsDownConcertStage_Action'
)
LightsDownConcertStageAnimator.addClip(playLightsDownConcertStage)
playLightsDownConcertStage.stop()
engine.addEntity(LightsDownConcertStage)

engine.addEntity(LightsDownConcertStage)

//add Pyrotechnics
let Pyrotechnics = new Entity()
Pyrotechnics.addComponent(new GLTFShape('models/Pyrotechnics.glb'))
Pyrotechnics.getComponent(GLTFShape).visible = false
Pyrotechnics.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const PyrotechnicsAnimator = new Animator()
Pyrotechnics.addComponent(PyrotechnicsAnimator)
let playPyrotechnics = new AnimationState('Pyrotechnics_Action', {
  looping: false
})
PyrotechnicsAnimator.addClip(playPyrotechnics)
playPyrotechnics.stop()
engine.addEntity(Pyrotechnics)

engine.addEntity(Pyrotechnics)

//add FireConcertStage
let FireConcertStage = new Entity()
FireConcertStage.addComponent(new GLTFShape('models/FireConcertStage.glb'))
FireConcertStage.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)
const FireConcertStageAnimator = new Animator()
FireConcertStage.addComponent(FireConcertStageAnimator)
let playFireConcertStage = new AnimationState('FireConcertStage_Action', {
  looping: false
})
FireConcertStageAnimator.addClip(playFireConcertStage)
playFireConcertStage.stop()
engine.addEntity(FireConcertStage)

engine.addEntity(FireConcertStage)

/// Speakers

let musicSpeaker = new Entity()
musicSpeaker.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
musicSpeaker.addComponent(new AudioSource(song1))
engine.addEntity(musicSpeaker)

let fxSpeaker1 = new Entity()
fxSpeaker1.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker1.addComponent(new AudioSource(button1))
engine.addEntity(fxSpeaker1)

let fxSpeaker2 = new Entity()
fxSpeaker2.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker2.addComponent(new AudioSource(button2))
engine.addEntity(fxSpeaker2)

let fxSpeaker3 = new Entity()
fxSpeaker3.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker3.addComponent(new AudioSource(button3))
engine.addEntity(fxSpeaker3)

let fxSpeaker4 = new Entity()
fxSpeaker4.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker4.addComponent(new AudioSource(button4))
engine.addEntity(fxSpeaker4)

let fxSpeaker5 = new Entity()
fxSpeaker5.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker5.addComponent(new AudioSource(button5))
engine.addEntity(fxSpeaker5)

let fxSpeaker6 = new Entity()
fxSpeaker6.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker6.addComponent(new AudioSource(button6))
engine.addEntity(fxSpeaker6)

let fxSpeaker7 = new Entity()
fxSpeaker7.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker7.addComponent(new AudioSource(button7))
engine.addEntity(fxSpeaker7)

let fxSpeaker8 = new Entity()
fxSpeaker8.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker8.addComponent(new AudioSource(button8))
engine.addEntity(fxSpeaker8)

let fxSpeaker9 = new Entity()
fxSpeaker9.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeaker9.addComponent(new AudioSource(button9))
engine.addEntity(fxSpeaker9)

let fxSpeakerFire = new Entity()
fxSpeakerFire.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeakerFire.addComponent(new AudioSource(fireEffect))
engine.addEntity(fxSpeakerFire)

let fxSpeakerScratch1 = new Entity()
fxSpeakerScratch1.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeakerScratch1.addComponent(new AudioSource(scratch1))
engine.addEntity(fxSpeakerScratch1)

let fxSpeakerScratch2 = new Entity()
fxSpeakerScratch2.addComponent(
  new Transform({
    position: new Vector3(160, 2, 58)
  })
)
fxSpeakerScratch2.addComponent(new AudioSource(scratch2))
engine.addEntity(fxSpeakerScratch2)

//// CONSOLE

let djSet = new Entity()
djSet.addComponent(new GLTFShape('models/DJ-Set/DJ-Set.glb'))
//djSet.getComponent(GLTFShape).isPointerBlocker = false
djSet.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
engine.addEntity(djSet)

let playSongButton = new Entity()
playSongButton.addComponent(new GLTFShape('models/DJ-Set/Play_Me.glb'))
playSongButton.addComponent(
  new Transform({ position: new Vector3(160, 0, 160) })
)
playSongButton.addComponent(
  new OnPointerDown(
    () => {
      background.visible = true
      background.isPointerBlocker = true
      UIOpenTime = +Date.now()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Play Song'
    }
  )
)
engine.addEntity(playSongButton)

let scratch1Button = new Entity()
scratch1Button.addComponent(new GLTFShape('models/DJ-Set/Disc_A.glb'))
scratch1Button.addComponent(
  new Transform({ position: new Vector3(160, 0, 160) })
)
let scratchAnim1 = new AnimationState('DiscA_Action', { looping: false })
scratch1Button.addComponent(new Animator()).addClip(scratchAnim1)
scratch1Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('scratch1', {})
      scratchAnim1.stop()
      scratchAnim1.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Scratch'
    }
  )
)
engine.addEntity(scratch1Button)

let scratch2Button = new Entity()
scratch2Button.addComponent(new GLTFShape('models/DJ-Set/Disc_B.glb'))
scratch2Button.addComponent(
  new Transform({ position: new Vector3(160, 0, 160) })
)
let scratchAnim2 = new AnimationState('DiscB_Action', { looping: false })
scratch2Button.addComponent(new Animator()).addClip(scratchAnim2)
scratch2Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('scratch2', {})
      scratchAnim2.stop()
      scratchAnim2.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Scratch'
    }
  )
)
engine.addEntity(scratch2Button)

let fireButton = new Entity()
fireButton.addComponent(new GLTFShape('models/DJ-Set/Fire_Button.glb'))
fireButton.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let fireAnim = new AnimationState('FireButton_Action', { looping: false })
fireButton.addComponent(new Animator()).addClip(fireAnim)
fireButton.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('fire', {})
      fireAnim.stop()
      fireAnim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'FIRE'
    }
  )
)
engine.addEntity(fireButton)

let sound1Button = new Entity()
sound1Button.addComponent(new GLTFShape('models/DJ-Set/ButtonA.glb'))
sound1Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button1Anim = new AnimationState('ButtonA_Action', { looping: false })
sound1Button.addComponent(new Animator()).addClip(button1Anim)
sound1Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button1', {})
      button1Anim.stop()
      button1Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Drop it!'
    }
  )
)
engine.addEntity(sound1Button)

let sound2Button = new Entity()
sound2Button.addComponent(new GLTFShape('models/DJ-Set/ButtonB.glb'))
sound2Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button2Anim = new AnimationState('ButtonB_Action', { looping: false })
sound2Button.addComponent(new Animator()).addClip(button2Anim)
sound2Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button2', {})
      button2Anim.stop()
      button2Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Scream'
    }
  )
)
engine.addEntity(sound2Button)

let sound3Button = new Entity()
sound3Button.addComponent(new GLTFShape('models/DJ-Set/ButtonC.glb'))
sound3Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button3Anim = new AnimationState('ButtonC_Action', { looping: false })
sound3Button.addComponent(new Animator()).addClip(button3Anim)
sound3Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button3', {})
      button3Anim.stop()
      button3Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Echo'
    }
  )
)
engine.addEntity(sound3Button)

let sound4Button = new Entity()
sound4Button.addComponent(new GLTFShape('models/DJ-Set/ButtonD.glb'))
sound4Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button4Anim = new AnimationState('ButtonD_Action', { looping: false })
sound4Button.addComponent(new Animator()).addClip(button4Anim)
sound4Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button4', {})
      button4Anim.stop()
      button4Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'UUMF'
    }
  )
)
engine.addEntity(sound4Button)

let sound5Button = new Entity()
sound5Button.addComponent(new GLTFShape('models/DJ-Set/ButtonE.glb'))
sound5Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button5Anim = new AnimationState('ButtonE_Action', { looping: false })
sound5Button.addComponent(new Animator()).addClip(button5Anim)
sound5Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button5', {})
      button5Anim.stop()
      button5Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Laser'
    }
  )
)
engine.addEntity(sound5Button)

let sound6Button = new Entity()
sound6Button.addComponent(new GLTFShape('models/DJ-Set/ButtonF.glb'))
sound6Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button6Anim = new AnimationState('ButtonF_Action', { looping: false })
sound6Button.addComponent(new Animator()).addClip(button6Anim)
sound6Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button6', {})
      button6Anim.stop()
      button6Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Oh Yeah!'
    }
  )
)
engine.addEntity(sound6Button)

let sound7Button = new Entity()
sound7Button.addComponent(new GLTFShape('models/DJ-Set/ButtonG.glb'))
sound7Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button7Anim = new AnimationState('ButtonG_Action', { looping: false })
sound7Button.addComponent(new Animator()).addClip(button7Anim)
sound7Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button7', {})
      button7Anim.stop()
      button7Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Orchestra'
    }
  )
)
engine.addEntity(sound7Button)

let sound8Button = new Entity()
sound8Button.addComponent(new GLTFShape('models/DJ-Set/ButtonH.glb'))
sound8Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button8Anim = new AnimationState('ButtonH_Action', { looping: false })
sound8Button.addComponent(new Animator()).addClip(button8Anim)
sound8Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button8', {})
      button8Anim.stop()
      button8Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'WasaWasa'
    }
  )
)
engine.addEntity(sound8Button)

let sound9Button = new Entity()
sound9Button.addComponent(new GLTFShape('models/DJ-Set/ButtonI.glb'))
sound9Button.addComponent(new Transform({ position: new Vector3(160, 0, 160) }))
let button9Anim = new AnimationState('ButtonI_Action', { looping: false })
sound9Button.addComponent(new Animator()).addClip(button9Anim)
sound9Button.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('button9', {})
      button9Anim.stop()
      button9Anim.play()
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Bitconeect'
    }
  )
)
engine.addEntity(sound9Button)

///  HOOK UP TO EVENTS

sceneMessageBus.on('scratch1', () => {
  fxSpeakerScratch1.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('scratch2', () => {
  fxSpeakerScratch2.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button1', () => {
  fxSpeaker1.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button2', () => {
  fxSpeaker2.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button3', () => {
  fxSpeaker3.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button4', () => {
  fxSpeaker4.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button5', () => {
  fxSpeaker5.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button6', () => {
  fxSpeaker6.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button7', () => {
  fxSpeaker7.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button8', () => {
  fxSpeaker8.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('button9', () => {
  fxSpeaker9.getComponent(AudioSource).playOnce()
})

sceneMessageBus.on('lightsOn', () => {
  SpotLightBackConcert.getComponent(GLTFShape).visible = true
  LightsUpConcertStage.getComponent(GLTFShape).visible = true
  LightsDownConcertStage.getComponent(GLTFShape).visible = true
  playSpotLightBackConcert.play()
  playLightsUpConcertStage.play()
  playLightsDownConcertStage.play()
})

sceneMessageBus.on('lightsOff', () => {
  SpotLightBackConcert.getComponent(GLTFShape).visible = false
  LightsUpConcertStage.getComponent(GLTFShape).visible = false
  LightsDownConcertStage.getComponent(GLTFShape).visible = false
  Pyrotechnics.getComponent(GLTFShape).visible = false
  playSpotLightBackConcert.stop()
  playLightsUpConcertStage.stop()
  playLightsDownConcertStage.stop()
  playPyrotechnics.stop()
  playFireConcertStage.stop()
})

sceneMessageBus.on('fire', () => {
  fxSpeakerFire.getComponent(AudioSource).playOnce()
  Pyrotechnics.getComponent(GLTFShape).visible = true
  FireConcertStage.getComponent(GLTFShape).visible = true
  playPyrotechnics.stop()
  playFireConcertStage.stop()
  playPyrotechnics.play()
  playFireConcertStage.play()
})

sceneMessageBus.on('song1', () => {
  playSong(song1, 1)
})

sceneMessageBus.on('song2', () => {
  playSong(song2, 2)
})

sceneMessageBus.on('song3', () => {
  playSong(song3, 3)
})

export function playSong(song: AudioClip, songIndex: number) {
  let audio = musicSpeaker.addComponentOrReplace(new AudioSource(song))
  audio.playing = true
  sceneState.songPlaying = 3
  scratchAnim1.play()
  scratchAnim2.play()
  scratchAnim1.looping = true
  scratchAnim2.looping = true
}

sceneMessageBus.on('stop', () => {
  let audio = musicSpeaker.addComponentOrReplace(new AudioSource(song3))
  audio.playing = false
  sceneState.songPlaying = 0
  scratchAnim1.stop()
  scratchAnim2.stop()
  scratchAnim1.looping = false
  scratchAnim2.looping = false
})

//// test

// let cubeTest = new Entity()
// cubeTest.addComponent(new BoxShape())
// cubeTest.addComponent(new Transform({ position: new Vector3(1, 1, 1) }))

// cubeTest.addComponent(
//   new OnPointerDown(
//     () => {
//       sceneMessageBus.emit('button4', {})
//       button4Anim.stop()
//       button4Anim.play()
//     },
//     {
//       button: ActionButton.POINTER,
//       hoverText: 'APALAPAPA'
//     }
//   )
// )
// engine.addEntity(cubeTest)

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
    elevatorTimer: sceneState.elevatorTimer,
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
    sceneState.elevatorTimer = state.elevatorTimer
    sceneState.songPlaying = state.songPlaying
    sceneState.bannerText = state.bannerText
    FloatingTextShape.value = state.bannerText
    if (state.songPlaying > 0) {
      let songClip =
        state.songPlaying == 1 ? song1 : state.songPlaying == 1 ? song2 : song3
      playSong(songClip, state.songPlaying)
    }
  }
})
