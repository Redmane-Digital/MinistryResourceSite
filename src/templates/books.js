/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useState, useEffect } from 'react';
import Hero from '../components/heroes/WithSearch';
import { BooksGrid, Sidebar } from '../components/pages/books';
import booksImgJPG from '../images/hero__books.jpg';
import booksImgWebP from '../images/hero__books.webp';
import { useQueryString } from '../hooks';
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useTranslations } from 'gatsby-plugin-translate';

const Books = ({ location, pageContext }) => {
    const t = useTranslations();
    const data = pageContext.books;
    const [products, updateProducts] = useState({
        loaded: false,
        items: {},
        hasContent: false
    });
    const params = useQueryString(location.search);
    let tag = params.category || 'all';
        tag = tag.replace('-', ' ');

        console.log(data);

    const filterProducts = () => {
        return new Promise((resolve) => {
            let tmp = {
                loaded: true,
                items: {}
            };

            for (const key of pageContext.keys) {
                const ref = data[key].tags.join(' ').toLowerCase();
                if (tag === 'all') {
                    tmp.items[key] = data[key];
                } else {
                    if (ref.includes(tag.toLowerCase())) {
                        tmp.items[key] = data[key]
                    };
                }
            };

            const keys = Object.keys(tmp.items);

            tmp = {
                ...tmp,
                loaded: true,
                keys,
                hasContent: keys.length > 0
            };

            return resolve(tmp);
        });
    };

    // Returned filtered products
    useEffect(() => {
       data && filterProducts().then(res => { updateProducts(res); });
    }, [data, tag]);

    return (
        <Layout location={location}>
            <SEO title={t`Books`} />
            <Hero title={t`Books`} imgSources={{ jpg: booksImgJPG, webp: booksImgWebP }} fullWidth={false} location={location} imgStyles={{ darkenBy: "0.6", position: "center bottom" }} />

            {products.loaded &&
                <section className="container reduced-width py-5 mt-5">
                    <div className="row">
                        <div className="col-12 col-md-3 px-5 px-md-0 mb-5 mb-md-0">
                            <Sidebar params={params}/>
                        </div>
                        <div className="col-12 col-md-9">
                            <BooksGrid perPage={24} books={{ items: products.items, hasContent: products.hasContent }} keys={products.keys} params={params} />
                        </div>
                    </div>
                </section>
            }
        </Layout>
    );
};

export default Books;