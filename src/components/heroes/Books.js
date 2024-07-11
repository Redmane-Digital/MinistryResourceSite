/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from "react"
import { booksImg } from "./images"
import { useTranslations } from "gatsby-plugin-translate"
import { HeroSection } from "./index"

const Hero = () => {
  const t = useTranslations()
  return (
    <HeroSection
      imgSources={{
        jpg: booksImg,
      }}
      imgStyles={{
        position: "center bottom",
      }}
      style={{
        minHeight: 300,
      }}
    >
      <div
        className="py-4"
        style={{
          background: "rgba(15,56,90,0.85)",
        }}
      >
        <div className="container text-white">
          <h2 className="mb-0 font-weight-bold">{t`Books`}</h2>
        </div>
      </div>
    </HeroSection>
  )
}

export default Hero
