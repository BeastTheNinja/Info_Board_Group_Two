import { BusPage } from "./Controllers/busController.js";
import { dateAndTime } from "./Controllers/DateAndTimeController.js";
import { SkemaPage } from "./Controllers/skemaController.js";

dateAndTime({
  elementId: "clock",
  locale: "en-GB",
  timezone: "Europe/Copenhagen",
});

BusPage();

SkemaPage()