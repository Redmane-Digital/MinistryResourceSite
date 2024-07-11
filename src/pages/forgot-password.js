/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useState, useEffect } from 'react';
import { booksImg } from '../components/heroes/images';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useAuth } from '../hooks';
import { useSelector } from 'react-redux';
import { useTranslations, useTranslateContext } from 'gatsby-plugin-translate';
import { translateLink } from '../hooks/'

const Input = styled.input`
    background: #eeeeee;
`;

const ForgotPassword = ({ location }) => {
    const auth = useAuth();
    const t = useTranslations();
    const { language } = useTranslateContext();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [formData, setFormData] = useState({ password: '' });
    const handleChange = function (e) {
        setFormData({ password: e.target.value });
    };
    const reset = function (e) {
        e.preventDefault();
        auth.resetPassword(formData.password).then(() => {
            const goTo = location.state.from ? location.state.from : '/';
            navigate(translateLink(goTo, language));
        });
    };

    useEffect(() => {
        const redirectIfAuth = () => {
            if (isAuthenticated) {
                const goTo = location.state.from ? location.state.from : '/';
                navigate(translateLink(goTo, language));
            }
        };
        redirectIfAuth();
    }, [isAuthenticated]);

    return (
        <Layout location={location}>
            <SEO title={t`Forgot Password`} />
            <section
                style={{
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundColor: '#eeeeee',
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${booksImg}')`
                }}>
                <div className="container py-5">
                    <h1 className="kapra font-weight-bold my-4 display-1 text-center" style={{ color: '#e8e1cf' }}>{t`Reset Your Password`}</h1>
                </div>
            </section>
            <section className="container reduced-width my-5">
                <form onSubmit={reset}>
                    <div className="mb-3">
                        <label for="email" className="form-label">{t`Email address`}</label>
                        <Input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={formData.email} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-shadow btn-sm text-white mt-3">{t`Reset`}</button>
                </form>
            </section>
        </Layout>
    );
};

export default ForgotPassword;