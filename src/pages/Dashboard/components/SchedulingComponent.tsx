import { SchedulerHelpers } from '@aldabil/react-scheduler/types';
import dayjs from 'dayjs';

import 'react-responsive-modal/styles.css';

import { IAppointment, ISubject } from '../../../interfaces';
import { CreateAppointment } from './CreateAppointment';
import { useAppSelector } from '../../../hooks';
import { selectAuthSlice } from '../../../store/reducers/auth/authSlice';
import { AppointmentStatus, Roles } from '../../../enums';
import { SolicitedAppointment } from './SolicitedAppointment';
import { PendingAppointment } from './PendingAppointment';
import { useEffect, useState } from 'react';
import { AppointmentService } from '../../../services';
import { ConfirmedAppointment } from '..';
import { CompletedAppointment } from './CompleteAppointment';

interface Props {
  event: SchedulerHelpers;
  subjects: ISubject[];
  getSchedules: () => {};
}

export const SchedulingComponent: React.FC<Props> = ({
  event,
  subjects,
  getSchedules,
}) => {
  const { user } = useAppSelector(selectAuthSlice);

  const { roles } = user;

  const isStudent = roles.includes(Roles.STUDENT);

  const [appointment, setAppointment] = useState<IAppointment | null>(null);

  const { state, edited }: any = event;
  const start = state.start.value;
  const end = state.end.value;

  const { color, status, _id } = edited;

  const isAvailableSchedule = !status;

  const isSolicited = status === AppointmentStatus.SOLICITED;
  const isPending = status === AppointmentStatus.PENDING;
  const isConfirmed = status === AppointmentStatus.CONFIRMED;
  const isCompleted = status === AppointmentStatus.COMPLETED;

  const getAppointment = async () => {
    try {
      const appointment = await AppointmentService.getById(_id);
      setAppointment(appointment);
    } catch (err) {}
  };

  useEffect(() => {
    if (![AppointmentStatus.SOLICITED].includes(status)) getAppointment();
  }, [_id]);

  const title = isSolicited
    ? 'Asesoría solicitada'
    : isPending
    ? 'Asesoría pendiente'
    : isConfirmed
    ? 'Asesoría confirmada'
    : isCompleted
    ? 'Asesoría completada'
    : 'Programar Asesoría';

  return (
    <div className="w-full">
      <div
        className="flex justify-between mb-3 px-4 pt-8 pb-2 w-auto"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <button
          className="font-bold text-inactive duration-300 hover:text-white focus:outline-none mr-1"
          onClick={event.close}
          aria-label="Cerrar modal"
        >
          X
        </button>
      </div>

      {isAvailableSchedule && isStudent ? (
        <CreateAppointment
          event={event}
          getSchedules={getSchedules}
          subjects={subjects}
        />
      ) : null}

      {isSolicited ? (
        <SolicitedAppointment event={event} getSchedules={getSchedules} />
      ) : null}

      {isPending ? (
        <PendingAppointment
          event={event}
          getSchedules={getSchedules}
          appointment={appointment}
        />
      ) : null}

      {isConfirmed ? (
        <ConfirmedAppointment
          event={event}
          getSchedules={getSchedules}
          appointment={appointment}
        />
      ) : null}

      {isCompleted ? (
        <CompletedAppointment
          event={event}
          getSchedules={getSchedules}
          appointment={appointment}
        />
      ) : null}
    </div>
  );
};
