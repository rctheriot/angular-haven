import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef,
} from '@angular/core';
import { Group, PaperScope, Raster, Project, Path, Point, Size, PointText, Gradient, GradientStop, Color, PathItem } from 'paper';
import * as firebase from 'firebase';
import * as stringtable from 'string-table';

import { HavenAppInterface } from '../../../../haven-apps-shared/haven-app-interface';


@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.css'],
  animations: []
})
export class GardenComponent implements HavenAppInterface, OnInit {

  appInfo: any;
  stations;
  state = 'inactive';
  loaded: boolean;
  size: [number, number];
  data = {};
  flowers = new Array();
  gcCount = 0;
  animeCount;
  plants;
  query: any;

  @ViewChild('chart') chartDiv: ElementRef;
  @ViewChild('myCanvas') canvasElement: ElementRef;
  @ViewChild('leaf') leafElement;
  @ViewChild('drop') dropElement;
  scope: PaperScope;
  project: Project;

  constructor(private changeDetector: ChangeDetectorRef) {
    this.loaded = false;
  }

  ngOnInit() {
    this.stations = new Array();
    this.scope = new PaperScope();
    this.animeCount = 0;

    this.query = this.appInfo.query.firestoreQuery;
    console.log(this.query);
    firebase.database().ref().child(`/key/`).once('value').then((stations) => {
      stations.forEach(station => {
        this.stations.push({ type: station.val().type, id: station.key, resource: station.val().resource });
      });
    }).then(() => {
      switch (this.query.type) {
        case 'capacity':
          this.GardenizeCapacity(this.query.scenario);
          break;
        /*case 'supply':
          this.GardenizeSupply();
          break;*/
        default:
          break;
      }
    });
  }

  // tslint:disable-next-line:one-line
  GardenizeCapacity(sce) {
    const data = {};
    firebase.database().ref().child(`/scenarios/`).child(`/${sce}/`).child('capacity').once('value').then((years) => {
      years.forEach(year => {
        const yr = year.key;
        year.forEach(id => {
          const type = this.getStationType(id.key);
          if (!data[yr]) { data[yr] = {}; }
          if (!data[yr][type]) { data[yr][type] = 0; }
          data[yr][type] += parseFloat(id.val());
        });
      });
    }).then(() => {
      this.data = data;
    }).then(() => {
      // tslint:disable-next-line:one-line
      for (let i = 2016; i <= 2045; i++) {
        if (this.data[i].hasOwnProperty('Offshore Wind')) {
          this.flowers.push({
            solar: Number(this.data[i]['Solar']),
            bio: Number(this.data[i]['Biofuel'] + this.data[i]['Biomass']),
            wind: Number(this.data[i]['Wind'] + this.data[i]['Offshore Wind']),
            hydro: 60,
            fossil: Number(this.data[i]['Fossil'])
          });
        }
        // tslint:disable-next-line:one-line
        else {
          this.flowers.push({
            solar: Number(this.data[i]['Solar']),
            bio: Number(this.data[i]['Biofuel'] + this.data[i]['Biomass']),
            wind: Number(this.data[i]['Wind']),
            hydro: 60,
            fossil: Number(this.data[i]['Fossil'])
          });
        }
      }

      for (let m = 0; m < this.flowers.length; m++) {
        this.flowers[m].shine = Math.random();
      }
    }).then(() => {
      this.imageLoader();
    });
  }

  GardenizeSupply() {
    const dateQuery = `/${this.query.year}/${this.query.month}/${this.query.day}/`;
    const capacity = {};
    const demand = {};
    const profile = {};
    const data = {};
    firebase.database().ref().child(`/scenarios/`).child(this.query.scenario).child('capacity').child(`/${this.query.year}/`).once('value').then((cap) => {
      cap.forEach(c => {
        if (!data['capacity']) { data['capacity'] = {}; }
        data['capacity'][c.key] = c.val();
      })
    }).then(() => {
      firebase.database().ref().child(`/scenarios/`).child(this.query.scenario).child('demand').child(dateQuery).once('value').then((dem) => {
        dem.forEach(d => {
          if (!data['Demand']) { data['Demand'] = {}; }
          data['Demand'][d.key] = Number(d.val());
          if (!data['Fossil']) { data['Fossil'] = {}; }
          data['Fossil'][d.key] = Number(d.val());
        })
      }).then(() => {
        firebase.database().ref().child(`/profiles/`).child(dateQuery).once('value').then((prof) => {
          profile[prof.key] = prof.val();
        }).then(() => {
          for (const key in profile) {
            if (profile[key].hasOwnProperty(key)) { continue; }
            for (let i = 0; i < profile[key].length; i++) {
              const time = i;
              for (const id in data['capacity']) {
                if (data['capacity'][id].hasOwnProperty(id)) { continue; }
                const resource = this.getStationResource(Number(id));
                const type = this.getStationType(Number(id));
                if (resource === 'Fossil') { continue; }
                if (!data['capacity'][id]) { continue; }
                const percent = profile[key][time][resource];
                const cap = data['capacity'][id];
                let supply = percent * cap;
                if (Number.isNaN(supply)) { supply = 0; }
                if (!data[type]) { data[type] = {}; }
                if (!data[type][time]) { data[type][time] = 0; }
                data[type][time] += supply;
                data['Fossil'][time] -= supply;
                data['Fossil'][time] = Math.max(data['Fossil'][time], 0);

              }
            }
          }
          delete data['capacity'];
        }).then(() => {
          // How to Render?
        });
      })
    });
  }

