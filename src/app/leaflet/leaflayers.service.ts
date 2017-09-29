import { Injectable } from '@angular/core';
import { LAYERS } from './layers';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class LeaflayersService {

  dod$: Observable<boolean>;
  private dodSub: Subject<boolean>;

  flood$: Observable<boolean>;
  private floodSub: Subject<boolean>;

  agr$: Observable<boolean>;
  private agrSub: Subject<boolean>;

  landuse$: Observable<boolean>;
  private landuseSub: Subject<boolean>;

  parks$: Observable<boolean>;
  private parksSub: Subject<boolean>;

  lava$: Observable<boolean>;
  private lavaSub: Subject<boolean>;

  constructor() {
    this.dodSub = new Subject<boolean>();
    this.dod$ = this.dodSub.asObservable();

    this.floodSub = new Subject<boolean>();
    this.flood$ = this.floodSub.asObservable();

    this.agrSub = new Subject<boolean>();
    this.agr$ = this.agrSub.asObservable();

    this.landuseSub = new Subject<boolean>();
    this.landuse$ = this.landuseSub.asObservable();

    this.parksSub = new Subject<boolean>();
    this.parks$ = this.parksSub.asObservable();

    this.lavaSub = new Subject<boolean>();
    this.lava$ = this.lavaSub.asObservable();
  }

  set dod(newValue) {
    this.dod$ = newValue;
    this.dodSub.next(newValue);
  }

  set flood(newValue) {
    this.flood$ = newValue;
    this.floodSub.next(newValue);
  }

  set agr(newValue) {
    this.agr$ = newValue;
    this.agrSub.next(newValue);
  }

  set landuse(newValue) {
    this.landuse$ = newValue;
    this.landuseSub.next(newValue);
  }

  set parks(newValue) {
    this.parks$ = newValue;
    this.parksSub.next(newValue);
  }

  set lava(newValue) {
    this.lava$ = newValue;
    this.lavaSub.next(newValue);
  }

  getLayers(): Promise<any[]> {
    return Promise.resolve(LAYERS);
  }

  addLayer(layer: any) {
    LAYERS.push(layer);
    return LAYERS.length - 1;
  }

  getLayer(index: number): Promise<any[]> {
    return Promise.resolve(LAYERS[index]);
  }

}
