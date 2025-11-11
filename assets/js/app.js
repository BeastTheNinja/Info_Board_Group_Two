// import components here

import { dateAndTime } from "./Controllers/DateAndTimeController.js";


dateAndTime({
  elementId: 'clock',
  locale: 'en-GB',
  timezone: 'Europe/Copenhagen',
});

// import modules here
import saveDataModule from './modules/localstorage.js';
import { loadStorageModule, removeStorageModule } from './modules/localstorage.js';

// import utils here

// write cool main js code here
saveDataModule();
    
loadStorageModule();
removeStorageModule();