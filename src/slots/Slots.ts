import utils from '../../node_modules/decentraland-ecs-utils/index'
import { DummyMachine } from './DummyMachine'
import { Positions } from './Positions'
import { Distances } from './Distances'
import slotsData from './slotsData'
import { Towers } from './Towers'

let delay: Entity = new Entity()
engine.addEntity(delay)

let instances: any = [] // array to hold references to new instances of machines

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// custom component to store setSlerp() function data
@Component('turnData')
class TurnData {
  originRot: Quaternion
  targetRot: Quaternion
  fraction1: number = 0
  fraction2: number = 0
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
class SlotMachine {
  gameType: number = 1 // slots == gameType of 1
  machineID: number = 0 // unique for each slot machine in the casino
  overlayUI = null
  UIValues: object = {}

  machine: Entity = new Entity()
  UIParent2D: Entity = new Entity()
  UIParent3D: Entity = new Entity()
  wheel0: Entity = new Entity()
  wheel1: Entity = new Entity()
  wheel2: Entity = new Entity()
  wheel3: Entity = new Entity()
  // button1: Entity = new Entity();
  button2: Entity = new Entity()
  // button3: Entity = new Entity();
  arm: Entity = new Entity()
  buttonPlane: Entity = new Entity()
  armPlane: Entity = new Entity()
  soundPoint1: Entity = new Entity()
  soundPoint2: Entity = new Entity()
  soundPoint3: Entity = new Entity()

  jackpot: Entity = new Entity()
  jackpot1: Entity = new Entity()
  jackpot2: Entity = new Entity()
  jackpot3: Entity = new Entity()
  jackpot4: Entity = new Entity()
  creditsCurrent: Entity = new Entity()
  betAmount: Entity = new Entity()
  winCurrent: Entity = new Entity()
  machineNumber: Entity = new Entity()

  credits: number = 0
  betWei: number = 0
  betStandard: number = 0
  jackpot1Amount: number = 0
  jackpot2Amount: number = 0
  jackpot3Amount: number = 0
  jackpot4Amount: number = 0
  winnings: number = 0
  coinName: string = ''
  winAmount: number = 0

  wheelsSpin1: boolean = false
  wheelsSpin2: boolean = false
  wheelsSpin3: boolean = false
  spinResult1: string = '' // always clear results when not spinning
  spinResult2: string = '' // always clear results when not spinning
  spinResult3: string = '' // always clear results when not spinning
  transformWheel1
  transformWheel2
  transformWheel3
  clipButton = new AudioClip('sounds/slots/buttonBeep1.mp3')
  soundButton = new AudioSource(this.clipButton)
  clipSpinning = new AudioClip('sounds/slots/spinning2.mp3')
  soundSpinning = new AudioSource(this.clipSpinning)
  clipJackpot = new AudioClip('sounds/slots/jackpot1.mp3')
  soundJackpot = new AudioSource(this.clipJackpot)
  clipWheelLock = new AudioClip('sounds/slots/wheelLock.mp3')
  soundLock = new AudioSource(this.clipWheelLock)
  position: Vector3
  rotation: number
  scale: number
  themeID: number

