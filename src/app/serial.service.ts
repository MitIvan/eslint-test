import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const navigator: any;

const options = {
  baudRate: 4800,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  flowControl: 'hardware',
};
const readFirmware = [0x0f, 0x00, 0x01, 0x00, 0x00, 0xf1];
// const readFirmwareExt =
// [
//     0x0F, 0x00, 0x1C, 0x00, 0x0E, 0xE2, 0x00, 0x00,
//     0x00, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//     0x00, 0x00, 0x00, 0x00, 0x6F,
// ];

@Injectable({
  providedIn: 'root',
})
export class SerialService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private port: any | null = null;

  // Request a serial port
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async requestPort(): Promise<any> {
    if (!('serial' in navigator)) {
      alert('Web Serial API is not supported in this browser.');
      return null;
    }

    try {
      const port = await navigator.serial.requestPort();
      this.port = port;
      console.log('Selected port:', port);
      return port;
    } catch (error) {
      console.error('Failed to request port:', error);
      return null;
    }
  }

  // Open the serial port
  async openPort(): Promise<void> {
    if (!this.port) {
      console.error('No port selected.');
      return;
    }
    try {
      await this.port.open(options);
      const info = this.port.getInfo();
      console.log(info);
      console.log('Port opened!');
    } catch (error) {
      console.error('Failed to open port:', error);
    }
  }

  // Read data from the serial port
  async readData(): Promise<void> {
    if (!this.port || !this.port.readable) {
      console.error('No readable port available.');
      return;
    }

    const reader = this.port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        console.log('read', value);

        if (done) break;
        console.log('Received data:', value);
      }
    } catch (error) {
      console.error('Error reading data:', error);
    } finally {
      reader.releaseLock();
    }
  }

  // Write data to the serial port
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  async writeData(): Promise<void> {
    if (!this.port || !this.port.writable) {
      console.error('No writable port available.');
      return;
    }

    const writer = this.port.writable.getWriter();
    const stringify = JSON.stringify(readFirmware);
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(stringify);

    try {
      await writer.write(encodedData);
      console.log(this.port);

      console.log('Data sent:', encodedData);
    } catch (error) {
      console.error('Error writing data:', error);
    } finally {
      writer.releaseLock();
    }
  }

  // Close the serial port
  async closePort(): Promise<void> {
    if (!this.port) {
      console.error('No port to close.');
      return;
    }

    try {
      await this.port.close();
      console.log('Port closed!');
    } catch (error) {
      console.error('Error closing port:', error);
    }
  }
}
