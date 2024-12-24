import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// import { APP_INITIALIZER } from '@angular/core';
// import { FeatureFlagService } from './featureflag.service';
// import { initializeFeatureFlag } from './initFeatureFlagClient';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    // FeatureFlagService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeFeatureFlag,
    //   deps: [FeatureFlagService],
    //   multi: true,
    // },
  ]
};
