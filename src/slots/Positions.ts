import utils from '../../node_modules/decentraland-ecs-utils/index';
import slotsData from './slotsData';

let delay: Entity = new Entity();
engine.addEntity(delay);

export class Positions {
  instances;

  transformDummyOld;
  positionDummy;
  transformDummyNew;
  themeID: number = 0;
  transformActive;
  transformWheel1;
  transformWheel2;
  transformWheel3;
  positionActive;
  rotationActive;
  themeIDActive: number = 0;
  textNumberActive;

  constructor(instances) {
    this.instances = instances;
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // position and rotate the dummy machines
  positionDummyMachines(leastDistance) {
    if (this.instances[0].machineID !== leastDistance) {
      // move the previous dummy back to its original position
      if (this.instances[0].machineID === 0) {
        this.transformDummyOld = this.instances[-1].machine.getComponent(
          Transform
        );
      } else {
        this.transformDummyOld = this.instances[
          this.instances[0].machineID
        ].machine.getComponent(Transform);
      }

      this.positionDummy = slotsData[this.instances[0].machineID].position;

      this.transformDummyOld.position = new Vector3(
        this.positionDummy[0],
        this.positionDummy[1],
        this.positionDummy[2]
      );

      // move next dummy out of the scene (after 2 second delay)
      if (leastDistance === 0) {
        this.transformDummyNew = this.instances[-1].machine.getComponent(
          Transform
        );
      } else {
        this.transformDummyNew = this.instances[
          leastDistance
        ].machine.getComponent(Transform);
      }
      delay.addComponentOrReplace(
        new utils.Delay(2000, () => {
          this.transformDummyNew.position = new Vector3(0, -100, 0);
        })
      );

      // position, rotate, and swap models for the active machine
      this.repositionActiveMachine(leastDistance);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // position, rotate, and swap models for the active machine
  repositionActiveMachine(leastDistance) {
    // if wheels are spinning stop them and don't reposition on update()
    this.instances[0].wheelsSpin1 = false;
    this.instances[0].wheelsSpin2 = false;
    this.instances[0].wheelsSpin3 = false;

    this.transformActive = this.instances[0].machine.getComponent(Transform);
    this.transformWheel1 = this.instances[0].wheel1.getComponent(Transform);
    this.transformWheel2 = this.instances[0].wheel2.getComponent(Transform);
    this.transformWheel3 = this.instances[0].wheel3.getComponent(Transform);

    this.positionActive = slotsData[leastDistance].position;
    this.rotationActive = slotsData[leastDistance].yRotation;
    this.themeIDActive = slotsData[leastDistance].themeID;

    this.transformActive.position = new Vector3(
      this.positionActive[0],
      this.positionActive[1],
      this.positionActive[2]
    );
    this.transformActive.rotation = Quaternion.Euler(0, this.rotationActive, 0);

    // changing the theme causes a lag, so only do it if necessary
    if (this.themeID !== this.themeIDActive) {
      // give the active machine's box and wheels a new theme
      this.instances[0].machine.addComponentOrReplace(
        new GLTFShape(
          'models/slots/slotMachine_' + this.themeIDActive + '_collider.gltf'
        )
      );
      // we do this twice to avoid non-update error
      this.instances[0].machine.addComponentOrReplace(
        new GLTFShape(
          'models/slots/slotMachine_' + this.themeIDActive + '_collider.gltf'
        )
      );

      // wheel 0 has no purpose other than to fix the first wheel replace model error
      this.instances[0].wheel0.addComponentOrReplace(
        new GLTFShape(
          'models/slots/slotMachineWheel_' + this.themeIDActive + '.gltf'
        )
      );
      this.instances[0].wheel1.addComponentOrReplace(
        new GLTFShape(
          'models/slots/slotMachineWheel_' + this.themeIDActive + '.gltf'
        )
      );
      this.instances[0].wheel2.addComponentOrReplace(
        new GLTFShape(
          'models/slots/slotMachineWheel_' + this.themeIDActive + '.gltf'
        )
      );
      this.instances[0].wheel3.addComponentOrReplace(
        new GLTFShape(
          'models/slots/slotMachineWheel_' + this.themeIDActive + '.gltf'
        )
      );

      this.themeID = this.themeIDActive;
    }

    this.transformWheel1.rotation = Quaternion.Euler(31, 180, 0);
    this.transformWheel2.rotation = Quaternion.Euler(67, 180, 0);
    this.transformWheel3.rotation = Quaternion.Euler(-5, 180, 0);

    // change numbers on the side of the box
    this.textNumberActive = new TextShape(leastDistance.toString());

    this.textNumberActive.color = Color3.White();
    this.textNumberActive.width = 10;
    this.textNumberActive.fontSize = 50;
    this.instances[0].machineNumber.addComponentOrReplace(
      this.textNumberActive
    );

    this.instances[0].machineID = leastDistance; // set the active machine's new id
  }
}
