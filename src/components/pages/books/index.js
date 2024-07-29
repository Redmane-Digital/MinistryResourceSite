/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import Pagination from '../../universal/Pagination';
import { useTranslations, useTranslateContext } from 'gatsby-plugin-translate';
import { translateLink } from '../../../hooks/';

const Book = styled.img`
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Select = styled.select`
  background: #eeeeee;
`;

const Price = ({ book }) => {
  const t = useTranslations();
  const price =
    book.price * 1 === 0
      ? 'FREE'
      : t`from` + ' $' + Number(book.price).toFixed(2);
  return (
    <small>
      {price}{' '}
      {book.compareAtPrice && (
        <span style={{ paddingLeft: '0.2rem', textDecoration: 'line-through' }}>
          ${book.compareAtPrice}
        </span>
      )}
    </small>
  );
};

export const BooksGrid = ({ books, perPage, keys, params }) => {
  const [state, setState] = useState({ keys: [] });
  const page = Number(params.page) > 1 ? Number(params.page) : 1;
  const { language } = useTranslateContext();
  const t = useTranslations();

  const updatePage = () => {
    const pages = Math.ceil(keys.length / perPage),
      slice = {
        start: page * perPage - perPage,
        end: page * perPage,
      },
      newState = {
        loadedSlug: params.category,
        loadedPage: page,
        keys,
        pages,
        currentPage: {
          index: page,
          books: keys.slice(slice.start, slice.end),
        },
      };
    setState(newState);
  };

  // Update state when prop 'books' changes
  useEffect(() => updatePage(), [books]);

  return (
    <>
      {books.hasContent &&
      state.loadedSlug === params.category &&
      state.loadedPage === page ? (
        <>
          <div className="row">
            {state.currentPage.books.map((b) => {
              let book = false;
              if (books.items[b] && books.items[b].variants) {
                let compareAt =
                  Number(books.items[b].variants[0].compareAtPrice) || 0.0;
                let img =
                  books.items[b].variants[0]?.image?.originalSrc ||
                  books.items[b].featuredImage?.originalSrc;
                book = {
                  ...books.items[b],
                  img,
                  price: books.items[b].variants[0].price,
                  handle: books.items[b].handle,
                  compareAtPrice:
                    compareAt > Number(books.items[b].variants[0].price)
                      ? compareAt
                      : false,
                };
              }

              const bookTitle = book.title ? book.title[language] : book.title;

              let bookHtml;
              if (book.isExternal) {
                bookHtml = (
                  <a
                    href={book.link}
                    className="col-12 col-md-6 col-lg-4 mb-5 text-center text-dark px-md-4 mb-4"
                    key={bookTitle}
                    target="_blank"
                  >
                    <Book
                      src={book.image.url}
                      alt={bookTitle}
                      className="w-75 mb-4"
                    />
                    <p className="mb-0 font-weight-bold">{bookTitle}</p>
                    <small>${book.price}</small>
                  </a>
                );
              } else {
                bookHtml = (
                  <Link
                    to={translateLink(`/book/${book.handle}`, language)}
                    className="col-12 col-md-6 col-lg-4 mb-5 text-center text-dark px-md-4 mb-4"
                    key={bookTitle}
                  >
                    <Book
                      src={book.img}
                      alt={bookTitle}
                      className="w-75 mb-4"
                    />
                    <p className="mb-0 font-weight-bold">{bookTitle}</p>
                    <small>
                      {t`from`} ${book.price}{' '}
                      {book.compareAtPrice && (
                        <span
                          style={{
                            paddingLeft: '0.2rem',
                            textDecoration: 'line-through',
                          }}
                        >
                          ${book.compareAtPrice}
                        </span>
                      )}
                    </small>
                  </Link>
                );
              }

              return book && bookHtml;
            })}
          </div>
          <Pagination
            index={state.currentPage.index}
            pages={state.pages}
            params={params}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export const Sidebar = ({ params }) => {
  const t = useTranslations();
  const { language } = useTranslateContext();
  const category = params.category || 'all';
  const cats = [
    {
      title: t`All`,
      slug: 'all',
    },
    {
      title: t`Biblical Studies`,
      slug: 'biblical-studies',
    },
    {
      title: t`Christian Living`,
      slug: 'christian-living',
    },
    {
      title: t`Church Growth`,
      slug: 'church-growth',
    },
    {
      title: t`eBooks`,
      slug: 'ebook',
    },
    {
      title: t`Leadership`,
      slug: 'leadership',
    },
    {
      title: t`Spanish`,
      slug: 'spanish',
    },
    {
      title: t`Worship`,
      slug: 'worship',
    },
  ];

  const handleChange = function (e) {
    if (e.target.value !== category) {
      navigate(translateLink(`/books/?category=${e.target.value}`, language));
    }
  };

  return (
    <div className="px-4">
      <h1 className="kapra text-primary text-uppercase font-weight-bold mb-3">{t`Books`}</h1>
      {cats.map((cat) => (
        <Link
          key={'link_' + cat.slug}
          to={translateLink(`/books/?category=${cat.slug}`, language)}
          className={`d-none text-dark d-md-block ${
            category === cat.slug ? ' font-weight-bold' : ''
          }`}
        >
          {cat.title}
        </Link>
      ))}
      <Select
        className="d-block d-md-none form-control"
        onChange={handleChange}
        aria-label="Category selector"
      >
        {cats.map((cat) => (
          <option
            value={cat.slug}
            selected={cat.slug === category}
            key={'opt_' + cat.slug}
          >
            {cat.title}
          </option>
        ))}
      </Select>
    </div>
  );
};