  getStationType(id) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i].id === id) {
        return this.stations[i].type;
      }
    }
  }

  getStationResource(id) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i].id === id) { return this.stations[i].resource; }
    }
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  imageLoader() {
    let count = 0;
    this.leafElement.nativeElement.src = './assets/images/resizedLeaf4.png';
    this.dropElement.nativeElement.src = './assets/images/resizedDrop.png';
    this.loaded = true;
    this.changeDetector.detectChanges();
    this.leafElement.nativeElement.addEventListener('load', () => {
      count++;
      if (count === 2) {
        if (this.query.type === 'capacity') {
          this.renderCapacity();
        }
      }
    }, false);

    this.dropElement.nativeElement.addEventListener('load', () => {
      count++;
      if (count === 2) {
        if (this.query.type === 'capacity') {
          this.renderCapacity();
        }
      }
    }, false);

  }

  // tslint:disable-next-line:one-line
  FlowerGenerate(flowers, count, ordering, year, scenario, showInfo) {
    const mwH = 'MWh';
    const htable = stringtable.create(
      [{ Type: 'Year', val: year },
      { Type: 'Scenario', val: scenario }],
      {
        headerSeparator: ' ',
        outerBorder: ' ',
        innerBorder: ' '
      }
    )

    const ttable = stringtable.create(
      [{ Type: 'Solar', val: Math.round(flowers['solar']), Un: mwH },
      { Type: 'Wind', val: Math.round(flowers['wind']), Un: mwH },
      { Type: 'Hydro', val: Math.round(flowers['hydro']), Un: mwH },
      { Type: 'Bio', val: Math.round(flowers['bio']), Un: mwH },
      { Type: 'Fossil', val: Math.round(flowers['fossil']), Un: mwH },
      { Type: 'Energy ', val: Math.round(flowers['shine'] * 100), Un: '%' }],
      {
        headerSeparator: ' ',
        outerBorder: ' ',
        innerBorder: ' '
      });
    let group;
    const sunFlower = new Path.Circle(new Point(45, 110), 40);
    let cloneSolar;
    sunFlower.fillColor = '#FF6A33';
    const total = flowers.solar + flowers.bio + flowers.wind + flowers.hydro + flowers.fossil;
    // tslint:disable-next-line:one-line
    const solar = (flowers.solar / total);
    if (solar <= 100) {
      cloneSolar = sunFlower.clone();
      cloneSolar.scale(solar);
      sunFlower.strokeColor = 'lightblue';
      sunFlower.strokeWidth = 4;
      sunFlower.fillColor = 'lightblue';
      sunFlower.opacity = 0;
      cloneSolar.bounds.bottomCenter = new Point(sunFlower.bounds.bottomCenter.x, sunFlower.bounds.bottomCenter.y - 9);
      group = new Group([sunFlower, cloneSolar]);
    }
    // tslint:disable-next-line:one-line
    else {
      group = new Group([sunFlower]);
    }
    let combine;
    const leaf = new Raster(this.leafElement.nativeElement);
    leaf.position = new Point(0, 220);

    // tslint:disable-next-line:prefer-const
    let bio = flowers.bio / total;
    // tslint:disable-next-line:one-line
    if (bio <= 100) {
      const cloneleaf = leaf.clone();
      cloneleaf.scale(bio);
      // tslint:disable-next-line:one-line
      if (bio < 74) {
        cloneleaf.position.x += 4;
      }
      // tslint:disable-next-line:one-line
      if (bio < 65) {
        cloneleaf.position.x += 4;
      }
      // tslint:disable-next-line:one-line
      if (bio < 54) {
        cloneleaf.position.x += 4;
      }
      // tslint:disable-next-line:one-line
      if (bio < 46) {
        cloneleaf.position.x += 4;
      }
      // tslint:disable-next-line:one-line
      if (bio < 38) {
        cloneleaf.position.x += 4;
      }
      // tslint:disable-next-line:one-line
      if (bio < 30) {
        cloneleaf.position.x += 4;
      }
      // tslint:disable-next-line:one-line
      if (bio < 22) {
        cloneleaf.position.x += 4;
      }
      leaf.opacity = 0;
      combine = new Group([group, leaf, cloneleaf]);
    }
    // tslint:disable-next-line:one-line
    else {
      combine = new Group([group, leaf]);
    }

    // const stem = new Path.Rectangle(new Point(combine.bounds.center.x + 18, combine.bounds.center.y - 20), new Size(20, 150));
    const stem = new Path.Rectangle({
      topLeft: [combine.bounds.center.x + 18, combine.bounds.center.y - 20],
      bottomRight: [combine.bounds.center.x + 38, combine.bounds.center.y + 130],
      radius: 10
    });
    stem.fillColor = '#84AD32';
    combine.addChild(stem);
    const rotP = new Point(combine.bounds.bottomCenter.x + 28, combine.bounds.bottomCenter.y);

    const drop = new Raster(this.dropElement.nativeElement);

    drop.position.x = combine.bounds.rightCenter.x + 60;
    drop.position.y = combine.bounds.rightCenter.y + 60;
    combine.addChild(drop);

    const cloneDrop = drop.clone();
    cloneDrop.scale((flowers.hydro / total) * 10);
    drop.opacity = 0;
    combine.addChild(cloneDrop);

    let root;
    let cloneGround;

    const ground = new Path.Rectangle({
      topLeft: [20, 20],
      bottomRight: [220, 100],
      radius: 50
    });
    ground.fillColor = '#626262';
    ground.position = rotP;

    root = new Group([combine, ground]);

    combine.bringToFront();

    // tslint:disable-next-line:one-line
    cloneGround = ground.clone();
    cloneGround.scale(flowers.fossil / total);
    ground.opacity = 0;
    root.addChild(cloneGround);

    group.bringToFront();
    const doRot = true;


    let rotV = 35;
    const w = (flowers.wind / total) * 100;
    const combineClone = combine.clone();

    // tslint:disable-next-line:one-line
    if (doRot) {
      // tslint:disable-next-line:one-line
      if (w <= 100) {
        rotV -= (35 * (w / 100));
        combineClone.children[2].rotate(rotV, rotP);
        combineClone.children[5].children[1].rotate(rotV, rotP);
        combineClone.children[1].rotate(rotV, rotP);
        combine.opacity = 0;
        root.position.y += 10;
        // tslint:disable-next-line:one-line
        if (w < 100) {
          stem.bounds.height += 7;
          stem.bounds.y += 7;
          cloneGround.position.y += (w / 10);
        }
        // tslint:disable-next-line:one-line
      } else {
        combine.rotate(rotV, rotP);
        drop.rotate(-rotV);
      }
    }

    root.bounds.height = 190;
    root.bounds.width = 210;
    root.position = new Point(100, 130);


    const boundary = new Path.Rectangle(
      {
        topLeft: [root.bounds.topLeft.x, root.bounds.topLeft.y],
        bottomRight: [root.bounds.bottomRight.x, root.bounds.bottomRight.y],
        radius: 50
      });
    // root.bounds);
    boundary.bounds.height += 50;
    boundary.position.y -= 50;
    boundary.fillColor = '#FFFFFF';

    const center = new Point(root.bounds.topCenter.x - 30, cloneSolar.bounds.topCenter.y - 15);
    const points = 16;
    const radius1 = 16;
    const radius2 = 20;
    const star = new Path.Star(center, points, radius1, radius2);

    const gradient = new Gradient();
    gradient.stops = [new GradientStop(new Color(1, 0.84, 0), 0.2),
    new GradientStop(new Color(1, 1, 1), 0.45),
    new GradientStop(new Color(1, 0.65, 0), 1)];

    gradient.radial = true;

    const origin = star.position;
    const destination = star.bounds.rightCenter;

    const gradientColor = new Color(gradient, origin, destination);

    star.fillColor = gradientColor;

    star.rotate(15);

    star.scale(flowers.shine);

    star.opacity = flowers.shine;

    // root.addChild(star);
    // star.bringToFront();

    star.visible = false;

    boundary.sendToBack();

    let pointsValue, pointsValue2;

    if (scenario.length < 3) {
      pointsValue = [200, 0];
      pointsValue2 = [240, 80]
    } else if (scenario.length < 9) {
      pointsValue = [235, 0];
      pointsValue2 = [240, 80];
    } else {
      pointsValue = [245, 0];
      pointsValue2 = [240, 80];
    }

    const hInfo = new PointText({
      point: pointsValue,
      content: htable,
      fillColor: 'black',
      fontFamily: 'Lucida Console , Monaco, monospace',
      fontWeight: 'bold',
      fontSize: 10
    });

    const info = new PointText({
      point: pointsValue2,
      content: ttable,
      fillColor: 'black',
      fontFamily: 'Lucida Console , Monaco, monospace',
      fontWeight: ' ',
      fontSize: 10
    });

    const text = new PointText(new Point(boundary.bounds.topCenter.x - 15, boundary.bounds.topCenter.y + 40));
    text.justification = 'center';
    text.fillColor = 'black';
    text.fontFamily = 'Monaco';
    text.fontSize = 16;
    text.content = year;

    const OmegaRoot = new Group([root, boundary, text]);
    info.scale(1.7);
    hInfo.scale(1.7);
    info.visible = false;
    hInfo.visible = false
    if (showInfo) {

      OmegaRoot.addChild(info);
      OmegaRoot.addChild(hInfo);
      // const xpos = OmegaRoot.position.x;
      combineClone.bringToFront();
      root.bringToFront();
      // Group[Boundary,Text,info,hInfo,root]
      let hover;

      this.scope.settings.handleSize = 0;

      OmegaRoot.on('mouseenter', function () {
        hover = OmegaRoot.clone();

        hover.bringToFront();
        hover.children[4].visible = false;
        hover.children[1].visible = false;
        hover.children[2].justification = 'right';
        hover.children[2].visible = true;
        hover.children[3].justification = 'right';
        hover.children[3].visible = true;
        hover.children[0].position.x -= 30;
        // hover.children[0].fillColor = '#FFFFFF';
        // boundary.strokeWidth = 5;
        // boundary.strokeColor = 'black';
        boundary.selected = true;
        boundary.selectedWidth = 20;
        boundary.selectedColor = '#000000'
        boundary.opacity = 0;
        boundary.bringToFront();
        // tslint:disable-next-line:one-line

        if (year <= 2035) {
          hover.position.x += hover.bounds.width;
        } else {
          hover.position.x -= hover.bounds.width - 65;
        }

      });


      // When the mouse leaves the item, set its fill color to black
      // and remove the mover function:
      OmegaRoot.on('mouseleave', function () {
        hover.visible = false;
        boundary.selected = false;
        // boundary.strokeWidth = 0;
        boundary.opacity = 1;
        boundary.sendToBack();
      });
    } else {
      combineClone.bringToFront();
      root.bringToFront();
    }
    // OmegaRoot.position.y += 30;

    return OmegaRoot;

  }
  // tslint:disable-next-line:one-line
  renderCapacity() {
    // Get a reference to the canvas object
    // const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    const canvas = <HTMLCanvasElement>this.canvasElement.nativeElement;
    this.scope.setup(canvas);
    this.plants = new Group();
    // tslint:disable-next-line:no-shadowed-variable
    for (let i = 0; i < this.flowers.length; i += 4) {
      this.plants.addChild(this.FlowerGenerate(this.flowers[i + 1], i + 1, i + 1, 2016 + i + 1, this.query.scenario, true));
      this.plants.children[i / 4].position.x += (i / 4) * this.plants.children[i / 4].bounds.width + 20;
    }
    // tslint:disable-next-line:one-line
    // }

    this.plants.position = this.scope.view.center;

    // double the zize of the text and move the years above plant, move hover to another box on side
    this.scope.view.draw();
  }

  renderSupply() {
    // Get a reference to the canvas object
    // const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    const canvas = <HTMLCanvasElement>this.canvasElement.nativeElement;
    this.scope.setup(canvas);
    this.plants = new Group();
    // tslint:disable-next-line:no-shadowed-variable
    for (let i = 0; i < this.flowers.length; i++) {
      this.plants.addChild(this.FlowerGenerate(this.flowers[i + 1], i + 1, i + 1, 2016 + i + 1, this.query.scenario, true));
      this.plants.children[i].position.x += (i) * this.plants.children[i / 4].bounds.width + 20;
    }
    // tslint:disable-next-line:one-line
    // }

    this.plants.position = this.scope.view.center;

    // double the zize of the text and move the years above plant, move hover to another box on side
    this.scope.view.draw();
  }

  public resize() {
    if (this.loaded === true) {
      const height = this.chartDiv.nativeElement.getBoundingClientRect().height;
      const width = this.chartDiv.nativeElement.getBoundingClientRect().width;
      const canvas = <HTMLCanvasElement>this.canvasElement.nativeElement;
      const originalBounds = 1728 + 287;
      // canvas.width = width;
      // canvas.height = height;
      this.renderCapacity();
      this.plants.scale((width + height) / originalBounds);
    }
  }
}
