/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import HeroSection from './index';

const Hero = ({ imgSources, title, heading = false, imagePosition = 'center bottom', reducedWidth = false, imgStyles = {} }) => {
    return (
        <HeroSection style={{ minHeight: 300 }} className="position-relative" position={imagePosition} imgSources={imgSources} imgStyles={imgStyles}>
            <div
                className="py-4 bg-tertiary-85"
            >
                <div className={`container ${reducedWidth && 'reduced-width'} text-white`}>
                    <h2 className="mb-0 font-weight-bold">{title}</h2>
                </div>
            </div>
            {heading && (
                <div className={`container ${reducedWidth && 'reduced-width'} py-5`}>
                    <h1 className="kapra my-4 display-1" style={{ color: '#e8e1cf' }}>{heading}</h1>
                </div>
            )}
        </HeroSection>
    );
};

export default Hero;