import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './ATLAS/app.config';
import { App } from './ATLAS/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
