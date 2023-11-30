import { useEffect, useRef, useState } from 'react';

import { Scheduler } from '@aldabil/react-scheduler';
import { SchedulerHelpers, SchedulerRef } from '@aldabil/react-scheduler/types';
import toast from 'react-hot-toast';

import 'react-responsive-modal/styles.css';

import {
  AppointmentService,
  AvailableSchedulesService,
  SubjectsService,
} from '../../services';

import { formatDateInLocalTimezone } from '../../helpers';
import { IAppointment, IAvailableSchedule, ISubject } from '../../interfaces';
import {
  AppointmentColors,
  AppointmentStatusText,
  Colors,
  Roles,
} from '../../enums';
import { SchedulingComponent } from './components';
import { Loader } from '../../common';
import { useAppSelector } from '../../hooks';
import { selectAuthSlice } from '../../store/reducers/auth/authSlice';
import dayjs from 'dayjs';

const Dashboard = () => {
  const { user } = useAppSelector(selectAuthSlice);

  const { roles } = user;

  const isStudent = roles.includes(Roles.STUDENT);
  const isTeacher = roles.includes(Roles.TEACHER);

  const [selectedDay, setSelectedDay] = useState(formatDateInLocalTimezone());

  const [availableSchedules, setAvailableSchedules] = useState<
    IAvailableSchedule[]
  >([]);

  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [data, setData] = useState<any>([]);

  const [subjects, setSubjects] = useState<ISubject[]>([]);

  const getSubjects = async () => {
    try {
      const response = await SubjectsService.listActive();
      setSubjects(response);
    } catch (error: any) {}
  };

  const calendarRef = useRef<SchedulerRef>(null);

  const getSchedules = async () => {
    setLoading(true);
    try {
      const [availableSchedules, appointments] = await Promise.all([
        AvailableSchedulesService.listByWeek(selectedDay),
        AppointmentService.listByWeek(selectedDay),
      ]);

      setAvailableSchedules(availableSchedules);
      setAppointments(appointments);

      const newAppointments = appointments.flatMap((appointment) => {
        const groupedHours: number[][] = groupConsecutiveHours(
          appointment.hours,
        );

        return groupedHours.map((group: number[], j: number) => ({
          event_id: `appointment-${appointment._id}-${j}`,
          title: `${AppointmentStatusText[appointment.status]}`,
          start: new Date(`${appointment.date} ${group[0]}:00`),
          end: new Date(`${appointment.date} ${group[group.length - 1]}:59`),
          color: AppointmentColors[appointment.status],
          editable: true,
          ...appointment,
        }));
      });

      const newData: any = availableSchedules.flatMap(
        (item: IAvailableSchedule, i: number) => {
          const groupedHours: number[][] = dayjs().isSame(item.date, 'day')
            ? groupConsecutiveHoursSameDay(item.hours)
            : groupConsecutiveHours(item.hours);

          return groupedHours.map((group: number[], j: number) => {
            const startHour = group[0];
            const endHour = group[group.length - 1];
            const start = new Date(`${item.date} ${startHour}:00`);
            const end = new Date(`${item.date} ${endHour}:59`);

            // Verificar si el intervalo ya pasó
            const hasPassed = dayjs().isAfter(end);

            // Verificar si el intervalo está actualmente disponible
            const isCurrent =
              !hasPassed && dayjs().isAfter(start) && dayjs().isBefore(end);

            return {
              event_id: `available-${item._id}-${j}`,
              title: isCurrent ? 'Disponible (Hora actual)' : 'Disponible',
              start,
              end,
              color: hasPassed ? Colors.UNAVAILABLE : Colors.AVAILABLE,
              editable: isStudent && !hasPassed,
              // date: item.date,
              // teacherId: item.teacherId,
              ...item,
            };
          });
        },
      );

      setData([...newData, ...newAppointments]);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const groupConsecutiveHours = (hours: number[]): number[][] => {
    const sortedHours = [...hours].sort((a, b) => a - b);
    const groupedHours: number[][] = [];

    let currentGroup: number[] = [];
    for (let i = 0; i < sortedHours.length; i++) {
      if (
        currentGroup.length === 0 ||
        sortedHours[i] === currentGroup[currentGroup.length - 1] + 1
      ) {
        currentGroup.push(sortedHours[i]);
      } else {
        groupedHours.push([...currentGroup]);
        currentGroup = [sortedHours[i]];
      }
    }

    if (currentGroup.length > 0) {
      groupedHours.push([...currentGroup]);
    }

    return groupedHours;
  };

  const groupConsecutiveHoursSameDay = (hours: number[]): number[][] => {
    const sortedHours = [...hours].sort((a, b) => a - b);
    const groupedHours: number[][] = [];
    const currentHour = new Date().getHours();

    let currentGroup: number[] = [];
    for (let i = 0; i < sortedHours.length; i++) {
      if (
        currentGroup.length === 0 ||
        sortedHours[i] === currentGroup[currentGroup.length - 1] + 1
      ) {
        currentGroup.push(sortedHours[i]);
      } else {
        const includesCurrentHour = currentGroup.includes(currentHour);

        if (includesCurrentHour) {
          const index = currentGroup.indexOf(currentHour);
          const beforeCurrentHour = currentGroup.slice(0, index);
          const afterCurrentHour = currentGroup.slice(index);

          if (beforeCurrentHour.length > 0) {
            groupedHours.push([...beforeCurrentHour]);
          }
          if (afterCurrentHour.length > 0) {
            groupedHours.push([...afterCurrentHour]);
          }
        } else {
          groupedHours.push([...currentGroup]);
        }

        currentGroup = [sortedHours[i]];
      }
    }

    if (currentGroup.length > 0) {
      const includesCurrentHour = currentGroup.includes(currentHour);

      if (includesCurrentHour) {
        const index = currentGroup.indexOf(currentHour);
        const beforeCurrentHour = currentGroup.slice(0, index);
        const afterCurrentHour = currentGroup.slice(index);

        if (beforeCurrentHour.length > 0) {
          groupedHours.push([...beforeCurrentHour]);
        }
        if (afterCurrentHour.length > 0) {
          groupedHours.push([...afterCurrentHour]);
        }
      } else {
        groupedHours.push([...currentGroup]);
      }
    }

    return groupedHours;
  };

  useEffect(() => {
    getSchedules();
  }, [selectedDay]);

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <Scheduler
      ref={calendarRef}
      view="week"
      events={data}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        startHour: 0,
        endHour: 24,
        weekStartOn: 1,
        step: 60,
      }}
      day={null}
      draggable={false}
      deletable={false}
      editable={false}
      month={null}
      customEditor={(e: SchedulerHelpers) => (
        <SchedulingComponent
          event={e}
          subjects={subjects}
          getSchedules={getSchedules}
        />
      )}
      onEventClick={(e) => console.log(e)}
    />
  );
};

export default Dashboard;
