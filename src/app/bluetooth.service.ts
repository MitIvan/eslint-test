import { Injectable } from '@angular/core';

declare const navigator: any;


@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  private device: any

  async connect(): Promise<string | undefined | void> {
    try {
      // Request a Bluetooth device
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'], // Add the required service UUIDs here
      });

      if (!this.device.gatt) {
        throw new Error('GATT server is not available on the device.');
      }

      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const value = await characteristic.readValue();
      const batteryLevel = value.getUint8(0);

      return `Battery Level: ${batteryLevel}%`;
    } catch (error) {
      console.log(error);
      ;
    }
  }

  disconnect(): void {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
      console.log('Device disconnected');
    } else {
      console.log('No device to disconnect');
    }
  }
}