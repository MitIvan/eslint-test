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
        filters: [
          { 
            services : ['77370001-9156-09be-554f-63b16824d02b']
          }
        ]
        // optionalServices: ['77370001-9156-09be-554f-63b16824d02b'], // Add the required service UUIDs here
      });

      // if (!this.device.gatt) {
      //   throw new Error('GATT server is not available on the device.');
      // }

      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('77370001-9156-09be-554f-63b16824d02b');
      const characteristic = await service.getCharacteristic('77370003-9156-09be-554f-63b16824d02b');
      // const value = await characteristic.readValue();
      // const data = value.getUint8(0);

      await characteristic.startNotifications();

      if (characteristic.properties.notify) {
        characteristic.addEventListener(
          "characteristicvaluechanged",
          (event: Event) => {
            const target = event.target as any
            const value = target.value
            this.handleNotification(value)
          },
        );
       
      }

      return `Battery Level: %`;
    } catch (error) {
      console.log(error);
      ;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleNotification(value: any){
  const hex = Array.from(new Uint8Array(value.buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('Received hex value:', hex);
  
    console.log(value);
    
  }

  async writeData(): Promise<string | undefined | void> {
    try {
      if (!this.device || !this.device.gatt.connected) {
        throw new Error('No connected device. Please connect to a device first.');
      }

      // Access the GATT server
      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('77370001-9156-09be-554f-63b16824d02b');
      const characteristic = await service.getCharacteristic('77370002-9156-09be-554f-63b16824d02b');

      // Write the data (e.g., alert level: 0x00, 0x01, or 0x02)
      const dataToSend = this.hexStringToUint8Array('0x100210000134120d0000000d0000007856321003');
      await characteristic.writeValue(dataToSend);

      console.log(`Data written successfully: ${dataToSend}`);
    } catch (error) { 
      console.error('Write Error:', error);
    }
  }

   hexStringToUint8Array(hexString:string) {
    let bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes;
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