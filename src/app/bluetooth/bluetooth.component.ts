import { Component, inject } from '@angular/core';
import { BluetoothService } from '../bluetooth.service';

@Component({
  selector: 'app-bluetooth',
  standalone: true,
  templateUrl: './bluetooth.component.html',
})
export class BluetoothComponent {
  statusMessage: any;
  errorMessage: string | null = null;

  bluetoothService = inject(BluetoothService)

  async connectToDevice() {
    try {
      this.statusMessage = await this.bluetoothService.connect();
      this.errorMessage = null;
    } catch (error: any) {
      this.errorMessage = error.message;
      this.statusMessage = null;
    }
  }

  async sendData() {
    try {
      await this.bluetoothService.writeData(0x01); // Example data
      this.statusMessage = 'Data sent successfully';
      this.errorMessage = null;
    } catch (error: any) {
      this.errorMessage = error.message;
      this.statusMessage = null;
    }
  }

  disconnectFromDevice() {
    this.bluetoothService.disconnect();
    this.statusMessage = 'Device disconnected';
    this.errorMessage = null;
  }
}
