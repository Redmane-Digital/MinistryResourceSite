/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import Hero from '../components/heroes/WithSearch';
import heroImgJPG from '../images/search.jpg';
import heroImageWebP from '../images/search.webp';
import { Categories } from '../components/pages/resources';
import { useTranslations } from 'gatsby-plugin-translate';
import Layout from "../components/layout";
import SEO from "../components/seo";
import { Link } from 'gatsby';

const Resources = ({ location, pageContext }) => {
    const t = useTranslations();
    return (
        <Layout location={location}>
            <SEO title={t`Resources`} />
            <Hero imgSources={{ jpg: heroImgJPG, webp: heroImageWebP }} title={t`Resources`} text={t`Start Searching for the Resource You Need`} location={location} />
            <Categories data={pageContext.resources}/>
            <section className="bg-light">
                <div className="container reduced-width py-4">
                    <h1 className="text-center mt-5 mb-3 kapra display-4">{t`More Resources`}</h1>
                    <div className="row gx-5 mt-5 pt-5">
                        <div className="col-12 col-md-6 pr-md-5 mb-md-0 mb-4">
                            <img src="https://media.graphcms.com/mTvM4raQ8WV2cX3FVdGj?_ga=2.83974480.859654849.1603164880-453183236.1602514586" alt={t`Online Courses`} className="w-100" loading="lazy" />
                        </div>
                        <div className="col-12 col-md-6 ">
                            <h1 className="kapra">{t`Online Courses`}</h1>
                            <h5 className="mt-3">{t`Courses designed for you to take a step up. World class lessons from theology and biblical foundations, to short term missions onboarding.`}</h5>
                            <Link to="/training" className="btn btn-primary btn-shadow btn-sm text-white mt-3">
                                {t`View Courses`}
                            </Link>
                        </div>
                    </div>
                    <div className="row gx-5 my-5 pt-5">
                        <div className="col-12 col-md-6 order-last order-md-first">
                            <h1 className="kapra">{t`Books`}</h1>
                            <h5 className="mt-3">{t`Essentials for the journey from some of our best authors.`}</h5>
                            <Link to="/books" className="btn btn-primary btn-shadow text-white mt-3 btn-sm">
                                {t`See Resource`}
                            </Link>
                        </div>
                        <div className="col-12 col-md-6 pl-md-5 mb-md-0 mb-4">
                            <img src="https://media.graphcms.com/M8pfGM8nS4eVKYpjSjv2" alt="Personal Evangelism" className="w-100" loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Resources;