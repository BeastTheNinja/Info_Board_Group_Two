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
  
    // Create inner elements for time and date (use classes so CSS controls styling)
      el.innerHTML = `
        <div id="timePart" class="time-part"></div>
        <div id="datePart" class="date-part"></div>
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
  
    // Date formatter with numeric month
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",  // <-- numeric month
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
  