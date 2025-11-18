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
  
    // Create inner elements for time and date. Include the CSS-friendly
    // class names `clock-time` and `clock-date` so the styles in
    // `_DateAndTime.scss` apply directly (keeps the existing `time-part`
    // / `date-part` names for compatibility).
        el.innerHTML = `
          <div id="timePart" class="time-part clock-time"></div>
          <div id="datePart" class="date-part clock-date"></div>
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

    // Call immediately to populate UI
    updateClock();

    // Align subsequent updates to the start of each minute so clock stays in sync
    let intervalId = null;
    let timeoutId = null;

    const msToNextMinute = () => {
      const n = new Date();
      return 60000 - n.getSeconds() * 1000 - n.getMilliseconds();
    };

    // Schedule first tick at the next minute boundary, then run every 60s
    timeoutId = setTimeout(() => {
      updateClock();
      intervalId = setInterval(updateClock, 60000);
    }, msToNextMinute());

    // Expose a stop function to clear timers
    const stop = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Add small, namespaced manual helpers for debugging/testing
    try {
      const safeId = (elementId || 'clock').toString().replace(/\W+/g, '_');
      if (typeof window !== 'undefined') {
        window[`refreshClock_${safeId}`] = updateClock;
        window[`stopClock_${safeId}`] = () => {
          stop();
          try {
            delete window[`refreshClock_${safeId}`];
            delete window[`stopClock_${safeId}`];
          } catch (e) {}
        };
      }
    } catch (e) {
      // ignore helper install errors
    }

    return stop;
  }
  