  constructor(
    position: Vector3,
    rotation: number,
    scale: number,
    themeID: number
  ) {
    this.position = position
    this.rotation = rotation
    this.scale = scale
    this.themeID = themeID

    this.arm.addComponent(new TurnData())
    this.buildMachine()
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // slerp function and wheels rotation. update() method executed once per frame
  setSlerp() {
    let slerp = this.arm.getComponent(TurnData)

    slerp.fraction1 = 0
    slerp.fraction2 = 0
  }

  update(dt: number) {
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // arm rotation
    let slerp = this.arm.getComponent(TurnData)
    let transform = this.arm.getComponent(Transform)

    if (this.wheelsSpin1) {
      if (slerp.fraction1 < 1) {
        let rot = Quaternion.Slerp(
          Quaternion.Euler(0, 180, 0),
          Quaternion.Euler(-45, 180, 0),
          slerp.fraction1
        )

        transform.rotation = rot
        slerp.fraction1 += dt
      } else if (slerp.fraction1 >= 1 && slerp.fraction2 < 1) {
        let rot = Quaternion.Slerp(
          Quaternion.Euler(-45, 180, 0),
          Quaternion.Euler(0, 180, 0),
          slerp.fraction2
        )

        transform.rotation = rot
        slerp.fraction2 += dt
      }
    } else if (slerp.fraction1 > 0) {
      transform.rotation = Quaternion.Euler(0, 180, 0)
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // set wheel rotations and stop positions
    this.spinResult(this.wheelsSpin1, this.transformWheel1, this.spinResult1)
    this.spinResult(this.wheelsSpin2, this.transformWheel2, this.spinResult2)
    this.spinResult(this.wheelsSpin3, this.transformWheel3, this.spinResult3)
  }

  spinResult(wheelsSpin, transformWheel, spinResult) {
    if (wheelsSpin) {
      transformWheel.rotate(Vector3.Left(), -36)
    } else if (spinResult !== '') {
      if (
        spinResult === '0' ||
        spinResult === '1' ||
        spinResult === '2' ||
        spinResult === '3'
      )
        transformWheel.rotation = Quaternion.Euler(67, 180, 0)
      else if (spinResult === '4' || spinResult === '5' || spinResult === '6')
        transformWheel.rotation = Quaternion.Euler(31, 180, 0)
      else if (spinResult === '7' || spinResult === '8')
        transformWheel.rotation = Quaternion.Euler(-5, 180, 0)
      else if (spinResult === '9')
        transformWheel.rotation = Quaternion.Euler(103, 180, 0)

      spinResult = ''
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // set free-to-play or payout mode play
  setPlay() {
    // only if not already in play
    if (!this.wheelsSpin3) {
      this.startSlots()

      if (!this.overlayUI.balance.payoutMode) {
        this.prePlay()
      } else {
        this.payout()
      }
    }
  }

  startSlots() {
    this.playSounds()
    this.setSlerp()

    this.wheelsSpin1 = true
    this.wheelsSpin2 = true
    this.wheelsSpin3 = true
  }

  prePlay() {
    // 3 second wheel spin (3000) then generate numbers
    this.arm.addComponentOrReplace(
      new utils.Delay(3000, () => {
        this.freePlay()
      })
    )

    // decrement credits and update balance on display and overlay
    this.credits = this.credits - this.betStandard

    this.updateText()

    this.UIValues = {
      creditsString: this.credits.toString(),
      betString: '',
      winningsString: '',
      winAmountString: ''
    }
    this.overlayUI.balance.setValues(this.UIValues)
  }

  freePlay() {
    // randomly determine number from 0 - 999
    // if user hasn't changed machines set the wheel positions, else use the default
    if (this.wheelsSpin1) {
      this.spinResult1 = Math.floor(Math.random() * Math.floor(10)).toString()
      this.spinResult2 = Math.floor(Math.random() * Math.floor(10)).toString()
      this.spinResult3 = Math.floor(Math.random() * Math.floor(10)).toString()
    } else {
      this.spinResult1 = '4'
      this.spinResult2 = '0'
      this.spinResult3 = '7'
    }

    let numbers: number = parseInt(
      this.spinResult1 + this.spinResult2 + this.spinResult3
    )

    // look-up table defining groups of winning number (symbol) combinations
    const symbols = [4, 4, 4, 4, 3, 3, 3, 2, 2, 1]
    let winner = symbols[numbers % 10] // get symbol for rightmost number

    for (let i = 0; i < 2; i++) {
      numbers = Math.floor(numbers / 10) // shift numbers to get next symbol

      if (symbols[numbers % 10] !== winner) {
        winner = 0

        break // if number not part of the winner group (same symbol) break
      }
    }
    if (winner === 1) {
      this.winAmount = this.jackpot1Amount
    } else if (winner === 2) {
      this.winAmount = this.jackpot2Amount
    } else if (winner === 3) {
      this.winAmount = this.jackpot3Amount
    } else if (winner === 4) {
      this.winAmount = this.jackpot4Amount
    } else {
      this.winAmount = 0
    }

    this.credits = this.credits + this.winAmount

    this.stopSlots()
  }

  payout() {
    if (this.betStandard > this.credits) {
      this.overlayUI.balance.setNotification(
        'You do not have enough funds to cover that bet amount'
      )

      this.spinResult1 = Math.floor(Math.random() * Math.floor(10)).toString()
      this.spinResult2 = Math.floor(Math.random() * Math.floor(10)).toString()
      this.spinResult3 = Math.floor(Math.random() * Math.floor(10)).toString()

      this.stopSlots()
    } else {
      let betIDs: number[] = []
      let betValues: number[] = []
      let betAmounts: number[] = [] // roulette gets a string due to large values

      betIDs.push(1101)
      betValues.push(0)
      betAmounts.push(this.betWei)

      // pass game data to WebSocket connection
      const gameData = {
        coinName: this.coinName,
        betIDs: betIDs,
        betValues: betValues,
        betAmounts: betAmounts
      }
      // sendMessage(this.gameType, this.machineID, gameData);
    }
  }

  stopSlots() {
    this.winnings = this.winnings + this.winAmount

    log('stopSlots win amount: ' + this.winAmount)
    log('stopSlots winnings + win amount: ' + this.winnings)

    // 0 second delay for wheel 1 stop
    this.wheel1.addComponentOrReplace(
      new utils.Delay(0, () => {
        this.wheelsSpin1 = false

        this.soundWheelLock()
      })
    )
    // 1 second delay for wheel 2 stop
    this.wheel2.addComponentOrReplace(
      new utils.Delay(1000, () => {
        this.wheelsSpin2 = false

        this.soundWheelLock()
      })
    )
    // 2 second delay for wheel 3 stop
    this.wheel3.addComponentOrReplace(
      new utils.Delay(2000, () => {
        this.wheelsSpin3 = false

        this.soundWheelLock()
        this.stopSounds() // stop all sounds
      })
    )

    // update win amount and play jackpot sound after 3 second delay
    delay.addComponentOrReplace(
      new utils.Delay(3000, async () => {
        if (this.overlayUI.balance.payoutMode) {
          this.credits = await this.overlayUI.balance.getCredits()
        }

        this.updateText()

        this.UIValues = {
          creditsString: this.credits.toString(),
          betString: '',
          winningsString: this.winnings.toString(),
          winAmountString: this.winAmount.toString()
        }
        this.overlayUI.balance.setValues(this.UIValues)

        if (this.winAmount > 0) {
          this.winningSound()
          this.winAmount = 0
        }
      })
    )
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // audio and text functions
  playSounds() {
    this.soundButton.playOnce()
    this.soundSpinning.playing = true
  }

  soundWheelLock() {
    this.soundLock.playOnce()
  }

  stopSounds() {
    this.soundSpinning.playing = false
  }

  winningSound() {
    this.soundJackpot.playOnce()
  }

  updateText() {
    const textJackpot = new TextShape(
      this.jackpot1Amount + ' ' + this.coinName + ' JACKPOT!'
    )
    textJackpot.fontSize = 70
    textJackpot.outlineWidth = 0.25
    textJackpot.outlineColor = Color3.FromHexString('#0088ff')
    this.jackpot.addComponentOrReplace(textJackpot)

    const textJackpot1 = new TextShape(
      this.jackpot1Amount + ' ' + this.coinName
    )
    textJackpot1.fontSize = 45
    textJackpot1.hTextAlign = 'right'
    this.jackpot1.addComponentOrReplace(textJackpot1)

    const textJackpot2 = new TextShape(
      this.jackpot2Amount + ' ' + this.coinName
    )
    textJackpot2.fontSize = 45
    textJackpot2.hTextAlign = 'right'
    this.jackpot2.addComponentOrReplace(textJackpot2)

    const textJackpot3 = new TextShape(
      this.jackpot3Amount + ' ' + this.coinName
    )
    textJackpot3.fontSize = 45
    textJackpot3.hTextAlign = 'right'
    this.jackpot3.addComponentOrReplace(textJackpot3)

    const textJackpot4 = new TextShape(
      this.jackpot4Amount + ' ' + this.coinName
    )
    textJackpot4.fontSize = 45
    textJackpot4.hTextAlign = 'right'
    this.jackpot4.addComponentOrReplace(textJackpot4)

    const textCredits = new TextShape('CREDITS ' + this.credits)
    textCredits.fontSize = 30
    this.creditsCurrent.addComponentOrReplace(textCredits)

    const textBet = new TextShape('BET ' + this.betStandard)
    textBet.fontSize = 30
    this.betAmount.addComponentOrReplace(textBet)

    const textWinnings = new TextShape('WIN ' + this.winnings)
    textWinnings.fontSize = 30
    this.winCurrent.addComponentOrReplace(textWinnings)
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  buildMachine() {
    this.slotsModelsActive() // buid active machine geometry

    this.transformWheel1 = this.wheel1.getComponent(Transform)
    this.transformWheel2 = this.wheel2.getComponent(Transform)
    this.transformWheel3 = this.wheel3.getComponent(Transform)
    this.transformWheel1.rotation = Quaternion.Euler(67, 180, 0)
    this.transformWheel2.rotation = Quaternion.Euler(175, 180, 0)
    this.transformWheel3.rotation = Quaternion.Euler(247, 180, 0)

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // create the three buttons and bet amounts
    // this.button1.addComponent(
    //   new GLTFShape('models/slots/slotMachineButton.gltf')
    // );
    // this.button1.addComponent(
    //   new Transform({
    //     position: new Vector3(-.5, 0.05, 0),
    //     rotation: Quaternion.Euler(0, 180, 0)
    //   })
    // );
    // this.button1.setParent(this.UIParent3D);
    // engine.addEntity(this.button1);

    this.button2.addComponent(
      new GLTFShape('models/slots/slotMachineButton.gltf')
    )
    this.button2.addComponent(
      new Transform({
        position: new Vector3(0, 0.05, 0),
        rotation: Quaternion.Euler(0, 180, 0)
      })
    )
    this.button2.setParent(this.UIParent3D)
    engine.addEntity(this.button2)

    // this.button3.addComponent(
    //   new GLTFShape('models/slots/slotMachineButton.gltf')
    // );
    // this.button3.addComponent(
    //   new Transform({
    //     position: new Vector3(.5, 0.05, 0),
    //     rotation: Quaternion.Euler(0, 180, 0)
    //   })
    // );
    // this.button3.setParent(this.UIParent3D);
    // engine.addEntity(this.button3);

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // create onClick() planes for button and arm
    // const alphaTexture = new Texture('materials/alpha.png');
    const alphaMaterial = new Material()
    alphaMaterial.albedoColor = new Color4(0, 0, 0, 0)
    // alphaMaterial.albedoTexture = alphaTexture;
    // alphaMaterial.alphaTexture = alphaTexture;

    this.buttonPlane.addComponent(
      new Transform({
        position: new Vector3(0, 2.42, -1.75),
        // position: new Vector3(this.position.x, this.position.y + 2, this.position.z - 2),
        rotation: Quaternion.Euler(53.5, 0, 0),
        // rotation: Quaternion.Euler(53.5, this.rotation, 0),
        scale: new Vector3(0.35, 0.25, 0.25)
        // scale: new Vector3(0.5, 0.5, 0.5)
      })
    )
    this.buttonPlane.addComponent(new PlaneShape())
    this.buttonPlane.setParent(this.UIParent3D)
    engine.addEntity(this.buttonPlane)
    this.buttonPlane.addComponent(alphaMaterial) // make it invisible

    this.buttonPlane.addComponent(
      new OnClick(e => {
        this.setPlay()
      })
    )

    this.armPlane.addComponent(
      new Transform({
        position: new Vector3(1.25, 2.85, -1.3),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.5, 2, 0.25)
      })
    )
    this.armPlane.addComponent(new PlaneShape())
    this.armPlane.setParent(this.UIParent3D)
    engine.addEntity(this.armPlane)
    this.armPlane.addComponent(alphaMaterial) // make it invisible

    this.armPlane.addComponent(
      new OnClick(e => {
        this.setPlay()
      })
    )

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // create sound planes for wheel spinning, jackpot, and lock
    this.soundPoint1.addComponent(
      new Transform({
        position: new Vector3(0, 3.5, -2),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.25, 0.25, 0.25)
      })
    )
    this.soundPoint1.addComponent(new PlaneShape())
    this.soundPoint1.setParent(this.UIParent3D)
    engine.addEntity(this.soundPoint1)
    this.soundPoint1.addComponent(alphaMaterial) // make it invisible

    this.soundPoint2.addComponent(
      new Transform({
        position: new Vector3(0, 3.5, -2),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.25, 0.25, 0.25)
      })
    )
    this.soundPoint2.addComponent(new PlaneShape())
    this.soundPoint2.setParent(this.UIParent3D)
    engine.addEntity(this.soundPoint2)
    this.soundPoint2.addComponent(alphaMaterial) // make it invisible

    this.soundPoint3.addComponent(
      new Transform({
        position: new Vector3(0, 3.5, -2),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.25, 0.25, 0.25)
      })
    )
    this.soundPoint3.addComponent(new PlaneShape())
    this.soundPoint3.setParent(this.UIParent3D)
    engine.addEntity(this.soundPoint3)
    this.soundPoint3.addComponent(alphaMaterial) // make it invisible

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // add audio
    this.soundButton.volume = 0.7
    this.soundButton.playing = false
    this.button2.addComponent(this.soundButton)

    this.soundSpinning.loop = true
    this.soundSpinning.volume = 0.5
    this.soundSpinning.playing = false
    this.soundPoint1.addComponent(this.soundSpinning)

    this.soundJackpot.volume = 1
    this.soundJackpot.playing = false
    this.soundPoint2.addComponent(this.soundJackpot)

    this.soundLock.volume = 0.4
    this.soundLock.playing = false
    this.soundPoint3.addComponent(this.soundLock)

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // add and position jackpot and credit entities
    this.jackpot.addComponent(new Transform())
    this.jackpot.getComponent(Transform).position.set(0, 80, 3.4)
    this.jackpot.setParent(this.UIParent2D)
    engine.addEntity(this.jackpot)

    this.jackpot1.addComponent(new Transform())
    this.jackpot1.getComponent(Transform).position.set(37, 52, -0.5)
    this.jackpot1.setParent(this.UIParent2D)
    engine.addEntity(this.jackpot1)

    this.jackpot2.addComponent(new Transform())
    this.jackpot2.getComponent(Transform).position.set(37, 43.5, -2.2)
    this.jackpot2.setParent(this.UIParent2D)
    engine.addEntity(this.jackpot2)

    this.jackpot3.addComponent(new Transform())
    this.jackpot3.getComponent(Transform).position.set(37, 35, -3.9)
    this.jackpot3.setParent(this.UIParent2D)
    engine.addEntity(this.jackpot3)

    this.jackpot4.addComponent(new Transform())
    this.jackpot4.getComponent(Transform).position.set(37, 26.5, -5.5)
    this.jackpot4.setParent(this.UIParent2D)
    engine.addEntity(this.jackpot4)

    this.creditsCurrent.addComponent(new Transform())
    this.creditsCurrent.getComponent(Transform).position.set(-25, -16.5, -14)
    this.creditsCurrent.setParent(this.UIParent2D)
    engine.addEntity(this.creditsCurrent)

    this.betAmount.addComponent(new Transform())
    this.betAmount.getComponent(Transform).position.set(0, -16.5, -14)
    this.betAmount.setParent(this.UIParent2D)
    engine.addEntity(this.betAmount)

    this.winCurrent.addComponent(new Transform())
    this.winCurrent.getComponent(Transform).position.set(25, -16.5, -14)
    this.winCurrent.setParent(this.UIParent2D)
    engine.addEntity(this.winCurrent)

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // add small ID number at the bottom of the machine
    const textNumber = new TextShape(this.machineID.toString())
    textNumber.fontSize = 50
    textNumber.color = Color3.White()
    textNumber.width = 10

    this.machineNumber.addComponent(textNumber)
    this.machineNumber.addComponent(
      new Transform({
        position: new Vector3(51, -145, 82),
        rotation: Quaternion.Euler(0, -90, 0)
      })
    )
    this.machineNumber.setParent(this.UIParent2D)
    engine.addEntity(this.machineNumber)
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  slotsModelsActive() {
    this.machine.addComponent(
      new GLTFShape(
        'models/slots/slotMachine_' + this.themeID + '_collider.gltf'
      )
    )
    this.machine.addComponent(
      new Transform({
        position: this.position,
        rotation: Quaternion.Euler(0, this.rotation, 0),
        scale: new Vector3(this.scale, this.scale, this.scale)
      })
    )
    engine.addEntity(this.machine)

    this.UIParent2D.addComponent(
      new Transform({
        position: new Vector3(0, 3, 1.19),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(0.02, 0.02, 0.02)
      })
    )
    this.UIParent2D.setParent(this.machine)
    engine.addEntity(this.UIParent2D)

    this.UIParent3D.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 180, 0)
      })
    )
    this.UIParent3D.setParent(this.machine)
    engine.addEntity(this.UIParent3D)

