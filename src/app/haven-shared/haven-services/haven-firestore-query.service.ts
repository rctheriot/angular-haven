import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { HavenFirestoreQuery } from './haven-firestore-query';
import { HavenWindow } from '../../haven-window/haven-window-shared/haven-window';
import { HavenApp } from '../../haven-apps/haven-apps-shared/haven-app';
import { HavenWindowService } from '../../haven-window/haven-window-services/haven-window.service';
import { PlotlyQuery } from '../../haven-apps/haven-apps/haven-plotly/haven-plotly-shared/plotlyQuery';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';

@Injectable()
export class HavenFirestoreQueryService {

  private keys = [];
  private dbRef;

  constructor(private db: AngularFirestore, private havenWindowService: HavenWindowService) {
    this.dbRef = this.db.collection('data').doc('haven2017');
    this.dbRef.collection('key', ref => ref
      .orderBy('id', 'asc'))
      .snapshotChanges().take(1).subscribe(keys => {
        keys.forEach(key => {
          this.keys.push(key.payload.doc.data());
        })
      })
  }

  public getCapacity(query: HavenFirestoreQuery): Promise<any> {
    const data = {};
    return this.getCapacityData(query).then(capacityData => {
      capacityData.forEach(cap => {
        const year = cap[0];
        const capData = cap[1];
        capData.forEach(station => {
          const currStation = this.getStationById(station.id);
          if (currStation) {
            if (!data[year]) { data[year] = {} }
            if (!data[year][currStation.type]) { data[year][currStation.type] = 0 }
            data[year][currStation.type] += station.capacity;
          }
        });
      });
      return Promise.resolve(data);
    })
  }

  public getLoad(query: HavenFirestoreQuery): Promise<any> {
    let data = {};
    return this.getLoadData(query).then(loadData => {
      loadData.forEach(load => {
        data[load[0]] = { 'Load': load[1] };
      });
      data = this.consolidateData(data, query);
      return Promise.resolve(data);
    })
  }

  public getNetLoad(query: HavenFirestoreQuery): Promise<any> {
    const data = [];
    return this.getCapacityData(query).then(capacityData => {
      return this.getLoadData(query).then(loadData => {
        return this.getProfileData(query).then(profileData => {
          profileData.forEach(profileDataPoint => {
            const time = profileDataPoint[0];
            const year = time.getFullYear();
            const profiles = profileDataPoint[1];
            const load = loadData.find(element => element[0].getTime() === time.getTime())[1];
            const capacity = capacityData.find(element => element[0] === year)[1];
            data.push([time, load]);
            capacity.forEach(el => {
              const profile = profiles[el.resource];
              if (profile != null) {
                const supply = profile * el.capacity;
                data[data.length - 1][1] -= supply;
              }
            })
          })
          data.sort((a, b) => b[1] - a[1]);
          const objectData = {};
          data.forEach(el => {
            objectData[el[0]] = { Load: el[1] };
          })
          return Promise.resolve(objectData);
        })
      })
    })
  }

  public getNetLoad3D(query: HavenFirestoreQuery): Promise<any> {
    const data = [];
    return this.getCapacityData(query).then(capacityData => {
      return this.getLoadData(query).then(loadData => {
        return this.getProfileData(query).then(profileData => {
          profileData.forEach(profileDataPoint => {
            const time = profileDataPoint[0];
            const year = time.getFullYear();
            const profiles = profileDataPoint[1];
            const load = loadData.find(element => element[0].getTime() === time.getTime())[1];
            const capacity = capacityData.find(element => element[0] === year)[1];
            data.push([time, load]);
            capacity.forEach(el => {
              const profile = profiles[el.resource];
              if (profile != null) {
                const supply = profile * el.capacity;
                data[data.length - 1][1] -= supply;
              }
            })
          });
          let objectData = {};
          data.forEach(el => {
            objectData[el[0]] = { Load: el[1] };
          })
          query.scope = 'daily';
          query.consolidate = false;
          objectData = this.consolidateData(objectData, query);
          return Promise.resolve(objectData);
        })
      })
    })
  }

  public getNetLoadDaily(query: HavenFirestoreQuery): Promise<any> {
    let data = {};
    return this.getCapacityData(query).then(capacityData => {
      return this.getLoadData(query).then(loadData => {
        return this.getProfileData(query).then(profileData => {
          profileData.forEach(profileDataPoint => {
            const time = profileDataPoint[0];
            const year = time.getFullYear();
            const profiles = profileDataPoint[1];
            const load = loadData.find(element => element[0].getTime() === time.getTime())[1];
            const capacity = capacityData.find(element => element[0] === year)[1];
            data[time] = {};
            data[time]['NetLoad'] = load;
            capacity.forEach(el => {
              const profile = profiles[el.resource];
              if (profile != null) {
                const newStation = {}
                const supply = profile * el.capacity;
                data[time]['NetLoad'] -= supply;
              }
            })
          })
          data = this.consolidateData(data, query);
          return Promise.resolve(data);
        })
      })
    })
  }


