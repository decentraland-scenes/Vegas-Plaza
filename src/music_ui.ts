import utils from '../node_modules/decentraland-ecs-utils/index'
import { sceneMessageBus, sceneState, UIOpenTime } from './music'

export const screenSpaceUI = new UICanvas()
screenSpaceUI.visible = true

const imageTexture = new Texture('images/dj-TX.png')

const messageTexture = new Texture('images/UI_TX.png')

export const background = new UIImage(screenSpaceUI, imageTexture)
background.name = 'background'
background.width = 1024
background.height = '512px'
background.hAlign = 'center'
background.vAlign = 'center'
background.sourceLeft = 0
background.sourceTop = 1024 / 2
background.sourceWidth = 1024
background.sourceHeight = 380
background.visible = false
background.isPointerBlocker = false

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
closeIcon.positionX = -40
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

// Instance the input object
const input = Input.instance

//button down event
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, false, e => {
  const currentTime = +Date.now()
  let isOpen: boolean
  if (background.visible || messagebg.visible) {
    isOpen = true
  } else {
    isOpen = false
  }

  if (isOpen && currentTime - UIOpenTime > 100) {
    background.visible = false
    background.isPointerBlocker = false
    messagebg.visible = false
    messagebg.isPointerBlocker = false
    log('clicked on the close image ', background.visible)
  }
})

// ///// TEXT TEST

const FloatingText = new Entity()
export let FloatingTextShape = new TextShape('Write something')
FloatingTextShape.color = new Color3(1000, 0, 0)
FloatingText.addComponent(FloatingTextShape)
FloatingText.addComponent(
  new Transform({
    position: new Vector3(160, 2.5, 55.55),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 180, 0)
  })
)
engine.addEntity(FloatingText)

const messagebg = new UIImage(screenSpaceUI, messageTexture)
messagebg.name = 'messagebackground'
messagebg.width = 1024
messagebg.height = 1024 / 4
messagebg.hAlign = 'center'
messagebg.vAlign = 'center'
messagebg.sourceLeft = 0
messagebg.sourceTop = 0
messagebg.sourceWidth = 1024
messagebg.sourceHeight = 1024 / 4
messagebg.visible = false
messagebg.isPointerBlocker = false

export const message = new UIInputText(messagebg)
message.name = 'message'
message.width = '650px'
message.height = '100px'
message.hAlign = 'center'
message.vAlign = 'center'
message.positionY = -30
message.fontSize = 30
message.vTextAlign = 'center'
message.hTextAlign = 'center'
message.color = Color4.FromHexString('#53508F88')
message.placeholder = 'Write something'
// stop.sourceLeft = 0
// stop.sourceTop = 384
// stop.sourceWidth = 1024
// stop.sourceHeight = 128
message.isPointerBlocker = true
message.visible = true
message.onTextSubmit = new OnTextSubmit(x => {
  //FloatingTextShape.value = x.text
  let newText = x.text.substr(0, 50)
  sceneMessageBus.emit('newText', { text: newText })
})

// const instructions = new UIText(message)
// instructions.name = 'messageInst'
// instructions.width = '400px'
// instructions.height = '128px'
// instructions.hAlign = 'center'
// instructions.vAlign = 'center'
// instructions.hTextAlign = 'center'
// instructions.positionY = -30
// instructions.fontSize = 40
// instructions.value = 'Write something and press enter'

sceneMessageBus.on('newText', x => {
  sceneState.bannerText = x.text
  FloatingTextShape.value = x.text
})

let UIOpener = new Entity()
UIOpener.addComponent(new GLTFShape('models/Message.glb'))
UIOpener.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    scale: new Vector3(1, 1, 1)
  })
)
UIOpener.addComponent(
  new OnPointerDown(
    e => {
      UIOpenTime = +Date.now()
      messagebg.visible = true
      messagebg.isPointerBlocker = true
    },
    {
      button: ActionButton.POINTER,
      hoverText: 'Write something'
    }
  )
)
engine.addEntity(UIOpener)

//////////////////////////////////////////
//CASINO UI
//////////////////////////////////////

