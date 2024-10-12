document.addEventListener('DOMContentLoaded', () => {
    // ИНИЦИАЛИЗАЦИЯ КАЛЕНДАРЕЙ
    // календарь для окна добавления/редактирования задачи
    const taskCalendarId = document.querySelector("#taskCalendar")
    const taskCalendar = new VanillaCalendar(taskCalendarId, {
        settings: {
            type: 'default',
            selection: {
                day: 'single',
                month: true,
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

                taskWeekNumber = Number(e.target.dataset.calendarWeekNumber)
                taskDate = self.selectedDates.toString()
                
                const gsDayNames = [
                    'sun',
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat'
                ]
                const date = new Date(taskDate)
                dayOfWeek = gsDayNames[date.getDay()]
            },
        }
    });
    taskCalendar.init();

    // определение и сохранение номера текущей недели
    const thisWeek = document.querySelector('.vanilla-calendar-day__btn_today').getAttribute('data-calendar-week-number')
    console.log('thisWeek', thisWeek)
    let weekPlanerWeekNumber = document.querySelector('#weekPlanerListCard').setAttribute('week-number', thisWeek)
    weekPlanerWeekNumber = thisWeek
    localStorage.setItem('weekPlanerWeekNumber', JSON.stringify(weekPlanerWeekNumber))
  });