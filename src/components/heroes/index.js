/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from "react"
import Helmet from "react-helmet"
import styled from "styled-components"

const SectionWithBackground = styled.section`
  background-size: cover;
  background-position: ${props => props.position};
  background-image: ${props => props.gradient}, url(${props => props.imgSrcJPG});
  ${props =>
    props.imgSrcWebp &&
    `
    @supports (background-image: url(${props.imgSrcWebW})) {
      background-image: ${props.gradient}, url(${props.imgSrcWebW});
    `}
`

const HeroSection = ({ imgSources = {}, imgStyles = {}, children, ...props}) => {
  const gradientOpacity = imgStyles.opacity || 0.5
  const gradientCSS = `linear-gradient(rgba(0,0,0,${gradientOpacity}), rgba(0,0,0,${gradientOpacity}))`

  return (
    <>
      <Helmet>
        <link
          rel="preload"
          as="image"
          href={imgSources.webp || imgSources.jpg}
        />
      </Helmet>
      <SectionWithBackground
        gradient={gradientCSS}
        imgSrcWebP={imgSources.webp}
        imgSrcJPG={imgSources.jpg}
        position={imgStyles.position || "center center"}
        {...props}
      >
        {children}
      </SectionWithBackground>
    </>
  )
}

export default HeroSection
