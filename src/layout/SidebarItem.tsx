import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardControlKey } from 'react-icons/md';

import SidebarLinkGroup from './SidebarLinkGroup';

import { ISection } from '../interfaces';

interface Props {
  sidebarExpanded: boolean,
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>,
  section: ISection
}

export const SidebarItem = ({ sidebarExpanded, setSidebarExpanded, section }: Props) => {
  const { path, name, Icon, children } = section;

  const location = useLocation();
  const { pathname } = location;

  return (
    <SidebarLinkGroup
      activeCondition={pathname === `${path}` || pathname.includes(path)}
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <NavLink
              to="#"
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === '/subjects' || pathname.includes('subjects')) &&
                'bg-graydark dark:bg-meta-4'
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
              }}
            >
              {Icon}
              {name}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 fill-current">
                {open ? (
                  <MdKeyboardControlKey style={{ height: 22, width: 22 }} />
                ) : (
                  <MdKeyboardArrowDown style={{ height: 22, width: 22 }} />
                )}
              </span>
            </NavLink>
            {/* <!-- Dropdown Menu Start --> */}
            {!children.length ? null : (
              <div
                className={`translate transform overflow-hidden ${
                  !open && 'hidden'
                }`}
              >
                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                  {children.map(({ path, name }) => (
                    <li key={path}>
                      <NavLink
                        to={path}
                        className={({ isActive }) =>
                          'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                          (isActive && '!text-white')
                        }
                      >
                        {name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* <!-- Dropdown Menu End --> */}
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
  );
};