  public getSupply(query: HavenFirestoreQuery): Promise<any> {
    let data = {};
    return this.getCapacityData(query).then(capacityData => {
      return this.getLoadData(query).then(loadData => {
        return this.getProfileData(query).then(profileData => {
          return this.getFossilSupplyData(query).then(fossilSupplyData => {
            profileData.forEach(profileDataPoint => {
              const time = profileDataPoint[0];
              const year = time.getFullYear();
              const profiles = profileDataPoint[1];
              const load = loadData.find(element => element[0].getTime() === time.getTime())[1];
              const capacity = capacityData.find(element => element[0] === year)[1];
              const fossilSupply = fossilSupplyData.find(element => element[0].getTime() === time.getTime())[1];
              data[time] = {};
              data[time]['Fossil'] = (fossilSupply.Coal + fossilSupply.Diesel + fossilSupply.LSFO + fossilSupply.ULSD);
              // data[time]['Load'] = load;
              capacity.forEach(el => {
                const profile = profiles[el.resource];
                if (profile != null) {
                  const newStation = {}
                  if (!data[time][el.type]) { data[time][el.type] = 0; }
                  const supply = profile * el.capacity;
                  data[time][el.type] += supply;
                }
              })
              data[time]['BioFuel'] = fossilSupply.BioMass + fossilSupply.BioDiesel;
            })
            data = this.consolidateData(data, query);
            return Promise.resolve(data);
          })
        })
      })
    })
  }

  public getSolarYearlyMW(query: HavenFirestoreQuery): Promise<any> {
    let value = 0;
    query.scope = 'monthly';
    return this.getCapacityData(query).then(capacityData => {
      return this.getProfileData(query).then(profileData => {
        profileData.forEach(profileDataPoint => {
          const time = profileDataPoint[0];
          const year = time.getFullYear();
          const profiles = profileDataPoint[1];
          const capacity = capacityData.find(element => element[0] === year)[1];
          capacity.forEach(el => {
            const profile = profiles[el.resource];
            if (profile != null && (el.station === 'FuturePV' || el.station === 'CBRE PV')) {
              const supply = profile * el.capacity;
              value += supply;
            }
          })
        })
        return Promise.resolve(value);
      })
    })
  }

  public getWindYearlyMW(query: HavenFirestoreQuery): Promise<any> {
    let value = 0;
    return this.getCapacityData(query).then(capacityData => {
      return this.getProfileData(query).then(profileData => {
        profileData.forEach(profileDataPoint => {
          const time = profileDataPoint[0];
          const year = time.getFullYear();
          const profiles = profileDataPoint[1];
          const capacity = capacityData.find(element => element[0] === year)[1];
          capacity.forEach(el => {
            const profile = profiles[el.resource];
            if (profile != null && (el.station === 'FutureWind')) {
              const supply = profile * el.capacity;
              value += supply;
            }
          })
        })
        return Promise.resolve(value);
      })
    })
  }

