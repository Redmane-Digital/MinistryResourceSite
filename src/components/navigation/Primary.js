/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useRef } from 'react';
import { Link } from 'gatsby';
import { translateLink } from '../../hooks/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUser, faShoppingCart, faTimes, faSignOutAlt, faSignInAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks';
import styled from 'styled-components';
import { useTranslateContext, useTranslations } from 'gatsby-plugin-translate';

const AuthDropdown = styled.ul`
    right: 0;
    left: auto;
    border: none;
    border-radius: 0;
    box-shadow: 0 0 20px #00000040;
    margin: 1rem 0 0;
`;

const AuthItem = styled.li`
    &:hover, > span:hover, > a:hover {
        background: transparent
    }
`;

const Separator = styled.hr`
    width: calc(100% - 2rem);
    margin: 0.5rem 0rem 0.5rem 1rem;
`;

const PrimaryNav = (props) => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const auth = useAuth();
    const mobileNavRef = useRef(null);
    const {language} = useTranslateContext();
    const t = useTranslations();

    const closeModal = () => mobileNavRef.current.click();

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-navbar">
                <div className="container">
                    <Link to={translateLink("/", language)} className="navbar-brand mb-0 h1">
                        <img src="https://media.graphassets.com/kloKxpVSQFeMtJWzzvQP" style={{ height: 55 }} alt="Mannahouse Resource" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="modal" data-target="#mobileNav" aria-label="Navigation menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-around">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to={translateLink("/", language)} className="nav-link" activeClassName="active" exact>{t`Home`}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={translateLink("/resources", language)} className="nav-link" activeClassName="active" exact>{t`Resources`}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={translateLink("/training", language)} className="nav-link" activeClassName="active">{t`Training`}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={translateLink("/books", language)} className="nav-link" activeClassName="active">{t`Books`}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={translateLink("/about", language)} activeClassName="active">{t`About Us`}</Link>
                            </li>
                            {!isAuthenticated && (
                                <li className="nav-item">
                                    <Link className="nav-link" to={translateLink("/signup", language)} activeClassName="active">{t`Sign Up`}</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    <ul className="navbar-nav mb-2 mb-lg-0 d-none d-lg-flex">
                        <li className="nav-item">
                            <Link to={translateLink("/cart", language)} aria-label="Go to Cart"><FontAwesomeIcon icon={faShoppingCart} style={{ color: '#e9e1cc' }} size="lg" /></Link>
                        </li>
                        <li className="nav-item dropdown">
                            <span className="nav-link dropdown-toggle acct py-0" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon icon={faUserCircle} style={{ color: '#e9e1cc' }} size="lg" />
                            </span>
                            <AuthDropdown className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                {isAuthenticated ? (
                                    <>
                                        <AuthItem>
                                            <span className="dropdown-item d-flex">
                                                <FontAwesomeIcon icon={faUserCircle} style={{ color: '#373737' }} size="3x" className="mr-3 font-weight-bold mb-0" />
                                                <span>
                                                    <h4 className="mb-0">{user.displayName}</h4>
                                                    <small className="mb-0">{user.email}</small>
                                                </span>
                                            </span>
                                        </AuthItem>
                                        <li>
                                            <Separator />
                                        </li>
                                        <AuthItem>
                                            <Link to={translateLink("/account", language)} className="dropdown-item">
                                                <FontAwesomeIcon icon={faCog} style={{ color: '#373737' }} size="sm" className="mr-3" />{t`My Account`}
                                            </Link>
                                        </AuthItem>
                                        <li>
                                            <Separator />
                                        </li>
                                        <AuthItem>
                                            <span className="dropdown-item" onClick={auth.signOut} style={{ cursor: 'pointer' }}>
                                                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: '#373737' }} size="sm" className="mr-3" />{t`Sign Out`}
                                            </span>
                                        </AuthItem>
                                    </>
                                ) : (
                                        <>
                                            <AuthItem>
                                                <Link to={translateLink("/signin", language)} state={{ from: props?.location?.pathName }} className="dropdown-item">
                                                    <FontAwesomeIcon icon={faSignInAlt} style={{ color: '#373737' }} size="sm" className="mr-3" />{t`Sign In`}
                                                </Link>
                                            </AuthItem>
                                            <li>
                                                <Separator />
                                            </li>
                                            <AuthItem>
                                                <Link to={translateLink("/signup", language)} state={{ from: props?.location?.pathName }} className="dropdown-item">
                                                    <FontAwesomeIcon icon={faUser} style={{ color: '#373737' }} size="sm" className="mr-3" />{t`Create Account`}
                                                </Link>
                                            </AuthItem>
                                        </>
                                    )
                                }
                            </AuthDropdown>
                        </li>
                    </ul >
                </div >
            </nav >
            {/* Mobile Nav */}
            <div className="modal" id="mobileNav" tabIndex="-1">
                <div className="modal-dialog modal-fullscreen text-white">
                    <div className="modal-content bg-primary p-4">
                        <div className="d-flex justify-content-between mb-5">
                            <img src="https://media.graphassets.com/kloKxpVSQFeMtJWzzvQP" style={{ height: 55 }} alt="Mannahouse Resource" />
                            <button type="button" className="btn btn-close text-white px-0" data-dismiss="modal" aria-label="Close" ref={mobileNavRef}>
                                <FontAwesomeIcon icon={faTimes} style={{ color: '#e9e1cc' }} size="2x" />
                            </button>
                        </div>
                        <div>
                            <ul className="navbar-nav mb-2 mb-lg-0 text-center">
                                <li className="nav-item">
                                    <Link to={translateLink("/", language)} className="nav-link text-white h2" activeClassName="active" onClick={closeModal} exact>{t`Home`}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={translateLink("/resources", language)} className="nav-link text-white h2" activeClassName="active" onClick={closeModal} exact>{t`Resources`}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={translateLink("/training", language)} className="nav-link text-white h2" activeClassName="active" onClick={closeModal}>{t`Training`}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={translateLink("/books", language)} className="nav-link text-white h2" activeClassName="active" onClick={closeModal}>{t`Books`}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white h2" to={translateLink("/about", language)} activeClassName="active" onClick={closeModal}>{t`About Us`}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white h2" to={translateLink("/cart", language)} activeClassName="active" onClick={closeModal}>{t`Cart`}</Link>
                                </li>
                                {isAuthenticated ? (
                                    <>
                                        <li><Link to={translateLink("/account", language)} className="nav-link text-white h2" onClick={closeModal}>{t`My Account`}</Link></li>
                                        <li><span className="nav-link text-white h2" onClick={() => { auth.signOut(); closeModal(); }} style={{ cursor: 'pointer' }}>{t`Sign Out`}</span></li>
                                    </>
                                ) : (
                                        <>
                                            <li><Link to={translateLink("/signin", language)} state={{ from: props?.location?.pathName }} className="nav-link text-white h2" onClick={closeModal}>{t`Sign In`}</Link></li>
                                            <li><Link to={translateLink("/signup", language)} state={{ from: props?.location?.pathName }} className="nav-link text-white h2" onClick={closeModal}>{t`Create Account`}</Link></li>
                                        </>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrimaryNav;