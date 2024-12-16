import { Component, inject } from '@angular/core';
import { SerialService } from '../serial.service';

@Component({
  selector: 'app-serial-port',
  standalone: true,
  templateUrl: './serial-port.component.html',
  styleUrls: ['./serial-port.component.scss'],
  providers: [SerialService],
})
export class SerialPortComponent {
  serialService = inject(SerialService);

  disconnect() {
    this.serialService.disconnect();
  }

  connect() {
    this.serialService.connect();
  }

  async writeAndRead() {
    const readFirmware = new Uint8Array([0x0f, 0x00, 0x01, 0x00, 0x00, 0xf1]);
    const readFirmwareExt = new Uint8Array([
      0x0f, 0x00, 0x1c, 0x00, 0x0e, 0xe2, 0x00, 0x00, 0x00, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x6f,
    ]);

    try {
      this.serialService.repack(readFirmware);
      await this.serialService.write(readFirmware);
      const firmwareResponse = await this.serialService.read(false);

      this.serialService.repack(readFirmwareExt);
      await this.serialService.write(readFirmwareExt);
      const firmwareExtResponse = await this.serialService.read(false);

      const v1 = firmwareResponse[0];
      const v2 = firmwareResponse[1];
      const v3 = firmwareExtResponse[0x7d];
      const v4 = firmwareExtResponse[0x7c];

      console.log(`Firmware: ${v1}.${v2}.${v3}.${v4}`);
    } catch (error) {
      console.error('Error during communication:', error);
    }
  }
}