    this.arm.addComponent(new GLTFShape('models/slots/slotMachineArm.gltf'))
    this.arm.addComponent(
      new Transform({
        position: new Vector3(1.105, 2.05, -1.15),
        rotation: Quaternion.Euler(0, 180, 0)
      })
    )
    this.arm.setParent(this.UIParent3D)
    engine.addEntity(this.arm)

    // wheel 0 has no purpose other than to fix the first wheel replace texture error
    this.wheel0.addComponent(
      new GLTFShape('models/slots/slotMachineWheel_' + this.themeID + '.gltf')
    )
    this.wheel0.addComponent(
      new Transform({
        position: new Vector3(0, 1, 0), // hide it inside the box
        rotation: Quaternion.Euler(0, 180, 0)
      })
    )
    this.wheel0.setParent(this.UIParent3D)
    engine.addEntity(this.wheel0)

    this.wheel1.addComponent(
      new GLTFShape('models/slots/slotMachineWheel_' + this.themeID + '.gltf')
    )
    this.wheel1.addComponent(
      new Transform({
        position: new Vector3(-0.4, 3, -1.17),
        rotation: Quaternion.Euler(0, 180, 0)
      })
    )
    this.wheel1.setParent(this.UIParent3D)
    engine.addEntity(this.wheel1)

