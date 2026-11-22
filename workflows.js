(() => {
  const board = document.querySelector('.workflow-board');
  if (!board) return;
  const tabs = [...board.querySelectorAll('[role="tab"]')];
  const panels = [...board.querySelectorAll('.workflow-panel')];

  function selectTab(tab, moveFocus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.id !== tab.getAttribute('aria-controls');
    });
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });

  panels.forEach(panel => {
    const controls = [...panel.querySelectorAll('[data-review-stage]')];
    controls.forEach(button => {
      button.addEventListener('click', () => {
        panel.dataset.review = button.dataset.reviewStage;
        controls.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
      });
    });

    panel.querySelectorAll('[data-reference]').forEach(button => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.reference);
        if (!target || !panel.contains(target)) return;
        panel.querySelectorAll('.is-referenced').forEach(item => item.classList.remove('is-referenced'));
        target.classList.add('is-referenced');
        panel.querySelectorAll('[data-reference]').forEach(item => {
          if (item.dataset.reference === target.id) item.classList.add('is-referenced');
        });
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      });
    });
  });
})();
