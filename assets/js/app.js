
import { dateAndTime } from "./Controllers/DateAndTimeController.js";


dateAndTime({
  elementId: 'clock',
  locale: 'en-GB',
  timezone: 'Europe/Copenhagen',
});

import { BusPage } from "./Controllers/busController.js";
BusPage();
