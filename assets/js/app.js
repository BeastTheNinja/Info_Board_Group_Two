import { BusPage } from "./Controllers/busController.js";
import { DagensRetPage } from "./Controllers/dagensRetController.js";
import { dateAndTime } from "./Controllers/DateAndTimeController.js";
import { SkemaPage } from "./Controllers/skemaController.js";
import { vejrPage } from "./Controllers/vejrController.js";

dateAndTime({
  elementId: "clock",
  locale: "en-GB",
  timezone: "Europe/Copenhagen",
});

// Give the clock element a `.clock-card` class so it receives panel styling in the grid
const clockEl = document.getElementById('clock');
if (clockEl) clockEl.classList.add('clock-card');

BusPage();

SkemaPage()
DagensRetPage();
vejrPage();
