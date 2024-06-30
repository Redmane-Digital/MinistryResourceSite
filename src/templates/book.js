/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useState } from 'react';
import { Sidebar } from '../components/pages/books';
import { useQueryString } from '../hooks/';
import parse from 'html-react-parser';
import { Link } from 'gatsby';
import { AddToCart, QuantitySelector, VariantSelector } from '../components/universal/storefront';
import Layout from "../components/layout"
import SEO from "../components/seo";
import { useTranslateContext, useTranslations } from 'gatsby-plugin-translate';

const Price = ({ variant }) => {
    const price = variant.price*1 === 0 ? 'FREE' : '$' + Number(variant.price).toFixed(2);

    console.log(price, variant.price);

    return <p>
        {price} {(variant.compareAtPrice && variant.compareAtPrice !== variant.price) && <span style={{ paddingLeft: '0.2rem', textDecoration: 'line-through' }}>${variant.compareAtPrice}</span>}
    </p>
}

const Book = ({ location, pageContext }) => {
    const { book, recs } = pageContext;
    const [state, setState] = useState({
        product: book,
        variant: book.variants[0],
        featuredImage: book.featuredImage,
        quantity: 1,
        recs: {}
    });
    const t = useTranslations();
    const { language } = useTranslateContext();
    const params = useQueryString(location.search);
    const options = {
        replace: ({ attribs }) => {
            if (!attribs) return;
            if (attribs.manna === 'hidden') return (<></>);
            else return;
        }
    };

    const changeQuantity = q => {
        const quantity = q < 1 ? 1 : q;
        setState({
            ...state,
            quantity
        });
    };

    const ProductRecs = () => {
        const keys = Object.keys(recs);
        const arr = [];

        for (let i = 0; i < 4; i++) {
            let rec = keys[keys.length * Math.random() << 0];
            while (arr.includes(rec) || state.product.handle === rec) {
                rec = keys[keys.length * Math.random() << 0];
            }
            arr.push(rec);
        };
        return arr.map(item => {
            const rec = recs[item];
            const img = rec.variants[0]?.node?.image?.originalSrc || rec?.featuredImage?.originalSrc;

            return <div className="col-6 col-lg-3 p-md-5 pt-5" key={rec.handle}>
                <Link to={`/book/${rec.handle}`} className="">
                    <img src={img} className="w-100 mb-3" alt={rec.title} />
                    <p className="h5 text-dark">{rec.title}</p>
                    <p className="h5 font-weight-bold text-dark mb-0">${rec.variants[0].node.price}</p>
                </Link>
            </div>
        })
    };

    const changeVariant = e => {
        setState({
            ...state,
            variant: state.product.variants[e]
        })
    };

    const img = state.variant?.image?.originalSrc || state.featuredImage?.originalSrc;

    return (
        <Layout location={location}>
            <SEO title={`${state.product.title[language]} | ${t`Books`}`} image={img} />
            <section style={{ background: "#d0d1c9" }}>
                <div className="container reduced-width py-4">
                    <h4 className="text-primary mb-0">
                        <strong><Link to="/books" className="text-primary">{t`Books`}</Link> / </strong>
                        <span className="font-weight-light">{state.product.title[language]}</span>
                    </h4>
                </div>
            </section>
            <section className="container reduced-width py-5 mt-md-5">
                <div className="row">
                    <div className="col-12 col-lg-4 col-xl-3 d-none d-lg-block">
                        <Sidebar params={params}/>
                    </div>
                    <div className="col-12 col-lg-8 col-xl-9">
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="px-5 pl-md-0">
                                    <img src={img} alt={state.product.title[language]} className="w-100" style={{ boxShadow: '0 0 10px rgba(0,0,0,0.2)' }} />
                                </div>
                            </div>
                            <div className="col-12 col-md-6 px-5 px-md-0">
                                <h1 className="kapra text-uppercase text-dark display-5 mt-5 mt-md-0">{state.product.title[language]}</h1>
                                <Price variant={state.variant} />
                                <span>{parse(state.product.descriptionHtml[language], options)}</span>
                                <VariantSelector handleChange={changeVariant} variants={state.product.variants} />
                                <QuantitySelector handleChange={changeQuantity} quantity={state.quantity} />
                                <AddToCart variant={state.variant.id} quantity={state.quantity} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="bg-light py-5">
                    <div className="container reduced-width py-4">
                        <h1 className="kapra text-uppercase text-primary display-5 ml-md-4 text-center text-md-left">You might also like</h1>
                        <div className="row gx-5 px-5 px-md-0">
                            <ProductRecs />
                        </div>
                    </div>
                </section> */}
        </Layout>
    );
};

export default Book;