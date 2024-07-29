/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import LogoTan from '../../images/MHR_logo.svg';
import Mannahouse from '../../images/mannahouse.jpg';
import PBC from '../../images/pbc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import { Link, navigate } from 'gatsby';
import { translateLink } from '../../hooks/';
import { useSelector } from 'react-redux';
import { useTranslateContext, useTranslations } from 'gatsby-plugin-translate';

const Copyright = () => {
  return (
    <p className="mt-5 mb-0 text-center text-sm-left">
      <small>
        Copyright ©{new Date().getFullYear()} Mannahouse Church, All Rights
        Reserved.
      </small>
    </p>
  );
};

const LanguageSelector = () => {
  const { language } = useTranslateContext();
  const changeLanguage = (e) => {
    const route = new URL(window.location.href);
    const originalPath = route.pathname.replace(`/${language}`, '');
    route.pathname =
      e.target.value == 'en'
        ? originalPath
        : `/${e.target.value}${originalPath}`;

    navigate(route.pathname + route.search);
  };

  return (
    <select
      onChange={changeLanguage}
      value={language}
      style={{
        width: '100%',
        padding: '5px 10px',
        margin: '10px 0',
        color: '#fff',
        background: 'transparent',
        border: '1px solid #a9b3b5',
      }}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
};

const WhitelabelFooter = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const t = useTranslations();
  const { language } = useTranslateContext();

  return (
    <footer className="bg-footer p-5 text-white mt-auto">
      <div className="container d-flex w-100 justify-content-between flex-sm-row flex-column text-center">
        <div>
          <img
            src={FooterLogo}
            alt="TFH Resource"
            style={{ height: 60 }}
            className="d-none d-sm-block"
          />
          <LanguageSelector />
        </div>

        <nav className="navbar navbar-expand-lg navbar-dark my-0 py-0 align-items-start">
          <div className="collapse navbar-collapse justify-content-around">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to={translateLink('/', language)}
                  className="nav-link"
                  activeClassName="active"
                  exact
                >
                  {t`Home`}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={translateLink('/resources', language)}
                  className="nav-link"
                  activeClassName="active"
                  exact
                >
                  {t`Resources`}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={translateLink('/training', language)}
                  className="nav-link"
                  activeClassName="active"
                >
                  {t`Training`}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={translateLink('/books', language)}
                  className="nav-link"
                  activeClassName="active"
                >
                  {t`Books`}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={translateLink('/about', language)}
                  activeClassName="active"
                >{t`About Us`}</Link>
              </li>
              {!isAuthenticated && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={translateLink('/signup', language)}
                    activeClassName="active"
                  >{t`Sign Up`}</Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
        <div className="text-center">
          <a
            href="https://mannahouseresource.com/?ref=mfi-resource"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={Mannahouse}
              alt="Mannahouse Resource"
              className="d-sm-block"
              style={{ width: '100%', maxWidth: 150 }}
            />
          </a>
        </div>
      </div>
      <div className="container d-sm-flex justify-content-between">
        <Copyright />
        {/* <p className="text-uppercase text-center text-sm-right mt-sm-5 mt-2 mb-0">
            <small>
                <span className="mr-3">{t`Connect With Us`}: </span>
                <a href="mailto:connect@mannahouseresource.com" target="_blank" rel="noopener noreferrer" className="mr-2">
                    <FontAwesomeIcon icon={faEnvelopeOpen} style={{ color: '#737c83' }} size="lg" />
                </a>
            </small>
        </p> */}
      </div>
    </footer>
  );
};

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const t = useTranslations();
  const { language } = useTranslateContext();

  return (
    <footer className="bg-footer p-5 text-white mt-auto">
      <div className="container d-flex w-100 justify-content-between flex-sm-row flex-column text-center">
        <div>
          <img
            src={LogoTan}
            alt="Mannahouse Resource"
            style={{ height: 60 }}
            className="d-none d-sm-block"
            loading="lazy"
          />
          <LanguageSelector />
        </div>

        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary my-0 py-0 align-items-start">
          <div className="collapse navbar-collapse justify-content-around">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to={translateLink('/', language)}
                  className="nav-link"
                  activeClassName="active"
                  exact
                >
                  {t`Home`}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={translateLink('/resources', language)}
                  className="nav-link"
                  activeClassName="active"
                  exact
                >
                  {t`Resources`}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={translateLink('/training', language)}
                  className="nav-link"
                  activeClassName="active"
                >
                  {t`Training`}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={translateLink('/books', language)}
                  className="nav-link"
                  activeClassName="active"
                >
                  {t`Books`}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={translateLink('/about', language)}
                  activeClassName="active"
                >{t`About Us`}</Link>
              </li>
              {!isAuthenticated && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={translateLink('/signup', language)}
                    activeClassName="active"
                  >{t`Sign Up`}</Link>
                </li>
              )}
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://www.pbcaccess.com/"
                  target="_blank"
                >
                  PBC Access
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="text-center">
          <a
            href="https://mannahouse.church"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={Mannahouse}
              alt="Mannahouse"
              className="d-sm-block mw-100"
              loading="lazy"
            />
          </a>
          <a
            href="https://portlandbiblecollege.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={PBC}
              alt="Portland Bible College"
              className="d-sm-block mt-3 mw-100"
              loading="lazy"
            />
          </a>
        </div>
      </div>
      <div className="container d-sm-flex justify-content-between">
        <Copyright />
        <p className="text-uppercase text-center text-sm-right mt-sm-5 mt-2 mb-0">
          <small>
            <span className="mr-3">{t`Connect With Us`}: </span>
            <a
              href="mailto:connect@mannahouseresource.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-2"
              aria-label="Email link"
            >
              <FontAwesomeIcon
                icon={faEnvelopeOpen}
                style={{ color: '#737c83' }}
                size="lg"
              />
            </a>
          </small>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
