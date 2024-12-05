import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SerialPortComponent } from './serial-port/serial-port.component';
import { UsbComponent } from './usb/usb.component';
import { BluetoothComponent } from "./bluetooth/bluetooth.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SerialPortComponent, UsbComponent, BluetoothComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'esLint';
}
