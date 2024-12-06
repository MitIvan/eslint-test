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
        optionalServices: ['immediate_alert'], // Add the required service UUIDs here
      });

      if (!this.device.gatt) {
        throw new Error('GATT server is not available on the device.');
      }

      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('immediate_alert');
      const characteristic = await service.getCharacteristic('alert_level');
      const value = await characteristic.readValue();
      const batteryLevel = value.getUint8(0);

      return `Battery Level: ${batteryLevel}%`;
    } catch (error) {
      console.log(error);
      ;
    }
  }

  async writeData(data: number): Promise<string | undefined | void> {
    try {
      if (!this.device || !this.device.gatt.connected) {
        throw new Error('No connected device. Please connect to a device first.');
      }

      // Access the GATT server
      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('immediate_alert');
      const characteristic = await service.getCharacteristic('alert_level');

      // Write the data (e.g., alert level: 0x00, 0x01, or 0x02)
      const dataToSend = new Uint8Array([data]);
      await characteristic.writeValue(dataToSend);

      console.log(`Data written successfully: ${data}`);
    } catch (error) {
      console.error('Write Error:', error);
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