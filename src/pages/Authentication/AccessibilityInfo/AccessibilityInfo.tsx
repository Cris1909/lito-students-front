import { useLocation } from 'react-router-dom';
import { FaHeart, FaBrain, FaHandsHelping, FaInfoCircle } from 'react-icons/fa';

interface LocationState {
  hasSpecialNeeds: boolean;
  needsEmotionalSupport: boolean;
  userData: any;
}

export const AccessibilityInfo = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  const { hasSpecialNeeds, needsEmotionalSupport } = state || {};

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary-600 dark:text-white mb-4">
          Gracias por confiar en nosotros 💙
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Tu bienestar es nuestra prioridad
        </p>
      </div>

      <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <FaInfoCircle className="text-primary-600 dark:text-primary-400 text-3xl" />
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Información importante
          </h3>
        </div>
        <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed">
          Actualmente, nuestra plataforma se encuentra en proceso de{' '}
          <span className="font-semibold text-primary-600 dark:text-primary-400">
            adaptación y mejora continua
          </span>{' '}
          para ofrecer un mejor servicio a estudiantes con necesidades educativas especiales.
        </p>
      </div>

      {hasSpecialNeeds && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-md border-l-4 border-purple-500">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <FaBrain className="text-purple-600 dark:text-purple-300 text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Apoyo educativo especializado
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Estamos trabajando para implementar herramientas de apoyo educativo 
                según el formato <strong>PIAR (Plan Individual de Ajustes Razonables)</strong>, 
                que nos permitirá adaptar la experiencia de aprendizaje a tus necesidades específicas.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>¿Qué incluirá el PIAR?</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                  <li>Ajustes personalizados en materiales de estudio</li>
                  <li>Tiempos flexibles para actividades</li>
                  <li>Recursos adicionales de apoyo</li>
                  <li>Seguimiento especializado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {needsEmotionalSupport && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-md border-l-4 border-pink-500">
          <div className="flex items-start gap-4">
            <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-full">
              <FaHeart className="text-pink-600 dark:text-pink-300 text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Apoyo emocional y acompañamiento
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Entendemos que el bienestar emocional es fundamental para el aprendizaje. 
                Estamos desarrollando un programa de acompañamiento que incluirá:
              </p>
              <div className="bg-pink-50 dark:bg-pink-900/30 rounded-lg p-4">
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Red de apoyo con profesionales</li>
                  <li>Recursos de salud mental</li>
                  <li>Espacios de escucha activa</li>
                  <li>Orientación personalizada</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 mb-8 shadow-md">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <FaHandsHelping className="text-green-600 dark:text-green-300 text-2xl" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Estamos aquí para ti
            </h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Pronto te notificaremos cuando las funciones de apoyo especializado 
              estén disponibles. Tu información ha sido registrada y te contactaremos cuando 
              todo esté listo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
