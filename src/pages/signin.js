/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useState, useEffect } from 'react';
import { booksImg } from '../components/heroes/images';
import signInWithPbcImg from "../images/signinwithPBC.jpg";
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useAuth, getSSO, useQueryString } from '../hooks';
import { useSelector } from 'react-redux';
import { useTranslations, useTranslateContext } from 'gatsby-plugin-translate';
import { translateLink } from '../hooks/';

const Input = styled.input`
    background: #eeeeee;
`;

const SignIn = ({ location }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const auth = useAuth();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [authErr, setError] = useState({ isError: false, msg: '' });
    const [queryString, setQueryString] = useState('');
    const t = useTranslations();
    const { language } = useTranslateContext();
    const handleChange = function (e) {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const { ref, return_to } = useQueryString(location.search);
    const canUsePbcSSO = true;

    const login = function (e) {
        e.preventDefault(); 
        auth.signIn(formData.email, formData.password)
            .then(res => {
                if (res.succeeded === false) {
                    if (res.error.code === "auth/wrong-password") {
                        setError({ isError: true, msg: `${t`Username or password incorrect. Did you sign up with`} PBC Access?` })
                    } else {
                        setError({ isError: true, msg: res.error.message })
                    }
                }
            });
    };

    useEffect(() => {
        if (typeof window !== undefined) {
            const params = new URLSearchParams(window.location.search).toString();
            if (params.length > 0) setQueryString(`?${params}`);
        }
    }, []);

    useEffect(() => {
        const redirectIfAuth = async () => {
            if (isAuthenticated) {
                let goTo;
                if (ref == "pbcaccess") {
                    const tmp = { firstName: user.firstName, lastName: user.lastName, email: user.email };
                    if (return_to) tmp.return_to = return_to;
                    goTo = await getSSO(tmp);
                    window.location = goTo;
                } else {
                    const goTo = location?.state && location.state.from ? location.state.from : '/';
                    navigate(translateLink(goTo, language));
                }
            }
        };
        redirectIfAuth();
    }, [isAuthenticated]);

    return (
        <Layout location={location}>
            <SEO title={t`Sign In`} />
            <section
                style={{
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundColor: '#eeeeee',
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${booksImg}')`
                }}>
                <div className="container py-5">
                    <h1 className="kapra font-weight-bold my-4 display-1 text-center" style={{ color: '#e8e1cf' }}>{t`Sign In To Your Account`}</h1>
                </div>
            </section>
            <section className="container reduced-width my-5">
                {authErr?.isError &&
                    <div class="alert alert-danger" role="alert">
                        {authErr.msg}
                    </div>
                }
                <form onSubmit={login}>
                    <div className="mb-3">
                        <label for="email" className="form-label">{t`Email address`}</label>
                        <Input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label for="password" className="form-label">{t`Password`}</label>
                        <Input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-shadow btn-sm text-white mt-3">{t`Sign In`}</button>
                    <Link to={translateLink(`/forgot-password`, language)} state={{ from: location.state?.from || '/signin' }} class="btn btn-link btn-sm text-primary mt-3">{t`Forgot your password?`}</Link>
                    <Link to={translateLink(`/signup${queryString}`, language)} state={{ from: location.state?.from || translateLink('/signin', language) }} class="btn btn-link btn-sm text-primary mt-3">{t`Create an account`}</Link>
                </form>
                {canUsePbcSSO && <div class="mhr-signin">
                    <div class="text-divider">OR</div>
                    <a class="mhr-btn" href="https://www.pbcaccess.com/pages/sign_into_mhr">
                        <img src={signInWithPbcImg} alt="Sign-in with PBC Access" />
                    </a>
                </div>}
            </section>
        </Layout>
    );
};

export default SignIn;