    this.wheel2.addComponent(
      new GLTFShape('models/slots/slotMachineWheel_' + this.themeID + '.gltf')
    )
    this.wheel2.addComponent(
      new Transform({
        position: new Vector3(0, 3, -1.17),
        rotation: Quaternion.Euler(0, 180, 0)
      })
    )
    this.wheel2.setParent(this.UIParent3D)
    engine.addEntity(this.wheel2)

    this.wheel3.addComponent(
      new GLTFShape('models/slots/slotMachineWheel_' + this.themeID + '.gltf')
    )
    this.wheel3.addComponent(
      new Transform({
        position: new Vector3(0.4, 3, -1.17),
        rotation: Quaternion.Euler(0, 180, 0)
      })
    )
    this.wheel3.setParent(this.UIParent3D)
    engine.addEntity(this.wheel3)
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// create the active and dummy slot machines and set the position, rotation, scale, and ID
export class Slots {
  towers
  topBetAmount: number
  creditsDefault: number = 1000
  multiplier: number = 1000000000000000000 // convert from Eth units to Wei and vice versa

  jackpotFactor1: number
  jackpotFactor2: number
  jackpotFactor3: number
  jackpotFactor4: number
  positionX: number
  positionY: number
  positionZ: number
  yRotation: number
  themeID: number

