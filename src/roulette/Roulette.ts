import utils from '../../node_modules/decentraland-ecs-utils/index'
import { verifyTableID } from '../modules/WebSocket'
import rouletteData from './rouletteData'

let instances: any = [] // array to hold references to new instances of machines
let myTableID = -1
let crntTableID = ''
let timerStarted = false
let player_mode = 'single'

const decimals = 0 // for ethvalue.toFixed
var winnings: number = 0
const creditsDefault: number = 1000
var credits: number = creditsDefault

var money_held = 0.0
const chip_height = 0.005

const color_green = new Color3(0.12, 0.369, 0.094)

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

var last_winning_bets = []
for (var i = 0; i < 10; i++) {
  last_winning_bets.push(getRandomIntInclusive(0, 36))
}

// Spawner factory functions
function spawnEntity(
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  sx: number,
  sy: number,
  sz: number
) {
  // create the entity
  const entity = new Entity()
  // set a transform to the entity
  const transform = new Transform({
    position: new Vector3(x, y, z),
    rotation: Quaternion.Euler(rx, ry, rz)
  })
  transform.scale.set(sx, sy, sz)
  entity.addComponent(transform)
  // add the entity to the engine
  engine.addEntity(entity)
  return entity
}

function spawnBoxX(
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  sx: number,
  sy: number,
  sz: number
) {
  const entity = spawnEntity(x, y, z, rx, ry, rz, sx, sy, sz)
  // set a shape to the entity
  entity.addComponent(new BoxShape())
  return entity
}

function spawnGltfX(
  s: GLTFShape,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  sx: number,
  sy: number,
  sz: number
) {
  const entity = spawnEntity(x, y, z, rx, ry, rz, sx, sy, sz)
  // set a shape to the entity
  entity.addComponent(s)
  return entity
}

function spawnGltf(s: GLTFShape, x: number, y: number, z: number) {
  return spawnGltfX(s, x, y, z, 0, 0, 0, 1, 1, 1)
}

function spawnTextX(
  value: string,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  sx: number,
  sy: number,
  sz: number
) {
  const entity = spawnEntity(x, y, z, rx, ry, rz, sx, sy, sz)
  // set a shape to the entity
  entity.addComponent(new TextShape(value))
  return entity
}

function spawnText(value: string, x: number, y: number, z: number) {
  return spawnTextX(value, x, y, z, 0, 0, 0, 1, 1, 1)
}

//////////////////////////////////////////
// Load Model Shapes
const chip_1eth_shape = new GLTFShape('models/roulette/chips/chip_1eth.gltf')
const chip_0_5eth_shape = new GLTFShape(
  'models/roulette/chips/chip_0_5eth.gltf'
)
const chip_0_1eth_shape = new GLTFShape(
  'models/roulette/chips/chip_0_1eth.gltf'
)
const chip_0_05eth_shape = new GLTFShape(
  'models/roulette/chips/chip_0_05eth.gltf'
)
const roulette_table_shape = new GLTFShape('models/roulette/roulette_table.glb')
const roulette_table_v2_shape = new GLTFShape(
  'models/roulette/roulette_table_v2.glb'
)
const roulette_wheel_shape = new GLTFShape('models/roulette/roulette_wheel.glb')
const roulette_ball_shape = new GLTFShape('models/roulette/roulette_ball.glb')
const roulette_numbers_shape = new GLTFShape(
  'models/roulette/roulette_wheel_numbers.glb'
)
const digit_glow_shape = new GLTFShape('models/roulette/ui/digit_glow.glb')
const chip_glow_shape = new GLTFShape('models/roulette/ui/coins_glow.glb')
const table_glow_shape = new GLTFShape('models/roulette/ui/table_glow.glb')
const table_glow_v2_shape = new GLTFShape(
  'models/roulette/ui/table_glow_v2.glb'
)
const wheel_glow_shape = new GLTFShape('models/roulette/ui/wheel_glow.glb')

// other constants
const roulette_number_order = [
  0,
  32,
  15,
  19,
  4,
  21,
  2,
  25,
  17,
  34,
  6,
  27,
  13,
  36,
  11,
  30,
  8,
  23,
  10,
  5,
  24,
  16,
  33,
  1,
  20,
  14,
  31,
  9,
  22,
  18,
  29,
  7,
  28,
  12,
  35,
  3,
  26
]
const roulette_red_numbers = [
  32,
  19,
  21,
  25,
  34,
  27,
  36,
  30,
  23,
  5,
  16,
  1,
  14,
  9,
  18,
  7,
  12,
  3
]

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
class RouletteTable {
  gameType: number = 2 // roulette == gameType of 2
  machineID: number = 0 // unique for each roulette machine in the casino

  overlayUI = null
  multiplier: number = 1000000000000000000 // convert from Eth units to Wei and vice versa

  // ball rotator system stuff
  timer: number = 3.0 / 37.0
  timer_entity: Entity = new Entity()
  spinning: boolean = false
  numbers_zero_at_degree: number = 0.0
  numbers_zero_at: number = 0
  ball_slot: number = 37
  current_number: number = 0
  full_rotations: number = 0
  stop_number: number = null
  look_at_timer: number = 0.0
  audio_chips_source: AudioSource = null
  audio_wheel_source: AudioSource = null
  audio_win_source: AudioSource = null

  my_bets = []
  table_type: number = 0
  // string number: [x,y,z], number_of_spawned_chips, array_of_spawned_chips, value_in_eth
  number_locations_and_chips = null
  scene = null
  roulette_table = null

  roulette_ball = null
  roulette_ball_big = null

  roulette_wheel = null
  roulette_wheel_root = null
  roulette_wheel_mid = null

  roulette_numbers = null
  // roulette_numbers_big = null; // big overhead wheel
  ink

  chip_0_05eth = null
  chip_0_1eth = null
  chip_0_5eth = null
  chip_1eth = null
  chips_root = null
  chip_0_05eth_root = null
  chip_0_1eth_root = null
  chip_0_5eth_root = null
  chip_1eth_root = null

  chip_value1
  chip_value2
  chip_value3
  chip_value4

  UIValues: object = {}

  top_side = null
  bottom_side = null
  chips_glow = null
  table_glow = null
  wheel_glow = null
  wheel_glow_idle: AnimationState = null
  wheel_glow_animator: Animator = null
  table_glow_shape = null
  winningNumberText: TextShape = null
  winningNumberUI: Entity = null
  winningNumberRoot: Entity = null
  text_chip_1: Entity = null
  text_chip_2: Entity = null
  text_chip_3: Entity = null
  text_chip_4: Entity = null
  coinName = null
  rouletteUI = null

