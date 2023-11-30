import React, { useEffect, useState } from 'react';
import { FaUser, FaClock, FaStar, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { PieChart } from '@mui/x-charts/PieChart';

import { useAppSelector } from '../../hooks';
import { selectAuthSlice } from '../../store/reducers/auth/authSlice';
import { AppointmentService, AuthService } from '../../services';
import { Loader } from '../../common';
import { IAppointment, ISubject } from '../../interfaces';

const StatisticsScreen = () => {
  const { user } = useAppSelector(selectAuthSlice);
  const { roles } = user;
  const isTeacher = roles.includes('TEACHER');

  const [loading, setLoading] = useState(true);

  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [appointmentHours, setAppointmentHours] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [completedAppointments, setCompletedAppointments] = useState<number>(0);
  const [pieData, setPieData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          studentsCount,
          appointmentHours,
          averageRating,
          appointmentBySubject,
          completedAppointments,
        ] = await Promise.all([
          AuthService.getStudentsCount(),
          AppointmentService.getAppointmentHours(),
          AppointmentService.getAverageRating(),
          AppointmentService.getAppointmentsBySubject(),
          AppointmentService.getCompletedAppointments(),
        ]);

        console.log({
          studentsCount,
          appointmentHours,
          averageRating,
          appointmentBySubject,
        });
        setStudentsCount(studentsCount);
        setAppointmentHours(appointmentHours);
        setAverageRating(averageRating);
        setCompletedAppointments(completedAppointments);

        const parseData = appointmentBySubject.map((e, i: number) => ({
          id: i,
          value: e.count,
          label: e?.subject?.name,
        }));

        setPieData(parseData);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);

        toast.error(error?.message);
        console.error('Error fetching statistics:', error.message);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-white">Estadísticas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white p-4 rounded-lg flex items-center shadow-4">
          <FaUser className="text-4xl text-primary mr-2" />
          <div>
            <p className="text-lg font-semibold">Estudiantes</p>
            <p className="text-xl">{studentsCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg flex items-center shadow-4">
          <FaClock className="text-4xl text-primary mr-2" />
          <div>
            <p className="text-lg font-semibold">Horas de Asesoría</p>
            <p className="text-xl">{appointmentHours}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg flex items-center shadow-4">
          <FaCheck className="text-4xl text-primary mr-2" />
          <div>
            <p className="text-lg font-semibold">Asesorías completadas</p>
            <p className="text-xl">{completedAppointments}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg flex items-center shadow-4">
          <FaStar className="text-4xl text-primary mr-2" />
          <div>
            <p className="text-lg font-semibold">Calificación Promedio</p>
            <p className="text-xl">{averageRating.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full">
        <div className="bg-white p-4 rounded-lg flex items-center shadow-4">
          <div>
            <p className="text-lg font-semibold">
              Cantidad de asesorías por materia
            </p>
            <PieChart
              series={[
                {
                  data: pieData,
                },
              ]}
              width={400}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsScreen;
