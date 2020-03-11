export class DummyMachine {
  machine: Entity = new Entity();
  UIParent3D: Entity = new Entity();

  wheel1: Entity = new Entity();
  wheel2: Entity = new Entity();
  wheel3: Entity = new Entity();
  arm: Entity = new Entity();

  position: Vector3;
  rotation: number;
  scale: number;
  themeID: number;

  constructor(
    position: Vector3,
    rotation: number,
    scale: number,
    themeID: number
  ) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.themeID = themeID;

    this.slotsModelsDummy(this.themeID);
  }

  slotsModelsDummy(id) {
    this.machine.addComponent(
      new GLTFShape('models/slots/slotMachine_' + id + '_collider.gltf')
    );
    this.machine.addComponent(
      new Transform({
        position: this.position,
        rotation: Quaternion.Euler(0, this.rotation, 0),
        scale: new Vector3(this.scale, this.scale, this.scale)
      })
    );
    engine.addEntity(this.machine);

    this.UIParent3D.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 180, 0)
      })
    );
    this.UIParent3D.setParent(this.machine);
    engine.addEntity(this.UIParent3D);

    this.wheel1.addComponent(
      new GLTFShape('models/slots/slotMachineWheel_' + id + '.gltf')
    );
    this.wheel1.addComponent(
      new Transform({
        position: new Vector3(-0.4, 3, -1.17),
        rotation: Quaternion.Euler(31, 180, 0)
      })
    );
    this.wheel1.setParent(this.UIParent3D);
    engine.addEntity(this.wheel1);

    this.wheel2.addComponent(
      new GLTFShape('models/slots/slotMachineWheel_' + id + '.gltf')
    );
    this.wheel2.addComponent(
      new Transform({
        position: new Vector3(0, 3, -1.17),
        rotation: Quaternion.Euler(67, 180, 0)
      })
    );
    this.wheel2.setParent(this.UIParent3D);
    engine.addEntity(this.wheel2);

    this.wheel3.addComponent(
      new GLTFShape('models/slots/slotMachineWheel_' + id + '.gltf')
    );
    this.wheel3.addComponent(
      new Transform({
        position: new Vector3(0.4, 3, -1.17),
        rotation: Quaternion.Euler(-5, 180, 0)
      })
    );
    this.wheel3.setParent(this.UIParent3D);
    engine.addEntity(this.wheel3);

    this.arm.addComponent(new GLTFShape('models/slots/slotMachineArm.gltf'));
    this.arm.addComponent(
      new Transform({
        position: new Vector3(1.105, 2.05, -1.15),
        rotation: Quaternion.Euler(0, 180, 0)
      })
    );
    this.arm.setParent(this.UIParent3D);
    engine.addEntity(this.arm);
  }
}
