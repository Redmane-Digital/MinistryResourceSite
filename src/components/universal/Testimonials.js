/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import { Splide, SplideSlide } from '../../plugins/splide/';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import quoteIcon from '../../assets/img/conversation-mark.svg';

const Testimonial = styled.div`
    border-radius: 5px;
    width: 100%;
    background: #ffffff;
    padding: 20px;
    border: 1px solid #eeedee;
    height: 100%;
`;

const Testimonials = () => {
    const data = useSelector(state => state.pages.resources.testimonials);

    return (
        <section className="bg-light pt-5 pb-4">
            <div className="container">
                <Splide
                    options={{
                        type: 'loop',
                        perPage: 3,
                        perMove: 1,
                        focus: 'center',
                        arrows: false,
                        gap: '1rem',
                        rewind: true,
                        breakpoints: {
                            1024: {
                                perPage: 2,
                                focus: 0
                            },
                            768: {
                                perPage: 1
                            }
                        }
                    }}
                    hasSliderWrapper={true}
                >
                    {data.map(item => (
                        <SplideSlide key={item.name}>
                            <Testimonial>
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <span>
                                        <div className="d-flex mb-3 align-items-center">
                                            <img src={item.image.url} className="rounded-circle float-left mr-3 testimonial-image" alt={item.name} />
                                            <span>
                                                <p className="text-uppercase text-secondary font-weight-bold mb-0">{item.name}</p>
                                                <span className="mb-0">{item.description}</span>
                                            </span>
                                        </div>
                                        <p>{item.testimonial}</p>
                                    </span>
                                    <div className="text-center">
                                        <img src={quoteIcon} className="quote-icon" alt="" />
                                    </div>
                                </div>
                            </Testimonial>
                        </SplideSlide>
                    )
                    )}
                </Splide>
            </div>
        </section>
    )

};

export default Testimonials;