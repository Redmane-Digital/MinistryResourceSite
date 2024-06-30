/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link, navigate } from 'gatsby';
import styled from 'styled-components';
import { filter } from "smart-array-filter";
import Spinner from 'react-spinner-material';
import placeholder from '../../../images/placeholder.jpeg';
import ContentTypeIcon from '../../../components/universal/ui/ContentTypeIcon';
import { useStaticQuery, graphql } from 'gatsby';
import { translateLink, useDebounce } from '../../../hooks';
import { useTranslateContext, useTranslations } from 'gatsby-plugin-translate';

const SearchBox = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 50px);
    z-index: 1000;
`;

const ClearSearch = styled.span`
    cursor: pointer;
    &.d-none {
        cursor: normal;
    }
`;

const SearchResults = styled.div`
    display: none;
    height: 0;
    overflow: hidden;
    transition: height 350ms ease-in-out;
    &.searching {
        display: block;
        height: auto;
    }
`;

const ResultThumb = styled.img`
    max-width: 100%;
    @media only screen and (min-width: 768px) {
        max-height: 100px;
        &.book {
            max-height: 150px;
        }
    }
`;

const items = graphql`
    {
        Hygraph {
            resources {
                categories {
                    title
                    slug
                }
                tags {
                    title
                    slug
                }
                downloads {
                    contentType
                    asset {
                        url
                        fileName
                    }
                    title
                }
                title
                thumbnail {
                    url
                }
                slug
                contentTypes
                description {
                    html
                }
            }
        }
        books: allShopifyProduct(filter: {tags: {eq: "mannahouseresource"}}) {
            edges {
                node {
                    id
                    handle
                    title
                    createdAt
                    descriptionHtml
                    options {
                        name
                        values
                    }
                    variants {
                        id
                        title
                        selectedOptions {
                            name
                            value
                        }
                        price
                        image {
                            originalSrc
                        }
                    }
                    tags
                    featuredImage {
                        originalSrc
                    }
                }
            }
        }
        training: allThinkificCourse {
            edges {
                node {
                    description {
                        en
                        es
                    }
                    instructor {
                        first_name
                        last_name
                        full_name
                    }
                    keywords
                    name {
                        en
                        es
                    }
                    slug
                    course_card_image_url
                }
            }
        }
    }
