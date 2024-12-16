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

@Injectable({
  providedIn: 'root',
})
export class SerialService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private port: any | null = null;

  // private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;

  async connect() {
    if (!('serial' in navigator)) {
      console.error('Web Serial API not supported.');
      return;
    }

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open(options);
      this.reader = this.port.readable.getReader();
      this.writer = this.port.writable.getWriter();
    } catch (error) {
      console.error('Failed to open serial port:', error);
    }
  }

  async disconnect() {
    if (this.reader) {
      await this.reader.cancel();
      this.reader.releaseLock();
    }
    if (this.writer) {
      await this.writer.close();
      this.writer.releaseLock();
    }
    if (this.port) {
      await this.port.close();
    }
  }

  async write(data: Uint8Array) {
    if (!this.writer) {
      throw new Error('Serial port not open');
    }
    console.log('Writing:', this.toHexString(data));
    await this.writer.write(data);
  }

  async read(ack: boolean): Promise<Uint8Array> {
    if (!this.reader) {
      throw new Error('Serial port not open');
    }

    const bytes: number[] = [];
    while (true) {
      const { value, done } = await this.reader.read();
      if (done || !value) break;

      for (const bt of value) {
        bytes.push(bt);

        switch (bytes[0]) {
          case 0x02:
            continue;

          case 0x17:
          case 0x18:
            throw new Error('Timeout');

          case 0x06:
            if (!ack) {
              throw new Error('Unexpected answer');
            }
            return new Uint8Array([0x06, bytes[0]]);

          case 0x0e:
          case 0x0f: {
            if (ack) {
              throw new Error('Unexpected answer');
            }
            if (bytes.length < 5) continue;

            const datalen = (bytes[3] << 8) + bytes[4] + 1;
            if (bytes.length < datalen + 6) continue;

            return new Uint8Array(bytes.slice(6, 6 + datalen));
          }

          default:
            return new Uint8Array([bt]);
        }
      }
    }

    return new Uint8Array(bytes);
  }

  repack(data: Uint8Array) {
    if (data[0] === 0x0e) return;

    const chkSum = (bytes: Uint8Array, n: number) => {
      return bytes.slice(0, n).reduce((a, b) => a ^ b, 0xff);
    };

    data[0] = 0x0e;
    data[5] = chkSum(data, 5);
  }

  private toHexString(byteArray: Uint8Array): string {
    return Array.from(byteArray, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}
