import React, { useState } from 'react';
import moment from 'moment';
// import calendarIcon from './assets/calendar-gray-700.svg';

const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [leftMonth, setLeftMonth] = useState(new Date());
  const [rightMonth, setRightMonth] = useState(moment().add(1, 'month').toDate());
  const [showCalendars, setShowCalendars] = useState(false);
  const [isSelectingStart, setIsSelectingStart] = useState(true);

  const getDaysInMonth = (date) => {
    const momentDate = moment(date);
    const year = momentDate.year();
    const month = momentDate.month();
    const daysInMonth = momentDate.daysInMonth();
    const days = [];
    const firstDay = moment([year, month, 1]);
    const startPadding = (firstDay.day() + 6) % 7;

    for (let i = 0; i < startPadding; i++) {
      days.push(moment([year, month, 1]).subtract(startPadding - i, 'days').toDate());
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(moment([year, month, i]).toDate());
    }

    const totalDays = days.length;
    const remainingDays = 42 - totalDays;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(moment([year, month, daysInMonth]).add(i, 'days').toDate());
    }

    return days;
  };

  const handleDateClick = (date) => {
    if (!isCurrentMonth(date, leftMonth) && !isCurrentMonth(date, rightMonth)) return;

    if (isSelectingStart || !dateRange.startDate) {
      setDateRange((prev) => ({ ...prev, startDate: date, endDate: null }));
      setIsSelectingStart(false);
    } else {
      if (moment(date).isBefore(dateRange.startDate)) {
        setDateRange({
          startDate: date,
          endDate: dateRange.startDate,
        });
      } else {
        setDateRange((prev) => ({ ...prev, endDate: date }));
      }
      setIsSelectingStart(true);
    }
  };

  const nextMonth = () => {
    setLeftMonth(moment(leftMonth).add(1, 'month').toDate());
    setRightMonth(moment(rightMonth).add(1, 'month').toDate());
  };

  const prevMonth = () => {
    setLeftMonth(moment(leftMonth).subtract(1, 'month').toDate());
    setRightMonth(moment(rightMonth).subtract(1, 'month').toDate());
  };

  const isInRange = (date) => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    return moment(date).isBetween(dateRange.startDate, dateRange.endDate, 'day', '[]');
  };

  const isCurrentMonth = (date, currentMonth) => {
    return moment(date).month() === moment(currentMonth).month();
  };

  const handleCancel = () => {
    setDateRange({
      startDate: null,
      endDate: null,
    });
    setIsSelectingStart(true);
    setShowCalendars(false);
  };

  const handleApply = () => {
    console.log('Selected Date Range:', dateRange);
    setShowCalendars(false);
  };

  const isStartDate = (date) => {
    return dateRange.startDate && moment(date).isSame(dateRange.startDate, 'day');
  };

  const isEndDate = (date) => {
    return dateRange.endDate && moment(date).isSame(dateRange.endDate, 'day');
  };

  const isToday = (date) => {
    return moment(date).isSame(new Date(), 'day');
  };

  const getFirstColumn = (index) => {
    const colIndex = index % 7;
    return colIndex === 0;
  };

  const getLastColumn = (index) => {
    const colIndex = index % 7;
    return colIndex === 6;
  };

  return (
    <div className="flex relative">
      {/* Start and End Date Buttons */}
      <div className="flex items-center">
        <div className="border-l">
          <button
            className="mx-6 my-3 py-2.5 text-gray-500 text-sm font-normal flex items-center gap-2 min-w-52"
            onClick={() => {
              if (showCalendars) return;
              setShowCalendars(true);
              setLeftMonth(dateRange.startDate ? new Date(dateRange.startDate) : new Date());
            }}
          >
            {/* <img src={calendarIcon} alt="calendar" className="w-5 h-5" /> */}
            {dateRange.startDate
              ? moment(dateRange.startDate).format('MMM DD, YYYY')
              : 'Start date range'}
          </button>
        </div>
        <div className="border-l">
          <button
            className="mx-6 my-3 py-2.5 text-gray-500 text-sm font-normal flex items-center gap-2 min-w-52"
            onClick={() => {
              if (showCalendars) return;
              setShowCalendars(true);
              setLeftMonth(dateRange.endDate ? new Date(dateRange.endDate) : new Date());
            }}
          >
            {/* <img src={calendarIcon} alt="calendar" className="w-5 h-5" /> */}
            {dateRange.endDate
              ? moment(dateRange.endDate).format('MMM DD, YYYY')
              : 'End date range'}
          </button>
        </div>
      </div>

      {/* Calendars */}
      {showCalendars && (
        <div className="absolute top-14 flex flex-col bg-white border rounded-lg shadow-lg">
          <div className="flex">
            {/* Left Calendar */}
            <div className="pt-5 px-6 border-r">
              <div className="flex justify-between items-center p-1 mb-3">
                <button onClick={prevMonth}>
                &#8592;
                </button>
                <h2 className="text-base text-gray-700 font-medium">
                  {moment(leftMonth).format('MMMM YYYY')}
                </h2>
                <button onClick={nextMonth}>
                &#8594;
                </button>
              </div>

              <div className="w-80 p-4">
                <div className="grid grid-cols-7">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div className="text-gray-700 text-sm font-medium px-3 py-2 flex justify-center items-center" key={day}>
                      {day}
                    </div>
                  ))}

                  {getDaysInMonth(leftMonth).map((date, index) => (
                    <div
                      className={`flex justify-center items-center ${
                        isInRange(date) && isCurrentMonth(date, leftMonth)
                          ? isStartDate(date)
                            ? 'bg-gray-50 rounded-l-full'
                            : isEndDate(date)
                            ? 'bg-gray-50 rounded-r-full'
                            : `bg-gray-50 ${getFirstColumn(index) ? 'rounded-l-full' : ''} ${getLastColumn(index) ? 'rounded-r-full' : ''}`
                          : ''
                      }`}
                      key={index}
                    >
                      <button
                        className={`px-3 py-2 h-10 w-10 flex justify-center items-center rounded-full text-sm font-normal ${
                          (isStartDate(date) || isEndDate(date)) && isCurrentMonth(date, leftMonth)
                            ? 'bg-primary-700 text-white'
                            : isToday(date) && isCurrentMonth(date, leftMonth)
                            ? 'bg-gray-100'
                            : isCurrentMonth(date, leftMonth)
                            ? 'text-gray-700 hover:bg-gray-50'
                            : 'text-gray-300 pointer-events-none'
                        }`}
                        onClick={() => handleDateClick(date)}
                      >
                        {moment(date).format('D')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Calendar */}
            <div className="pt-5 px-6">
              <div className="flex justify-between items-center p-1 mb-3">
                <button onClick={prevMonth}>
                &#8592;
                </button>
                <h2 className="text-base text-gray-700 font-medium">
                  {moment(rightMonth).format('MMMM YYYY')}
                </h2>
                <button onClick={nextMonth}>
                &#8594;
                </button>
              </div>

              <div className="w-80 p-4">
                <div className="grid grid-cols-7">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div className="text-gray-700 text-sm font-medium px-3 py-2 flex justify-center items-center" key={day}>
                      {day}
                    </div>
                  ))}

                  {getDaysInMonth(rightMonth).map((date, index) => (
                    <div
                      className={`flex justify-center items-center ${
                        isInRange(date) && isCurrentMonth(date, rightMonth)
                          ? isStartDate(date)
                            ? 'bg-gray-50 rounded-l-full'
                            : isEndDate(date)
                            ? 'bg-gray-50 rounded-r-full'
                            : `bg-gray-50 ${getFirstColumn(index) ? 'rounded-l-full' : ''} ${getLastColumn(index) ? 'rounded-r-full' : ''}`
                          : ''
                      }`}
                      key={index}
                    >
                      <button
                        className={`px-3 py-2 h-10 w-10 flex justify-center items-center rounded-full text-sm font-normal ${
                          (isStartDate(date) || isEndDate(date)) && isCurrentMonth(date, rightMonth)
                            ? 'bg-primary-700 text-white'
                            : isToday(date) && isCurrentMonth(date, rightMonth)
                            ? 'bg-gray-100'
                            : isCurrentMonth(date, rightMonth)
                            ? 'text-gray-700 hover:bg-gray-50'
                            : 'text-gray-300 pointer-events-none'
                        }`}
                        onClick={() => handleDateClick(date)}
                      >
                        {moment(date).format('D')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="py-2 border-t bg-gray-50 flex justify-between">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
