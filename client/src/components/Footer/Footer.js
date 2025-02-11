import React from 'react';
import { useTheme } from '../../context/themeContext';
import twitterlogo from '../../assets/twitterlogo.svg'
import instalogo from '../../assets/instalogo.svg'
import fblogo from '../../assets/fblogo.svg'
import './footer.styles.css';

const Footer = () => {

    const darkMode = useTheme();

    return (
        <div className={`footer ${darkMode ? 'dark' : ''}`}>
            <div className="col">
                <h1>Company</h1>
                <ul>
                    <li>About</li>
                    <li>Mission</li>
                    <li>Services</li>
                    <li>Social</li>
                    <li>Get in touch</li>
                </ul>
            </div>

            <div className="col">
                <h1>Products</h1>
                <ul>
                    <li>About</li>
                    <li>Mission</li>
                    <li>Services</li>
                    <li>Social</li>
                    <li>Get in touch</li>
                </ul>
            </div>

            <div className="col">
                <h1>Accounts</h1>
                <ul>
                    <li>About</li>
                    <li>Mission</li>    
                    <li>Services</li>
                    <li>Social</li>
                    <li>Get in touch</li>
                </ul>
            </div>

            <div className="col">
                <h1>Resources</h1>
                <ul>
                    <li>Webmail</li>
                    <li>Redeem code</li>
                    <li>WHOIS lookup</li>
                    <li>Site map</li>
                    <li>Web templates</li>
                    <li>Email templates</li>
                </ul>
            </div>

            <div className="col">
                <h1>Support</h1>
                <ul>
                    <li>Contact us</li>
                    <li>Web chat</li>
                    <li>Open ticket</li>
                </ul>
            </div>

            <div className="col">
                <h1>Social</h1>
                <ul>
                    <li>
                        <img
                            src={fblogo}
                            alt="Facebook"
                            width="32"
                        />
                    </li>
                    <li>
                        <img
                            src={twitterlogo}
                            alt="Twitter"
                            width="32"
                        />
                    </li>
                    <li>
                        <img
                            src={instalogo}
                            alt="Instagram"
                            width="32"
                        />
                    </li>
                </ul>
            </div>
            <div className="clearfix"></div>
        </div>
    );
};

export default Footer;