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
  getSchedules: () => {},
}

const calculateHours = (start: Date, end: Date): number[] => {
  const startHour = dayjs(start).hour();
  const endHour = dayjs(end).hour();
  return Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i,
  );
};

export const SchedulingComponent: React.FC<Props> = ({ event, subjects, getSchedules }) => {
  const { state, edited }: any = event;
  const start = state.start.value;
  const end = state.end.value;

  const { date, color, teacherId } = edited;

const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<IFormInput>({
    [FormKeys.START]: dayjs(start).toDate(),
    [FormKeys.END]: dayjs(end).toDate(),
    [FormKeys.SUBJECT]: subjects[0],
    [FormKeys.DESCRIPTION]: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const validateHours = () => {
    const startHour = dayjs(formData[FormKeys.START]).hour();
    const endHour = dayjs(formData[FormKeys.END]).hour();

    if (startHour > endHour) {
      setValidationError('La hora de inicio debe ser menor que la hora de fin');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateHours()) return;
    
    const { end, start, description, subject } = formData;
    
    const hours = calculateHours(start, end);

    const data = {
      date,
      hours,
      teacher: teacherId,
      description,
      subject: subject._id,
    };

    
    setLoading(true)
    // setLoadingCalendar(true);
    toast.loading('Cargando...', { id: 'loading' });
    try {
      await AppointmentService.createAppointment(data);
      toast.success('Asesoría agendada exitosamente');
      setLoading(true)
      getSchedules()
      event.close();
    } catch (error: any) {
      setLoading(false)
      toast.error(error.message, { id: 'error' });
    } finally {
      toast.remove('loading');
    }
  };

  return (
    <div className="">
      <div
        className="flex justify-between mb-3 px-4 pt-8 pb-2"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-2xl font-semibold text-white">
          Programar Asesoría
        </h3>
        <button
          className="text-form-strokedark duration-300 hover:text-white focus:outline-none mr-1"
          onClick={event.close}
          aria-label="Cerrar modal"
        >
          X
        </button>
      </div>

      <form onSubmit={handleSubmit} className="m-5">
        <h2 className="mb-4">
          Fecha: <span className="font-thin">{date}</span>
        </h2>
        <div className="flex gap-2.5">
          <MobileTimePicker
            label={'Inicio'}
            defaultValue={dayjs(start)}
            minTime={dayjs(start)}
            maxTime={dayjs(end)}
            views={['hours']}
            format="hh:mm"
            ampm={false}
            onChange={(value) =>
              setFormData({ ...formData, [FormKeys.START]: value?.toDate()! })
            }
          />
          <MobileTimePicker
            label={'Fin'}
            defaultValue={dayjs(end)}
            minTime={dayjs(start)}
            maxTime={dayjs(end)}
            views={['hours']}
            format="hh:mm"
            ampm={false}
            onChange={(value) =>
              setFormData({ ...formData, [FormKeys.END]: value?.toDate()! })
            }
          />
        </div>

        <div className="flex mt-2.5 w-100">
          <TextField
            select
            label="Materia"
            defaultValue=""
            className="w-100"
            value={formData[FormKeys.SUBJECT]._id}
            onChange={(e) => {
              const selectedSubject = subjects.find(
                (subject) => subject._id === e.target.value,
              );
              if (selectedSubject) {
                setFormData({
                  ...formData,
                  [FormKeys.SUBJECT]: selectedSubject,
                });
              }
            }}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                {subject.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="mt-2.5">
          <TextField
            label="Descripción"
            multiline
            className="w-100"
            helperText="Especifica el tema de la asesoría"
            value={formData[FormKeys.DESCRIPTION]}
            onChange={(e) =>
              setFormData({
                ...formData,
                [FormKeys.DESCRIPTION]: e.target.value,
              })
            }
          />
        </div>
        <div className="mt-5">
          <GlobalButton type='submit' disabled={loading} backgroundColor="success" text="Crear" />
        </div>
      </form>
    </div>
  );
};
