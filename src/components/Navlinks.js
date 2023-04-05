import links from '../utils/links';
import { NavLink } from 'react-router-dom';

import React from 'react';

const Navlinks = ({ toggleSidebar }) => {
	return (
		<div className='nav-links'>
			{links.map((link) => {
				return (
					<NavLink
						className={({ isActive }) =>
							isActive ? 'nav-link active' : 'nav-link'
						}
						key={link.id}
						to={link.path}
						onClick={toggleSidebar}
						end
					>
						<span className='icon'>{link.icon}</span>
						{link.text}
					</NavLink>
				);
			})}
		</div>
	);
};

export default Navlinks;
