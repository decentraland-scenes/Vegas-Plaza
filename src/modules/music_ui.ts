import { sceneMessageBus, sceneState } from '../game'
import { UIOpenTime } from '../music'

export const screenSpaceUI = new UICanvas()
screenSpaceUI.visible = true

const imageTexture = new Texture('images/dj-TX.png')

export const background = new UIImage(screenSpaceUI, imageTexture)
background.name = 'background'
background.width = 1024
background.height = '512px'
background.hAlign = 'center'
background.vAlign = 'center'
background.sourceLeft = 0
background.sourceTop = 470
background.sourceWidth = 1024
background.sourceHeight = 380
background.visible = false

background.isPointerBlocker = true

// export const container = new UIContainerRect(screenSpaceUI)
// container.width = '40%'
// container.height = '55%'
// container.color = Color4.FromHexString(`#AA4639ff`)
// container.hAlign = 'center'
// container.vAlign = 'center'
// container.visible = false
// container.isPointerBlocker = false

const closeIcon = new UIImage(background, new Texture('images/close-icon3.png'))
closeIcon.name = 'clickable-image'
closeIcon.width = '60px'
closeIcon.height = '60px'
closeIcon.hAlign = 'right'
closeIcon.vAlign = 'top'
closeIcon.sourceWidth = 128
closeIcon.sourceHeight = 128
closeIcon.sourceLeft = 0
closeIcon.sourceTop = 0
closeIcon.isPointerBlocker = true
closeIcon.onClick = new OnClick(() => {
  background.visible = false
  background.isPointerBlocker = false
  log('clicked on the close image ', background.visible)
})

// --- SONG LIST

const song1 = new UIImage(background, imageTexture)
song1.name = 'song1'
song1.width = '1024px'
song1.height = '128px'
song1.hAlign = 'center'
song1.vAlign = 'top'
song1.positionY = -34
song1.sourceLeft = 0
song1.sourceTop = 0
song1.sourceWidth = 1024
song1.sourceHeight = 128
song1.isPointerBlocker = true
song1.onClick = new OnClick(() => {
  sceneMessageBus.emit('lightsOn', {})
  sceneMessageBus.emit('song1', {})
})

const song2 = new UIImage(background, imageTexture)
song2.name = 'song2'
song2.width = '1024px'
song2.height = '128px'
song2.hAlign = 'center'
song2.vAlign = 'top'
song2.positionY = -34 - 128
song2.sourceLeft = 0
song2.sourceTop = 128
song2.sourceWidth = 1024
song2.sourceHeight = 128
song2.isPointerBlocker = true
song2.onClick = new OnClick(() => {
  sceneMessageBus.emit('lightsOn', {})
  sceneMessageBus.emit('song2', {})
})

const song3 = new UIImage(background, imageTexture)
song3.name = 'song3'
song3.width = '1024px'
song3.height = '128px'
song3.hAlign = 'center'
song3.vAlign = 'top'
song3.positionY = -34 - 256
song3.sourceLeft = 0
song3.sourceTop = 256
song3.sourceWidth = 1024
song3.sourceHeight = 128
song3.isPointerBlocker = true
song3.onClick = new OnClick(() => {
  sceneMessageBus.emit('lightsOn', {})
  sceneMessageBus.emit('song3', {})
})

const stop = new UIImage(background, imageTexture)
stop.name = 'stop'
stop.width = '1024px'
stop.height = '128px'
stop.hAlign = 'center'
stop.vAlign = 'top'
stop.positionY = -34 - 384
stop.sourceLeft = 0
stop.sourceTop = 384
stop.sourceWidth = 1024
stop.sourceHeight = 128
stop.isPointerBlocker = true
stop.onClick = new OnClick(() => {
  sceneMessageBus.emit('lightsOff', {})
  sceneMessageBus.emit('stop', {})
})

//console.log(engine)

// export const inventoryContainer = new UIContainerStack(container)
// inventoryContainer.spacing = 30
// inventoryContainer.stackOrientation = UIStackOrientation.VERTICAL
// inventoryContainer.width = '90%'
// inventoryContainer.height = '80%'
// inventoryContainer.color = Color4.FromHexString(`#8E2F5Cff`)
// inventoryContainer.hAlign = 'center'
// inventoryContainer.vAlign = 'center'
// inventoryContainer.stackOrientation = UIStackOrientation.VERTICAL

// // SONG 1

// const bg = new UIContainerRect(inventoryContainer)
// bg.name = 'song1bg'
// bg.thickness = 2
// bg.color = Color4.FromHexString('#AA7139ff')
// bg.width = '400px'
// bg.height = '80px'
// bg.vAlign = 'center'
// bg.hAlign = 'center'
// bg.vAlign = 'center'

