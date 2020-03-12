// import utils from '../../node_modules/decentraland-ecs-utils/index'
// import { screenSpaceUI } from '../music_ui'

// const delay: Entity = new Entity()
// // export let canvas: UICanvas
// // canvas = new UICanvas()
// // canvas.visible = true

// /////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////
// export class OverlayUI {
//   gameInstances: any[]
//   notification: NotificationUI
//   balance: BalanceUI
//   camera = Camera.instance
//   cameraPosition: Vector3
//   arrayPositions = []

//   constructor(gameInstances) {
//     this.notification = new NotificationUI()
//     this.balance = new BalanceUI(gameInstances, this.notification)
//     this.gameInstances = gameInstances

//     /////////////////////////////////////////////////////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////
//     // pass an instance of the overlay UI to each game and get each game's machine positions
//     for (var i = 0; i < this.gameInstances.length; i++) {
//       this.gameInstances[i].setOverlayUI(this)
//       this.arrayPositions.push(this.gameInstances[i].arrayPositions)
//     }

//     this.balance.onModeFree() // default game to free-to-play mode
//   }

//   update() {
//     let leastDistance: number = 999
//     let distance: number = 0
//     let tempIndex: number = 0

//     this.cameraPosition = this.camera.position

//     // loop through the positions array and find game instance with shortest machine distance
//     for (let i = 0; i < this.arrayPositions.length; i++) {
//       for (let j = 0; j < this.arrayPositions[i].length; j++) {
//         distance = Vector3.Distance(
//           Camera.instance.position,
//           new Vector3(
//             this.arrayPositions[i][j][0],
//             this.arrayPositions[i][j][1],
//             this.arrayPositions[i][j][2]
//           )
//         )

//         if (distance < leastDistance) {
//           if (tempIndex !== i) {
//             tempIndex = i
//           }

//           leastDistance = distance
//         }
//       }
//     }

//     // call changeMode() of game instance at least distance and reset currentIndex
//     const index = this.balance.currentIndex
//     if (index !== tempIndex) {
//       const balance = this.gameInstances[index].getCredits()
//       const winnings = this.gameInstances[index].getWinnings()

//       this.gameInstances[tempIndex].changeMode(balance, winnings)
//       this.balance.setNotification('') // remove any messages

//       this.balance.currentIndex = tempIndex
//     }
//   }
// }

// /////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////
// class NotificationUI {
//   notificationBack: UIContainerRect
//   notificationBackImg: UIImage
//   notificationText: UIText
//   notificationButton: UIContainerRect
//   notificationButtonImg: UIImage

//   constructor() {
//     this.notificationBack = new UIContainerRect(screenSpaceUI)
//     this.notificationBackImg = new UIImage(
//       this.notificationBack,
//       new Texture('images/notificationBack.png')
//     )
//     this.notificationText = new UIText(this.notificationBack)
//     this.notificationButton = new UIContainerRect(screenSpaceUI)
//     this.notificationButtonImg = new UIImage(
//       this.notificationButton,
//       new Texture('images/notificationButton.png')
//     )

//     this.initUI()
//   }

//   initUI() {
//     this.notificationBack.hAlign = 'right'
//     this.notificationBack.vAlign = 'bottom'
//     this.notificationBack.adaptHeight = true
//     this.notificationBack.width = 360
//     this.notificationBack.height = 60
//     this.notificationBack.positionX = -60
//     this.notificationBack.color = Color4.Clear()
//     this.notificationBackImg.hAlign = 'center'
//     this.notificationBackImg.vAlign = 'center'
//     this.notificationBackImg.width = '100%'
//     this.notificationBackImg.height = '100%'
//     this.notificationBackImg.sourceWidth = 800
//     this.notificationBackImg.sourceHeight = 120

//     this.notificationText.hAlign = 'center'
//     this.notificationText.vAlign = 'center'
//     this.notificationText.positionY = 6
//     this.notificationText.width = 360
//     this.notificationText.paddingLeft = 15
//     this.notificationText.paddingRight = 15
//     this.notificationText.value = ''
//     this.notificationText.color = Color4.White()
//     this.notificationText.fontSize = 14
//     this.notificationText.textWrapping = true
//     this.notificationText.lineSpacing = 24

//     this.notificationButton.hAlign = 'right'
//     this.notificationButton.vAlign = 'bottom'
//     this.notificationButton.adaptHeight = true
//     this.notificationButton.width = 25
//     this.notificationButton.height = 25
//     this.notificationButton.positionX = -59
//     this.notificationButton.color = Color4.Clear()
//     this.notificationButtonImg.width = '100%'
//     this.notificationButtonImg.height = '100%'
//     this.notificationButtonImg.sourceWidth = 50
//     this.notificationButtonImg.sourceHeight = 50

