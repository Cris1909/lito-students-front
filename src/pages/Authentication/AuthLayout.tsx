import { Link, Outlet } from 'react-router-dom';

import Logo from '../../assets/images/logo.png';
import LogoText from '../../assets/images/logo-text.png';

import EducationItems from '../../assets/images/education-items.png';

export const AuthLayout: React.FC = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap">
        <div className="hidden w-full lg:block lg:w-1/2 h-screen">
          <div className="py-17.5 px-26 text-center">
            <Link className="inline-block" to="/">
              <img className="hidden dark:block" src={LogoText} alt="Logo" />
              <img className="dark:hidden" src={LogoText} alt="Logo" />
            </Link>
            <p className="2xl:px-20">
              Un espacio para fortalecer tus conocimientos
            </p>
            <div className="grid place-items-center mt-10">
              <img src={EducationItems} width={300} height={300} />
            </div>
          </div>
        </div>
        <div className="w-full border-stroke dark:border-strokedark lg:w-1/2 lg:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">{<Outlet />}</div>
        </div>
      </div>
    </div>
  );
};
