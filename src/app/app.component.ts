import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SerialPortComponent } from './serial-port/serial-port.component';
import { UsbComponent } from './usb/usb.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SerialPortComponent, UsbComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'esLint';
}
