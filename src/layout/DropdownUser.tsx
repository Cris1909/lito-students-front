import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { BiLogOut } from 'react-icons/bi';

import userIcon from '../assets/images/user.png';

import { useAppDispatch, useAppSelector } from '../hooks';
import { startLogout } from '../store';
import { ROUTES, Roles } from '../enums';
import { selectAuthSlice } from '../store/reducers/auth/authSlice';
import { MdKeyboardArrowDown, MdKeyboardControlKey } from 'react-icons/md';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { user } = useAppSelector(selectAuthSlice);
  const { name, roles } = user;

  const displayRole = roles.some((e) => e === Roles.ADMIN)
    ? 'Administrador'
    : 'Estudiante';

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  const handleLogout = async () => {
    await dispatch(startLogout());
    location.reload();
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="text-right">
          <span className="block text-sm font-medium text-black dark:text-white">
            {name}
          </span>
          <span className="block text-xs">{displayRole}</span>
        </span>

        <span className="h-8 w-8 rounded-full">
          <img src={userIcon} alt="User" />
        </span>

        {dropdownOpen ? (
          <MdKeyboardControlKey style={{ height: 22, width: 22 }} />
        ) : (
          <MdKeyboardArrowDown style={{ height: 22, width: 22 }} />
        )}
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <button
          className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          onClick={handleLogout}
        >
          <BiLogOut style={{ width: 22, height: 22 }} />
          Cerrar sesión
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
