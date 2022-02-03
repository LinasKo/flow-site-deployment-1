import React from 'react';
import logo from './assets/logo.png';

import { Anchor } from 'antd';

const { Link } = Anchor;

const Header = () => {
    return(
        <div className='header' id="header_section">   
            <div className='container'>
                <div className='row'>
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container">
                            <a className="navbar-brand" href="/">
                                <img src={logo} alt='lets flow logo'/>
                            </a>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                            <div className="collapse navbar-collapse" id="navbarToggler">
                                
                                <Anchor >
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
                                        <li className="nav-item">
                                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="#program" title="Features" className="nav-link"/>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="#contact-section" title="Get in touch" className="nav-link"/>
                                        </li>
                                    </ul>
                                </Anchor>
                                    
                            </div>
                            <div className="d-flex">
                                    <Anchor>
                                        <Link href="#subscribe" title="Subscribe" className='btn newsletter-btn hvr-sweep-to-right'/>
                                    </Anchor>
                                    
                                </div>
                        </div>
                    </nav>
                </div>
            </div>

        </div>
    );
}
export default Header;