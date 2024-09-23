/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useState, useEffect } from 'react';
import BasicSearch from '../components/universal/search/BasicSearch';
import placeholder from '../images/placeholder.jpeg';
import parse from 'html-react-parser';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { useTranslateContext, useTranslations } from 'gatsby-plugin-translate';
import ContentTypeIcon from '../components/atoms/ContentTypeIcon';
import { Link } from 'gatsby';
import { translateLink } from '../hooks/';
import { resourceBrands } from '../config';

const Category = ({ location, pageContext }) => {
  const { language } = useTranslateContext();
  const t = useTranslations();
  const data = pageContext.category;
  const sourcesObj = resourceBrands.reduce((obj, brand) => {
    obj[brand.slug] = true;
    return obj;
  }, {});
  const [sources, setSources] = useState(sourcesObj);
  const [items, setItems] = useState({
    featured: [],
    resource: [],
  });
  const [filters, setFilters] = useState({
    psd: false,
    pdf: false,
    video: false,
    podcast: false,
    editable: false,
    jpg: false,
  });

  const handleClick = (e) => {
    if (sources.hasOwnProperty(e.target.id)) {
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

  useEffect(() => {
    const filterArr = [];
    const srcArray = [];
    const defaultVals = {
      featured: data.featured,
      resource: data.resource,
    };

    let tmp = false;

    for (const f in filters) {
      if (filters[f]) filterArr.push(f);
    }

    for (const s in sources) {
      if (sources[s]) srcArray.push(s);
    }

    /* If there are no sources selected, return nothing */
    if (srcArray.length === 0) {
      return setItems({
        featured: [],
        resource: [],
      });
    } else {
      tmp = defaultVals;
    }

    if (srcArray.length) {
      tmp.featured = tmp.featured.filter((res) => {
        const matches =
          (res.tags && res.tags.some((tag) => srcArray.includes(tag.slug))) ||
          (res.resourceSites &&
            res.resourceSites.some((site) =>
              srcArray.includes(site.replaceAll('_', '-'))
            ));

        return matches;
      });

      tmp.resource = tmp.resource.filter((res) => {
        const matches =
          (res.tags && res.tags.some((tag) => srcArray.includes(tag.slug))) ||
          (res.resourceSites &&
            res.resourceSites.some((site) =>
              srcArray.includes(site.replaceAll('_', '-'))
            ));

        return matches;
      });
    }

    if (filterArr.length > 0) {
      tmp.featured = tmp.featured.filter((res) => {
        const matches =
          res.contentTypes &&
          res.contentTypes.some((type) => filterArr.includes(type));
        return matches;
      });

      tmp.resource = tmp.resource.filter((res) => {
        const matches =
          res.contentTypes &&
          res.contentTypes.some((type) => filterArr.includes(type));
        return matches;
      });
    }

    setItems(tmp);
  }, [filters, sources]);

  return (
    <Layout location={location}>
      <SEO title={`${data.title[language]} | ${t`Resources`}`} />
      <section className="bg-secondary">
        <div className="container reduced-width py-3">
          <h4 className="text-white">
            <strong>{t`Resources`} :: </strong>
            {data.title[language]}
          </h4>
        </div>
      </section>
      <BasicSearch location={location} />
      {items.featured.length > 0 && (
        <>
          <section className="container reduced-width py-5">
            <h1 className="font-weight-medium mb-5">{t`Featured Resources`}</h1>
            <div className="row gx-5">
              {items.featured.slice(0, 3).map((item) => {
                return (
                  <Link
                    to={translateLink(`/resource/${item.slug}`, language)}
                    className="col-12 col-md-4 text-dark"
                    key={item.title[language]}
                  >
                    <img
                      src={item.thumbnail ? item.thumbnail.url : placeholder}
                      alt=""
                      className="w-100"
                    />
                    <p className="mt-3 font-weight-bold">
                      {item.title[language]}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
          <div className="container reduced-width">
            <hr />
          </div>
        </>
      )}
      <section className="container reduced-width py-5">
        <h1 className="font-weight-medium mb-5">
          {items.featured.length > 0 ? t`More Resources` : t`Resources`}
        </h1>
        <div className="row">
          <div className="col-12 col-md-4 col-lg-3 mb-5">
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
              <p className="font-weight-bold">Content Type</p>
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
                  Video
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
          </div>
          <div className="col-12 col-md-8 col-lg-9 mb-5">
            {items.resource.length > 0 ? (
              <>
                {items.resource.map((item) => {
                  return (
                    <div className="row gx-5 mb-4" key={item.slug}>
                      <div className="col-12 col-md-5">
                        <Link
                          to={translateLink(`/resource/${item.slug}`, language)}
                          className="col-12 col-md-4 text-dark"
                        >
                          <img
                            src={
                              item.thumbnail ? item.thumbnail.url : placeholder
                            }
                            alt=""
                            className="w-100"
                          />
                        </Link>
                      </div>
                      <div className="col-12 col-md-7">
                        <Link
                          to={translateLink(`/resource/${item.slug}`, language)}
                          className="font-weight-bold h3 text-dark"
                        >
                          {item.title[language]}
                        </Link>
                        {item.description ? (
                          <p className="mt-3 truncate-search">
                            {parse(item.description.html[language])}
                          </p>
                        ) : (
                          ''
                        )}
                        <p className="mt-3">
                          {item.contentTypes &&
                            item.contentTypes.map((type, i) => {
                              return (
                                <ContentTypeIcon
                                  contentType={type}
                                  key={'icon_' + i}
                                />
                              );
                            })}
                        </p>
                      </div>
                    </div>
                  );
                })}{' '}
              </>
            ) : (
              <h1 className="text-center">No resources to show</h1>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Category;
