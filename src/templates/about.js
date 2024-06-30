/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import styled from 'styled-components';
import Hero from '../components/heroes/Primary';
import heroImgJPG from '../images/about.jpg';
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useTranslations, useTranslateContext } from 'gatsby-plugin-translate';
import parse from "html-react-parser";

const Partner = styled.img`
    max-height: 60px;
    max-width: 100%;
    margin-right: 40px;
    margin-bottom: 40px;
    &.last {
        margin-right: 0;
        max-height: 50px;
    }
    @media only screen and (max-width: 576px) {
        height: auto;
        max-height: 60px;
    }
`

const About = ({ location, pageContext }) => {
    const t = useTranslations();
    const { language } = useTranslateContext();
    console.log(pageContext);
    return (
        <Layout location={location}>
            <SEO title={t`About Us`} />
            <Hero title={t`About Us`} imgSources={{ jpg: heroImgJPG }} heading={t`Step up. Step forward.`} imgStyles={{ position: "center center" }} reducedWidth={true} />
            <section className="container reduced-width my-5 py-5">
                <div>{parse(pageContext.text.html[language])}</div>
                <div className="mt-5 pt-5">
                    <h1 className="text-primary display-5 kapra mb-4">{t`Better Together.`}</h1>
                    <h5 className="text-dark mb-5">{t`We have the privilege of being a part of an ever-growing family! We truly are better together.`}</h5>
                    <div className="d-flex flex-wrap text-gray justify-content-between align-items-center" style={{ color: "gray", maxWidth: 800 }}>
                        {pageContext.partners.map((partner, i) => <Partner src={partner.partnerLogo.url} alt={partner.partnerName} className={i === pageContext.partners.length - 1 && 'last'} key={i} />)}
                    </div>
                </div>
                <div className="mt-5 pt-5">
                    <h1 className="text-primary display-5 kapra">{t`Connect With Us`}:</h1>
                    <h5 className="text-dark mb-5">
                        <a href="mailto:connect@mannahouseresource.com" class="text-dark" aria-label="Email link">
                            connect<i></i>@<i></i>mannahouseresource.com
                        </a>
                    </h5>
                </div>
            </section>
        </Layout>
    );
};

export default About;