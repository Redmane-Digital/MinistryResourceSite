/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useEffect, useState } from 'react';
import { removeStopwords } from 'stopword';
import heroImg from '../../images/training.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useQueryString, translateLink } from '../../hooks';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import placeholder from '../../images/placeholder.jpeg';
import coursePlaceholder from '../../images/course-placeholder.jpg';
import { Link, navigate } from 'gatsby';
import parse from 'html-react-parser';
import ContentTypeIcon from '../../components/atoms/ContentTypeIcon';
import Fuse from 'fuse.js';
import { useTranslateContext, useTranslations } from 'gatsby-plugin-translate';
import config from './config';
import { resourceBrands } from '../../config';

const stopwords = {
  en: ['a', 'the', 'in', 'of', 'is', 'do', 'did', 'by'],
  es: ['un', 'una', 'en', 'de'],
};

const slugify = (input) => {
  if (!input) {
    return '';
  }

  // make lower case and trim
  var slug = input.toLowerCase().trim();

  // remove accents from charaters
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Replace & with 'and'
  slug = slug.replace(/\&/g, 'and');

  // replace invalid chars with spaces
  slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

  // replace multiple spaces or hyphens with a single hyphen
  slug = slug.replace(/[\s-]+/g, '-');

  return slug;
};

const ResourceResult = ({ result, language }) => {
  return (
    <div className="row gx-5 mb-5">
      <div className="col-12 col-md-5">
        <Link
          to={translateLink(`/resource/${result.slug}`, language)}
          className="col-12 col-md-4 text-dark"
        >
          <img
            src={result.thumbnail ? result.thumbnail.url : placeholder}
            alt=""
            className="w-100"
          />
        </Link>
      </div>
      <div className="col-12 col-md-7 pl-md-0">
        <Link
          to={translateLink(`/resource/${result.slug}`, language)}
          className="font-weight-bold h4 text-dark"
        >
          {result.title[language]}
        </Link>
        <div className="my-2 truncate-search">
          {result.description && parse(result.description.html[language])}
        </div>
        <div>
          {result.contentTypes &&
            result.contentTypes.map((type, index) => {
              return (
                <ContentTypeIcon contentType={type} key={'icon_' + index} />
              );
            })}
        </div>
      </div>
    </div>
  );
};

const BookResult = ({ result, language }) => {
  return (
    <div className="row gx-5 mb-5">
      <div className="col-12 col-md-5">
        <div className="ratio ratio-16x9">
          <Link
            to={translateLink(`/book/${result.handle}`, language)}
            className="d-flex justify-content-center p-2"
            style={{
              backgroundImage: `linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)`,
            }}
          >
            <img
              src={result.featuredImage?.src}
              alt={`Book cover for ${result.title[language]}`}
              className="box-shadow h-100"
            />
          </Link>
        </div>
      </div>
      <div className="col-12 col-md-7 pl-md-0">
        <Link
          to={translateLink(`/book/${result.handle}`, language)}
          className="font-weight-bold h4 text-dark"
        >
          {result.title[language]}
        </Link>
        <p className="my-2 truncate-search">{result.vendor}</p>
      </div>
    </div>
  );
};

const CourseResult = ({ result, language, t }) => {
  return (
    <div className="row gx-5 mb-5">
      <div className="col-12 col-md-5">
        <a
          href={`https://www.pbcaccess.com/${result.subtype || result.type}s/${
            result.slug
          }`}
          target="_blank"
          rel="nofollow noopener"
          className="col-12 col-md-4 text-dark"
        >
          <picture>
            <source srcSet={result.course_card_image_url} type="image/jpg" />
            <img
              src={coursePlaceholder}
              alt={result.name[language] + ' image'}
              className="w-100"
            />
          </picture>
        </a>
      </div>
      <div className="col-12 col-md-7 pl-md-0">
        <a
          href={`https://www.pbcaccess.com/${result.subtype || result.type}s/${
            result.slug
          }`}
          target="_blank"
          rel="nofollow noopener"
          className="font-weight-bold h4 text-dark"
        >
          {result.name[language]}
        </a>
        {result.instructor?.first_name && (
          <p class="mt-3">
            <strong>{t`Instructor`}:</strong> {result.instructor.first_name}{' '}
            {result.instructor.last_name}
          </p>
        )}
        <div className="my-2 truncate-search">
          {result.description[language] && parse(result.description[language])}
        </div>
      </div>
    </div>
  );
};

