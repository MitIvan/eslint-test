import { Injectable, signal } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private ldClient: LDClient.LDClient | null = null;
  private flagValues: Record<string, boolean> = {};

  private _flagChange = signal<Record<string, boolean>>(null);

  _LDReady = signal<boolean>(false);

  initialize() {
    // const user = {
    //   anonymous: true
    // } as LDClient.LDUser;

    const context: LDClient.LDContext = {
      kind: 'user',
      key:'user'
    }
    
  
    this.ldClient = LDClient.initialize('67651a3a84ab1008f3aeebd9', context);

    this.ldClient.on('initialized', (flag) => {console.log('initialized', flag)});
    this.ldClient.waitUntilReady().then(() => {this._LDReady.set(true)}) // add loading spinner
    
    
   


    this.ldClient.on('change', (flags) => {      


      this.flagValues = Object.keys(this.flagValues).reduce((acc, key) => {
        if (key in flags) {
          acc[key] = flags[key].current;
        } else {
          acc[key] = this.flagValues[key];
        }
        return acc;
      }, {} as Record<string, boolean>);


      console.log(this.flagValues);
      
      console.log('change', flags);
      const newFlags = this.flagValues 
      console.log(newFlags);
      
      // this.flagValues = flags || {};
      this._flagChange.set(newFlags);
    });


    this.ldClient.on('ready', () => {
      this.flagValues = this.ldClient.allFlags() || {};
      this._flagChange.set(this.flagValues);
      
    });

    return this._flagChange;
  }

  

  getFeatureFlag(flagKey: string) {
    return this._flagChange() ? (this._flagChange() as Record<string, boolean>)[flagKey] : null;
  }

  shutdown() {
    if (this.ldClient) {
      this.ldClient.close();
    }
  }
}