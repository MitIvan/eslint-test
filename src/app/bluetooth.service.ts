import { Injectable } from '@angular/core';

// Declare navigator to access Bluetooth API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const navigator: any;

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private device: any;

  // Method to connect to a Bluetooth device
  async connect(): Promise<string | undefined | void> {
    try {
      // Request a Bluetooth device with specific service
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { 
            services : ['77370001-9156-09be-554f-63b16824d02b']
          }
        ]
      });

      // Check if GATT server is available
      if (!this.device.gatt) {
        throw new Error('GATT server is not available on the device.');
      }

      // Connect to the GATT server
      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('77370001-9156-09be-554f-63b16824d02b');
      const characteristic = await service.getCharacteristic('77370003-9156-09be-554f-63b16824d02b');

      // Start notifications for the characteristic
      await characteristic.startNotifications();

      // Add event listener for characteristic value changes
      if (characteristic.properties.notify) {
        characteristic.addEventListener(
          "characteristicvaluechanged",
          (event: Event) => {
            const target = event.target as any;
            const value = target.value;
            this.handleNotification(value);
          },
        );
      }

      return `Battery Level: %`;
    } catch (error) {
      console.log(error);
    }
  }

  // Method to write data to the Bluetooth device
  async writeData(): Promise<string | undefined | void> {
    try {
      // Check if device is connected
      if (!this.device || !this.device.gatt.connected) {
        throw new Error('No connected device. Please connect to a device first.');
      }

      // Access the GATT server
      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('77370001-9156-09be-554f-63b16824d02b');
      const characteristic = await service.getCharacteristic('77370002-9156-09be-554f-63b16824d02b');

      // Convert hex string to Uint8Array and write to characteristic
      const dataToSend = this.hexStringToUint8Array('0x100210000134120d0000000d0000007856321003');
      await characteristic.writeValue(dataToSend);

      console.log(`Data written successfully: ${dataToSend}`);
    } catch (error) { 
      console.error('Write Error:', error);
    }
  }

  // Method to disconnect from the Bluetooth device
  disconnect(): void {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
      console.log('Device disconnected');
    } else {
      console.log('No device to disconnect');
    }
  }

  // Helper method to convert hex string to Uint8Array
  private hexStringToUint8Array(hexString: string) {
    // Remove '0x' prefix if present
    const cleanHex = hexString.replace('0x', '');
    const bytes = new Uint8Array(cleanHex.length / 2);
    
    for (let i = 0; i < cleanHex.length; i += 2) {
      const byte = cleanHex.substr(i, 2).padStart(2, '0');
      bytes[i / 2] = parseInt(byte, 16);
    }
    return bytes;
  }

  // Method to handle notifications from the Bluetooth device
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleNotification(value: any) {
    const hex = Array.from(new Uint8Array(value.buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log('Received hex value:', hex);
    console.log(value);
  }
}