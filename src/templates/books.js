import React, { useState, useEffect } from 'react';
import Hero from '../components/heroes/WithSearch';
import { BooksGrid, Sidebar } from '../components/pages/books';
import { booksImg } from '../components/heroes/images';
import { useQueryString } from '../hooks';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { useTranslations } from 'gatsby-plugin-translate';

const Books = ({ location, pageContext }) => {
  const t = useTranslations();
  const data = pageContext.books;
  const [products, updateProducts] = useState({
    loaded: false,
    items: {},
    hasContent: false,
  });
  const params = useQueryString(location.search);
  let tag = params.category || 'all';
  tag = tag.replace('-', ' ');

  const filterProducts = () => {
    return new Promise((resolve) => {
      let tmp = {
        loaded: true,
        external: {},
        internal: {},
        items: {},
      };

      for (const key of pageContext.keys) {
        const ref = data[key].tags.join(' ').toLowerCase();
        if (tag === 'all') {
          if (data[key].isExternal) {
            tmp.external[key] = data[key];
          } else {
            tmp.internal[key] = data[key];
          }
        } else {
          if (ref.includes(tag.toLowerCase())) {
            if (data[key].isExternal) {
              tmp.external[key] = data[key];
            } else {
              tmp.internal[key] = data[key];
            }
          }
        }
      }

      tmp.items = { ...tmp.external, ...tmp.internal };

      const keys = Object.keys(tmp.items);

      tmp = {
        ...tmp,
        loaded: true,
        keys,
        hasContent: keys.length > 0,
      };

      return resolve(tmp);
    });
  };

  // Returned filtered products
  useEffect(() => {
    data &&
      filterProducts().then((res) => {
        updateProducts(res);
      });
  }, [data, tag]);

  return (
    <Layout location={location}>
      <SEO title={t`Books`} />
      <Hero
        title={t`Books`}
        background={booksImg}
        fullWidth={false}
        location={location}
      />
      {products.loaded && (
        <section className="container reduced-width py-5 mt-5">
          <div className="row">
            <div className="col-12 col-md-3 px-5 px-md-0 mb-5 mb-md-0">
              <Sidebar params={params} />
            </div>
            <div className="col-12 col-md-9">
              <BooksGrid
                perPage={24}
                books={{
                  items: products.items,
                  hasContent: products.hasContent,
                }}
                keys={products.keys}
                params={params}
              />
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Books;
