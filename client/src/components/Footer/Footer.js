import '@fortawesome/fontawesome-free/css/all.min.css';
import { useTheme } from '../../context/themeContext';
import React from 'react';
import './footer.styles.css';

const Footer = () => {
    const darkMode = useTheme();

    return (
        <footer className={`footer ${darkMode ? 'dark' : ''}`}>
            <div className="container">
                <div className="footer-content">
                    {/* Brand & Social */}
                    <div className="footer-brand">
                        <h2 className="brand-name">Flicklog</h2>
                        <div className="social-icons">
                            <a href="/#" className="social-icon" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="/#" className="social-icon" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                            <a href="/#" className="social-icon" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="/#" className="social-icon" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="/#" className="social-icon" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
                        </div>
                        <ul className="legal-links">
                            <li><a href="/#">Trust</a></li>
                            <li><a href="/#">Privacy</a></li>
                            <li><a href="/#">Terms of use</a></li>
                            <li><a href="/#">Legal notices</a></li>
                            <li><a href="/#">About us</a></li>
                        </ul>
                    </div>

                    {/* Footer Nav Columns */}
                    <div className="footer-links-container">
                        <div className="footer-links-column">
                            <h3 className="column-title">USE CASES</h3>
                            <ul className="footer-links">
                                <li><a href="/#">Vector database</a></li>
                                <li><a href="/#">Feature stores</a></li>
                                <li><a href="/#">Semantic cache</a></li>
                                <li><a href="/#">Caching</a></li>
                            </ul>
                        </div>
                        <div className="footer-links-column">
                            <h3 className="column-title">INDUSTRIES</h3>
                            <ul className="footer-links">
                                <li><a href="/#">Financial Services</a></li>
                                <li><a href="/#">Gaming</a></li>
                                <li><a href="/#">Healthcare</a></li>
                                <li><a href="/#">Retail</a></li>
                            </ul>
                        </div>
                        <div className="footer-links-column">
                            <h3 className="column-title">COMPARE</h3>
                            <ul className="footer-links">
                                <li><a href="/#">Redis vs Elasticache</a></li>
                                <li><a href="/#">Redis vs Memcached</a></li>
                                <li><a href="/#">Redis vs Memory Store</a></li>
                                <li><a href="/#">Redis vs Source Available</a></li>
                            </ul>
                        </div>
                        <div className="footer-links-column">
                            <h3 className="column-title">CONNECT</h3>
                            <ul className="footer-links">
                                <li><a href="/#">Community</a></li>
                                <li><a href="/#">Events & webinars</a></li>
                                <li><a href="/#">News</a></li>
                            </ul>
                        </div>
                        <div className="footer-links-column">
                            <h3 className="column-title">PARTNERS</h3>
                            <ul className="footer-links">
                                <li><a href="/#">Amazon Web Services</a></li>
                                <li><a href="/#">Google Cloud</a></li>
                                <li><a href="/#">Microsoft Azure</a></li>
                                <li><a href="/#">All partners</a></li>
                            </ul>
                        </div>
                        <div className="footer-links-column">
                            <h3 className="column-title">SUPPORT</h3>
                            <ul className="footer-links">
                                <li><a href="/#">Professional services</a></li>
                                <li><a href="/#">Support</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright row */}
                <div className="footer-copyright">
                    © {new Date().getFullYear()} Flicklog. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
