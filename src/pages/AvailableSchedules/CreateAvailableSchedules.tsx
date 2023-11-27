import React, { useState } from 'react';
import dayjs from 'dayjs';

import { Calendar } from 'primereact/calendar';
import { HourSelection } from './HourSelection';
import { PiBroom, PiPaperPlaneTilt } from 'react-icons/pi';
import { GlobalButton } from '../../components';
import { AvailableSchedulesService } from '../../services';
import toast from 'react-hot-toast';
import { Errors } from '../../enums';

const CreateAvailableSchedules = () => {
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateChange = (e: any) => setSelectedDate(e.value);

  const formatSelectedDate = (date: Date | undefined) => {
    return date ? dayjs(date).format('YYYY-MM-DD') : ''; // Formato como 'yyyy-mm-dd'
  };

  const clearAllHours = () => setSelectedHours([]);

  const errorHandlers: any = {
    [Errors.HOURS_INVALID]: () =>
      toast.error('Las horas que ingresaste son invalidas', { id: 'error' }),
    [Errors.DATE_INVALID_FORMAT]: () =>
      toast.error('La fecha no cumple con el formato YYYY-MM-DD', {
        id: 'error',
      }),
    [Errors.DATE_IS_PREVIOUS]: () =>
    toast.error('La fecha que ingresaste ya pasó', { id: 'error' }),
    [Errors.HOURS_EMPTY]: () =>
    toast.error('Debes seleccionar por lo menos una hora', { id: 'error' }),
    [Errors.AVAILABLE_SCHEDULE_EXIST]: () =>
    toast.error('Esta fecha ya tiene un horario asignado', { id: 'error' }),
  };

  const handleErrors = (error: any) => {
    const errorHandler = errorHandlers[error];
    console.log({errorHandler})
    if (errorHandler) return errorHandler();
    toast.error('Ha ocurrido un error', { id: 'error' });
  };

  const createAvailableSchedule = async () => {

    if(!selectedDate) return toast.error('Debes seleccionar una fecha para crear un horario disponible', {id: 'error'})
    if(!selectedHours.length) return toast.error('Debes seleccionar por lo menos una hora', {id: 'error'})

    const body = {
      hours: selectedHours,
      date: formatSelectedDate(selectedDate),
    };
    toast.remove('error');
    toast.loading('Cargando...', { id: 'loading' });
    try {
      await AvailableSchedulesService.createAvailableSchedule(body);
      toast.remove('loading');
      toast.success('Horario disponible creado con éxito');
      setSelectedDate(undefined);
      setSelectedHours([]);
    } catch (error: any) {
      toast.remove('loading');
      handleErrors(error?.message);
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-full md:w-1/2 p-2">
        <h3 className="text-xl font-semibold text-black dark:text-white text-center pb-3">
          {selectedDate
            ? `Fecha escogida: ${formatSelectedDate(selectedDate)}`
            : 'Selecciona una fecha'}
        </h3>
        <div className="flex justify-center">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            inline
            className="w-100"
            dateFormat="yy-mm-dd"
            minDate={new Date()}
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 p-2 px-4">
        {selectedDate ? (
          <div className="animate__animated animate__fadeInRight">
            <h3 className="text-xl font-semibold text-black dark:text-white text-center pb-3">
              Escoge las horas
            </h3>
            <HourSelection
              selectedHours={selectedHours}
              setSelectedHours={setSelectedHours}
              targetDate={selectedDate}
            />
            <hr className="w-90 m-auto my-3 text-black dark:text-bodydark1 opacity-50" />
            <div className="flex justify-center gap-6">
              <GlobalButton
                text="Limpiar horas"
                onClick={clearAllHours}
                icon={<PiBroom />}
                classStyle="w-auto h-12"
                backgroundColor="danger"
              />
              <GlobalButton
                disabled={!selectedHours.length}
                text="Guardar"
                onClick={createAvailableSchedule}
                icon={<PiPaperPlaneTilt />}
                backgroundColor="success"
                classStyle="w-auto h-12"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CreateAvailableSchedules;
