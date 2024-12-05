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

  // Request a serial port
  async requestPort() {
    await this.serialService.requestPort();
  }

  // Open the selected serial port
  async openPort() {
    await this.serialService.openPort();
  }

  // Write data to the serial port
  async writeData() {
    await this.serialService.writeData();
  }

  // Read data from the serial port
  async readData() {
    await this.serialService.readData();
  }

  // Close the serial port
  async closePort() {
    await this.serialService.closePort();
  }
}
