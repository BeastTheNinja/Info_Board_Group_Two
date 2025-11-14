export function dateAndTime({
  elementId,
  locale = navigator.language,
  timezone,
}) {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error("Element with id '" + elementId + "' not found.");
    return;
  }

  // Create inner elements for title, time and date
  el.innerHTML = `
   <div id="titlePart" style=" font-size: 2rem; font-weight: 900; color: #b4bbff; -webkit-text-stroke: 2px #363bff; margin:0; padding: 0; line-height: 1; "> TID </div>

  <div id="timePart" style=" font-size: 3rem; font-weight: 900; color: #5c4ad8; margin: -2px 0 0 0; line-height: 1; ">
   </div>

  <div id="datePart" style=" font-size: 1.4rem; font-weight: 700; color: #c96e14; margin: -2px 0 0 0; line-height: 1.1; "> </div>
`;

  const timeEl = el.querySelector("#timePart");
  const dateEl = el.querySelector("#datePart");

  // Time formatter (HH:MM)
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone || undefined,
  });

  // Date formatter numeric
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: timezone || undefined,
  });

  function updateClock() {
    const now = new Date();
    timeEl.textContent = timeFormatter.format(now);
    dateEl.textContent = dateFormatter.format(now);
  }

  updateClock();
  const interval = setInterval(updateClock, 60000);

  return () => clearInterval(interval);
}
