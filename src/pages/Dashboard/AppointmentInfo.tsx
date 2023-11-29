import dayjs from 'dayjs';
import React from 'react';
import { ISubject, IUser } from '../../interfaces';
import { Image } from 'primereact/image';
import { AppointmentColors, AppointmentStatus, AppointmentStatusText, Roles } from '../../enums';
import { useAppSelector } from '../../hooks';
import { selectAuthSlice } from '../../store/reducers/auth/authSlice';

interface Props {
  date: string;
  hours: number[];
  start: Date;
  end: Date;
  subject: ISubject;
  user: IUser;
  description: string;
  createdAt: string;
  status: AppointmentStatus;
  teacher: IUser;
}

export const AppointmentInfo: React.FC<Props> = ({
  date,
  end,
  start,
  subject,
  user,
  description,
  createdAt,
  status,
  teacher,
}) => {
  const { roles } = useAppSelector(selectAuthSlice).user;

  const { img } = subject;

  const hourStart = `${dayjs(start).get('hour')}:00`;
  const hourEnd = `${dayjs(end).get('hour')}:59`;

  const color = AppointmentColors[status];

  const isStudent = roles.includes(Roles.STUDENT);
  const isTeacher = roles.includes(Roles.TEACHER);

  return (
    <div className="w-full">
      <div className="flex mb-4 md:justify-around px-2">
        <h2 className="font-medium w-1/2 md:w-auto">
          Fecha: <span className="font-thin">{date}</span>
        </h2>
        <h2 className="font-medium w-1/2 md:w-auto">
          Horas:{' '}
          <span className="font-thin">
            {hourStart} - {hourEnd}
          </span>
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row w-full gap-2.5">
        <div className="w-full sm:w-1/2 md:w-1/3 p-2 font-medium">
          <div className="flex flex-row sm:flex-col w-full">
            {isTeacher ? (
              <div className="w-1/2 sm:w-full sm:mb-2.5">
                <p>
                  Estudiante: <span className="font-thin">{user.name}</span>
                </p>
                <p>
                  Correo: <span className="font-thin">{user.email}</span>
                </p>
                <p>
                  Teléfono: <span className="font-thin">{user.phoneNumber}</span>
                </p>
              </div>
            ) : null}
               {isStudent ? (
              <div className="w-1/2 sm:w-full sm:mb-2.5">
                <p>
                  Profesor: <span className="font-thin">{teacher.name}</span>
                </p>
                <p>
                  Correo: <span className="font-thin">{teacher.email}</span>
                </p>
                <p>
                  Teléfono: <span className="font-thin">{teacher.phoneNumber}</span>
                </p>
              </div>
            ) : null}
            <div className="w-1/2 sm:w-full">
              <p>
                Fecha de agendamiento:{' '}
                <span className="font-thin block">
                  {dayjs(createdAt).format('L LT')}
                </span>
              </p>
              <p>
                Estado:{' '}
                <span
                  className="font-extrabold py-0.5 px-2.5 rounded-full text-white font-outline"
                  style={{ backgroundColor: color }}
                >
                  {AppointmentStatusText[status]}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 md:w-2/3 p-2">
          <div className="rounded-lg border-black border-2">
            <span className=" rounded-tl-lg rounded-br-lg absolute font-bold px-4 py-1 bg-white  border-black border-r-2 border-b-2 ">
              {subject.name}
            </span>
            <Image
              src={img}
              alt="Imagen de la materia"
              imageClassName="rounded-lg"
              loading="lazy"
            />
          </div>
          <p className="font-medium">
            Descripción: <span className="font-thin">{description}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