const delay: Entity = new Entity()
// export let canvas: UICanvas
// canvas = new UICanvas()
// canvas.visible = true

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
export class OverlayUI {
  gameInstances: any[]
  notification: NotificationUI
  balance: BalanceUI
  camera = Camera.instance
  cameraPosition: Vector3
  arrayPositions = []

  constructor(gameInstances) {
    this.notification = new NotificationUI()
    this.balance = new BalanceUI(gameInstances, this.notification)
    this.gameInstances = gameInstances

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // pass an instance of the overlay UI to each game and get each game's machine positions
    for (var i = 0; i < this.gameInstances.length; i++) {
      this.gameInstances[i].setOverlayUI(this)
      this.arrayPositions.push(this.gameInstances[i].arrayPositions)
    }

    this.balance.onModeFree() // default game to free-to-play mode
  }

  update() {
    let leastDistance: number = 999
    let distance: number = 0
    let tempIndex: number = 0

    this.cameraPosition = this.camera.position

    // loop through the positions array and find game instance with shortest machine distance
    for (let i = 0; i < this.arrayPositions.length; i++) {
      for (let j = 0; j < this.arrayPositions[i].length; j++) {
        distance = Vector3.Distance(
          Camera.instance.position,
          new Vector3(
            this.arrayPositions[i][j][0],
            this.arrayPositions[i][j][1],
            this.arrayPositions[i][j][2]
          )
        )

        if (distance < leastDistance) {
          if (tempIndex !== i) {
            tempIndex = i
          }

          leastDistance = distance
        }
      }
    }

    // call changeMode() of game instance at least distance and reset currentIndex
    const index = this.balance.currentIndex
    if (index !== tempIndex) {
      const balance = this.gameInstances[index].getCredits()
      const winnings = this.gameInstances[index].getWinnings()

      this.gameInstances[tempIndex].changeMode(balance, winnings)
      this.balance.setNotification('') // remove any messages

      this.balance.currentIndex = tempIndex
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
class NotificationUI {
  notificationBack: UIContainerRect
  notificationBackImg: UIImage
  notificationText: UIText
  notificationButton: UIContainerRect
  notificationButtonImg: UIImage

  constructor() {
    this.notificationBack = new UIContainerRect(screenSpaceUI)
    this.notificationBackImg = new UIImage(
      this.notificationBack,
      new Texture('images/notificationBack.png')
    )
    this.notificationText = new UIText(this.notificationBack)
    this.notificationButton = new UIContainerRect(screenSpaceUI)
    this.notificationButtonImg = new UIImage(
      this.notificationButton,
      new Texture('images/notificationButton.png')
    )

    this.initUI()
  }

  initUI() {
    this.notificationBack.hAlign = 'right'
    this.notificationBack.vAlign = 'bottom'
    this.notificationBack.adaptHeight = true
    this.notificationBack.width = 360
    this.notificationBack.height = 60
    this.notificationBack.positionX = -60
    this.notificationBack.color = Color4.Clear()
    this.notificationBackImg.hAlign = 'center'
    this.notificationBackImg.vAlign = 'center'
    this.notificationBackImg.width = '100%'
    this.notificationBackImg.height = '100%'
    this.notificationBackImg.sourceWidth = 800
    this.notificationBackImg.sourceHeight = 120

    this.notificationText.hAlign = 'center'
    this.notificationText.vAlign = 'center'
    this.notificationText.positionY = 6
    this.notificationText.width = 360
    this.notificationText.paddingLeft = 15
    this.notificationText.paddingRight = 15
    this.notificationText.value = ''
    this.notificationText.color = Color4.White()
    this.notificationText.fontSize = 14
    this.notificationText.textWrapping = true
    this.notificationText.lineSpacing = 24

    this.notificationButton.hAlign = 'right'
    this.notificationButton.vAlign = 'bottom'
    this.notificationButton.adaptHeight = true
    this.notificationButton.width = 25
    this.notificationButton.height = 25
    this.notificationButton.positionX = -59
    this.notificationButton.color = Color4.Clear()
    this.notificationButtonImg.width = '100%'
    this.notificationButtonImg.height = '100%'
    this.notificationButtonImg.sourceWidth = 50
    this.notificationButtonImg.sourceHeight = 50

    this.notificationButtonImg.onClick = new OnClick(() => {
      this.setNotificationText('')
    })
  }
  hide() {
    this.notificationBack.visible = false
    this.notificationBackImg.visible = false
    this.notificationText.visible = false
    this.notificationButton.visible = false
    this.notificationButtonImg.visible = false
  }

  show() {
    this.notificationBack.visible = true
    this.notificationBackImg.visible = true
    this.notificationText.visible = true
    this.notificationButton.visible = true
    this.notificationButtonImg.visible = true
  }

  setNotificationText(text: string) {
    this.notificationText.value = text

    if (text === '') {
      this.notificationBack.positionY = -200 // lose notification background
      this.notificationButton.positionY = -200 // lose notification button
    } else {
      this.notificationBack.positionY = 100 // re-position notification background
      this.notificationButton.positionY = 135 // re-position notification button
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
class BalanceUI {
  gameInstances
  notification: NotificationUI
  currentIndex: number = 0 // current index in the gameInstances array
  balanceBack: UIContainerRect
  balanceBackImg: UIImage
  logoImg: UIImage
  creditText: UIText
  creditBalanceText: UIText
  betText: UIText
  betBalanceText: UIText
  winText: UIText
  winBalanceText: UIText
  winOverlay: UIContainerRect
  winOverlayText: UIText
  approved: number = 0
  coinName: string
  payoutMode: boolean

  constructor(gameInstances, NotificationUI) {
    this.gameInstances = gameInstances
    this.notification = NotificationUI
    this.balanceBack = new UIContainerRect(screenSpaceUI)
    this.balanceBackImg = new UIImage(
      this.balanceBack,
      new Texture('images/balanceBack.png')
    )
    this.logoImg = new UIImage(screenSpaceUI, new Texture('images/logoDG.png'))
    this.winOverlay = new UIContainerRect(screenSpaceUI)
    this.winOverlayText = new UIText(this.winOverlay)
    this.creditText = new UIText(this.balanceBack)
    this.creditBalanceText = new UIText(this.balanceBack)
    this.betText = new UIText(this.balanceBack)
    this.betBalanceText = new UIText(this.balanceBack)
    this.winText = new UIText(this.balanceBack)
    this.winBalanceText = new UIText(this.balanceBack)

    this.initUI()
  }

  initUI() {
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // general interface styles
    this.balanceBack.hAlign = 'right'
    this.balanceBack.vAlign = 'bottom'
    this.balanceBack.positionY = -47 // 15
    this.balanceBack.positionX = -36 // -36
    this.balanceBack.width = 387 // 387
    this.balanceBack.height = 135 // 135
    this.balanceBack.color = Color4.Clear()

    this.balanceBackImg.hAlign = 'center'
    this.balanceBackImg.vAlign = 'center'
    this.balanceBackImg.width = '100%'
    this.balanceBackImg.height = '100%'
    this.balanceBackImg.sourceWidth = 400 // 400
    this.balanceBackImg.sourceHeight = 135 // 135

    this.logoImg.hAlign = 'right'
    this.logoImg.vAlign = 'bottom'
    this.logoImg.width = 45
    this.logoImg.height = 50
    this.logoImg.positionX = -10
    this.logoImg.positionY = 41 // 104
    this.logoImg.sourceWidth = 100
    this.logoImg.sourceHeight = 100

    this.winOverlay.hAlign = 'center'
    this.winOverlay.vAlign = 'center'
    this.winOverlay.positionY = 25
    this.winOverlay.positionX = -150
    this.winOverlay.color = Color4.Clear()
    this.winOverlayText.value = ''
    this.winOverlayText.color = Color4.White()
    this.winOverlayText.fontSize = 75
    this.winOverlayText.outlineWidth = 0.3
    this.winOverlayText.outlineColor = Color4.White()
    this.winOverlayText.textWrapping = false
    this.winOverlayText.fontWeight = 'bold'

    this.creditText.hAlign = 'left'
    this.creditText.vAlign = 'top'
    this.creditText.positionX = 35 // 35
    this.creditText.positionY = 23

    this.creditText.value = 'CREDITS:'
    this.creditText.color = Color4.Black()
    this.creditText.fontSize = 9
    this.creditText.outlineWidth = 0.4
    this.creditText.outlineColor = Color4.Black()
    this.creditText.textWrapping = true
    this.creditText.fontWeight = 'bold'

    this.creditBalanceText.hAlign = 'left'
    this.creditBalanceText.vAlign = 'top'
    this.creditBalanceText.positionX = 65 // 65
    this.creditBalanceText.positionY = 20

    this.creditBalanceText.paddingBottom = 2
    this.creditBalanceText.paddingLeft = 24
    this.creditBalanceText.value = ''
    this.creditBalanceText.color = Color4.Black()
    this.creditBalanceText.fontSize = 12
    this.creditBalanceText.outlineWidth = 0.3
    this.creditBalanceText.outlineColor = Color4.Black()
    this.creditBalanceText.textWrapping = true
    this.creditBalanceText.fontWeight = 'bold'

    this.betText.hAlign = 'left'
    this.betText.vAlign = 'top'
    this.betText.positionX = 165 // 165
    this.betText.positionY = 23

    this.betText.value = 'BET:'
    this.betText.color = Color4.Black()
    this.betText.fontSize = 9
    this.betText.outlineWidth = 0.4
    this.betText.outlineColor = Color4.Black()
    this.betText.textWrapping = true
    this.betText.fontWeight = 'bold'

    this.betBalanceText.hAlign = 'left'
    this.betBalanceText.vAlign = 'top'
    this.betBalanceText.positionX = 175 // 175
    this.betBalanceText.positionY = 20

    this.betBalanceText.paddingBottom = 2
    this.betBalanceText.paddingLeft = 24
    this.betBalanceText.value = ''
    this.betBalanceText.color = Color4.Black()
    this.betBalanceText.fontSize = 12
    this.betBalanceText.outlineWidth = 0.3
    this.betBalanceText.outlineColor = Color4.Black()
    this.betBalanceText.textWrapping = true
    this.betBalanceText.fontWeight = 'bold'

    this.winText.hAlign = 'left'
    this.winText.vAlign = 'top'
    this.winText.positionX = 265 // 265
    this.winText.positionY = 23

    this.winText.value = 'WIN:'
    this.winText.color = Color4.Black()
    this.winText.fontSize = 9
    this.winText.outlineWidth = 0.4
    this.winText.outlineColor = Color4.Black()
    this.winText.textWrapping = true
    this.winText.fontWeight = 'bold'

    this.winBalanceText.hAlign = 'left'
    this.winBalanceText.vAlign = 'top'
    this.winBalanceText.positionX = 275 // 275
    this.winBalanceText.positionY = 20
    this.winBalanceText.paddingBottom = 2
    this.winBalanceText.paddingLeft = 24
    this.winBalanceText.value = ''
    this.winBalanceText.color = Color4.Black()
    this.winBalanceText.fontSize = 12
    this.winBalanceText.outlineWidth = 0.3
    this.winBalanceText.outlineColor = Color4.Black()
    this.winBalanceText.textWrapping = true
    this.winBalanceText.fontWeight = 'bold'
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  onModeFree() {
    this.coinName = 'PLAY'
    this.payoutMode = false

    this.setNotification(
      'You are currently playing the free-to-play mode with ' +
        this.coinName +
        ', a worthless coin'
    )

    this.gameInstances[this.currentIndex].changeMode(0)
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  setNotification(text: string) {
    this.notification.setNotificationText(text)
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // set balance, button, and overlay win! values
  async setValues(UIValues) {
    log(UIValues)

    if (UIValues.creditsString !== '') {
      this.creditBalanceText.value = UIValues.creditsString
    }

    if (UIValues.betString !== '') {
      this.betBalanceText.value = UIValues.betString
    }

    if (UIValues.winningsString !== '') {
      this.winBalanceText.value = UIValues.winningsString
    }

    if (UIValues.winAmountString !== '') {
      const winAmount = UIValues.winAmountString

      if (winAmount !== '0') {
        this.winOverlayText.value = '+' + winAmount + ' ' + this.coinName + '!'

        delay.addComponent(
          new utils.Delay(3000, () => {
            this.winOverlayText.value = ''
          })
        )
        engine.addEntity(delay)
      }
    }
  }
}
