import { Injectable } from '@angular/core';
import { LAYERS } from './layers';

@Injectable()
export class LeaflayersService {

  constructor() { }

  getLayers(): Promise<any[]> {
    return Promise.resolve(LAYERS);
  }

  addLayer(layer: any) {
    LAYERS.push(layer);
  }

}