//     this.notificationButtonImg.onClick = new OnClick(() => {
//       this.setNotificationText('')
//     })
//   }

//   setNotificationText(text: string) {
//     this.notificationText.value = text

//     if (text === '') {
//       this.notificationBack.positionY = -200 // lose notification background
//       this.notificationButton.positionY = -200 // lose notification button
//     } else {
//       this.notificationBack.positionY = 100 // re-position notification background
//       this.notificationButton.positionY = 135 // re-position notification button
//     }
//   }
// }

// /////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////
// class BalanceUI {
//   gameInstances
//   notification: NotificationUI
//   currentIndex: number = 0 // current index in the gameInstances array
//   balanceBack: UIContainerRect
//   balanceBackImg: UIImage
//   logoImg: UIImage
//   creditText: UIText
//   creditBalanceText: UIText
//   betText: UIText
//   betBalanceText: UIText
//   winText: UIText
//   winBalanceText: UIText
//   winOverlay: UIContainerRect
//   winOverlayText: UIText
//   approved: number = 0
//   coinName: string
//   payoutMode: boolean

//   constructor(gameInstances, NotificationUI) {
//     this.gameInstances = gameInstances
//     this.notification = NotificationUI
//     this.balanceBack = new UIContainerRect(screenSpaceUI)
//     this.balanceBackImg = new UIImage(
//       this.balanceBack,
//       new Texture('images/balanceBack.png')
//     )
//     this.logoImg = new UIImage(screenSpaceUI, new Texture('images/logoDG.png'))
//     this.winOverlay = new UIContainerRect(screenSpaceUI)
//     this.winOverlayText = new UIText(this.winOverlay)
//     this.creditText = new UIText(this.balanceBack)
//     this.creditBalanceText = new UIText(this.balanceBack)
//     this.betText = new UIText(this.balanceBack)
//     this.betBalanceText = new UIText(this.balanceBack)
//     this.winText = new UIText(this.balanceBack)
//     this.winBalanceText = new UIText(this.balanceBack)

//     this.initUI()
//   }

//   initUI() {
//     /////////////////////////////////////////////////////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////
//     // general interface styles
//     this.balanceBack.hAlign = 'right'
//     this.balanceBack.vAlign = 'bottom'
//     this.balanceBack.positionY = -47 // 15
//     this.balanceBack.positionX = -36 // -36
//     this.balanceBack.width = 387 // 387
//     this.balanceBack.height = 135 // 135
//     this.balanceBack.color = Color4.Clear()

//     this.balanceBackImg.hAlign = 'center'
//     this.balanceBackImg.vAlign = 'center'
//     this.balanceBackImg.width = '100%'
//     this.balanceBackImg.height = '100%'
//     this.balanceBackImg.sourceWidth = 400 // 400
//     this.balanceBackImg.sourceHeight = 135 // 135

//     this.logoImg.hAlign = 'right'
//     this.logoImg.vAlign = 'bottom'
//     this.logoImg.width = 45
//     this.logoImg.height = 50
//     this.logoImg.positionX = -10
//     this.logoImg.positionY = 41 // 104
//     this.logoImg.sourceWidth = 100
//     this.logoImg.sourceHeight = 100

//     this.winOverlay.hAlign = 'center'
//     this.winOverlay.vAlign = 'center'
//     this.winOverlay.positionY = 25
//     this.winOverlay.positionX = -150
//     this.winOverlay.color = Color4.Clear()
//     this.winOverlayText.value = ''
//     this.winOverlayText.color = Color4.White()
//     this.winOverlayText.fontSize = 75
//     this.winOverlayText.outlineWidth = 0.3
//     this.winOverlayText.outlineColor = Color4.White()
//     this.winOverlayText.textWrapping = false
//     this.winOverlayText.fontWeight = 'bold'

//     this.creditText.hAlign = 'left'
//     this.creditText.vAlign = 'top'
//     this.creditText.positionX = 35 // 35
//     this.creditText.positionY = 23

//     this.creditText.value = 'CREDITS:'
//     this.creditText.color = Color4.Black()
//     this.creditText.fontSize = 9
//     this.creditText.outlineWidth = 0.4
//     this.creditText.outlineColor = Color4.Black()
//     this.creditText.textWrapping = true
//     this.creditText.fontWeight = 'bold'