  chips_placed = false // chips recently placed on table
  constructor(
    scenetransform: Transform,
    roulette_ui,
    table_type: number = 0,
    id: number
  ) {
    // type of table model
    // 0 = normal roulette table
    // 1 = smaller table, floating wheel
    this.table_type = table_type

    this.machineID = id

    // set UI
    this.rouletteUI = roulette_ui
    this.rouletteUI.add_table(scenetransform.position)

    if (this.table_type == 0) {
      this.number_locations_and_chips = {
        '0': [
          -0.7109429240226746,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0,
          [1, 1, 3]
        ],
        '1': [
          -0.8194509744644165,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '2': [
          -0.8194509744644165,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '3': [
          -0.8194510340690613,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '4': [
          -0.9276285171508789,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '5': [
          -0.9276285171508789,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '6': [
          -0.9276285767555237,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '7': [
          -1.0358059406280518,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '8': [
          -1.0358059406280518,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '9': [
          -1.0358060598373413,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '10': [
          -1.1439834833145142,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '11': [
          -1.1439834833145142,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '12': [
          -1.1439834833145142,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '13': [
          -1.252160906791687,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '14': [
          -1.2521610260009766,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '15': [
          -1.2521610260009766,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '16': [
          -1.3603384494781494,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '17': [
          -1.3603384494781494,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '18': [
          -1.3603384494781494,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '19': [
          -1.4685158729553223,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '20': [
          -1.4685158729553223,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '21': [
          -1.4685158729553223,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '22': [
          -1.5766932964324951,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '23': [
          -1.5766932964324951,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '24': [
          -1.5766934156417847,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '25': [
          -1.6848708391189575,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '26': [
          -1.6848708391189575,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '27': [
          -1.6848708391189575,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '28': [
          -1.7930482625961304,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '29': [
          -1.7930482625961304,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '30': [
          -1.7930482625961304,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '31': [
          -1.9012256860733032,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '32': [
          -1.9012256860733032,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '33': [
          -1.9012258052825928,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '34': [
          -2.0094032287597656,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0
        ],
        '35': [
          -2.0094032287597656,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0
        ],
        '36': [
          -2.0094032287597656,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0
        ],
        '1st 2-1': [
          -2.1469173431396484,
          0.9500002264976501,
          -0.10460454225540161,
          0,
          [],
          0.0,
          [1.8, 1, 1.2]
        ],
        '2nd 2-1': [
          -2.1469173431396484,
          0.9500002264976501,
          -0.23918265104293823,
          0,
          [],
          0.0,
          [1.8, 1, 1.2]
        ],
        '3rd 2-1': [
          -2.1469173431396484,
          0.9500002264976501,
          -0.37376075983047485,
          0,
          [],
          0.0,
          [1.8, 1, 1.2]
        ],
        red: [
          -1.3062496185302734,
          0.9500002264976501,
          0.19599002599716187,
          0,
          [],
          0.0,
          [2, 1, 1.2]
        ],
        black: [
          -1.5226045846939087,
          0.9500002264976501,
          0.19599002599716187,
          0,
          [],
          0.0,
          [2, 1, 1.2]
        ],
        even: [
          -1.0898946523666382,
          0.9500002264976501,
          0.19599002599716187,
          0,
          [],
          0.0,
          [2, 1, 1.2]
        ],
        odd: [
          -1.738959550857544,
          0.9500002264976501,
          0.19599002599716187,
          0,
          [],
          0.0,
          [2, 1, 1.2]
        ],
        low: [
          -0.8735398054122925,
          0.9500002264976501,
          0.19599002599716187,
          0,
          [],
          0.0,
          [2, 1, 1.2]
        ],
        high: [
          -1.9553143978118896,
          0.9500002264976501,
          0.19599002599716187,
          0,
          [],
          0.0,
          [2, 1, 1.2]
        ],
        '1st 12': [
          -0.9817172288894653,
          0.9500002264976501,
          0.03592633455991745,
          0,
          [],
          0.0,
          [4, 1, 1.2]
        ],
        '2nd 12': [
          -1.4144271612167358,
          0.9500002264976501,
          0.03592633455991745,
          0,
          [],
          0.0,
          [4, 1, 1.2]
        ],
        '3rd 12': [
          -1.8471369743347168,
          0.9500002264976501,
          0.03592633455991745,
          0,
          [],
          0.0,
          [4, 1, 1.2]
        ]
      }
    } else if (this.table_type == 1) {
      this.number_locations_and_chips = {
        '0': [
          0.7642437219619751,
          0.9500002861022949,
          -0.16105809807777405,
          0,
          [],
          0.0,
          [1.2, 1.2, 3.6]
        ],
        '1': [
          0.6658656001091003,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '2': [
          0.6658656001091003,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '3': [
          0.6658656001091003,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '4': [
          0.5511267185211182,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '5': [
          0.5511267185211182,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '6': [
          0.5511267185211182,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '7': [
          0.43638795614242554,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '8': [
          0.43638795614242554,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '9': [
          0.43638795614242554,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '10': [
          0.32164913415908813,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '11': [
          0.32164913415908813,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '12': [
          0.32164913415908813,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '13': [
          0.20691031217575073,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '14': [
          0.20691031217575073,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '15': [
          0.20691031217575073,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '16': [
          0.09217150509357452,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '17': [
          0.09217150509357452,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '18': [
          0.09217150509357452,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '19': [
          -0.022567294538021088,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '20': [
          -0.022567294538021088,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '21': [
          -0.022567294538021088,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '22': [
          -0.1373060941696167,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '23': [
          -0.1373060941696167,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '24': [
          -0.1373060941696167,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '25': [
          -0.2520449459552765,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '26': [
          -0.2520449459552765,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '27': [
          -0.2520449459552765,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '28': [
          -0.3667837083339691,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '29': [
          -0.3667837083339691,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '30': [
          -0.3667837083339691,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '31': [
          -0.48152250051498413,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '32': [
          -0.48152250051498413,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '33': [
          -0.48152250051498413,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '34': [
          -0.5962613224983215,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '35': [
          -0.5962613224983215,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '36': [
          -0.5962613224983215,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.2, 1.2, 1.2]
        ],
        '1st 2-1': [
          -0.7281630039215088,
          0.9500002861022949,
          -0.020464371889829636,
          0,
          [],
          0.0,
          [1.8, 1, 1.2]
        ],
        '2nd 2-1': [
          -0.7281630039215088,
          0.9500002861022949,
          -0.16105811297893524,
          0,
          [],
          0.0,
          [1.8, 1, 1.2]
        ],
        '3rd 2-1': [
          -0.7281630039215088,
          0.9500002861022949,
          -0.30165183544158936,
          0,
          [],
          0.0,
          [1.8, 1, 1.2]
        ],
        '1st 12': [
          0.493757426738739,
          0.9500002861022949,
          0.1260308176279068,
          0,
          [],
          0.0,
          [5, 1.2, 1.5]
        ],
        '2nd 12': [
          0.03480212390422821,
          0.9500002861022949,
          0.1260308176279068,
          0,
          [],
          0.0,
          [5, 1.2, 1.5]
        ],
        '3rd 12': [
          -0.42415308952331543,
          0.9500002861022949,
          0.1260308176279068,
          0,
          [],
          0.0,
          [5, 1.2, 1.5]
        ],
        low: [
          0.6084961891174316,
          0.9500002861022949,
          0.292171448469162,
          0,
          [],
          0.0,
          [2.4, 1.2, 1.6]
        ],
        high: [
          -0.5388919115066528,
          0.9500002861022949,
          0.292171448469162,
          0,
          [],
          0.0,
          [2.4, 1.2, 1.6]
        ],
        even: [
          0.379018634557724,
          0.9500002861022949,
          0.292171448469162,
          0,
          [],
          0.0,
          [2.4, 1.2, 1.6]
        ],
        odd: [
          -0.3094142973423004,
          0.9500002861022949,
          0.292171448469162,
          0,
          [],
          0.0,
          [2.4, 1.2, 1.6]
        ],
        red: [
          0.14954093098640442,
          0.9500002861022949,
          0.292171448469162,
          0,
          [],
          0.0,
          [2.4, 1.2, 1.6]
        ],
        black: [
          -0.07993666082620621,
          0.9500002861022949,
          0.292171448469162,
          0,
          [],
          0.0,
          [2.4, 1.2, 1.6]
        ]
      }
    }

    // spinning sound
    const audio_wheel_clip = new AudioClip('sounds/roulette/rouletteplay.mp3')
    this.audio_wheel_source = new AudioSource(audio_wheel_clip)
    // chips moving sound
    const audio_chips_clip = new AudioClip('sounds/roulette/stacking.mp3')
    this.audio_chips_source = new AudioSource(audio_chips_clip)
    // win sound
    const audio_win_clip = new AudioClip('sounds/roulette/win.mp3')
    this.audio_win_source = new AudioSource(audio_win_clip)

    this.audio_wheel_source.volume = 1
    this.audio_chips_source.volume = 1
    this.audio_win_source.volume = 1

    // This this.scene entity wraps the whole this.scene, so it can be moved, rotated, or sized as may be needed
    this.scene = new Entity()
    this.scene.addComponent(scenetransform)
    engine.addEntity(this.scene)

    var scene_scale = this.scene.getComponent(Transform).scale

    if (this.table_type == 0) {
      this.bottom_side = new Vector3(
        -1.25 * scene_scale.x,
        0,
        -1.5 * scene_scale.z
      )
        .rotate(scenetransform.rotation)
        .add(scenetransform.position)
      this.top_side = new Vector3(-1.25 * scene_scale.x, 0, 1.5 * scene_scale.z)
        .rotate(scenetransform.rotation)
        .add(scenetransform.position)
    } else if (this.table_type == 1) {
      this.bottom_side = new Vector3(0, 0, -1.5 * scene_scale.z)
        .rotate(scenetransform.rotation)
        .add(scenetransform.position)
      this.top_side = new Vector3(0, 0, 1.5 * scene_scale.z)
        .rotate(scenetransform.rotation)
        .add(scenetransform.position)
    }

    if (this.table_type == 0) {
      this.roulette_table = spawnGltfX(
        roulette_table_shape,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.table_glow_shape = table_glow_shape
      this.roulette_table.setParent(this.scene)
      this.roulette_table.addComponent(this.audio_chips_source)

      this.roulette_wheel = spawnGltfX(
        roulette_wheel_shape,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.roulette_wheel.setParent(this.scene)
      this.roulette_wheel.addComponent(this.audio_wheel_source)

      this.roulette_ball = spawnGltfX(
        roulette_ball_shape,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.roulette_ball.setParent(this.scene)
      this.roulette_ball.addComponent(this.audio_win_source)

      this.roulette_numbers = spawnGltfX(
        roulette_numbers_shape,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.roulette_numbers.setParent(this.scene)
    } else if (this.table_type == 1) {
      this.roulette_table = spawnGltfX(
        roulette_table_v2_shape,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.table_glow_shape = table_glow_v2_shape
      this.roulette_table.setParent(this.scene)
      this.roulette_table.addComponent(this.audio_chips_source)

      this.roulette_wheel_root = new Entity()
      this.roulette_wheel_root.addComponent(
        new Transform({
          position: new Vector3(0, 2.25, 0)
        })
      )
      engine.addEntity(this.roulette_wheel_root)

      this.roulette_wheel_mid = new Entity()
      this.roulette_wheel_mid.addComponent(
        new Transform({
          position: new Vector3(0, 0, 0),
          rotation: Quaternion.Euler(90, 0, 0)
        })
      )
      this.roulette_wheel = spawnGltfX(
        roulette_wheel_shape,
        0,
        -1,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.roulette_wheel_mid.setParent(this.roulette_wheel_root)
      this.roulette_wheel.setParent(this.roulette_wheel_mid)

      this.roulette_ball = spawnGltfX(
        roulette_ball_shape,
        0,
        -1,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.roulette_ball.setParent(this.roulette_wheel_mid)
      this.roulette_ball.addComponent(this.audio_win_source)

      this.roulette_numbers = spawnGltfX(
        roulette_numbers_shape,
        0,
        -1,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.roulette_numbers.setParent(this.roulette_wheel_mid)

      this.roulette_wheel.addComponent(this.audio_wheel_source)
    }

    if (this.table_type == 0) {
      this.chips_root = spawnEntity(
        -1.5 * scene_scale.x,
        1.25 * scene_scale.y,
        -1 * scene_scale.z,
        0,
        0,
        0,
        1,
        1,
        1
      )
    } else if (this.table_type == 1) {
      this.chips_root = spawnEntity(
        0 * scene_scale.x,
        1.25 * scene_scale.y,
        -0.5 * scene_scale.z,
        0,
        0,
        0,
        1,
        1,
        1
      )
    }
    this.chips_root.setParent(this.scene)

    // this.roulette_numbers_big = spawnGltfX(
    //   roulette_numbers_shape,
    //   3,
    //   3.5,
    //   0,
    //   0,
    //   0,
    //   90,
    //   2.5,
    //   2.5,
    //   2.5
    // );
    // this.roulette_numbers_big.setParent(this.roulette_wheel_mid);

    // this.roulette_ball_big = spawnGltfX(
    //   roulette_ball_shape,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   1,
    //   1,
    //   1
    // );
    // this.roulette_ball_big.setParent(this.roulette_numbers_big);
    // this.roulette_ball_big.addComponent(this.audio_win_source);

    // chip 1
    this.chip_0_05eth_root = spawnEntity(-0.375, 0, 0, 0, 0, 0, 1, 1, 1)
    this.chip_0_05eth = spawnGltfX(
      chip_0_05eth_shape,
      0,
      0,
      0,
      90,
      0,
      0,
      scene_scale.x * 3,
      scene_scale.y * 3,
      scene_scale.z * 3
    )
    this.chip_0_05eth.setParent(this.chip_0_05eth_root)

    var scene_scale = this.scene.getComponent(Transform).scale

    this.text_chip_1 = spawnTextX(
      '',
      0,
      0,
      0.01,
      0,
      180,
      0,
      0.15 * scene_scale.x,
      0.15 * scene_scale.y,
      0.15 * scene_scale.z
    )
    this.text_chip_1.setParent(this.chip_0_05eth_root)
    var shape = this.text_chip_1.getComponent(TextShape)
    shape.fontWeight = 'bolder'
    shape.fontSize = 3
    shape.outlineColor = new Color3(0, 0, 0)
    shape.outlineWidth = 0.15

    // chip 2
    this.chip_0_1eth_root = spawnEntity(-0.125, 0, 0, 0, 0, 0, 1, 1, 1)
    this.chip_0_1eth = spawnGltfX(
      chip_0_1eth_shape,
      0,
      0,
      0,
      90,
      0,
      0,
      scene_scale.x * 3,
      scene_scale.y * 3,
      scene_scale.z * 3
    )
    this.chip_0_1eth.setParent(this.chip_0_1eth_root)

    this.text_chip_2 = spawnTextX(
      '',
      0,
      0,
      0.01,
      0,
      180,
      0,
      0.15 * scene_scale.x,
      0.15 * scene_scale.y,
      0.15 * scene_scale.z
    )
    this.text_chip_2.setParent(this.chip_0_1eth_root)
    var shape = this.text_chip_2.getComponent(TextShape)
    shape.fontWeight = 'bolder'
    shape.fontSize = 3
    shape.outlineColor = new Color3(0, 0, 0)
    shape.outlineWidth = 0.15

    // chip 3
    this.chip_0_5eth_root = spawnEntity(0.125, 0, 0, 0, 0, 0, 1, 1, 1)
    this.chip_0_5eth = spawnGltfX(
      chip_0_5eth_shape,
      0,
      0,
      0,
      90,
      0,
      0,
      scene_scale.x * 3,
      scene_scale.y * 3,
      scene_scale.z * 3
    )
    this.chip_0_5eth.setParent(this.chip_0_5eth_root)

    this.text_chip_3 = spawnTextX(
      '',
      0,
      0,
      0.01,
      0,
      180,
      0,
      0.15 * scene_scale.x,
      0.15 * scene_scale.y,
      0.15 * scene_scale.z
    )
    this.text_chip_3.setParent(this.chip_0_5eth_root)
    var shape = this.text_chip_3.getComponent(TextShape)
    shape.fontWeight = 'bolder'
    shape.fontSize = 3
    shape.outlineColor = new Color3(0, 0, 0)
    shape.outlineWidth = 0.15

    // chip 4
    this.chip_1eth_root = spawnEntity(0.375, 0, 0, 0, 0, 0, 1, 1, 1)
    this.chip_1eth = spawnGltfX(
      chip_1eth_shape,
      0,
      0,
      0,
      90,
      0,
      0,
      scene_scale.x * 3,
      scene_scale.y * 3,
      scene_scale.z * 3
    )
    this.chip_1eth.setParent(this.chip_1eth_root)

    this.text_chip_4 = spawnTextX(
      '',
      0,
      0,
      0.01,
      0,
      180,
      0,
      0.15 * scene_scale.x,
      0.15 * scene_scale.y,
      0.15 * scene_scale.z
    )
    this.text_chip_4.setParent(this.chip_1eth_root)
    var shape = this.text_chip_4.getComponent(TextShape)
    shape.fontWeight = 'bolder'
    shape.fontSize = 3
    shape.outlineColor = new Color3(0, 0, 0)
    shape.outlineWidth = 0.15

    var wheelDownEvent = new OnPointerDown(
      e => {
        if (!this.spinning) {
          if (this.has_bets() == false) {
            // no numbers bet on
            this.show_notification('Error:\nYou need to bet on something first')
            return
          } else {
            this.place_bets()
            //socket_send(socket, {'method':'spin'})
          }
        }
      },
      { hoverText: 'Spin Wheel' }
    )
    this.roulette_numbers.addComponent(wheelDownEvent)
    this.roulette_wheel.addComponent(wheelDownEvent)
    this.roulette_ball.addComponent(wheelDownEvent)
    this.chip_0_05eth.addComponent(
      new OnPointerDown(
        e => {
          this.add_chip(this.chip_value1)
        },
        { hoverText: 'Join Game' }
      )
    )
    this.chip_0_1eth.addComponent(
      new OnPointerDown(
        e => {
          this.add_chip(this.chip_value2)
        },
        { hoverText: 'Join Game' }
      )
    )
    this.chip_0_5eth.addComponent(
      new OnPointerDown(
        e => {
          this.add_chip(this.chip_value3)
        },
        { hoverText: 'Join Game' }
      )
    )
    this.chip_1eth.addComponent(
      new OnPointerDown(
        e => {
          this.add_chip(this.chip_value4)
        },
        { hoverText: 'Join Game' }
      )
    )
    this.roulette_table.addComponent(
      new OnPointerDown(
        e => {
          // don't do anything while the wheel is spinning
          if (myTableID == -1 || this.machineID != myTableID) {
            myTableID = this.machineID

            const gameData = {
              method: 'join_server'
            }

            // sendMessage(this.gameType, this.machineID, gameData);
          } else {
            if (!e.hit) {
              return
            }
            if (!e.hit.meshName) {
              return
            }
            this.place_chip(e.hit.meshName)
          }
        },
        { hoverText: 'Join Game' }
      )
    )

    this.changeButtonTableHoverText(false)

    this.wheel_glow_animator = new Animator()
    this.wheel_glow_idle = new AnimationState('Idle', { looping: true })
    this.wheel_glow_animator.addClip(this.wheel_glow_idle)

    this.winningNumberText = new TextShape('')

    this.winningNumberText.isPointerBlocker = false

    this.winningNumberText.fontSize = 2
    this.winningNumberText.color = new Color3(1, 1, 1)
    if (this.table_type == 0) {
      this.winningNumberText.vTextAlign = 'bottom'
    } else if (this.table_type == 1) {
      this.winningNumberText.vTextAlign = 'bottom'
    }
    this.winningNumberText.outlineColor = new Color3(0, 0, 0)
    this.winningNumberText.outlineWidth = 0.1

    var scene_scale = this.scene.getComponent(Transform).scale

    this.winningNumberUI = spawnEntity(0, 0, 0, 0, 180, 0, 1, 1, 1)
    this.winningNumberUI.addComponent(this.winningNumberText)
    this.winningNumberRoot = spawnEntity(
      scenetransform.position.x,
      scenetransform.position.y + 1.5 * scene_scale.y,
      scenetransform.position.z,
      0,
      0,
      0,
      scene_scale.x,
      scene_scale.y,
      scene_scale.z
    )
    this.winningNumberUI.setParent(this.winningNumberRoot)
  }

  changeWheelClickableStatus(isMulti) {
    this.roulette_numbers.removeComponent(OnPointerDown)
    this.roulette_wheel.removeComponent(OnPointerDown)
    this.roulette_ball.removeComponent(OnPointerDown)
    if (!isMulti) {
      var wheelDownEvent = new OnPointerDown(
        e => {
          if (!this.spinning) {
            if (this.has_bets() == false) {
              // no numbers bet on
              this.show_notification(
                'Error:\nYou need to bet on something first'
              )
              return
            } else {
              this.place_bets()
              //socket_send(socket, {'method':'spin'})
            }
          }
        },
        { hoverText: 'Spin Wheel' }
      )
      this.roulette_numbers.addComponent(wheelDownEvent)
      this.roulette_wheel.addComponent(wheelDownEvent)
      this.roulette_ball.addComponent(wheelDownEvent)
    }
  }

  changeButtonTableHoverText(joined) {
    if (joined) {
      this.roulette_table.getComponent(OnPointerDown).hoverText = 'Place Chip'
      this.chip_0_05eth.getComponent(OnPointerDown).hoverText = 'Select Chip'
      this.chip_0_1eth.getComponent(OnPointerDown).hoverText = 'Select Chip'
      this.chip_0_5eth.getComponent(OnPointerDown).hoverText = 'Select Chip'
      this.chip_1eth.getComponent(OnPointerDown).hoverText = 'Select Chip'
    } else {
      this.roulette_table.getComponent(OnPointerDown).hoverText = 'Join Game'
      this.chip_0_05eth.getComponent(OnPointerDown).hoverText = 'Join Game'
      this.chip_0_1eth.getComponent(OnPointerDown).hoverText = 'Join Game'
      this.chip_0_5eth.getComponent(OnPointerDown).hoverText = 'Join Game'
      this.chip_1eth.getComponent(OnPointerDown).hoverText = 'Join Game'
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  show_notification(text) {
    instances[this.machineID].overlayUI.notification.setNotificationText(text)
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // called on changeMode()
  select_coin() {
    this.text_chip_1.getComponent(TextShape).value = this.chip_value1.toString()
    this.text_chip_2.getComponent(TextShape).value = this.chip_value2.toString()
    this.text_chip_3.getComponent(TextShape).value = this.chip_value3.toString()
    this.text_chip_4.getComponent(TextShape).value = this.chip_value4.toString()

    this.clear_chips(false)
    this.show_chips_glow()
  }
  // show glow mesh around chips hide others
  show_chips_glow() {
    var scene_scale = this.scene.getComponent(Transform).scale
    if (!this.chips_glow) {
      //this.chips_glow = spawnGltfX(chip_glow_shape, 0,0,0, 0,0,0, 1,1,1)
      //this.chips_glow.setParent(this.chips_root)
      this.chips_glow = new Entity()
      this.chips_glow.addComponent(chip_glow_shape)
      var pos = this.chips_root
        .getComponent(Transform)
        .position.add(this.scene.getComponent(Transform).position)
      var rot = this.scene.getComponent(Transform).rotation
      this.chips_glow.addComponent(
        new Transform({ position: pos, rotation: rot, scale: scene_scale })
      )
      engine.addEntity(this.chips_glow)
    }
    this.hide_table_glow()
    this.hide_wheel_glow()
  }
  // hide glow mesh around chips
  hide_chips_glow() {
    if (this.chips_glow) {
      engine.removeEntity(this.chips_glow)
      this.chips_glow = null
    }
  }
  // show glow mesh on table
  show_table_glow() {
    if (!this.table_glow) {
      this.table_glow = spawnGltfX(
        this.table_glow_shape,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1
      )
      this.table_glow.setParent(this.scene)
    }
    this.hide_wheel_glow()
    this.hide_chips_glow()
  }
  // hide glow mesh on table
  hide_table_glow() {
    if (this.table_glow) {
      engine.removeEntity(this.table_glow)
      this.table_glow = null
    }
  }
  // show and animate glow mesh on wheel
  show_wheel_glow() {
    if (!this.wheel_glow) {
      if (this.table_type == 0) {
        this.wheel_glow = spawnGltfX(
          wheel_glow_shape,
          0,
          0,
          0,
          0,
          0,
          0,
          1,
          1,
          1
        )
        this.wheel_glow.setParent(this.scene)
      } else if (this.table_type == 1) {
        this.wheel_glow = spawnGltfX(
          wheel_glow_shape,
          0,
          -1,
          0,
          0,
          0,
          0,
          1,
          1,
          1
        )
        this.wheel_glow.setParent(this.roulette_wheel_mid)
      }
      this.wheel_glow.addComponent(this.wheel_glow_animator)
      this.wheel_glow_idle.play()
    }
    this.hide_table_glow()
    this.hide_chips_glow()
  }
  // hide glow mesh on wheel
  hide_wheel_glow() {
    if (this.wheel_glow) {
      engine.removeEntity(this.wheel_glow)
      this.wheel_glow = null
    }
  }

  // point entity at a position and optionally position the entity
  entityLookAt(entity: Entity, lookAtPos: Vector3, position: Vector3 = null) {
    if (position) {
      entity.getComponent(Transform).position = position
    }
    entity.getComponent(Transform).lookAt(lookAtPos, Vector3.Up())
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
  // on tick: position/lookAt entites and rotate wheel
  update(dt: number) {
    if (this.table_type == 1) {
      var lookAtPos = Camera.instance.position
      var lines = (this.winningNumberText.value.match(/\n/g) || []).length
      var entityRootPos = this.scene
        .getComponent(Transform)
        .position.add(new Vector3(0, 2.1 + lines * 0.075, 0))
      this.entityLookAt(this.roulette_wheel_root, lookAtPos, entityRootPos)
      /*entityRootPos = entityRootPos.add(
				new Vector3(0,0,0.5).rotate(this.roulette_wheel_root.getComponent(Transform).rotation)
			)*/
      entityRootPos = this.scene
        .getComponent(Transform)
        .position.add(new Vector3(0, 1.25, 0))
      this.entityLookAt(
        this.winningNumberRoot,
        Camera.instance.position,
        entityRootPos
      )
    }

    this.look_at_timer = this.look_at_timer - dt
    if (this.look_at_timer <= 0) {
      this.look_at_timer = 0.2
      var scene_scale = this.scene.getComponent(Transform).scale
      var pos = null
      var pos_y = this.chips_root.getComponent(Transform).position.y
      if (
        Vector3.Distance(Camera.instance.position, this.top_side) <
        Vector3.Distance(Camera.instance.position, this.bottom_side)
      ) {
        // update chips position
        if (this.table_type == 0) {
          pos = new Vector3(-1.5 * scene_scale.x, 0, -0.4 * scene_scale.z)
        } else if (this.table_type == 1) {
          pos = new Vector3(0, 0, -0.5 * scene_scale.z)
        }
        this.chips_root.getComponent(Transform).position = pos
          .rotate(this.scene.getComponent(Transform).rotation)
          .add(new Vector3(0, pos_y, 0))
        // update glow too
        if (this.chips_glow) {
          pos = this.chips_root
            .getComponent(Transform)
            .position.add(this.scene.getComponent(Transform).position)
          var rot = this.scene.getComponent(Transform).rotation
          this.chips_glow.getComponent(Transform).position = pos
        }
      } else {
        // update chips position
        if (this.table_type == 0) {
          pos = new Vector3(-1.5 * scene_scale.x, 0, 0.4 * scene_scale.z)
        } else if (this.table_type == 1) {
          pos = new Vector3(0, 0, 0.5 * scene_scale.z)
        }
        this.chips_root.getComponent(Transform).position = pos
          .rotate(this.scene.getComponent(Transform).rotation)
          .add(new Vector3(0, pos_y, 0))
        // update glow too
        if (this.chips_glow) {
          pos = this.chips_root
            .getComponent(Transform)
            .position.add(this.scene.getComponent(Transform).position)
          var rot = this.scene.getComponent(Transform).rotation
          this.chips_glow.getComponent(Transform).position = pos
        }
      }
      var lookAtPos = Camera.instance.position
      var entityRootPos = this.chips_root
        .getComponent(Transform)
        .position.add(this.scene.getComponent(Transform).position)

      var transform = this.chips_root.getComponent(Transform)
      var rot = this.scene.getComponent(Transform).rotation

      this.entityLookAt(
        this.chip_0_05eth_root,
        lookAtPos,
        entityRootPos.add(new Vector3(-0.375 * scene_scale.x, 0, 0).rotate(rot))
      )
      this.entityLookAt(
        this.chip_0_1eth_root,
        lookAtPos,
        entityRootPos.add(new Vector3(-0.125 * scene_scale.x, 0, 0).rotate(rot))
      )
      this.entityLookAt(
        this.chip_0_5eth_root,
        lookAtPos,
        entityRootPos.add(new Vector3(0.125 * scene_scale.x, 0, 0).rotate(rot))
      )
      this.entityLookAt(
        this.chip_1eth_root,
        lookAtPos,
        entityRootPos.add(new Vector3(0.375 * scene_scale.x, 0, 0).rotate(rot))
      )
      if (this.table_type == 0) {
        this.entityLookAt(this.winningNumberRoot, Camera.instance.position)
      }

      // this.entityLookAt(
      //   this.roulette_numbers_big,
      //   new Vector3(0, 0, lookAtPos.z),
      //   null
      // );

      // this.entityLookAt(this.roulette_numbers_big, Camera.instance.position);
    }
    if (this.spinning == true) {
      if (this.timer > 0) {
        this.timer -= dt
      } else {
        this.timer = 3.0 / 37.0

        const transform = this.roulette_ball.getComponent(Transform)
        transform.rotate(Vector3.Up(), -360.0 / 37.0)

        const transform2 = this.roulette_ball_big.getComponent(Transform)
        transform2.rotate(Vector3.Up(), -360.0 / 37.0)

        this.ball_slot = (this.ball_slot - 1 + 37) % 37
      }

      var add_degree = (Math.round(dt * 37) * 360.0) / 37

      const rntransform = this.roulette_numbers.getComponent(Transform)
      // const rntransform_big = this.roulette_numbers_big.getComponent(Transform);

      this.numbers_zero_at_degree =
        (this.numbers_zero_at_degree + add_degree) % 360.0
      var last_numbers_zero_at = this.numbers_zero_at
      this.numbers_zero_at = Math.round(
        (1 / 360) * this.numbers_zero_at_degree * 37
      )

      rntransform.rotate(Vector3.Up(), add_degree)
      // rntransform_big.rotate(Vector3.Up(), add_degree);

      if (this.numbers_zero_at == 0) {
        this.full_rotations += 1
      }

      var slot = (this.ball_slot - this.numbers_zero_at + 37) % 37

      this.current_number = roulette_number_order[slot]

      if (this.full_rotations > 3 && this.current_number == this.stop_number) {
        this.spinning = false
        this.timer = 3.0 / 37.0
        this.winning_number_chosen()

        /////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////
        // for payout mode immediately set stop_number to 999 (out-of-range until blockchain values come in)
        this.stop_number = 999
      } else {
        this.show_current_number()
      }
    }
  }

  async place_chip(meshName) {
    if (this.spinning) {
      return
    }
    // check for elements named 'v1_mesh_buttons.0' through 'v1_mesh_buttons.36', 'v1_mesh_buttons.odds', 'v1_mesh_buttons.evens', 'v1_mesh_buttons.high', 'v1_mesh_buttons.low', 'v1_mesh_buttons.1st'/2nd/3rd
    if (meshName.substring(3, 16) == 'mesh_buttons.') {
      var choice = meshName.substring(16)
      var choice_int = parseInt(choice)
      if (choice == 'red' || choice == 'black') {
        this.spawn_chips_on_number(choice)
      } else if (choice == 'even' || choice == 'odd') {
        this.spawn_chips_on_number(choice)
      } else if (choice == '19-36' || choice == 'high') {
        this.spawn_chips_on_number('high')
      } else if (choice == '1-18' || choice == 'low') {
        this.spawn_chips_on_number('low')
      } else if (choice == '1st' || choice == '2nd' || choice == '3rd') {
        this.spawn_chips_on_number(choice + ' 12')
      } else if (choice == '2-1_A') {
        this.spawn_chips_on_number('1st 2-1')
      } else if (choice == '2-1_B') {
        this.spawn_chips_on_number('2nd 2-1')
      } else if (choice == '2-1_C') {
        this.spawn_chips_on_number('3rd 2-1')
      } else if (!Number.isNaN(choice_int)) {
        this.spawn_chips_on_number(choice_int.toString())
      }
    }
  }

  // put a chip in hand
  async add_chip(chip) {
    if (myTableID == -1 || this.machineID != myTableID) {
      myTableID = this.machineID

      const gameData = {
        method: 'join_server'
      }

      // sendMessage(this.gameType, this.machineID, gameData);
      return
    }

    if (myTableID == -1 || this.machineID != myTableID) {
      return
    }

    if (typeof this.overlayUI.balance.coinName === 'undefined') {
      this.show_notification('Error:\nFirst choose a gameplay below')
      return
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    if (credits < chip) {
      this.show_notification('Error:\nNot enough credits')
      money_held = 0.0
      return
    }

    if (this.chips_placed) {
      money_held = 0.0
      this.chips_placed = false
    }

    this.audio_chips_source.playOnce()
    this.rouletteUI.add_floating_text(chip)
    money_held += chip
    this.show_notification(
      'Picked up ' +
        chip.toFixed(decimals) +
        ' ' +
        this.overlayUI.balance.coinName +
        '\nHolding ' +
        money_held.toFixed(decimals) +
        ' ' +
        this.overlayUI.balance.coinName
    )

    if (this.get_bets_total_amount() == 0.0) {
      this.show_table_glow()
    } else {
      this.hide_chips_glow()
    }
    this.update_ui()
  }
  // winning number is chosen, stop the wheel
  show_current_number() {
    /*
    var color = 'Black';
    if (roulette_red_numbers.indexOf(this.current_number) >= 0) {
      color = 'Red';
      this.winningNumberText.color = new Color3(1, 0, 0);
    } else if (this.current_number == 0) {
      color = 'Zero';
      this.winningNumberText.color = color_green;
    } else {
      this.winningNumberText.color = new Color3(0, 0, 0);
    }*/
    this.winningNumberText.color = new Color3(1, 1, 1)
    if (this.table_type == 0) {
      this.winningNumberText.outlineColor = this.winningNumberText.color
      this.winningNumberText.outlineWidth = 0.1
    } else if (this.table_type == 1) {
      this.winningNumberText.outlineColor = this.winningNumberText.color
      this.winningNumberText.outlineWidth = 0.2
    }
    this.winningNumberText.value = this.current_number.toString()
    this.winningNumberText.fontSize = 2
  }
  // winning number is chosen, stop the wheel
  winning_number_chosen() {
    this.audio_wheel_source.playing = false
    if (!this.spinning) {
      last_winning_bets.splice(0, 0, this.current_number)

      if (last_winning_bets.length > 10) {
        last_winning_bets.pop()
      }
      log('Last winning bets', last_winning_bets)
      this.rouletteUI.set_winning_numbers()
      var color = 'Black'
      if (roulette_red_numbers.indexOf(this.current_number) >= 0) {
        color = 'Red'
        this.winningNumberText.color = new Color3(1, 0, 0)
      } else if (this.current_number == 0) {
        color = 'Zero'
        this.winningNumberText.color = color_green
      } else {
        this.winningNumberText.color = new Color3(0, 0, 0)
      }
      if (this.table_type == 0) {
        this.winningNumberText.outlineColor = this.winningNumberText.color
        this.winningNumberText.outlineWidth = 0.1
      } else if (this.table_type == 1) {
        this.winningNumberText.outlineColor = this.winningNumberText.color
        this.winningNumberText.outlineWidth = 0.2
      }
      this.winningNumberText.value = this.current_number.toString()
      this.winningNumberText.fontSize = 2
      // even or odd?
      var even_or_odd = 'Odd'
      if (this.current_number % 2 == 0) {
        even_or_odd = 'Even'
      }
      if (this.current_number == 0) {
        even_or_odd = 'Zero'
      }
      // low or high?
      var low_or_high = 'High'
      if (this.current_number <= 18) {
        low_or_high = 'Low'
      }
      if (this.current_number == 0) {
        low_or_high = 'Zero'
      }
      var twelve = 'Zero'
      if (this.current_number >= 1 && this.current_number <= 12) {
        twelve = '1st 12'
      } else if (this.current_number >= 13 && this.current_number <= 24) {
        twelve = '2nd 12'
      } else if (this.current_number >= 25 && this.current_number <= 36) {
        twelve = '3rd 12'
      }
      var column = 'Zero'
      if (this.current_number == 0) {
        column = 'Zero'
      } else if (this.current_number % 3 == 1) {
        column = '1st 2-1'
      } else if (this.current_number % 3 == 2) {
        column = '2nd 2-1'
      } else if (this.current_number % 3 == 0) {
        column = '3rd 2-1'
      }
      this.show_payout(
        color,
        even_or_odd,
        low_or_high,
        twelve,
        column,
        'Winner: ' + this.current_number + '\n'
      )
    }
  }

  // visibly display amount won or lost
  async show_payout(color, even_or_odd, low_or_high, twelve, column, text) {
    var bets = this.get_bets()
    var won = 0.0
    var lost = 0.0
    //var numbers = Object.keys(bets).length

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // set won amount
    for (var ki = 0; ki < Object.keys(bets).length; ki++) {
      var key = Object.keys(bets)[ki]
      var bet = bets[key]
      var ratio = 35.0
      if (
        key == 'even' ||
        key == 'odd' ||
        key == 'red' ||
        key == 'black' ||
        key == 'high' ||
        key == 'low'
      ) {
        ratio = 1.0
      } else if (
        key == '1st 12' ||
        key == '2nd 12' ||
        key == '3rd 12' ||
        key == '1st 2-1' ||
        key == '2nd 2-1' ||
        key == '3rd 2-1'
      ) {
        ratio = 2.0
      }
      if (
        key == this.current_number.toString() ||
        key == color.toLowerCase() ||
        key == even_or_odd.toLowerCase() ||
        key == low_or_high.toLowerCase() ||
        key == twelve ||
        key == column
      ) {
        won += parseFloat(bet) + parseFloat(bet) * ratio
      } else {
        lost += parseFloat(bet)
      }
    }

    if (won > 0.0) {
      this.show_notification(
        text +
          'Won: ' +
          won.toFixed(decimals).toString() +
          ' ' +
          this.overlayUI.balance.coinName
      )
      winnings += won

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      if (!this.overlayUI.balance.payoutMode) {
        credits += won
      } else {
        credits = await this.overlayUI.balance.getCredits()
      }

      this.audio_win_source.playOnce()

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // display big win amount in center of screen
      this.UIValues = {
        creditsString: '',
        betString: '',
        winningsString: '',
        winAmountString: won.toFixed(decimals).toString()
      }
      this.overlayUI.balance.setValues(this.UIValues)

      this.clear_chips(false, false)
    } else {
      this.show_notification(
        text +
          'Lost: ' +
          lost.toFixed(decimals).toString() +
          ' ' +
          this.overlayUI.balance.coinName
      )
      this.clear_chips(true, false)
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // updates credits and total winnings
    if (this.overlayUI.balance.payoutMode) {
      credits = await this.overlayUI.balance.getCredits()
    }

    this.UIValues = {
      creditsString: credits.toFixed(decimals).toString(),
      betString: '0',
      winningsString: winnings.toFixed(decimals).toString(),
      winAmountString: ''
    }
    this.overlayUI.balance.setValues(this.UIValues)

    this.update_ui((bet = 0))

    this.timer_entity.addComponent(
      new utils.Delay(8000, () => {
        this.hide_winning_number()
      })
    )
    engine.addEntity(this.timer_entity)

    const gameData = {
      method: 'clear_chip',
      mode: 'all'
    }
    // sendMessage(this.gameType, this.machineID, gameData);
  }

  // hide amount won
  hide_winning_number() {
    //this.winningNumberText.value = ''
    this.update_bets_string()
  }

  // set credits and bet on the overlayUI
  update_ui(bet = null) {
    if (bet != null) {
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // show current bet amount
      this.UIValues = {
        creditsString: credits.toFixed(decimals),
        betString: bet.toFixed(decimals),
        winningsString: '',
        winAmountString: ''
      }
      this.overlayUI.balance.setValues(this.UIValues)
    }
  }

  // just return true if the player has made any bets yet
  has_bets() {
    for (var ki in Object.keys(this.number_locations_and_chips)) {
      var key = Object.keys(this.number_locations_and_chips)[ki]
      if (this.number_locations_and_chips[key][5] > 0.0) {
        return true
      }
    }
    return false
  }

  // update player bets' floating text
  update_bets_string() {
    var lines = this.get_bets_string()
    this.winningNumberText.value = lines
    if (this.table_type == 0) {
      this.winningNumberText.color = new Color3(1, 1, 1)
      this.winningNumberText.outlineColor = new Color3(0, 0, 0)
      this.winningNumberText.outlineWidth = 0.2
    } else if (this.table_type == 1) {
      this.winningNumberText.color = new Color3(1, 1, 1)
      this.winningNumberText.outlineColor = new Color3(0, 0, 0)
      this.winningNumberText.outlineWidth = 0.2
    }
    this.winningNumberText.fontWeight = 'bold'

    this.winningNumberText.fontSize = 1
  }

  // return a multiline string of all player bets
  get_bets_string() {
    var bets = this.get_bets()
    var lines = ''
    for (var ki in Object.keys(bets)) {
      var key = Object.keys(bets)[ki]
      var bet = bets[key]
      var name = key
      var first_letter = name.slice(0, 1)
      first_letter = first_letter.toUpperCase()
      name = first_letter + name.slice(1)
      lines +=
        bet + ' ' + this.overlayUI.balance.coinName + ' on ' + name + '\n'
    }
    return lines
  }

  // return dictionary of bets
  get_bets() {
    var bets = {}
    for (var ki in Object.keys(this.number_locations_and_chips)) {
      var key = Object.keys(this.number_locations_and_chips)[ki]
      if (this.number_locations_and_chips[key][5] > 0.0) {
        bets[key] = this.number_locations_and_chips[key][5].toFixed(decimals)
      }
    }
    return bets
  }

  // get sum of all money bet
  get_bets_total_amount() {
    var amount = 0.0
    for (var ki in Object.keys(this.number_locations_and_chips)) {
      var key = Object.keys(this.number_locations_and_chips)[ki]
      if (this.number_locations_and_chips[key][5] > 0.0) {
        amount += this.number_locations_and_chips[key][5]
      }
    }
    return amount
  }

  // visibly stack chips
  spawn_chip_graphic(bet, chip_shape, value) {
    var scene_scale = this.scene.getComponent(Transform).scale
    var loc = this.number_locations_and_chips[bet]
    var height =
      chip_height * scene_scale.y * loc[3] + chip_height * scene_scale.y
    var new_chip = spawnGltfX(
      chip_shape,
      loc[0],
      loc[1] + height,
      loc[2],
      0,
      Math.random() * 360,
      0,
      1,
      1,
      1
    )
    new_chip.setParent(this.roulette_table)
    this.number_locations_and_chips[bet][3] += 1 // add to stack height
    if (loc[4].length == 0) {
      var scale = [1, 1, 1]
      if (this.number_locations_and_chips[bet].length == 7) {
        scale = this.number_locations_and_chips[bet][6]
      }
      var glow = spawnGltfX(
        digit_glow_shape,
        loc[0],
        loc[1],
        loc[2],
        0,
        0,
        0,
        scale[0],
        scale[1],
        scale[2]
      )
      glow.setParent(this.roulette_table)
      this.number_locations_and_chips[bet][4].push(glow)
    }
    this.number_locations_and_chips[bet][4].push(new_chip)
    this.number_locations_and_chips[bet][3] += 1 // add to stack ETH value
  }

  // on board click, place a chip on a number if it's held
  // bet: number to place bet on, example '1'
  spawn_chips_on_number(bet, money_held_socket = 0, fromSocket = false) {
    // nothing is held, so let's remove the chips from this bet instead.
    // when DCL allows, we can just right click to clear instead.
    var bets = this.get_bets()
    var loc = this.number_locations_and_chips[bet]

    var remaining = parseFloat(money_held.toFixed(decimals))

    if (!fromSocket) {
      if (money_held <= 0.0 || this.number_locations_and_chips[bet][5] > 0.0) {
        this.clear_chips_from_number(bet)
        return
      }

      if (credits < money_held) {
        this.show_notification('Error:\nNot enough credits')
        money_held = 0.0
        return
      }

      const gameData = {
        method: 'place_chip',
        money_held: money_held,
        bet: bet
      }
      // sendMessage(this.gameType, this.machineID, gameData);

      if (timerStarted == false && player_mode == 'multi') {
        const gameData = {
          method: 'timer_start'
        }
        // sendMessage(this.gameType, this.machineID, gameData);
      }
      this.show_wheel_glow()
    } else {
      remaining = parseFloat(money_held_socket.toFixed(decimals))
    }

    while (remaining >= this.chip_value4) {
      remaining = parseFloat((remaining - this.chip_value4).toFixed(decimals))
      this.spawn_chip_graphic(bet, chip_1eth_shape, this.chip_value4)
    }
    while (remaining >= this.chip_value3) {
      remaining = parseFloat((remaining - this.chip_value3).toFixed(decimals))
      this.spawn_chip_graphic(bet, chip_0_5eth_shape, this.chip_value3)
    }
    while (remaining >= this.chip_value2) {
      remaining = parseFloat((remaining - this.chip_value2).toFixed(decimals))
      this.spawn_chip_graphic(bet, chip_0_1eth_shape, this.chip_value2)
    }
    while (remaining >= this.chip_value1) {
      remaining = parseFloat((remaining - this.chip_value1).toFixed(decimals))
      this.spawn_chip_graphic(bet, chip_0_05eth_shape, this.chip_value1)
    }

    if (!fromSocket) {
      this.number_locations_and_chips[bet][5] += money_held
      credits -= money_held
      //money_held = 0.0
      this.chips_placed = true
      this.show_notification(
        'Total bet on ' +
          bet +
          ':\n' +
          this.number_locations_and_chips[bet][5].toFixed(decimals) +
          ' ' +
          this.overlayUI.balance.coinName
      )
      this.update_ui((bet = this.get_bets_total_amount()))
      this.audio_chips_source.playOnce()
      this.update_bets_string()
    }
  }

  // remove bet and clear chip from one number on board
  async clear_chips_from_number(bet, fromSocket = false) {
    for (
      var i = this.number_locations_and_chips[bet][4].length - 1;
      i >= 0;
      i--
    ) {
      var ent = this.number_locations_and_chips[bet][4][i]
      if (ent) {
        engine.removeEntity(ent)
      }
    }

    if (fromSocket) {
      this.number_locations_and_chips[bet][3] = 0
      this.number_locations_and_chips[bet][4] = []
      return
    } else {
      const gameData = {
        method: 'clear_chip',
        bet: bet
      }

      // sendMessage(this.gameType, this.machineID, gameData);
    }
    if (this.number_locations_and_chips[bet][5] > 0.0) {
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      if (!this.overlayUI.balance.payoutMode) {
        credits += this.number_locations_and_chips[bet][5]
      } else {
        credits = await this.overlayUI.balance.getCredits()
      }

      this.show_notification('Removed bet:\n' + bet)
      this.audio_chips_source.playOnce()
    }
    this.number_locations_and_chips[bet][3] = 0
    this.number_locations_and_chips[bet][4] = []
    this.number_locations_and_chips[bet][5] = 0.0
    this.update_ui((bet = this.get_bets_total_amount()))
    if (!this.has_bets()) {
      if (money_held > 0.0) {
        this.show_table_glow()
      } else {
        this.show_chips_glow()
      }
    }
    this.update_bets_string()
  }

  // remove bet and clear chip from all numbers on board
  clear_chips(play_sound = true, update_string = true) {
    this.show_chips_glow()
    for (var ki in Object.keys(this.number_locations_and_chips)) {
      var key = Object.keys(this.number_locations_and_chips)[ki]
      for (
        var i = this.number_locations_and_chips[key][4].length - 1;
        i >= 0;
        i--
      ) {
        var ent = this.number_locations_and_chips[key][4][i]
        if (ent) {
          engine.removeEntity(ent)
        }
        //this.number_locations_and_chips[key][4].splice(i, 1)
      }
      this.number_locations_and_chips[key][3] = 0
      this.number_locations_and_chips[key][4] = []
      this.number_locations_and_chips[key][5] = 0.0
    }
    if (play_sound) {
      this.audio_chips_source.playOnce()
    }
    if (update_string) {
      this.update_bets_string()
    }
  }

  // start spinning the wheel
  place_bets(stop_number = -1) {
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
    // 3301 - betSingle (need to provide number in _betValues for the number on which user makes a bet 0-36) *
    // 3302 - betEven (only requires bet amount, betting on all even numbers) *
    // 3303 - betOdd (only requires bet amount, betting on all odd numbers) *
    // 3304 - betRed (only requires bet amount, betting on red numbers) *
    // 3305 - betBlack (only requires bet amount, betting on black numbers) *
    // 3306 - betHigh (only requires bet amount, betting on 19-36 numbers) // not registering
    // 3307 - betLow (only requires bet amount, betting on 1-18 numbers) // not registering
    // 3308 - betColumn (need to provide number of the column 1-3) *
    // 3309 - betDozen (need to provide number of the dozen 1-3) *
    if (!this.overlayUI.balance.payoutMode) {
      log('Testing the bet without a server connection...')
      this.test_bet(stop_number)
    } else {
      const bets = this.get_bets()
      log(JSON.stringify(bets))

      let betAmountSum: number = 0
      let betIDs: number[] = []
      let betValues: number[] = []
      let betAmounts: string[] = []

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // loop through bets and create data arrays to send to the smart contract
      for (var ki = 0; ki < Object.keys(bets).length; ki++) {
        const betType = Object.keys(bets)[ki]

        const betAmountWei: bigint = BigInt(bets[betType] * this.multiplier)
        betAmounts.push(betAmountWei.toString())

        if (betType === 'red') {
          betIDs.push(3304)
          betValues.push(0)
        } else if (betType === 'black') {
          betIDs.push(3305)
          betValues.push(0)
        } else if (betType === 'even') {
          betIDs.push(3302)
          betValues.push(0)
        } else if (betType === 'odd') {
          betIDs.push(3303)
          betValues.push(0)
        } else if (betType === 'high' || betType == '19-36') {
          betIDs.push(3306)
          betValues.push(0)
        } else if (betType === 'low' || betType == '1-18') {
          betIDs.push(3307)
          betValues.push(0)
        } else if (betType === '1st 12') {
          betIDs.push(3309)
          betValues.push(1)
        } else if (betType === '2nd 12') {
          betIDs.push(3309)
          betValues.push(2)
        } else if (betType === '3rd 12') {
          betIDs.push(3309)
          betValues.push(3)
        } else if (betType === '1st 2-1') {
          betIDs.push(3308)
          betValues.push(1)
        } else if (betType === '2nd 2-1') {
          betIDs.push(3308)
          betValues.push(2)
        } else if (betType === '3rd 2-1') {
          betIDs.push(3308)
          betValues.push(3)
        } else {
          betIDs.push(3301)
          betValues.push(parseInt(betType, 10))
        }

        const betNumber = parseInt(bets[betType], 10)
        betAmountSum = betAmountSum + betNumber
      }

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // check betAmountSum to see if the player has enough funds to cover the bet
      // if they don't set a notification and do not process the play
      if (betAmountSum > credits) {
        this.show_notification(
          'You do not have enough funds to cover that bet amount'
        )

        this.audio_chips_source.playOnce()
      } else {
        this.hide_wheel_glow()
        money_held = 0.0
        this.spinning = true
        this.hide_winning_number()
        this.full_rotations = 0
        this.audio_wheel_source.playing = true

        const gameData = {
          coinName: this.coinName,
          betIDs: betIDs,
          betValues: betValues,
          betAmounts: betAmounts
        }
        // sendMessage(this.gameType, this.machineID, gameData);

        this.show_notification('Blockchain transaction pending...')
      }

      betAmountSum = 0
    }
  }

  // spin the wheel
  test_bet(stop_number) {
    money_held = 0.0
    this.hide_wheel_glow()
    if (stop_number != -1) {
      this.stop_number = stop_number
    } else {
      this.stop_number = getRandomIntInclusive(0, 36)
    }
    //log("stop number "+this.stop_number)
    this.spinning = true
    this.hide_winning_number()
    this.full_rotations = 0
    this.audio_wheel_source.playing = true
  }
}

class RouletteUI {
  ui_canvas: UICanvas
  text_elements = []
  active_elements = []
  timer: number = 0.0
  timer_speed: number = 0.05

  countdownSeconds: number = -1
  countdownDate: Date
  countdownTimer: Entity

  back_rect: UIContainerRect
  rouletteRect: UIContainerRect
  centerBottomText: UIText
  centerTopText: UIText
  timeLeftTopText: UIText
  timeLeftBottomText: UIText
  back_image: UIImage

  last_button: UIContainerRect
  last_text: UIText
  last_button_image: UIImage

  number_text_0: UIText
  number_text_1: UIText
  number_text_2: UIText
  number_text_3: UIText
  number_text_4: UIText
  number_text_5: UIText
  number_text_6: UIText
  number_text_7: UIText
  number_text_8: UIText
  number_text_9: UIText

  table_positions = []
  visible = false

  constructor(ui_canvas) {
    this.ui_canvas = ui_canvas

    this.countdownTimer = new Entity()
    engine.addEntity(this.countdownTimer)

    this.rouletteRect = new UIContainerRect(ui_canvas)
    this.rouletteRect.width = '100%'
    this.rouletteRect.height = '100%'
    this.rouletteRect.isPointerBlocker = false

    this.centerTopText = new UIText(this.rouletteRect)
    this.centerTopText.value = 'CLICK BOARD TO'
    this.centerTopText.hTextAlign = 'center'
    this.centerTopText.hAlign = 'center'
    this.centerTopText.vAlign = 'center'
    this.centerTopText.positionY = 60
    this.centerTopText.fontSize = 32
    this.centerTopText.isPointerBlocker = false
    this.centerTopText.opacity = 0.5
    this.centerTopText.visible = false

    this.centerBottomText = new UIText(this.rouletteRect)
    this.centerBottomText.value = 'JOIN GAME'
    this.centerBottomText.hTextAlign = 'center'
    this.centerBottomText.hAlign = 'center'
    this.centerBottomText.vAlign = 'center'
    this.centerBottomText.positionY = -20
    this.centerBottomText.fontSize = 72
    this.centerBottomText.isPointerBlocker = false
    this.centerBottomText.opacity = 0.5
    this.centerBottomText.visible = false

    this.timeLeftTopText = new UIText(this.rouletteRect)
    this.timeLeftTopText.value = 'TIME LEFT'
    this.timeLeftTopText.hTextAlign = 'center'
    this.timeLeftTopText.hAlign = 'right'
    this.timeLeftTopText.vAlign = 'bottom'
    this.timeLeftTopText.positionX = -160
    this.timeLeftTopText.positionY = 260
    this.timeLeftTopText.fontSize = 30
    this.timeLeftTopText.isPointerBlocker = false
    this.timeLeftTopText.opacity = 0.5
    this.timeLeftTopText.visible = false

    this.timeLeftBottomText = new UIText(this.rouletteRect)
    this.timeLeftBottomText.value = '00:00'
    this.timeLeftBottomText.hTextAlign = 'center'
    this.timeLeftBottomText.hAlign = 'right'
    this.timeLeftBottomText.vAlign = 'bottom'
    this.timeLeftBottomText.positionX = -160
    this.timeLeftBottomText.positionY = 230
    this.timeLeftBottomText.fontSize = 30
    this.timeLeftBottomText.isPointerBlocker = false
    this.timeLeftBottomText.opacity = 0.5
    this.timeLeftBottomText.visible = false

    this.back_rect = new UIContainerRect(ui_canvas)
    this.back_rect.visible = false
    this.back_image = this.back_image = new UIImage(
      this.back_rect,
      new Texture('images/winningNumbersBack.png')
    )
    this.back_rect.hAlign = 'right'
    this.back_rect.vAlign = 'center'
    this.back_rect.adaptHeight = true
    this.back_rect.width = 48
    this.back_rect.height = 302
    this.back_rect.positionX = -60
    this.back_rect.positionY = -15 // 30
    this.back_rect.color = Color4.Clear()
    this.back_image.hAlign = 'center'
    this.back_image.vAlign = 'center'
    this.back_image.width = '100%'
    this.back_image.height = '100%'
    this.back_image.sourceWidth = 48
    this.back_image.sourceHeight = 302

    this.last_button = new UIContainerRect(this.back_rect)
    this.last_button.hAlign = 'center'
    this.last_button.vAlign = 'top'
    this.last_button.width = 32
    this.last_button.height = 16
    this.last_button.positionY = -16

    this.last_button_image = new UIImage(
      this.last_button,
      new Texture('images/balanceButton.png')
    )
    this.last_button_image.sourceWidth = 180
    this.last_button_image.sourceHeight = 100
    this.last_button_image.width = 40
    this.last_button_image.height = 28
    this.last_button_image.hAlign = 'center'
    this.last_button_image.vAlign = 'center'
    this.last_button_image.positionX = -4
    this.last_button_image.positionY = -24

    this.last_text = new UIText(this.last_button)
    this.last_text.hAlign = 'center'
    this.last_text.vAlign = 'center'
    this.last_text.hTextAlign = 'center'
    this.last_text.vTextAlign = 'center'
    this.last_text.width = '100%'
    this.last_text.height = '100%'
    this.last_text.value = 'Last'
    this.last_text.fontSize = 14
    this.last_text.outlineWidth = 0.4
    this.last_text.outlineColor = new Color4(0, 0, 0, 1)
    this.last_text.textWrapping = true
    this.last_text.fontWeight = 'bold'
    this.last_text.isPointerBlocker = false
    this.last_text.color = new Color4(0, 0, 0, 1)

    var spacing = 24
    this.number_text_0 = this.create_number_text(-40)
    this.number_text_1 = this.create_number_text(-40 - spacing * 1)
    this.number_text_2 = this.create_number_text(-40 - spacing * 2)
    this.number_text_3 = this.create_number_text(-40 - spacing * 3)
    this.number_text_4 = this.create_number_text(-40 - spacing * 4)
    this.number_text_5 = this.create_number_text(-40 - spacing * 5)
    this.number_text_6 = this.create_number_text(-40 - spacing * 6)
    this.number_text_7 = this.create_number_text(-40 - spacing * 7)
    this.number_text_8 = this.create_number_text(-40 - spacing * 8)
    this.number_text_9 = this.create_number_text(-40 - spacing * 9)
    this.set_winning_numbers()
  }

  // hidecountdown text
  public hideCountDownText(seconds) {
    timerStarted = false
    this.timeLeftTopText.visible = false
    this.timeLeftBottomText.visible = false
  }

  // show countdown text
  public showCountDownText(seconds) {
    timerStarted = true

    if (seconds > -1) {
      if (this.countdownSeconds == -1) this.countdownSeconds = seconds

      this.countdownTimer.addComponentOrReplace(
        new utils.Interval(1000, () => {
          if (this.countdownSeconds >= 0) {
            this.updateCountdownText()
            this.countdownSeconds--
          }

          if (this.countdownSeconds == -1) {
            this.timeLeftTopText.visible = false
            this.timeLeftBottomText.visible = false
            timerStarted = false
          }
        })
      )
    }
  }

  public updateCountdownText() {
    this.timeLeftTopText.visible = true
    this.timeLeftBottomText.visible = true

    let minutes = Math.floor(this.countdownSeconds / 60)
    let seconds = (this.countdownSeconds % 60).toString()
    if (this.countdownSeconds % 60 < 10) {
      seconds = '0' + seconds.toString()
    }
    this.timeLeftBottomText.value = minutes + ':' + seconds
  }

  // hide center text
  public hideCenterText() {
    this.centerTopText.visible = false
    this.centerBottomText.visible = false
  }

  // show center text
  public showCenterText(reason) {
    if (reason == 0) {
      this.centerTopText.value = 'CLICK BOARD TO'
      this.centerBottomText.value = 'JOIN GAME'
    }
    this.centerTopText.visible = true
    this.centerBottomText.visible = true
  }

  // set one of the winning numbers on the screen (by index)
  set_winning_number(index, text) {
    var winning_number = last_winning_bets[index]
    if (roulette_red_numbers.indexOf(winning_number) >= 0) {
      // red
      if (index == 0) {
        this.last_button_image.source = new Texture('images/redButton.png')
        text.color = new Color3(1, 1, 1)
      } else {
        text.color = new Color3(1, 0, 0)
      }
    } else if (winning_number == 0) {
      if (index == 0) {
        this.last_button_image.source = new Texture('images/greenButton.png')
        text.color = new Color3(1, 1, 1)
      } else {
        text.color = color_green // zero/gray
      }
    } else {
      if (index == 0) {
        this.last_button_image.source = new Texture('images/blackButton.png')
        text.color = new Color3(1, 1, 1)
      } else {
        text.color = new Color3(0, 0, 0) // black
      }
    }
    text.value = winning_number.toString()
  }

  // set all winning numbers from a list
  set_last_winning_bets(bets) {
    last_winning_bets = bets
  }

  // run set_winning_number for all 10
  set_winning_numbers() {
    this.set_winning_number(0, this.number_text_0)
    this.set_winning_number(1, this.number_text_1)
    this.set_winning_number(2, this.number_text_2)
    this.set_winning_number(3, this.number_text_3)
    this.set_winning_number(4, this.number_text_4)
    this.set_winning_number(5, this.number_text_5)
    this.set_winning_number(6, this.number_text_6)
    this.set_winning_number(7, this.number_text_7)
    this.set_winning_number(8, this.number_text_8)
    this.set_winning_number(9, this.number_text_9)
  }

  // create Text entity for winning umber at position
  create_number_text(positionY) {
    var rect = new UIContainerRect(this.back_rect)
    rect.hAlign = 'center'
    rect.vAlign = 'top'
    rect.width = 32
    rect.height = 16
    rect.positionX = 0
    rect.positionY = positionY
    var text = new UIText(rect)
    text.hAlign = 'center'
    text.vAlign = 'center'
    text.hTextAlign = 'center'
    text.vTextAlign = 'center'
    text.color = new Color4(0, 0, 0, 1)
    text.isPointerBlocker = false
    text.fontSize = 14
    text.value = '0'
    text.width = '100%'
    text.height = '100%'
    text.fontWeight = 'bold'
    text.outlineWidth = 0.2
    text.outlineColor = new Color4(0, 0, 0, 1)
    return text
  }

  // get the oldest floating Text entity for reuse
  get_next_uitext() {
    if (this.text_elements.length < 3) {
      var ele = new UIText(this.ui_canvas)
      this.text_elements.push(ele)
      return ele
    } else {
      var ele: UIText = this.text_elements[0]
      this.text_elements.splice(0, 1)
      this.text_elements.push(ele)
      return ele
    }
  }

  // add floating text when clicking a chip
  add_floating_text(amount) {
    var text = this.get_next_uitext()
    text.value = '+' + amount.toString()
    text.hAlign = 'center'
    text.vAlign = 'center'
    text.positionY = 60
    text.fontWeight = 'bold'
    text.fontSize = 32
    text.color = new Color4(1, 1, 1, 1)
    text.positionX = '15px'
    text.outlineWidth = 0.5
    if (this.active_elements.indexOf(text) == -1) {
      this.active_elements.push(text)
    }
  }

  // add a table to the list of tables in the world, will be used to hide/show the UI at a distance - called from RouletteTable constructor
  add_table(position: Vector3) {
    this.table_positions.push(position)
  }

  // tick: hide/show tables, move floating text upward
  update(dt: number) {
    let tbNum = -1
    this.timer = this.timer - dt
    if (this.timer <= 0) {
      this.timer = this.timer_speed

      this.visible = false
      for (var i = this.table_positions.length - 1; i >= 0; i--) {
        if (
          this.visible == false &&
          Vector3.Distance(Camera.instance.position, this.table_positions[i]) <
            8
        ) {
          this.visible = true
          tbNum = i
          break
        }
      }
      if (this.back_rect.visible != this.visible) {
        this.back_rect.visible = this.visible
      }

      // if (this.back_rect.visible && (myTableID == -1 || (myTableID != -1 && tbNum != -1 && tbNum != myTableID)))
      //   this.showCenterText(0);
      // else
      //   this.hideCenterText();

      for (var i = this.active_elements.length - 1; i >= 0; i--) {
        var text = this.active_elements[i]
        text.positionY = parseFloat(text.positionY) + this.timer_speed * 200
        var opacity =
          (200.0 - (parseFloat(text.positionY) - 60)) * this.timer_speed * 0.5
        if (opacity < 0.0) {
          text.value = ''
          this.active_elements.splice(i, 1)
        } else {
          text.color = new Color4(1, 1, 1, opacity)
        }
      }
    }
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
export class Roulette {
  roulette_ui
  topBetAmount: number
  arrayPositions: any = []

  positionX: number
  positionY: number
  positionZ: number
  yRotation: number

  constructor(topBetAmount) {
    this.topBetAmount = topBetAmount

    // create the roulette UI and roulette table
    const ui_canvas = new UICanvas()
    this.roulette_ui = new RouletteUI(ui_canvas)
    engine.addSystem(this.roulette_ui)

    this.createTables() // create active and dummy machines
  }

  createTables() {
    rouletteData.map((object, index) => {
      this.positionX = object.position[0]
      this.positionY = object.position[1]
      this.positionZ = object.position[2]
      this.yRotation = object.yRotation

      instances[index] = engine.addSystem(
        new RouletteTable(
          new Transform({
            position: new Vector3(
              this.positionX,
              this.positionY,
              this.positionZ
            ),
            rotation: Quaternion.Euler(0, this.yRotation, 0),
            scale: new Vector3(1.1, 1.1, 1.1)
          }),
          this.roulette_ui,
          0,
          index
        )
      )

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
    for (var i = 0; i < instances.length; i++) {
      instances[i].overlayUI = instance
    }
  }

  // give overlay UI access to credits amount
  getCredits() {
    return credits
  }

  // give overlay UI access to total winnings
  getWinnings() {
    // log('roulette: ' + winnings);

    return winnings
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // set payout mode and initial balance values
  async changeMode(balance, winnings2) {
    for (var i = 0; i < instances.length; i++) {
      if (!instances[i].overlayUI.balance.payoutMode) {
        // set the credits and bet amounts for free-to-play mode
        if (balance === 0) {
          credits = creditsDefault
          winnings = 0
        } else {
          credits = balance
          winnings = winnings2
        }

        instances[i].chip_value1 = this.topBetAmount * 0.01
        instances[i].chip_value2 = this.topBetAmount * 0.025
        instances[i].chip_value3 = this.topBetAmount * 0.05
        instances[i].chip_value4 = this.topBetAmount * 0.1
      } else {
        // set the credits and bet amounts for payout mode
        credits = await instances[i].overlayUI.balance.getCredits()
        const topBetAmount = await instances[i].overlayUI.balance.getMaximumBet(
          instances[i].gameType
        )
        const topBetStandard = topBetAmount / instances[i].multiplier

        instances[i].chip_value1 = topBetStandard * 0.01
        instances[i].chip_value2 = topBetStandard * 0.025
        instances[i].chip_value3 = topBetStandard * 0.05
        instances[i].chip_value4 = topBetStandard * 0.1
      }

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // change the coin name and reset the text values on chips
      instances[i].coinName = instances[i].overlayUI.balance.coinName
      instances[i].select_coin()

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // set initial balances on the machine displays as well as the overlay UI
      instances[i].UIValues = {
        creditsString: credits.toString(),
        betString: '0',
        winningsString: winnings.toFixed(decimals).toString(),
        winAmountString: ''
      }
      instances[i].overlayUI.balance.setValues(instances[i].UIValues)
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  async messageHandler(json) {
    // log("qqqqq", crntTableID);
    // if (crntTableID != json.tableID && json.tableID != undefined)
    //   return;
    const verified = await verifyTableID(myTableID, json.tableID, 2)
    if (!verified) {
      return
    }

    log(json)
    if (json.gameData.method == 'place_chip') {
      instances[myTableID].spawn_chips_on_number(
        json.gameData.bet,
        json.gameData.money_held,
        true
      )
    } else if (json.gameData.method == 'clear_chip') {
      instances[myTableID].clear_chips_from_number(json.gameData.bet, true)

      if (json.gameData.removed_bets) {
        json.gameData.removed_bets.forEach(element => {
          instances[myTableID].clear_chips_from_number(element, true)
        })
      }
    } else if (json.gameData.method == 'timer_start') {
      instances[myTableID].rouletteUI.showCountDownText(json.gameData.seconds)
    } else if (json.gameData.method == 'wheel_play') {
      instances[myTableID].place_bets(json.gameData.stop_number)
    } else if (json.gameData.method == 'player_mode') {
      player_mode = json.gameData.mode
      if (player_mode == 'single') {
        instances[myTableID].rouletteUI.hideCountDownText()
        instances[myTableID].changeWheelClickableStatus(false)
      } else {
        instances[myTableID].changeWheelClickableStatus(true)
      }
    } else if (json.gameData.method == 'join_server') {
      instances[myTableID].rouletteUI.countdownSeconds = -1
      // instances[myTableID].rouletteUI.hideCenterText();
      instances[myTableID].changeButtonTableHoverText(true)
      if (json.gameData.seconds != 15 && json.gameData.seconds != undefined) {
        instances[myTableID].rouletteUI.showCountDownText(json.gameData.seconds)
      }

      if (json.gameData.bet_array) {
        json.gameData.bet_array.forEach(element => {
          instances[myTableID].spawn_chips_on_number(
            element.bet,
            element.money_held,
            true
          )
        })
      }
    } else {
      const address = json.data._address
      const numbers = json.data._numbers
      const amountWin = json.data._amountWin

      log('wallet address: ' + address)
      log('numbers: ' + numbers)
      log('amount win: ' + amountWin)

      for (var i = 0; i < instances.length; i++) {
        instances[i].stop_number = numbers
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  pingHandler(minutes, seconds) {
    // log('ping at ' + minutes + ' minutes ' + seconds + ' seconds');
  }
}