  private getCapacityData(query: HavenFirestoreQuery): Promise<any> {
    const capacityData = [];
    return firebase.firestore().collection('data').doc('haven2017').collection('scenarios').doc(query.scenario).collection('capacity').orderBy('year', 'asc')
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const year = doc.data().year;
          let stations = doc.data().stations;
          stations.forEach((el) => {
            const station = this.getStationById(el.id);
            if (station) {
              el['resource'] = station['resource'];
              el['type'] = station['type'];
            }
          })
          stations = stations.filter((el) => (el['resource'] || el['type']));
          capacityData.push([year, stations]);
        });
        capacityData.sort((a, b) => a[0] - b[0]);
        console.log(capacityData);
      }).then(() => Promise.resolve(capacityData));
  }

  private getLoadData(query: HavenFirestoreQuery): Promise<any> {
    const loadData = [];
    let firebaseRef = null;
    switch (query.scope) {
      case 'yearly':
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('loads').doc(query.load).collection('loads')
        break;
      case 'monthly':
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('loads').doc(query.load).collection('loads').where('year', '==', query.year)
        break
      case '8760':
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('loads').doc(query.load).collection('loads').where('year', '==', query.year)
        break
      default:
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('loads').doc(query.load).collection('loads').where('year', '==', query.year).where('month', '==', query.month);
        break;
    }
    return firebaseRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.data().loads.forEach(el => {
          if (this.scopeCheck(el.time, query.scope, query.year, query.month, query.day)) {
            loadData.push([new Date(el.time), el.load]);
          }
        })
      });
      loadData.sort((a, b) => a[0] - b[0]);
    }).then(() => Promise.resolve(loadData));
  }


  private getProfileData(query: HavenFirestoreQuery): Promise<any> {
    const profileData = [];
    let firebaseRef = null;
    switch (query.scope) {
      case 'yearly':
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('profiles')
        break;
      case 'monthly':
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('profiles').where('year', '==', query.year)
        break
      default:
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('profiles').where('year', '==', query.year).where('month', '==', query.month);
        break;
    }
    return firebaseRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.data().profiles.forEach(el => {
          if (this.scopeCheck(el['Time'], query.scope, query.year, query.month, query.day)) {
            const time = new Date(el['Time']);
            delete el['Time'];
            profileData.push([time, el]);
          }
        })
      });
      profileData.sort((a, b) => a[0] - b[0]);
    }).then(() => Promise.resolve(profileData));
  }

  private getFossilSupplyData(query: HavenFirestoreQuery): Promise<any> {
    const fossilSupplyData = [];
    let firebaseRef = null;
    switch (query.scope) {
      case 'yearly':
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('scenarios').doc(query.scenario).collection('fossilsupply')
        break;
      case 'monthly':
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('scenarios').doc(query.scenario).collection('fossilsupply').where('year', '==', query.year)
        break
      default:
        firebaseRef = firebase.firestore().collection('data').doc('haven2017').collection('scenarios').doc(query.scenario).collection('fossilsupply').where('year', '==', query.year).where('month', '==', query.month);
        break;
    }
    return firebaseRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.data().profiles.forEach(el => {
          if (this.scopeCheck(el['Time'], query.scope, query.year, query.month, query.day)) {
            const time = new Date(el['Time']);
            delete el['Time'];
            fossilSupplyData.push([time, el]);
          }
        })
      });
      fossilSupplyData.sort((a, b) => a[0] - b[0]);
    }).then(() => Promise.resolve(fossilSupplyData));
  }

  private consolidateData(data: any, query: any) {
    const consData = {};
    switch (query.scope) {
      case 'yearly':
        for (const date in data) {
          const dateVar = new Date(date);
          const year = (query.consolidate) ?
            `${dateVar.getFullYear()}` :
            `${dateVar.getFullYear()}-${this.padZero(dateVar.getMonth() + 1)}`;
          const d = data[date];
          if (!consData[year]) { consData[year] = {} }
          for (const el in d) {
            if (!consData[year][el]) { consData[year][el] = 0 }
            consData[year][el] += d[el];
          }
        }
        return consData;
      case 'monthly':
        for (const date in data) {
          const dateVar = new Date(date);
          const month = (query.consolidate) ?
            `${dateVar.getFullYear()}-${this.padZero(dateVar.getMonth() + 1)}` :
            `${dateVar.getFullYear()}-${this.padZero(dateVar.getMonth() + 1)}-${this.padZero(dateVar.getDate())}`;
          const d = data[date];
          if (!consData[month]) { consData[month] = {} }
          for (const el in d) {
            if (!consData[month][el]) { consData[month][el] = 0 }
            consData[month][el] += d[el];
          }
        }
        return consData;
      case '8760':
        for (const date in data) {
          const dateVar = new Date(date);
          const day = (query.consolidate) ?
            `${dateVar.getFullYear()}-${this.padZero(dateVar.getMonth() + 1)}-${this.padZero(dateVar.getDate())}` :
            `${dateVar.getFullYear()}-${this.padZero(dateVar.getMonth() + 1)}-${this.padZero(dateVar.getDate())} ${this.padZero(dateVar.getHours())}`;
          const d = data[date];
          if (!consData[day]) { consData[day] = {} }
          for (const el in d) {
            if (!consData[day][el]) { consData[day][el] = 0 }
            consData[day][el] += d[el];
          }
        }
        return consData;
      case 'daily':
        for (const date in data) {
          const dateVar = new Date(date);
          const day = (query.consolidate) ?
            `${dateVar.getFullYear()}-${this.padZero(dateVar.getMonth() + 1)}-${this.padZero(dateVar.getDate())}` :
            `${dateVar.getFullYear()}-${this.padZero(dateVar.getMonth() + 1)}-${this.padZero(dateVar.getDate())} ${this.padZero(dateVar.getHours())}`;
          const d = data[date];
          if (!consData[day]) { consData[day] = {} }
          for (const el in d) {
            if (!consData[day][el]) { consData[day][el] = 0 }
            consData[day][el] += d[el];
          }
        }
        return consData;
      case 'hourly':
        for (const date in data) {
          const hour = new Date(date).getHours();
          const d = data[date];
          if (!consData[hour]) { consData[hour] = {} }
          for (const el in d) {
            if (!consData[hour][el]) { consData[hour][el] = 0 }
            consData[hour][el] += d[el];
          }
        }
        return consData;
    }
  }

  private scopeCheck(time, scope, year, month, day): boolean {
    const date = time;
    switch (scope) {
      case 'yearly':
        return true;
      case 'monthly':
        return (date.getFullYear() === year);
      case '8760':
        return (date.getFullYear() === year);
      case 'daily':
        return (date.getFullYear() === year && date.getMonth() === month);
      case 'hourly':
        return (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day);
    }
  }

  public getStationById(id: number) {
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i].id === id) { return this.keys[i]; }
    }
    return null;
  }

  private padZero(n) {
    return (n < 10) ? ('0' + n) : n;
  }

}
