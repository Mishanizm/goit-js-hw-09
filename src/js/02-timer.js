import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const refs = {
  datetimePicker: document.querySelector("#datetime-picker"),
  startButton: document.querySelector('[data-start]'),
  timerFields: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },
};

let targetDate = null;
let intervalId = null;

function updateTimerFields({ days, hours, minutes, seconds }) {
  refs.timerFields.days.textContent = addLeadingZero(days);
  refs.timerFields.hours.textContent = addLeadingZero(hours);
  refs.timerFields.minutes.textContent = addLeadingZero(minutes);
  refs.timerFields.seconds.textContent = addLeadingZero(seconds);
}

function updateTimer() {
  const currentDate = new Date();
  const timeLeft = targetDate - currentDate;

  if (timeLeft <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    updateTimerFields({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.startButton.disabled = false;
    alert("Time's up!");
    return;
  }

  const timeValues = convertMs(timeLeft);
  updateTimerFields(timeValues);
}

function createCalendarInstance() {
  return flatpickr(refs.datetimePicker, {
    enableTime: true,
    time_24hr: true,
    dateFormat: "Y-m-d H:i", // Уберем секунды из формата
    defaultDate: new Date(),
    minuteIncrement: 1, // Установим минуты без лишних нулей
    onClose(selectedDates) {
      if (selectedDates[0]) {
        targetDate = selectedDates[0];
        const currentDate = new Date();
        if (currentDate >= targetDate) {
          alert("Please choose a date in the future");
          targetDate = null;
          refs.datetimePicker._input.value = ""; // Очищаем поле в случае ошибки
        } else {
          refs.startButton.disabled = false;
        }
      }
    },
  });
}

refs.datetimePicker._flatpickr = createCalendarInstance();

refs.startButton.addEventListener("click", () => {
  refs.startButton.disabled = true;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    return;
  }
  intervalId = setInterval(updateTimer, 1000);
});
