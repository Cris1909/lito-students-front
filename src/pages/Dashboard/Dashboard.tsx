import { RefObject, useEffect, useId, useRef, useState } from 'react';

import { Scheduler } from '@aldabil/react-scheduler';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { AvailableSchedulesService } from '../../services';
import { IAvailableSchedule } from '../../interfaces';
import { formatDateInLocalTimezone } from '../../helpers';
import { SchedulerRef } from '@aldabil/react-scheduler/types';

const Dashboard = () => {
  const [selectedDay, setSelectedDay] = useState(formatDateInLocalTimezone());
  
  const [availableSchedules, setAvailableSchedules] = useState<
    IAvailableSchedule[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [data, setData] = useState([])


  const calendarRef = useRef<SchedulerRef>(null);

  const getSchedules = async () => {
    setLoading(true);
    try {
      const response = await AvailableSchedulesService.listByWeek(selectedDay);
      setAvailableSchedules(response);
      const newData: any = response.flatMap((item: IAvailableSchedule, i: number) => 
        item.hours.map((hour: number, j: number) => ({
          event_id: `${i}-${j}`,
          title: 'Horario disponible',
          start: new Date(`${item.date} ${hour}:00`),
          end: new Date(`${item.date} ${hour + 1}:00`),
          color: '#219653',
        }))
      );
      setData(newData)
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false)
    }
  };

  const changeSelectedDay = (date: Date) => {
    const day4 = dayjs(date).add(3, 'day');
    setSelectedDay(day4.format('YYYY-MM-DD'));
  };

  useEffect(() => {
    getSchedules();
  }, [selectedDay]);


  return (
    <Scheduler
      // loading={loading}
      ref={calendarRef}
      onSelectedDateChange={(e) => changeSelectedDay(e)}
      view="week"
      events={data}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        startHour: 0,
        endHour: 24,
        weekStartOn: 6,
        step: 60,
      }}
      day={null}
      draggable={false}
      deletable={false}
      editable={false}
      month={null}
    />
  );
};

export default Dashboard;
