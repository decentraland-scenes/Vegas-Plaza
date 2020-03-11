import slotsData from './slotsData';

const camera = Camera.instance;

export class Distances {
  instances;

  physicsCast = PhysicsCast.instance;
  arraySlotsData = [];
  arrayDistances = [];
  distance: number = 0;
  shortestDistance: number = 0;
  cameraPosition: Vector3;
  slotsPosition: Vector3;

  constructor(instances) {
    this.instances = instances;

    this.arraySlotsData = slotsData;
  }

  update() {
    this.cameraPosition = camera.position;
    this.arrayDistances = [];

    // loop through the positions array and find the shortest distance
    this.arraySlotsData.map(item => {
      this.distance = this.getDistances(item.position);
      this.arrayDistances.push(this.distance);
    });

    const leastDistance = this.indexSmallest(this.arrayDistances);

    this.instances.positionDummyMachines(leastDistance);
  }

  getDistances(item) {
    this.slotsPosition = new Vector3(item[0], item[1], item[2]);

    let rayFromPoints = this.physicsCast.getRayFromPositions(
      this.cameraPosition,
      this.slotsPosition
    );

    return rayFromPoints.distance;
  }

  indexSmallest(array) {
    let lowest = 0;

    for (let i = 1; i < array.length; i++) {
      if (array[i] < array[lowest]) lowest = i;
    }

    return lowest;
  }
}
