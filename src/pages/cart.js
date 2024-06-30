/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useContext } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { Context } from '../plugins/shopify';
import { useTranslations } from 'gatsby-plugin-translate';
 
const Quantity = styled.div`
    max-width: 180px;
    button, input {
        background-color: #eeeeee;
    }
    input {
        border-bottom:1px solid #eeeeee;
        border-top: 1px solid #eeeeee;
        text-align: center;
        

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    button {
        border-radius: 0;
        font-weight: bold;
        padding: 0 10px;
    }
`;

const Cart = ({ location }) => {
    const { removeLineItem, updateLineItem, store: { checkout, client } } = useContext(Context);
    const handleCheckout = () => window.open(checkout.webUrl);
    const removeItem = lineItem => removeLineItem(client, checkout.id, lineItem);
    const t = useTranslations();

    const setQuantity = function(e) {
        const { value, dataset } = e.target; 
        if (value < 1) return;
        updateLineItem(client, checkout.id, dataset.item, value);
    }

    return (
        <Layout location={location}>
            <SEO title="Cart" />
            {checkout && checkout.lineItems ?
                <section className="container my-5">
                    {checkout.lineItems.length > 0 ? <h5 className="mb-4">Cart (<span>{checkout.lineItems.length}</span> items)</h5> : ""}
                    <div className="row gx-5">
                        <div className="col-lg-8">
                            {checkout.lineItems.length > 0 ? <>
                                {checkout.lineItems.map((item, index) =>
                                    <div className="mb-3" key={index}>
                                        <div className="pt-4 wish-list">
                                            <div className="row mb-4">
                                                <div className="col-md-5 col-lg-3 col-xl-3">
                                                    <div className="vmb-3 mb-md-0">
                                                        <img className="img-fluid w-100 box-shadow" src={item.attrs.variant.image.src} alt={item.attrs.title.value} />
                                                    </div>
                                                </div>
                                                <div className="col-md-7 col-lg-9 col-xl-9">
                                                    <div>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <h5>{item.attrs.title.value}</h5>
                                                                {/* <p className="mb-3 text-muted text-uppercase small">Shirt - blue</p> */}
                                                            </div>
                                                            <div>
                                                                <Quantity className="input-group mb-3">
                                                                    {/* <button className="btn btn-sm" type="button">-</button> */}
                                                                    <div className="form-file">
                                                                        <input type="number" data-item={item.attrs.id.value} className="form-control" value={item.quantity} onChange={setQuantity} />
                                                                    </div>
                                                                    {/* <button className="btn btn-sm" type="button">+</button> */}
                                                                </Quantity>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <a href="#!" onClick={() => removeItem(item.attrs.id.value)} type="button" className="card-link-secondary small text-uppercase mr-3"><i
                                                                    className="fas fa-trash-alt mr-1"></i> Remove item </a>
                                                                {/* <a href="#!" type="button" className="card-link-secondary small text-uppercase"><i
                                                                    className="fas fa-heart mr-1"></i> Move to wish list </a> */}
                                                            </div>
                                                            <p className="mb-0"><span><strong id="summary">${Number(item.variant.price.amount).toFixed(2)}</strong></span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="mb-4" />
                                        </div>
                                    </div>
                                )}
                            </> : "No products in cart"}
                        </div>


                        <div className="col-lg-4">
                            <div className="mb-3">
                                <div className="pt-4">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                            Subtotal:
                                    <span>${isNaN(checkout.subtotalPrice?.amount) ? '0.00' : Number(checkout.subtotalPrice?.amount).toFixed(2)}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                            Estimated tax: <span><em>Calculated at checkout</em></span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                <strong>Total</strong>
                                            </div>
                                            <span><strong>${isNaN(checkout.totalPrice?.amount) ? '0.00' : Number(checkout.totalPrice?.amount).toFixed(2)}</strong></span>
                                        </li>
                                    </ul>

                                    <button onClick={handleCheckout} className="btn btn-secondary text-white btn-block" disabled={checkout.lineItems.length === 0}>{t`Checkout`}</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </section> : "Loading..."}
        </Layout>
    );
};

export default Cart;