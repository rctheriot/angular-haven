import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { HavenFirestoreQuery } from './haven-firestore-query';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class HavenDateSelectorService {

  public profiles = {};

  public ScenarioProfilesSubs = {
    'e3': new Subject<ScenarioProfile>(),
    'postapril': new Subject<ScenarioProfile>(),
    'e3genmod': new Subject<ScenarioProfile>(),
  }

  public ScenarioProfiles = {
    'e3': ScenarioProfile,
    'postapril': ScenarioProfile,
    'e3genmod': ScenarioProfile,
  }

  constructor() {
    this.loadScenarioProfile('e3');
    this.loadScenarioProfile('postapril');
    this.loadScenarioProfile('e3genmod');
  }

  private loadScenarioProfile(scenario: string) {
    const profileData = [];
    firebase.firestore().collection('data').doc('haven2017').collection('scenarios').doc(scenario).collection('portfolio').orderBy('year', 'asc')
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const year = doc.data().year;
          const re = doc.data().re;
          const rps = doc.data().rps;
          profileData[year] = { re, rps, year };
        });
        this.profiles[scenario] = profileData;
      });
  }

  public setByRPS(rps: number) {
    for (const scenario in this.profiles) {
      let profile = this.profiles[scenario][0];
      this.profiles[scenario].forEach(el => {
        if (rps > el.rps) {
          profile = el;
        }
      })
      const prof = new ScenarioProfile(profile.year, profile.rps, profile.re);
      this.ScenarioProfiles[scenario] = prof;
    }
  }

  public setByRE(re: number) {
    for (const scenario in this.profiles) {
      let profile = this.profiles[scenario][0];
      this.profiles[scenario].forEach(el => {
        if (re > el.re) {
          profile = el;
        }
      })
      const prof = new ScenarioProfile(profile.year, profile.rps, profile.re);
      this.ScenarioProfiles[scenario] = prof;
    }
  }

  public UpdateProfiles(month: number, day: number) {
    for (const scenario in this.profiles) {
      this.ScenarioProfiles[scenario].month = month;
      this.ScenarioProfiles[scenario].day = day;
      this.ScenarioProfilesSubs[scenario].next(this.ScenarioProfiles[scenario]);
    }
  }

}

class ScenarioProfile {
  year: number;
  month: number;
  day: number;
  rps: number;
  re: number;

  constructor(year: number, rps: number, re: number) {
    this.year = year;
    this.rps = rps;
    this.re = re;
  }

}
