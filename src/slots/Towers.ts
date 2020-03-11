import towersData from './towersData';

export class Towers {
  tower: Entity;
  arrayTowers: any = [];
  arrayRotations: any = [];

  scaleText1;
  scaleText2;
  scaleText3;
  scaleText4;
  position: Vector3;

  slotMachineTower;
  towerAnimator: Animator;
  towerScrollState: AnimationState;

  constructor() {
    this.slotMachineTower = new GLTFShape(
      'models/slots/slot_machine_tower.glb'
    );

    this.arrayRotations.push([90, 243, 90]);
    this.arrayRotations.push([270, 63, 90]);
    this.arrayRotations.push([27, 180, 0]);
    this.arrayRotations.push([153, 180, 180]);

    this.scaleText1 = new Vector3(0.6, 0.6, 0.6);
    this.scaleText2 = new Vector3(0.5, 0.5, 0.5);
    this.scaleText3 = new Vector3(0.4, 0.4, 0.4);
    this.scaleText4 = new Vector3(0.3, 0.3, 0.3);

    this.createTowers();
  }

  updateText(jackpot1, jackpot2, jackpot3, jackpot4, coinName) {
    let textJackpot;

    for (let i = 0; i < this.arrayTowers.length; i++) {
      for (let j = 0; j < 4; j++) {
        textJackpot = new TextShape(jackpot1 + ' ' + coinName);
        textJackpot.vTextAlign = 'center';
        textJackpot.hTextAlign = 'center';
        textJackpot.color = new Color3(1, 1, 1);
        textJackpot.outlineWidth = 0.2;
        textJackpot.outlineColor = Color3.FromHexString('#0088ff');
        this.arrayTowers[i][j][0].addComponentOrReplace(textJackpot);

        textJackpot = new TextShape(jackpot2 + ' ' + coinName);
        textJackpot.vTextAlign = 'center';
        textJackpot.hTextAlign = 'center';
        textJackpot.color = new Color3(1, 1, 1);
        textJackpot.outlineWidth = 0.2;
        textJackpot.outlineColor = Color3.FromHexString('#0088ff');
        this.arrayTowers[i][j][1].addComponentOrReplace(textJackpot);

        textJackpot = new TextShape(jackpot3 + ' ' + coinName);
        textJackpot.vTextAlign = 'center';
        textJackpot.hTextAlign = 'center';
        textJackpot.color = new Color3(1, 1, 1);
        textJackpot.outlineWidth = 0.2;
        textJackpot.outlineColor = Color3.FromHexString('#0088ff');
        this.arrayTowers[i][j][2].addComponentOrReplace(textJackpot);

        textJackpot = new TextShape(jackpot4 + ' ' + coinName);
        textJackpot.vTextAlign = 'center';
        textJackpot.hTextAlign = 'center';
        textJackpot.color = new Color3(1, 1, 1);
        textJackpot.outlineWidth = 0.2;
        textJackpot.outlineColor = Color3.FromHexString('#0088ff');
        this.arrayTowers[i][j][3].addComponentOrReplace(textJackpot);
      }
    }
  }

  createTowers() {
    towersData.map((object, index) => {
      this.position = new Vector3(
        object.position[0],
        object.position[1],
        object.position[2]
      );

      const tower = new Entity();
      tower.addComponent(this.slotMachineTower);
      tower.addComponent(
        new Transform({
          position: this.position,
          scale: new Vector3(0.5, 0.5, 0.5)
        })
      );
      engine.addEntity(tower);
      this.tower = tower;

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // create the text elements on each display on each side of the tower
      let arrayDisplay: any = [];
      let toggle: number = 1;

      for (let i = 0; i < 4; i++) {
        let arrayText: any = [];

        const textElement1 = new Entity();
        const textElement2 = new Entity();
        const textElement3 = new Entity();
        const textElement4 = new Entity();

        if (i < 2) {
          textElement1.addComponent(
            new Transform({
              position: new Vector3(2.93 * toggle, 9.15, 0),
              rotation: Quaternion.Euler(
                this.arrayRotations[i][0],
                this.arrayRotations[i][1],
                this.arrayRotations[i][2]
              ),
              scale: this.scaleText1
            })
          );
          textElement2.addComponent(
            new Transform({
              position: new Vector3(2.62 * toggle, 8.5, 0),
              rotation: Quaternion.Euler(
                this.arrayRotations[i][0],
                this.arrayRotations[i][1],
                this.arrayRotations[i][2]
              ),
              scale: this.scaleText2
            })
          );
          textElement3.addComponent(
            new Transform({
              position: new Vector3(2.31 * toggle, 7.85, 0),
              rotation: Quaternion.Euler(
                this.arrayRotations[i][0],
                this.arrayRotations[i][1],
                this.arrayRotations[i][2]
              ),
              scale: this.scaleText3
            })
          );
          textElement4.addComponent(
            new Transform({
              position: new Vector3(2 * toggle, 7.25, 0),
              rotation: Quaternion.Euler(
                this.arrayRotations[i][0],
                this.arrayRotations[i][1],
                this.arrayRotations[i][2]
              ),
              scale: this.scaleText4
            })
          );
        } else {
          textElement1.addComponent(
            new Transform({
              position: new Vector3(0, 9.15, 2.93 * toggle),
              rotation: Quaternion.Euler(
                this.arrayRotations[i][0],
                this.arrayRotations[i][1],
                this.arrayRotations[i][2]
              ),
              scale: this.scaleText1
            })
          );
          textElement2.addComponent(
            new Transform({
              position: new Vector3(0, 8.5, 2.62 * toggle),
              rotation: Quaternion.Euler(
                this.arrayRotations[i][0],
                this.arrayRotations[i][1],
                this.arrayRotations[i][2]
              ),
              scale: this.scaleText2
            })
          );
          textElement3.addComponent(
            new Transform({
              position: new Vector3(0, 7.85, 2.31 * toggle),
              rotation: Quaternion.Euler(
                this.arrayRotations[i][0],
                this.arrayRotations[i][1],
                this.arrayRotations[i][2]
              ),
              scale: this.scaleText3
            })
          );
          textElement4.addComponent(
            new Transform({
              position: new Vector3(0, 7.25, 2 * toggle),
              rotation: Quaternion.Euler(
                this.arrayRotations[i][0],
                this.arrayRotations[i][1],
                this.arrayRotations[i][2]
              ),
              scale: this.scaleText4
            })
          );
        }

        textElement1.setParent(tower);
        engine.addEntity(textElement1);
        arrayText.push(textElement1);
        textElement2.setParent(tower);
        engine.addEntity(textElement2);
        arrayText.push(textElement2);
        textElement3.setParent(tower);
        engine.addEntity(textElement3);
        arrayText.push(textElement3);
        textElement4.setParent(tower);
        engine.addEntity(textElement4);
        arrayText.push(textElement4);

        arrayDisplay.push(arrayText); // add the text elements to the display array

        toggle = toggle * -1;
      }

      this.arrayTowers.push(arrayDisplay); // add each display array to the towers array

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // animate the frame lights/colors
      this.towerAnimator = new Animator();
      this.towerScrollState = new AnimationState('Scroll', { looping: true });
      this.towerAnimator.addClip(this.towerScrollState);
      this.tower.addComponent(this.towerAnimator);
      this.towerScrollState.play();
    });
  }
}