// const image1 = new UIImage(bg, imageTexture)
// image1.height = '70px'
// image1.width = '70px'
// image1.sourceTop = 0
// image1.sourceLeft = 0
// image1.sourceHeight = 256
// image1.sourceWidth = 256
// image1.vAlign = `center`
// image1.hAlign = `left`
// image1.positionX = 10
// image1.onClick = new OnClick(() => {
//   sceneMessageBus.emit('lightsOn', {})
//   sceneMessageBus.emit('song1', {})
// })

// const text = new UIText(bg)
// text.value = 'Vexetto'
// text.width = '50%'
// text.height = 25
// text.vAlign = 'center'
// text.hAlign = 'right'
// text.vTextAlign = 'left'
// text.fontSize = 25
// text.color = Color4.FromHexString('#0F1217ff')

// // SONG 2

// const bg2 = new UIContainerRect(inventoryContainer)
// bg2.name = 'song2bg'
// bg2.thickness = 2
// bg2.color = Color4.FromHexString('#AA7139ff')
// bg2.width = '400px'
// bg2.height = '80px'
// bg2.vAlign = 'center'
// bg2.hAlign = 'center'
// bg2.vAlign = 'center'

// const image2 = new UIImage(bg2, imageTexture)
// image2.height = '70px'
// image2.width = '70px'
// image2.sourceTop = 0
// image2.sourceLeft = 0
// image2.sourceHeight = 256
// image2.sourceWidth = 256
// image2.vAlign = `center`
// image2.hAlign = `left`
// image2.positionX = 10
// image2.onClick = new OnClick(() => {
//   sceneMessageBus.emit('lightsOn', {})
//   sceneMessageBus.emit('song2', {})
// })

// const text2 = new UIText(bg2)
// text2.value = 'Vexetto2'
// text2.width = '50%'
// text2.height = 25
// text2.vAlign = 'center'
// text2.hAlign = 'right'
// text2.vTextAlign = 'left'
// text2.fontSize = 25
// text2.color = Color4.FromHexString('#0F1217ff')

// // SONG 3

// const bg3 = new UIContainerRect(inventoryContainer)
// bg3.name = 'song3bg'
// bg3.thickness = 2
// bg3.color = Color4.FromHexString('#AA7139ff')
// bg3.width = '400px'
// bg3.height = '80px'
// bg3.vAlign = 'center'
// bg3.hAlign = 'center'
// bg3.vAlign = 'center'

// const image3 = new UIImage(bg3, imageTexture)
// image3.height = '70px'
// image3.width = '70px'
// image3.sourceTop = 0
// image3.sourceLeft = 0
// image3.sourceHeight = 256
// image3.sourceWidth = 256
// image3.vAlign = `center`
// image3.hAlign = `left`
// image3.positionX = 10
// image3.onClick = new OnClick(() => {
//   sceneMessageBus.emit('lightsOn', {})
//   sceneMessageBus.emit('song3', {})
// })

// const text3 = new UIText(bg3)
// text3.value = 'Vexetto3'
// text3.width = '50%'
// text3.height = 25
// text3.vAlign = 'center'
// text3.hAlign = 'right'
// text3.vTextAlign = 'left'
// text3.fontSize = 25
// text3.color = Color4.FromHexString('#0F1217ff')

// Instance the input object
const input = Input.instance

//button down event
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, false, e => {
  const currentTime = +Date.now()
  const isOpen = background.visible
  if (isOpen && currentTime - UIOpenTime > 100) {
    background.visible = false
    background.isPointerBlocker = false
    log('clicked on the close image ', background.visible)
  }
})

///// TEXT TEST

const FloatingText = new Entity()
export let FloatingTextShape = new TextShape('Write something')
FloatingTextShape.color = new Color3(99, 0, 0)
FloatingText.addComponent(FloatingTextShape)
FloatingText.addComponent(
  new Transform({
    position: new Vector3(1, 1, 1)
  })
)
engine.addEntity(FloatingText)

const message = new UIInputText(screenSpaceUI)
message.name = 'message'
message.width = '800px'
message.height = '128px'
message.hAlign = 'top'
message.vAlign = 'top'
message.positionY = 0
message.fontSize = 40
message.vTextAlign = 'center'
message.hTextAlign = 'center'
// stop.sourceLeft = 0
// stop.sourceTop = 384
// stop.sourceWidth = 1024
// stop.sourceHeight = 128
message.isPointerBlocker = true
message.onTextSubmit = new OnTextSubmit(x => {
  //FloatingTextShape.value = x.text
  sceneMessageBus.emit('newText', { text: x.text })
})

sceneMessageBus.on('newText', x => {
  sceneState.bannerText = x.text
  FloatingTextShape.value = x.text
})
