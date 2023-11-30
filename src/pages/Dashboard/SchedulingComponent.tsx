import { useState } from 'react';
import { SchedulerHelpers } from '@aldabil/react-scheduler/types';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { MobileTimePicker } from '@mui/x-date-pickers';

import 'react-responsive-modal/styles.css';

import { MenuItem, TextField } from '@mui/material';
import { ISubject } from '../../interfaces';
import { GlobalButton } from '../../components';
import { AppointmentService } from '../../services';
import { CreateAppointment } from './CreateAppointment';
import { useAppSelector } from '../../hooks';
import { selectAuthSlice } from '../../store/reducers/auth/authSlice';
import { AppointmentStatus, Roles } from '../../enums';
import { SolicitedAppointment } from './SolicitedAppointment';

enum FormKeys {
  START = 'start',
  END = 'end',
  SUBJECT = 'subject',
  DESCRIPTION = 'description',
}
interface IFormInput {
  [FormKeys.START]: Date;
  [FormKeys.END]: Date;
  [FormKeys.SUBJECT]: ISubject;
  [FormKeys.DESCRIPTION]: string;
}

interface Props {
  event: SchedulerHelpers;
  subjects: ISubject[];
  getSchedules: () => {};
}

const calculateHours = (start: Date, end: Date): number[] => {
  const startHour = dayjs(start).hour();
  const endHour = dayjs(end).hour();
  return Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i,
  );
};

export const SchedulingComponent: React.FC<Props> = ({
  event,
  subjects,
  getSchedules,
}) => {
  const { user } = useAppSelector(selectAuthSlice);

  const { roles } = user;

  const isStudent = roles.includes(Roles.STUDENT);

  const { state, edited }: any = event;
  // const start = state.start.value;
  // const end = state.end.value;

  const { color, status } = edited;

  const isAvailableSchedule = !status;

  const isSolicited = status === AppointmentStatus.SOLICITED;

  const title = isSolicited ? 'Asesoría pendiente' : 'Programar Asesoría';

  return (
    <div className="">
      <div
        className="flex justify-between mb-3 px-4 pt-8 pb-2 w-auto"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <button
          className="text-form-strokedark duration-300 hover:text-white focus:outline-none mr-1"
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

      {isSolicited ? <SolicitedAppointment event={event} getSchedules={getSchedules} />: null}
    </div>
  );
};