  arrayPositions = []

  constructor(topBetAmount, arrayFactors) {
    this.topBetAmount = topBetAmount
    this.jackpotFactor1 = arrayFactors[0]
    this.jackpotFactor2 = arrayFactors[1]
    this.jackpotFactor3 = arrayFactors[2]
    this.jackpotFactor4 = arrayFactors[3]

    this.createMachines() // create active and dummy machines

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // position active and dummy machines and calculate distances between user and each machine
    // (position, rotation, and theme information are contained in ./slotsData.ts)
    // delay instantiating Positions class by 5 seconds to avoid wrong theme error
    delay.addComponentOrReplace(
      new utils.Delay(5000, () => {
        const positions = new Positions(instances)
        engine.addSystem(new Distances(positions))
      })
    )

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // add display towers (positions are set in ./towersData.ts)
    this.towers = new Towers()
  }

  createMachines() {
    slotsData.map((object, index) => {
      this.positionX = object.position[0]
      this.positionY = object.position[1]
      this.positionZ = object.position[2]
      this.yRotation = object.yRotation
      this.themeID = object.themeID

      if (index === 0) {
        // create active slot machine for instance 0
        instances[0] = engine.addSystem(
          new SlotMachine(
            new Vector3(this.positionX, this.positionY, this.positionZ),
            this.yRotation,
            0.5,
            this.themeID
          )
        )

        // create dummy for instance 0 (and immediately move it out-of-scene)
        instances[-1] = new DummyMachine(
          new Vector3(0, -100, 0),
          this.yRotation,
          0.5,
          this.themeID
        )
      } else {
        // create dummy slot machine
        instances[index] = new DummyMachine(
          new Vector3(this.positionX, this.positionY, this.positionZ),
          this.yRotation,
          0.5,
          this.themeID
        )
      }

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // add machine coordinates to arrayPositions for use in Overaly UI
      this.arrayPositions.push([this.positionX, this.positionY, this.positionZ])
    })
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // create a reference to the overlay UI instance
  setOverlayUI(instance) {
    instances[0].overlayUI = instance
  }

  // give overlay UI access to credits amount
  getCredits() {
    return instances[0].credits
  }

  // give overlay UI access to total winnings
  getWinnings() {
    // log('slots: ' + instances[0].winnings);

    return instances[0].winnings
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // set coin name and grab the blockchain maximum bet value (in payout mode)
  async changeMode(balance, winnings) {
    let jackpot1: number
    let jackpot2: number
    let jackpot3: number
    let jackpot4: number
    let coinName: string = instances[0].overlayUI.balance.coinName

    if (!instances[0].overlayUI.balance.payoutMode) {
      if (balance === 0) {
        instances[0].credits = this.creditsDefault
        instances[0].winnings = 0
      } else {
        instances[0].credits = balance
        instances[0].winnings = winnings
      }

      // instances[0].winnings = 0; // zero-out the total winnings each change mode

      instances[0].betWei = this.topBetAmount * this.multiplier
      instances[0].betStandard = this.topBetAmount

      jackpot1 = this.topBetAmount * this.jackpotFactor1
      jackpot2 = this.topBetAmount * this.jackpotFactor2
      jackpot3 = this.topBetAmount * this.jackpotFactor3
      jackpot4 = this.topBetAmount * this.jackpotFactor4
    } else {
      instances[0].credits = await instances[0].overlayUI.balance.getCredits()
      instances[0].winnings = 0 // zero-out the total winnings each change mode
      const topBetAmount = await instances[0].overlayUI.balance.getMaximumBet(
        instances[0].gameType
      )

      instances[0].betWei = topBetAmount
      const topBetStandard = topBetAmount / this.multiplier

      instances[0].betStandard = topBetStandard
      jackpot1 = topBetStandard * this.jackpotFactor1
      jackpot2 = topBetStandard * this.jackpotFactor2
      jackpot3 = topBetStandard * this.jackpotFactor3
      jackpot4 = topBetStandard * this.jackpotFactor4
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // change the jackpot values and coin name on the machine and tower displays
    instances[0].jackpot1Amount = jackpot1
    instances[0].jackpot2Amount = jackpot2
    instances[0].jackpot3Amount = jackpot3
    instances[0].jackpot4Amount = jackpot4
    instances[0].coinName = coinName

    this.towers.updateText(jackpot1, jackpot2, jackpot3, jackpot4, coinName)

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // set initial balances on the machine displays as well as the overlay UI
    instances[0].updateText()

    instances[0].UIValues = {
      creditsString: instances[0].credits.toString(),
      betString: instances[0].betStandard.toString(),
      winningsString: instances[0].winnings.toString(),
      winAmountString: ''
    }
    instances[0].overlayUI.balance.setValues(instances[0].UIValues)
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  async messageHandler(json) {
    if (!json.data) return
    const numbers = json.data._numbers
    const formattedNumbers = ('00' + numbers).slice(-3)
    const amountWin = json.data._amountWin

    instances[0].winAmount = amountWin / this.multiplier

    // if user hasn't changed machines set the wheel positions, else use the default
    if (instances[0].wheelsSpin1) {
      instances[0].spinResult1 = formattedNumbers.toString().slice(0, 1)
      instances[0].spinResult2 = formattedNumbers.toString().slice(1, 2)
      instances[0].spinResult3 = formattedNumbers.toString().slice(2, 3)
    } else {
      instances[0].spinResult1 = '4'
      instances[0].spinResult2 = '0'
      instances[0].spinResult3 = '7'
    }

    log('f:onmessage win amount: ' + instances[0].winAmount)
    log('f:onmessage returned numbers: ' + numbers)
    log(
      'f:onmessage spin result: ' +
        instances[0].spinResult1 +
        ' + ' +
        instances[0].spinResult2 +
        ' + ' +
        instances[0].spinResult3
    )

    // stop wheels from spinning after a short graded period
    instances[0].stopSlots()
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  pingHandler(minutes, seconds) {
    // log('ping at ' + minutes + ' minutes ' + seconds + ' seconds');
  }
}
