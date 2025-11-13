import { HomePage } from "./Controllers/homeController.js";
import { BusPage } from "./Controllers/busController.js";
import { dateAndTime } from "./Controllers/DateAndTimeController.js";

// render the composed HomePage into the root #app and then start bus updates
const appRoot = document.getElementById('app');
if (appRoot) {
  appRoot.appendChild(HomePage());
}

dateAndTime({
  elementId: "clock",
  locale: "en-GB",
  timezone: "Europe/Copenhagen",
});

// start bus fetching which will mount into the #bus-root placeholder inside HomePage
BusPage();