document.addEventListener('DOMContentLoaded', () => {
    // инициализация календарей
    const mainCalendarId = document.querySelector("#mainCalendar")
    const mainCalendar = new VanillaCalendar(mainCalendarId, {
        settings: {
            type: 'default',
            selection: {
                day: 'single',
                month: true,
                // time: true,
                holidays: ['2024-06-20'],
            },
            visibility: {
                weekNumbers: true,
                weekend: true,
                today: true,
              },
        },
        actions: {
            clickDay(e, self) {
                console.log('self', self)
            },
            clickWeekNumber(e, number, days, year, self) {
                console.log('self', self)
            },
        },
        popups: {
            '2024-06-28': {
                modifier: '',
                html: `<div>
                    <u><b>12:00 PM</b></u>
                    <p style="margin: 5px 0 0;">Airplane in Las Vegas</p>
                </div>`,
                // or just text
                // html: 'Airplane in Las Vegas',
            },
          }
    });
    mainCalendar.init();

    const addTaskCalendarId = document.querySelector("#addTaskCalendar")
    const addTaskCalendar = new VanillaCalendar(addTaskCalendarId, {
        settings: {
            type: 'default',
            selection: {
                day: 'single',
                month: true,
                // time: true,
                holidays: ['2024-06-20'],
            },
            visibility: {
                weekNumbers: true,
                weekend: true,
                today: true,
              },
        },
        actions: {
            clickDay(e, self) {
                console.log('e', e)
                e.target.classList.add('vanilla-calendar-day-check')
                // e.target.style.backgroundColor = "blueviolet !important"
                taskDate = self.selectedDates.toString()
                
                const gsDayNames = [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ]
                const date = new Date(taskDate)
                dayOfWeek = gsDayNames[date.getDay()]
            },
        }
    });
    addTaskCalendar.init();

    const addDateCalendarId = document.querySelector("#calendarDateDialog")
    const addDateCalendar = new VanillaCalendar(addDateCalendarId, {
        settings: {
            type: 'default',
            selection: {
                day: 'single',
                month: true,
                // time: true,
                holidays: ['2024-06-20'],
            },
            visibility: {
                weekNumbers: true,
                weekend: true,
                today: true,
              },
        },
        actions: {
            clickDay(e, self) {
                console.log('e', e)
                e.target.classList.add('vanilla-calendar-day-check')
            },
        }
    });
    addDateCalendar.init();

  });