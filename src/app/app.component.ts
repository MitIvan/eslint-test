import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const navigator: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'esLint';

  constructor() {
    this.checkWebUsbSupport();
  }

  checkWebUsbSupport() {
    if ('usb' in navigator) {
      console.log('WebUSB is supported!');
    } else {
      console.error('WebUSB is not supported in this browser.');
    }
  }

  async requestUSBDevice() {
    try {
      const device = await navigator.usb.requestDevice({ filters: [] });
      console.log(device);

      console.log(`Device selected: ${device.productName}`);
      console.log(`Device protocol: ${device.deviceProtocol}`);

      await device.open();
      console.log('Device opened');

      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }

      await device.claimInterface(0);

      await device.controlTransferOut({
        requestType: 'vendor',
        recipient: 'device',
        request: 0x01,
        value: 0x0001,
        index: 0x0000,
      });

      console.log('Control transfer sent');

      await device.close();
      console.log('Device closed');
    } catch (error) {
      console.error('Error: ', error);
    }
  }
}
