/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from "react"
import HeroImageJPG from "../../images/resources-hero.jpg"
import HeroImageWebP from "../../images/resources-hero.webp"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { useTranslations, useTranslateContext } from "gatsby-plugin-translate"
import { translateLink } from "../../hooks/"
import HeroSection from './index'


const Hero = () => {
  const t = useTranslations()
  const { language } = useTranslateContext()
  const { isAuthenticated } = useSelector(state => state.auth)
  return (
    <HeroSection imgSources={{ jpg: HeroImageJPG, webp: HeroImageWebP }} style={{ padding: '40px 0' }}>
      <div className="container reduced-width my-5">
        <h4 className="text-tan font-weight-bold">{t`Step up. Step forward.`}</h4>
        <h1 className="text-tan display-1 font-weight-light mb-3 pb-4 kapra">{t`Resources to help you grow`}</h1>
        <Link
          to={translateLink("/about", language)}
          className="btn btn-primary btn-sm text-white"
          aria-label="Learn more about Mannahouse Resource"
        >{t`Learn More`}</Link>
        {!isAuthenticated && (
          <Link
            to={translateLink("/signup", language)}
            className="btn btn-outline-primary btn-sm text-white ml-4"
          >{t`Sign Up`}</Link>
        )}
      </div>
    </HeroSection>
  )
}

export default Hero
