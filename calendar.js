/**
 * ==============================================================================
 * SPA DATE PICKER & CALENDAR COMPONENT
 * Functional, accessible date selection with blackout dates, review,
 * and WhatsApp sharing.
 * ==============================================================================
 */

window.SpaCalendar = (function() {
  let currentDate = new Date();
  let displayedYear = currentDate.getFullYear();
  let displayedMonth = currentDate.getMonth(); // 0-indexed
  let selectedDateStr = null; // "YYYY-MM-DD"
  let unavailableDates = [];

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function init(configUnavailableDates = []) {
    unavailableDates = configUnavailableDates || [];
    render();
    attachNavListeners();
  }

  function getTodayString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDateFriendly(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function render() {
    const titleEl = document.getElementById('calendar-month-title');
    const daysGrid = document.getElementById('calendar-days-grid');
    if (!titleEl || !daysGrid) return;

    titleEl.textContent = `${MONTH_NAMES[displayedMonth]} ${displayedYear}`;
    daysGrid.innerHTML = '';

    const firstDayIndex = new Date(displayedYear, displayedMonth, 1).getDay(); // 0 is Sun
    const totalDaysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
    const todayStr = getTodayString();

    // Empty lead cells
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day-cell empty';
      emptyCell.setAttribute('aria-hidden', 'true');
      daysGrid.appendChild(emptyCell);
    }

    // Days of the month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const monthStr = String(displayedMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateFormatted = `${displayedYear}-${monthStr}-${dayStr}`;

      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'calendar-day-cell';
      cell.textContent = day;
      cell.setAttribute('aria-label', formatDateFriendly(dateFormatted));
      cell.setAttribute('data-date', dateFormatted);

      if (dateFormatted === todayStr) {
        cell.classList.add('today');
      }

      // Check if past date
      const isPast = dateFormatted < todayStr;
      // Check if blocked by config
      const isUnavailable = unavailableDates.includes(dateFormatted);

      if (isPast || isUnavailable) {
        cell.disabled = true;
        cell.setAttribute('aria-disabled', 'true');
        if (isUnavailable) {
          cell.title = "Unavailable date";
        }
      } else {
        cell.addEventListener('click', () => selectDate(dateFormatted));
      }

      if (dateFormatted === selectedDateStr) {
        cell.classList.add('selected');
        cell.setAttribute('aria-selected', 'true');
      }

      daysGrid.appendChild(cell);
    }

    updateSelectionDisplay();
  }

  function selectDate(dateFormatted) {
    selectedDateStr = dateFormatted;
    // Clear validation error if any
    const errEl = document.getElementById('date-validation-error');
    if (errEl) errEl.classList.remove('show');
    render();
  }

  function updateSelectionDisplay() {
    const banner = document.getElementById('date-selected-banner');
    const textEl = document.getElementById('selected-date-text');
    if (!banner || !textEl) return;

    if (selectedDateStr) {
      banner.style.display = 'flex';
      textEl.textContent = formatDateFriendly(selectedDateStr);
    } else {
      banner.style.display = 'none';
    }
  }

  function attachNavListeners() {
    const prevBtn = document.getElementById('cal-prev-month');
    const nextBtn = document.getElementById('cal-next-month');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        displayedMonth--;
        if (displayedMonth < 0) {
          displayedMonth = 11;
          displayedYear--;
        }
        render();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        displayedMonth++;
        if (displayedMonth > 11) {
          displayedMonth = 0;
          displayedYear++;
        }
        render();
      });
    }
  }

  function getSelectedDate() {
    return selectedDateStr;
  }

  function getFormattedSelectedDate() {
    return formatDateFriendly(selectedDateStr);
  }

  return {
    init: init,
    getSelectedDate: getSelectedDate,
    getFormattedSelectedDate: getFormattedSelectedDate,
    render: render
  };
})();
