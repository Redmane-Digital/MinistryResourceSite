/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from "react"
import LiveSearchBox from "../universal/search/LiveSearchBox"
import HeroSection from "./index"

const Hero = ({
  imgSources,
  title,
  text,
  placeholder = "Ex. Streaming our Worship Service",
  fullWidth = false,
  location,
  imgStyles = {},
}) => {
  const heroWidth = fullWidth ? "" : "reduced-width"

  return (
    <HeroSection
      imgSources={imgSources}
      imgStyles={imgStyles}
      style={{
        minHeight: 400,
      }}
    >
      <div
        className="py-4 bg-tertiary-85"
      >
        <div className={`container text-white ${heroWidth}`}>
          <h2 className="mb-0 font-weight-bold">{title}</h2>
        </div>
      </div>
      <LiveSearchBox
        text={text}
        placeholder={placeholder}
        theWidth={heroWidth}
        location={location}
      />
    </HeroSection>
  )
}

export default Hero
