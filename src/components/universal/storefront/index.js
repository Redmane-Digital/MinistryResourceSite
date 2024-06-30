/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { Context } from '../../../plugins/shopify';
import { translateLink } from '../../../hooks/';
import { useTranslateContext, useTranslations } from 'gatsby-plugin-translate';

const Quantity = styled.input`
    background-color: #eeeeee;
`;

const Variants = styled.select`
    background-color: #eeeeee;
    border-radius: 0;
    border: none;
`;

export const AddToCart = props => {
    const [carted, setCarted] = useState(false);
    const { addVariantToCart } = useContext(Context);
    const handleAddToCart = () => addVariantToCart(props.variant, props.quantity).then(setCarted(true));
    const t = useTranslations();
    const { language } = useTranslateContext();

    return (
        <>
            <button className="btn btn-primary btn-shadow text-white mt-5 btn-sm" onClick={handleAddToCart}>{t`Add to Cart`}</button>
            {carted && navigate(translateLink('/cart', language))}
        </>
    );
};

export const QuantitySelector = ({ handleChange, quantity }) => {
    const t = useTranslations();
    return (
        <>
            <label htmlFor="quantity" className="form-label font-weight-bold mt-4">{t`Quantity`}</label>
            <Quantity className="form-control" id="quantity" type="number" value={quantity} onChange={e => handleChange(e.target.value)} />
        </>
    );
};

export const VariantSelector = ({ variants, handleChange }) => {
    const t = useTranslations();
    return (
        <>
            {variants.length > 1 &&
                <>
                    <label htmlFor="variant" className="form-label font-weight-bold mt-4">{t`Variant`}</label>
                    <Variants className="form-select" id="variant" aria-label="Variants" onChange={e => handleChange(e.target.value)}>
                        {variants.map((variant, i) => {
                            return <option value={i} key={variant.title}>{variant.title}</option>
                        })}
                    </Variants>
                </>
            }
        </>
    );
};