`;

const LiveSearchBox = (props) => {
    const { Hygraph, books, training } = useStaticQuery(items);
    const [state, setState] = useState({
        isSearching: true,
        contentTypes: props.type || "all",
        resourcesResults: Hygraph.resources,
        booksResults: books?.edges || [],
        coursesResults: training.edges
    });
    const mt = `mt-${props.mt || 5}`;
    const loc = props.location;
    const width = props.theWidth || '';
    const noTitle = props.noTitle || false;
    const textColor = props.textColor || 'white';
    const fontWeight = props.fontWeight || 'bold';
    const [query, setQuery] = useState('');
    const results = useRef(false);
    const t = useTranslations();
    const { language } = useTranslateContext();

    /* Handle the search event */
    const Search = function (e) {
        e.preventDefault();

        /* Determine if there is a resource type we should be searching for */
        let type = loc.pathname.match(/\/resources|\/training|\/books/gi);
            type = type && type.length ? type[0].replace('/', '') : false;

        /* Don't search if there is no query */
        if (query === '') return;
        
        /* Navigate user to the search page with the search data */
        navigate(
            translateLink(
                `/search/?q=${encodeURIComponent(query)}${type ? '&type=' + type : ''}`,
                language
            )
        );
    };
    const debouncedQuery = useDebounce(query, 500);

    const show = () => {
        // Get the natural height of the element
        const getHeight = () => {
            results.current.style.display = 'block'; // Make it visible
            const height = results.current.scrollHeight + 'px'; // Get it's height
            results.current.style.display = ''; //  Hide it again
            return height;
        };

        const height = getHeight(); // Get the natural height
        results.current.classList.add('searching'); // Make the element visible
        results.current.style.height = height; // Update the max-height

        // Once the transition is complete, remove the inline max-height so the content can scale responsively
        window.setTimeout(function () {
            if (results.current) {
                results.current.style.height = '';
            };
        }, 350);
    };

    const hide = () => {
        // Give the element a height to change from
        results.current.style.height = results.scrollHeight + 'px';

        // Set the height back to 0
        window.setTimeout(function () {
            results.current.style.height = '0';
        }, 1);

        // When the transition is complete, hide it
        window.setTimeout(function () {
            results.current.classList.remove('searching');
        }, 350);
    };

    const handleChange = function (e) { setQuery(e.target.value); };

    useEffect(() => {
        const toggle = () => {
            if (results.current && results.current.classList) {
                if (query.length === 0 && results.current.classList.contains('searching')) hide();
                else if (query.length > 0 && !results.current.classList.contains('searching')) show();
            }
            if (debouncedQuery) {
                const filteredResources = filter(Hygraph.resources, {
                    keywords: query,
                    caseSensitive: false
                });

                const filteredBooks = filter(books.edges, {
                    keywords: query,
                    caseSensitive: false
                });

                const filteredCourses = filter(training.edges, {
                    keywords: query,
                    caseSensitive: false
                });

                setState({
                    isSearching: false,
                    resourcesResults: filteredResources,
                    booksResults: filteredBooks,
                    coursesResults: filteredCourses
                });
            };
        };
        toggle();
    }, [debouncedQuery]);

    return (
        <SearchBox className={`container reduced-width py-3 ${width}`}>
            {!noTitle && <h2 className={`text-center font-weight-${fontWeight} text-${textColor} ${mt} pb-3`}>{t`Start Searching for the Resource You Need`}</h2>}
            <div className='box-shadow mt-4 mb-2 bg-white'>
                <form className="input-group input-group-lg" onSubmit={Search}>
                    <span className='input-group-text' id='addon-wrapping'>
                        <FontAwesomeIcon icon={faSearch} style={{ color: '#000' }} size="lg" />
                    </span>
                    <input type='text' style={{ background: '#fff' }} className='form-control' placeholder={t`E.g. Worship Job Description`} aria-label='search' aria-describedby='addon-wrapping' value={query} onChange={handleChange} />
                    <ClearSearch className={`input-group-text ${query.length < 1 ? 'd-none' : ''}`} type="button" id='addon-wrapping' onClick={() => setQuery('')}>
                        <FontAwesomeIcon icon={faTimes} style={{ color: '#ddd' }} size="sm" />
                    </ClearSearch>
                </form>
                {query.length > 1 && (
                    <SearchResults ref={results}>
                        <hr className="mt-0 mx-3" />
                        {state.isSearching
                            ? <div className="text-center my-5 d-flex justify-content-center"><Spinner size={120} spinnerColor={"#ddd"} spinnerWidth={3} visible={true} /></div>
                            : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center px-5 px-md-3 mb-4">
                                        <p className="text-uppercase font-weight-bold mb-0">{t`Resources`}</p>
                                        {state.resourcesResults.length > 0 && <Link className="d-block text-right mb-0 font-weight-bold small" to={translateLink(`/search/?q=${encodeURI(query)}`, language)}>
                                            {t`All Results`} <FontAwesomeIcon icon={faArrowRight} style={{ color: 'red' }} />
                                        </Link>}
                                    </div>
                                    {state.resourcesResults.length === 0 && <h5 class="px-3"><em>{t`No results to show`}</em></h5>}
                                    {state.resourcesResults.slice(0, 2).map(result => {
                                        return (
                                            <Link to={`/resource/${result.slug}`} className="row gx-5 px-5 px-md-3" key={result.slug}>
                                                <div className="col-12 col-md-9 mb-2 mb-md-4 d-flex flex-column flex-md-row align-items-md-center">
                                                    <ResultThumb src={result.thumbnail ? result.thumbnail.url : placeholder} alt={result.title} />
                                                    <p className="font-weight-bold mt-4 mt-md-0 mb-0 text-dark ml-md-5">{result.title}</p>
                                                </div>
                                                <div className="col-12 col-md-3 mb-5 mb-md-4 flex-wrap d-flex align-items-center justify-content-between">
                                                    <small style={{ color: '#ccc' }}>{result.categories[0].title}</small>
                                                    <div>
                                                        {result.contentTypes.map(type => {
                                                            return <ContentTypeIcon contentType={type} key={type} />
                                                        })}
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                    <hr className="my-4 mx-3" />
                                    <div className="d-flex justify-content-between align-items-center px-5 px-md-3 mb-4">
                                        <p className="text-uppercase font-weight-bold mb-0">{t`Books`}</p>
                                        {/* <Link className="d-block text-right mb-0 font-weight-bold small" to={`/search/${encodeURI(query)}`}>
                                        All Results <FontAwesomeIcon icon={faArrowRight} style={{ color: 'red' }} />
                                    </Link> */}
                                    </div>
                                    {state.booksResults.length === 0 && <h5 class="px-3"><em>No results to show</em></h5>}
                                    {state.booksResults.slice(0, 2).map(result => {
                                        let thumbnail = result.node.variants[0].image?.originalSrc || result.node.featuredImage?.originalSrc;

                                        return (
                                            <Link to={`/book/${result.node.handle}`} className="row gx-5 px-5 px-md-3" key={'link_' + result.node.title}>
                                                <div className="col-12 col-md-9 mb-2 mb-md-4 d-flex flex-column flex-md-row align-items-md-center">
                                                    <ResultThumb src={thumbnail ? thumbnail : placeholder} alt={result.node.title} className="book" />
                                                    <div className="mt-4 mt-md-0 mb-0 ml-md-5">
                                                        <p className="font-weight-bold text-dark mb-0">{result.node.title}</p>
                                                        <small style={{ color: '#ccc' }}>{result.node.vendor}</small>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                    <hr className="my-4 mx-3" />
                                    <div className="d-flex justify-content-between align-items-center px-5 px-md-3 mb-4">
                                        <p className="text-uppercase font-weight-bold mb-0">Training</p>
                                        {/* <Link className="d-block text-right mb-0 font-weight-bold small" to={`/search/${encodeURI(query)}`}>
                                        All Results <FontAwesomeIcon icon={faArrowRight} style={{ color: 'red' }} />
                                    </Link> */}
                                    </div>
                                    {state.coursesResults.length === 0 && <h5 class="px-3"><em>No results to show</em></h5>}
                                    {state.coursesResults.slice(0, 2).map(result => {
                                        const { name, slug, course_card_image_url: thumbnail } = result.node;
                                        return (
                                            <a href={`https://www.pbcaccess.com/courses/${slug}`} className="row gx-5 px-5 px-md-3" target="_blank" rel="nofollow noreferrer" key={slug}>
                                                <div className="col-12 col-md-9 mb-2 mb-md-4 d-flex flex-column flex-md-row align-items-md-center">
                                                    <ResultThumb src={thumbnail ? thumbnail : placeholder} alt={name[language]} />
                                                    <p className="font-weight-bold mt-4 mt-md-0 mb-0 text-dark ml-md-5">{name[language]}</p>
                                                </div>
                                            </a>
                                        )
                                    })}
                                </>
                            )
                        }
                    </SearchResults>
                )}
            </div>
        </SearchBox>
    );
};


export default LiveSearchBox;