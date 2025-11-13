export const composeViews = (views = []) => {
  const container = document.createElement('div');
  container.className = 'flet-container';
  views.forEach((v) => {
    try {
      const el = (typeof v === 'function') ? v() : v;
      if (el) container.appendChild(el);
    } catch (e) {
      // swallow individual view errors so the whole layout still renders
      // log to console for debugging
      console.warn('composeViews: failed to render a view', e);
    }
  });
  return container;
};