//     this.creditBalanceText.hAlign = 'left'
//     this.creditBalanceText.vAlign = 'top'
//     this.creditBalanceText.positionX = 65 // 65
//     this.creditBalanceText.positionY = 20

//     this.creditBalanceText.paddingBottom = 2
//     this.creditBalanceText.paddingLeft = 24
//     this.creditBalanceText.value = ''
//     this.creditBalanceText.color = Color4.Black()
//     this.creditBalanceText.fontSize = 12
//     this.creditBalanceText.outlineWidth = 0.3
//     this.creditBalanceText.outlineColor = Color4.Black()
//     this.creditBalanceText.textWrapping = true
//     this.creditBalanceText.fontWeight = 'bold'

//     this.betText.hAlign = 'left'
//     this.betText.vAlign = 'top'
//     this.betText.positionX = 165 // 165
//     this.betText.positionY = 23

//     this.betText.value = 'BET:'
//     this.betText.color = Color4.Black()
//     this.betText.fontSize = 9
//     this.betText.outlineWidth = 0.4
//     this.betText.outlineColor = Color4.Black()
//     this.betText.textWrapping = true
//     this.betText.fontWeight = 'bold'

//     this.betBalanceText.hAlign = 'left'
//     this.betBalanceText.vAlign = 'top'
//     this.betBalanceText.positionX = 175 // 175
//     this.betBalanceText.positionY = 20

//     this.betBalanceText.paddingBottom = 2
//     this.betBalanceText.paddingLeft = 24
//     this.betBalanceText.value = ''
//     this.betBalanceText.color = Color4.Black()
//     this.betBalanceText.fontSize = 12
//     this.betBalanceText.outlineWidth = 0.3
//     this.betBalanceText.outlineColor = Color4.Black()
//     this.betBalanceText.textWrapping = true
//     this.betBalanceText.fontWeight = 'bold'

//     this.winText.hAlign = 'left'
//     this.winText.vAlign = 'top'
//     this.winText.positionX = 265 // 265
//     this.winText.positionY = 23

//     this.winText.value = 'WIN:'
//     this.winText.color = Color4.Black()
//     this.winText.fontSize = 9
//     this.winText.outlineWidth = 0.4
//     this.winText.outlineColor = Color4.Black()
//     this.winText.textWrapping = true
//     this.winText.fontWeight = 'bold'

//     this.winBalanceText.hAlign = 'left'
//     this.winBalanceText.vAlign = 'top'
//     this.winBalanceText.positionX = 275 // 275
//     this.winBalanceText.positionY = 20
//     this.winBalanceText.paddingBottom = 2
//     this.winBalanceText.paddingLeft = 24
//     this.winBalanceText.value = ''
//     this.winBalanceText.color = Color4.Black()
//     this.winBalanceText.fontSize = 12
//     this.winBalanceText.outlineWidth = 0.3
//     this.winBalanceText.outlineColor = Color4.Black()
//     this.winBalanceText.textWrapping = true
//     this.winBalanceText.fontWeight = 'bold'
//   }

//   /////////////////////////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////////////////////////
//   onModeFree() {
//     this.coinName = 'PLAY'
//     this.payoutMode = false

//     this.setNotification(
//       'You are currently playing the free-to-play mode with ' +
//         this.coinName +
//         ', a worthless coin'
//     )

//     this.gameInstances[this.currentIndex].changeMode(0)
//   }

//   /////////////////////////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////////////////////////
//   setNotification(text: string) {
//     this.notification.setNotificationText(text)
//   }

//   /////////////////////////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////////////////////////
//   // set balance, button, and overlay win! values
//   async setValues(UIValues) {
//     log(UIValues)

//     if (UIValues.creditsString !== '') {
//       this.creditBalanceText.value = UIValues.creditsString
//     }

//     if (UIValues.betString !== '') {
//       this.betBalanceText.value = UIValues.betString
//     }

//     if (UIValues.winningsString !== '') {
//       this.winBalanceText.value = UIValues.winningsString
//     }

//     if (UIValues.winAmountString !== '') {
//       const winAmount = UIValues.winAmountString

//       if (winAmount !== '0') {
//         this.winOverlayText.value = '+' + winAmount + ' ' + this.coinName + '!'

//         delay.addComponent(
//           new utils.Delay(3000, () => {
//             this.winOverlayText.value = ''
//           })
//         )
//         engine.addEntity(delay)
//       }
//     }
//   }
// }
