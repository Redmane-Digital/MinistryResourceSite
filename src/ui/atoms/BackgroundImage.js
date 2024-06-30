/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import styled from "styled-components"

const Picture = styled.picture`
    top: 0;
    z-index: -1;
    filter: brightness(${props => props.darkenBy});
    position: absolute;
    width: 100%;
    height: 100%;
`

const BackgroundImage = ({ webpSrc, jpgSrc, altText, position = 'center center', darkenBy = '0.5' }) => {
  return (
    <Picture darkenBy={darkenBy}>
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={jpgSrc} type="image/jpeg" />
      <img
        src={jpgSrc}
        alt={altText}
        className="w-100 h-100 object-fit-cover overflow-hidden"
        style={{ objectPosition: position }}
      />
    </Picture>
  )
}

export default BackgroundImage;