import utils from '../../node_modules/decentraland-ecs-utils/index'

export function addScreen() {
  const e = new Entity()
  e.addComponent(new PlaneShape())
  e.addComponent(
    new Transform({
      position: new Vector3(265, 10, 299.9),
      rotation: Quaternion.Euler(0, 136, 0), //new Quaternion(-0.7259005, 0.2195348, -0.5940643, 0.2682545),
      scale: new Vector3(10 * 1.3, 5.6 * 1.3, 10 * 1.3),
    })
  )
  //e.getComponent(Transform).rotate(new Vector3(1, 0, 0), 10)
  const v = new VideoTexture(
    new VideoClip('https://theuniverse.club/live/bbb/index.m3u8')
  )
  const mat = new BasicMaterial()
  mat.texture = v

  e.addComponent(mat)
  e.addComponent(
    new OnPointerDown(() => {
      v.playing = !v.playing
    })
  )
  engine.addEntity(e)

  const videoTrigger = new Entity()
  videoTrigger.addComponent(
    new Transform({ position: new Vector3(266, 1, 300) })
  )

  let videoTriggerBox = new utils.TriggerBoxShape(
    new Vector3(30, 30, 30),
    Vector3.Zero()
  )
  videoTrigger.addComponent(
    new utils.TriggerComponent(
      videoTriggerBox, //shape
      0, //layer
      0, //triggeredByLayer
      null, //onTriggerEnter
      null, //onTriggerExit
      () => {
        v.playing = true
        log('triggered!')
      },
      () => {
        v.playing = false
        log('triggered!')
      }, //onCameraExit
      false
    )
  )
  engine.addEntity(videoTrigger)
}
