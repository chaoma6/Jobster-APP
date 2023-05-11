import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import React from 'react';
import { Logo } from '../components';
import { Link } from 'react-router-dom';

const Landing = () => {
	return (
		<Wrapper>
			<nav>
				<Logo />
			</nav>
			<div className='container page'>
				{/* info */}
				<div className='info'>
					<h1>
						job <span>tracking</span> app
					</h1>
					<p>
						Maximize Your Job Search Success with Our Job Tracking App -
						Powerful Stats to Help You Optimize Your Strategy and Land Your
						Dream Job!
					</p>
					<Link to='/register' className='btn btn-hero'>
						Login / Register
					</Link>
				</div>
				<img src={main} alt='job hunt' className='img main-img' />
			</div>
		</Wrapper>
	);
};

export default Landing;
