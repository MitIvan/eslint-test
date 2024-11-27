import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const navigator: any;

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
  async openPort(baudRate = 9600): Promise<void> {
    if (!this.port) {
      console.error('No port selected.');
      return;
    }
    try {
      await this.port.open({ baudRate });
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
  async writeData(data: { id: number; name: string }): Promise<void> {
    if (!this.port || !this.port.writable) {
      console.error('No writable port available.');
      return;
    }

    const writer = this.port.writable.getWriter();
    const stringify = JSON.stringify(data);
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(stringify);

    try {
      await writer.write(encodedData);
      console.log('Data sent:', data);
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
