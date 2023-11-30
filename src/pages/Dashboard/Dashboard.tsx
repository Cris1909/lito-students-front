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
import { AppointmentColors, AppointmentStatusText, Colors, Roles } from '../../enums';
import { SchedulingComponent } from './SchedulingComponent';
import { Loader } from '../../common';
import { useAppSelector } from '../../hooks';
import { selectAuthSlice } from '../../store/reducers/auth/authSlice';

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
          // description: appointment.description,
          // teacherId: appointment.teacher,
          // subjectId: appointment.subject,
          // status: appointment.status
          ...appointment
        }));
      });

      const newData: any = availableSchedules.flatMap(
        (item: IAvailableSchedule, i: number) => {
          const groupedHours: number[][] = groupConsecutiveHours(item.hours);

          return groupedHours.map((group: number[], j: number) => ({
            event_id: `available-${item._id}-${j}`,
            title: 'Disponible',
            start: new Date(`${item.date} ${group[0]}:00`),
            end: new Date(`${item.date} ${group[group.length - 1]}:59`),
            color: Colors.AVAILABLE,
            editable: isStudent,
            // date: item.date,
            // teacherId: item.teacherId,
            ...item,
          }));
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
