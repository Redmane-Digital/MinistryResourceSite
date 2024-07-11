/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { navigate, Link } from 'gatsby';
import placeholder from '../images/placeholder.jpeg';
import parse from 'html-react-parser';
import styled from 'styled-components';
import { saveCustomerResource } from '../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import ContentTypeIcon from '../components/universal/ui/ContentTypeIcon';
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useTranslateContext, useTranslations } from 'gatsby-plugin-translate';

const Tag = styled.span`
    padding: 8px 20px;
    background: #e9ecf4;
    font-weight: 500;
`;

const VideoSection = styled.section`
    background: #2b2b2b;
`;


const Video = ({ resource, isAuthenticated, downloads, loc, saveResource }) => {
    const embedUrl = resource.vimeoUrl?.replace('https://vimeo.com/', 'https://player.vimeo.com/video/');
    const { language } = useTranslateContext();
    const t = useTranslations();

    return (
        <>
            <VideoSection className="py-5">
                <div className="container reduced-width text-tan">
                    <p className="mb-2 text-tan cursor-pointer" onClick={() => navigate('/resources')}>
                        <FontAwesomeIcon icon={faCaretLeft} style={{ color: '#e9e1cc' }} className="ml-2" size="sm" /> {t`Back`}
                    </p>
                    <h2 className="mb-4">
                        <strong>{resource.title[language]}</strong>
                    </h2>
                    {isAuthenticated
                        ?
                        <div className="embed-responsive embed-responsive-16by9">
                            <iframe src={embedUrl} allow="autoplay; fullscreen" allowfullscreen></iframe>
                        </div>
                        :
                        <div className="embed-responsive embed-responsive-16by9" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)), url(${resource?.thumbnail?.url})`, backgroundSize: 'cover' }}>
                            <div className="embed-responsive-item d-flex justify-content-center align-items-center">
                                <p className="text-tan">
                                    {t`To watch video, please`}
                                    <Link className="ml-1" to="/signin" state={{ from: loc.pathname }}>{t`sign in`}</Link> {t`or`} <Link to="/signup" state={{ from: loc.pathname }}>{t`create an account`}</Link>
                                </p>
                            </div>
                        </div>
                    }
                </div>
            </VideoSection>
            <section className="container reduced-width my-5">
                <div className="row gx-5">
                    <div className="col-12">
                        <div className="mt-3">
                            {resource.tags.map(tag => (
                                <Tag className="badge rounded-pill bg-light text-dark mr-3 mb-3" key={tag.title[language]}>{tag.title[language]}</Tag>
                            ))}
                        </div>
                        <div className="mt-3">
                            {parse(resource.description.html[language])}
                        </div>
                        <div className="mt-5 pt-4">
                            <h4><strong>{t`Resources`}</strong></h4>
                            <hr />
                            {isAuthenticated ? resource.downloads.map((download, i) => {
                                const { fileName, url } = download.asset;
                                return (
                                    <div
                                        className="d-flex justify-content-between flex-column flex-sm-row flex-md-column flex-lg-row"
                                        key={i}
                                        ref={ref => downloads.current.push(ref)} onClick={() => saveResource(i)}
                                        data-link={url}
                                        data-filename={fileName}
                                    >
                                        <p className="mb-0" data-filename={fileName} style={{ cursor: 'pointer' }}><ContentTypeIcon data-filename={fileName} contentType={download.contentType} /> {fileName}</p>
                                        <p className="text-dark ml-4 pl-1 ml-sm-0 pl-sm-0 pl-md-1 ml-md-1 pl-lg-0 ml-lg-0 d-inline-block" data-filename={fileName} style={{ opacity: 0.4, cursor: 'pointer' }}>
                                            {t`Download`} <FontAwesomeIcon icon={faDownload} style={{ color: '#000' }} className="ml-2" size="sm" data-filename={fileName} />
                                        </p>
                                    </div>
                                )
                            })
                                : <p>
                                    <Link to="/signin" state={{ from: loc.pathname }}>{t`Sign in`}</Link> {t`or`} <Link to="/signup" state={{ from: loc.pathname }}>{t`create an account`}</Link> {t`to download resources`}
                                    </p>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
};

const Other = ({ resource, isAuthenticated, downloads, loc, saveResource }) => {
    const { language } = useTranslateContext();
    const t = useTranslations();

    return (
        <section className="container reduced-width my-5">
            <div className="row gx-5">
                <div className="col-12 col-md-5">
                    <img src={resource.thumbnail ? resource.thumbnail.url : placeholder} className="w-100" alt={resource.title[language]} />
                </div>
                <div className="col-12 col-md-7 mt-4 mt-md-0">
                    <h2><strong>{resource.title[language]}</strong></h2>
                    <div className="mt-3">
                        {resource.tags.map(tag => (
                            <Tag className="badge rounded-pill bg-light text-dark mr-3 mb-3" key={tag.title[language]}>{tag.title[language]}</Tag>
                        ))}
                    </div>
                    <div className="mt-3">
                        {resource?.description?.html ? parse(resource.description.html[language]) : ""}
                    </div>
                    <div className="mt-5 pt-4">
                        <h4><strong>{t`Resources`}</strong></h4>
                        <hr />
                        {isAuthenticated ? resource.downloads.map((download, i) => {
                            const { fileName, url } = download.asset;
                            return (
                                <a
                                    className="d-flex justify-content-between flex-column flex-sm-row flex-md-column flex-lg-row"
                                    key={i}
                                    ref={ref => downloads.current.push(ref)}
                                    onClick={(e) => saveResource(i, e)}
                                    data-link={url}
                                    data-filename={fileName}
                                    href={url + '?download=true'}
                                    style={{ display: 'block', gap: 10 }}
                                >
                                    <p className="mb-0 d-flex" data-filename={fileName} style={{ cursor: 'pointer' }}><ContentTypeIcon contentType={download.contentType} data-filename={fileName} /> {fileName}</p>
                                    <p className="text-dark ml-4 pl-1 ml-sm-0 pl-sm-0 pl-md-1 ml-md-1 pl-lg-0 ml-lg-0 d-inline-block" style={{ opacity: 0.4, cursor: 'pointer', minWidth: 101 }} data-filename={fileName}>
                                        {t`Download`} <FontAwesomeIcon icon={faDownload} style={{ color: '#000' }} className="ml-2" size="sm" data-filename={fileName} />
                                    </p>
                                </a>
                            )
                        })
                            : <p>
                                <Link to="/signin" state={{ from: loc.pathname }}>{t`Sign in`}</Link> {t`or`} <Link to="/signup" state={{ from: loc.pathname }}>{t`create an account`}</Link> {t`to download resources`}
                              </p>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
};

const Resource = ({ location, pageContext }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const downloads = useRef([]);
    const resource = pageContext.resource;
    const loc = location;
    const { language } = useTranslateContext();
    const t = useTranslations();

    const saveResource = (i, e) => {
        if (e) e.preventDefault();
        window.open(downloads.current[i].dataset.link + '?download=true', "_blank");
        const data = {
            saved: new Date(),
            title: resource.title[language],
            description: resource.description[language],
            thumbnail: resource.thumbnail,
            slug: resource.slug
        };
        saveCustomerResource(loc.pathname, data);
    };

    return (
        <Layout location={location}>
            <SEO title={`${resource.title[language]} | ${t`Resources`}`} image={resource.thumbnail} />
            <section className="bg-secondary">
                <div className="container reduced-width py-3">
                    <h4 className="text-white mb-0">
                        <strong>{t`Resources`} :: </strong>
                        {resource.categories.length ? <Link to={`/resources/${resource.categories[0].slug}`} className="text-white">{resource.categories[0].title[language]}</Link> : ''}
                    </h4>
                </div>
            </section>
            {resource.contentTypes && resource.contentTypes.includes('video')
                ? <Video isAuthenticated={isAuthenticated} resource={resource} downloads={downloads} loc={loc} saveResource={saveResource} />
                : <Other isAuthenticated={isAuthenticated} resource={resource} downloads={downloads} loc={loc} saveResource={saveResource} />
            }
        </Layout>
    );
};

export default Resource;