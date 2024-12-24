import { Component, inject, OnDestroy, OnInit, computed } from '@angular/core';
import { SerialPortComponent } from './serial-port/serial-port.component';
import { UsbComponent } from './usb/usb.component';
import { BluetoothComponent } from "./bluetooth/bluetooth.component";
import { FeatureFlagService } from './featureflag.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SerialPortComponent, UsbComponent, BluetoothComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'esLint';
  featureFlagService = inject(FeatureFlagService);

  isUsbEnabled = computed(() => this.featureFlagService.getFeatureFlag('usb'));
  isSerialEnabled = computed(() => this.featureFlagService.getFeatureFlag('serialApi'));
  LdReady = this.featureFlagService._LDReady

  ngOnInit() {
    this.featureFlagService.initialize();
    console.log('LDReady', this.LdReady);
    
  }

  ngOnDestroy() {
    this.featureFlagService.shutdown();
  }
}