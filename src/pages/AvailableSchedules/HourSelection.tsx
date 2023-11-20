import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface Props {
  selectedHours: number[];
  setSelectedHours: React.Dispatch<React.SetStateAction<number[]>>;
  targetDate?: Date;
}

export const HourSelection: React.FC<Props> = ({
  selectedHours,
  setSelectedHours,
  targetDate,
}) => {
  const getCurrentHour = () => {
    const now = dayjs();
    return now.hour();
  };

  const isSameDayAsTarget = () => {
    const now = dayjs();
    return targetDate ? dayjs(targetDate).isSame(now, 'day') : false;
  };

  const getFormattedHour = (hour: number) => {
    const formattedHour = hour % 12 || 12;
    const period = hour < 12 ? 'AM' : 'PM';
    return `${formattedHour}:00 ${period}`;
  };

  const clearAllHours = () => setSelectedHours([]);

  const [dragging, setDragging] = useState(false);


  const toggleHour = (hour: number) => {
    if (selectedHours.includes(hour)) {
      setSelectedHours(selectedHours.filter((h) => h !== hour));
    } else {
      setSelectedHours([...selectedHours, hour]);
    }
  };

  const handleMouseDown = (hour: number) => {
    setDragging(true);
    toggleHour(hour);
  };

  const handleMouseEnter = (hour: number) => {
    if (dragging) {
      toggleHour(hour);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    clearAllHours();
  }, [getCurrentHour(), targetDate]);

  const hoursOfDay = Array.from({ length: 24 }, (_, index) => index);
  const currentHour = getCurrentHour();

  return (
    <div
      className="max-w-screen-md mx-auto"
      onMouseUp={handleMouseUp}
    >
      <div className="grid grid-rows-6 grid-flow-col gap-2 justify-center">
        {hoursOfDay.map((hour, index) => (
          <button
            key={hour}
            onMouseDown={() => handleMouseDown(hour)}
            onMouseEnter={() => handleMouseEnter(hour)}
            disabled={
              targetDate && !isSameDayAsTarget() ? false : hour < currentHour
            }
            className={`py-1 w-20 rounded border-2 border-black border-opacity-20 dark:border-primary-400 ${
              selectedHours.includes(hour)
                ? 'bg-primary-500 text-white dark:bg-primary-400 dark:text-primary-950'
                : 'text-black dark:text-bodydark1'
            } ${
              targetDate && hour <= currentHour && isSameDayAsTarget()
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } ${index === 6 ? 'mr-5' : ''}`}
          >
            {getFormattedHour(hour)}
          </button>
        ))}
      </div>
    </div>
  );
};
