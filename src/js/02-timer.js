import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
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

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(new Date().getTime() + 1 * 60000), 
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (!selectedDate) {
            document.querySelector('[data-start]').disabled = true;
            return;
        }

        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            Notiflix.Notify.failure('Please choose a date in the future');
            document.querySelector('[data-start]').disabled = true;
            document.querySelector('#datetime-picker').value = '';
        } else {
            document.querySelector('[data-start]').disabled = false;
        }
    },
};

flatpickr("#datetime-picker", options);

let countdownInterval;
let targetDate;

function updateTimer() {
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;

    if (timeDifference <= 0) {
        clearInterval(countdownInterval);
        Notiflix.Notify.success('Countdown has finished!');
        return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);

    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

document.querySelector('[data-start]').disabled = true;

document.querySelector('[data-start]').addEventListener('click', () => {
    targetDate = flatpickr.parseDate(document.querySelector('#datetime-picker').value);

    if (!targetDate) {
        Notiflix.Notify.failure('Please choose a valid date');
        return;
    }

    const currentDate = new Date();

    if (targetDate <= currentDate) {
        Notiflix.Notify.failure('Please choose a date in the future');
        return;
    }

    targetDate.setSeconds(0);

    updateTimer(); 
    countdownInterval = setInterval(updateTimer, 1000);

    document.querySelector('[data-start]').disabled = true;
});