const Result = (props) => {
  if (!props.result.type) {
    return null;
  }

  const lookup = {
    resource: ResourceResult,
    book: BookResult,
    course: CourseResult,
  };

  const Render = lookup[props.result.type];

  return <Render {...props} />;
};

const Search = ({ location, pageContext }) => {
  const { resources, books, thinkific: courses } = pageContext;
  const sourcesObj = resourceBrands.reduce((obj, brand) => {
    obj[brand.slug] = true;
    return obj;
  }, {});
  const [sources, setSources] = useState(sourcesObj);
  const [filters, setFilters] = useState({
    pdf: false,
    video: false,
    podcast: false,
    editable: false,
    jpg: false,
    psd: false,
  });
  const [productTypes, setProductTypes] = useState({
    resources: false,
    books: false,
    training: false,
  });

  const [categories, setCategories] = useState({
    'bible-and-theology': false,
    'global-missions': false,
    sermons: false,
    'worship-and-production': false,
    'local-outreach': false,
    generations: false,
    discipleship: false,
    languages: false,
    'culture-and-worldview': false,
    leadership: false,
    operations: false,
    'missions-&-outreach': false,
  });

  const [unfiltered, setUnfiltered] = useState([]);
  const [results, setResults] = useState([]);
  const { q, categories: cats, type, strict } = useQueryString(location.search);
  const [query, setQuery] = useState(decodeURI(q !== undefined ? q : ''));
  const t = useTranslations();
  const { language } = useTranslateContext();

  const handleClick = function (e) {
    if (Object.keys(productTypes).includes(e.target.id)) {
      setProductTypes({
        ...productTypes,
        [e.target.id]: e.target.checked,
      });
    } else if (Object.keys(categories).includes(e.target.id)) {
      setCategories({
        ...categories,
        [e.target.id]: e.target.checked,
      });
    } else if (Object.keys(sources).includes(e.target.id)) {
      setSources({
        ...sources,
        [e.target.id]: e.target.checked,
      });
    } else {
      setFilters({
        ...filters,
        [e.target.id]: e.target.checked,
      });
    }
  };

  const filterResults = () => {
    const filterArr = [];
    const categoriesArr = [];
    const sourcesArr = [];
    let tmp;

    for (const f in filters) {
      if (filters[f]) filterArr.push(f);
    }

    for (const c in categories) {
      if (categories[c]) categoriesArr.push(c);
    }

    for (const s in sources) {
      if (sources[s]) sourcesArr.push(s);
    }

    /* If no sources are selected, all should be selected */
    if (sourcesArr.length === 0) {
      return setResults([]);
    }

    if (filterArr.length + categoriesArr.length === 0) {
      if (sourcesArr.length == 2) {
        return setResults(unfiltered);
      }
    }

    if (sourcesArr.length) {
      tmp = unfiltered.filter((res) => {
        const matches =
          (res.item.tags &&
            res.item.tags.some((tag) => sourcesArr.includes(tag.slug))) ||
          (res.item.resourceSites &&
            res.item.resourceSites.some((site) =>
              sourcesArr.includes(site.replaceAll('_', '-'))
            ));

        return matches;
      });
    }

    if (filterArr.length + categoriesArr.length === 0)
      return setResults(unfiltered);

    if (filterArr.length > 0) {
      tmp = unfiltered.filter((res) => {
        const matches =
          res.item.contentTypes &&
          res.item.contentTypes.some((type) => filterArr.includes(type));
        return matches;
      });
    }

    if (categoriesArr.length > 0) {
      if (!tmp) tmp = unfiltered;
      tmp = tmp.filter((res) => {
        const categories = res.item?.categories || res.item.node?.categories;
        let isMatch = false;

        if (categories) {
          isMatch = categories.some((cat) => categoriesArr.includes(cat.slug));
        } else if (res.item.node?.tags) {
          isMatch = res.item.node.tags.some((tag) =>
            categoriesArr.includes(slugify(tag))
          );
        } else if (res.item.node?.keywords) {
          const keywordsArr = res.item.node.keywords.length
            ? res.item.node.keywords.split('\n')
            : [];
          isMatch = keywordsArr.some((keyword) => {
            return categoriesArr.includes(slugify(keyword));
          });
        }

        if (isMatch) {
          console.log(true, res);
        }

        return isMatch;
      });
    }

    setResults(tmp);
  };

  const handleChange = function (e) {
    setQuery(e.target.value);
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    if (query === '') return;
    navigate(
      translateLink(`/search/?q=${encodeURIComponent(query)}`, language)
    );
  };

  const generateUnfiltered = () => {
    let tmp = [];
    const threshold = strict && strict.toLowerCase() == 'true' ? 0.0 : 0.0;

    if (productTypes.resources) tmp.push(...resources);
    if (productTypes.books) tmp.push(...books);
    if (productTypes.training && courses) tmp.push(...courses.edges);

    const options = {
      includeScore: true,
      threshold: threshold,
      minMatchCharLength: 2,
      useExtendedSearch: true,
      includeMatches: true,
      findAllMatches: true,
      ignoreLocation: true,
      keys: [
        `title.${language}`,
        'categories.slug',
        `categories.title.${language}`,
        'tags.slug',
        `tags.title.${language}`,
        'contentTypes',
        `description.html.${language}`,
        `node.descriptionHtml.${language}`,
        `node.title.${language}`,
        'node.handle',
        'name',
        'slug',
        'subtitle',
        `node.description.${language}`,
        `node.name.${language}`,
        `node.keywords`,
        `node.instructor.full_name`,
      ],
    };

    const fuse = new Fuse(tmp, options);

    if (!!!q?.length) {
      tmp = tmp.map((item) => ({ item: item }));
      setUnfiltered(tmp);
    } else {
      /* Initially, we want to remove any stopwords from the query to avoid irrelevant matches */
      let withoutStopwords = removeStopwords(
        (q || '').split(' '),
        stopwords[language]
      ).join(' ');

      /* If the string is all stopwords, just use the query */
      if (!withoutStopwords.length) {
        withoutStopwords = q;
      }

      /* Get the search results via Fuse.js and then return them to the user */
      tmp = fuse.search(decodeURI(withoutStopwords));
      setUnfiltered(tmp);
    }
  };

  useEffect(() => filterResults(), [filters, unfiltered, categories, sources]);
  useEffect(
    () => generateUnfiltered(),
    [productTypes, resources, books, courses, sources]
  );

  useEffect(() => {
    if (type !== undefined) {
      const tmp = decodeURIComponent(type.replace('/', '')).split(',');
      const typesObj = { ...productTypes };

      for (let t of tmp) {
        typesObj[t.toLowerCase()] = true;
      }

      return setProductTypes(typesObj);
    } else {
      return setProductTypes({ resources: true, books: true, training: true });
    }
  }, [q]);

  useEffect(() => {
    if (cats) {
      const qCats = decodeURIComponent(cats).split('|');
      const newCategoriesState = categories;
      qCats.forEach((cat) => {
        newCategoriesState[cat] = true;
      });
      setCategories(newCategoriesState);
    }
  }, [cats]);

  console.log(resourceBrands.length);

  return (
    <Layout location={location}>
      <SEO title={`${t`Search for`}: ${query}`} />
      <section
        style={{
          backgroundPosition: 'center bottom',
          backgroundSize: 'cover',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('${heroImg}')`,
        }}
      >
        <div className={`py-4 bg-${config.colors.titleBg}`}>
          <div
            className={`container reduced-width text-${config.colors.title}`}
          >
            <h2 className="mb-0 font-weight-bold">{t`Search`}</h2>
          </div>
        </div>
        <div className="container reduced-width py-5 mb-5">
          <form
            className="input-group flex-nowrap input-group-lg box-shadow mt-4 mb-2"
            onSubmit={handleSubmit}
          >
            <span className="input-group-text" id="addon-wrapping">
              <FontAwesomeIcon
                icon={faSearch}
                style={{ color: '#000' }}
                size="lg"
              />
            </span>
            <input
              type="text"
              className="form-control bg-white"
              placeholder="Ex. Streaming our Worship Service"
              aria-label="search"
              onChange={handleChange}
              value={query}
            />
          </form>
        </div>
      </section>
      <section className="my-5 container reduced-width">
        <div className="row gx-5 position-relative align-items-start">
          <div
            className="col-12 col-md-4 col-lg-3 mb-5"
            style={{ top: '1rem' }}
          >
            {resourceBrands?.length > 1 && (
              <div className="bg-light p-3 mb-3">
                <p class="font-weight-bold">Resource Library</p>
                {resourceBrands.map((brand, index) => (
                  <div className="form-check" key={`brand_${index}`}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id={brand.slug}
                      checked={sources[brand.slug]}
                      onClick={handleClick}
                    />
                    <label className="form-check-label" htmlFor={brand.slug}>
                      {brand.title}
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-light p-3">
              <p className="font-weight-bold">{t`Include in search`}...</p>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="resources"
                  checked={productTypes.resources}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="resources">
                  {t`Resources`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="books"
                  checked={productTypes.books}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="books">
                  {t`Books`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="training"
                  checked={productTypes.training}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="training">
                  {t`Training`}
                </label>
              </div>
            </div>

            {productTypes.resources && (
              <>
                <div className="bg-light p-3 mt-3">
                  <p className="font-weight-bold">{t`Content Type`}</p>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="pdf"
                      checked={filters.pdf}
                      onClick={handleClick}
                    />
                    <label className="form-check-label" htmlFor="pdf">
                      PDF
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="psd"
                      checked={filters.psd}
                      onClick={handleClick}
                    />
                    <label className="form-check-label" htmlFor="psd">
                      PSD
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="jpg"
                      checked={filters.jpg}
                      onClick={handleClick}
                    />
                    <label className="form-check-label" htmlFor="jpg">
                      JPG
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="video"
                      checked={filters.video}
                      onClick={handleClick}
                    />
                    <label className="form-check-label" htmlFor="video">
                      {t`Video`}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="podcast"
                      checked={filters.podcast}
                      onClick={handleClick}
                    />
                    <label className="form-check-label" htmlFor="podcast">
                      Podcast
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="editable"
                      checked={filters.editable}
                      onClick={handleClick}
                    />
                    <label className="form-check-label" htmlFor="editable">
                      {t`Editable Document`}
                    </label>
                  </div>
                </div>
              </>
            )}
            <div className="bg-light p-3 mt-3">
              <p className="font-weight-bold">{t`Categories`}</p>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="bible-and-theology"
                  checked={categories['bible-and-theology']}
                  onClick={handleClick}
                />
                <label
                  className="form-check-label"
                  htmlFor="bible-and-theology"
                >
                  {t`Bible & Theology`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="global-missions"
                  checked={categories['global-missions']}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="global-missions">
                  {t`Global Missions`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="sermons"
                  checked={categories['sermons']}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="sermons">
                  {t`Sermons`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="worship-and-production"
                  checked={categories['worship-and-production']}
                  onClick={handleClick}
                />
                <label
                  className="form-check-label"
                  htmlFor="worship-and-production"
                >
                  {t`Worship & Production`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="local-outreach"
                  checked={categories['local-outreach']}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="local-outreach">
                  {t`Local Outreach`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="generations"
                  checked={categories['generations']}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="generations">
                  {t`Generations`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="discipleship"
                  checked={categories['discipleship']}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="discipleship">
                  {t`Discipleship`}
                </label>
              </div>
              {/* <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="languages"
                      checked={categories["languages"]}
                      onClick={handleClick}
                    />
                    <label className="form-check-label" htmlFor="languages">
                      {t`Languages`}
                    </label>
                  </div> */}
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="culture-and-worldview"
                  checked={categories['culture-and-worldview']}
                  onClick={handleClick}
                />
                <label
                  className="form-check-label"
                  htmlFor="culture-and-worldview"
                >
                  {t`Culture & Worldview`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="leadership"
                  checked={categories['leadership']}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="leadership">
                  {t`Leadership`}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="operations"
                  checked={categories['operations']}
                  onClick={handleClick}
                />
                <label className="form-check-label" htmlFor="operations">
                  {t`Operations`}
                </label>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-8 col-lg-9">
            {results.length > 0 ? (
              results.map((res, index) => {
                const result = res.item?.node || res.item;

                return result ? (
                  <Result
                    result={result}
                    language={language}
                    t={t}
                    key={'result_' + index}
                  />
                ) : (
                  <></>
                );
              })
            ) : (
              <section className="col-12 col-md-8 col-lg-9 my-5 text-center">
                <h1>{t`No results to show`}</h1>
              </section>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Search;
