/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import LiveSearchBox from "../components/universal/search/LiveSearchBox"
import background from "../images/training.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { Link } from "gatsby"
import { useTranslations, useTranslateContext } from "gatsby-plugin-translate"
import Hero from "../components/heroes/WithSearch"

// pics
import dos from "../images/trainDos.jpg"
import pill from "../images/pbc_pill.png"
import courseIcon from "../images/course_icon.svg"
import workshopIcon from "../images/workshop_icon.svg"
import BackgroundImage from "../ui/atoms/BackgroundImage"
import trainingToSharpen from "../images/training_to_sharpen.jpg";

const Button = styled.a`
  font-size: 14px;
  text-transform: uppercase;
  padding: 10px;
  display: flex;
  width: 50%;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: 0.3s ease;
  min-width: 80px;
  text-decoration: none;
  &.right {
    clip-path: polygon(21px 0, 100% 0, 100% 100%, 0 100%);
    padding-left: 2rem;
    background: transparent;
    position: relative;
    margin-left: -10px;
    border: 1px solid #121c30;
    color: #121c30;
    &:after {
      position: absolute;
      content: "";
      height: calc(100% + 1px);
      width: calc(100% + 1px);
      top: -1px;
      background: #121c30;
      left: calc(-100% + 20.1px);
      -webkit-clip-path: polygon(0 0, 100% 0, calc(100% - 21px) 100%, 0 100%);
      clip-path: polygon(0 0, 100% 0, calc(100% - 21px) 100%, 0 100%);
    }
    &:hover {
      background: #121c30;
      color: #eeece8;
    }
  }
  &.left {
    padding-right: 2rem;
    -webkit-clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
    clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
    background: #121c30;
    border: 1px solid #121c30;
    color: #eeece8;
    position: relative;
    &.bg-primary {
      border-color: #e95b43;
      &:after {
        background: #e95b43;
      }
      &:hover {
        background: transparent !important;
        color: #e95b43;
      }
    }
    &:after {
      position: absolute;
      content: "";
      height: calc(100% + 1px);
      width: calc(100% + 1px);
      top: -1px;
      background: #121c30;
      right: calc(-100% + 20.1px);
      -webkit-clip-path: polygon(21px 0, 100% 0, 100% 100%, 0 100%);
      clip-path: polygon(21px 0, 100% 0, 100% 100%, 0 100%);
    }
    &:hover {
      background: #e64226;
      border-color: #e64226;
    }
  }
`

const PbcInfo = styled.div`
  @media only screen and (max-width: 767px) {
    margin-top: 4rem !important;
  }
  .pbc-logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -72px;
    @media only screen and (min-width: 768px) {
      width: 100px;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
    }
  }
  .pbc-content {
    border: 2px solid black;
    padding-left: 30px;
    padding-right: 30px;
    @media only screen and (min-width: 768px) {
      width: calc(100% - 38px);
      float: right;
      padding-top: inherit;
      padding-left: 90px;
      padding-right: 30px;
      .pbc-buttons {
        float: right;
      }
    }
    @media only screen and (max-width: 767px) {
      padding-top: 100px !important;
      .left,
      .right {
        width: 50%;
      }
    }
  }
`

const CourseImage = styled.img`
  aspect-ratio: 209 / 118;
  object-fit: cover;
  width: 100%;
`

const Train = ({ location }) => {
  const t = useTranslations()
  const { language } = useTranslateContext()
  return (
    <Layout location={location}>
      <SEO
        title={t`Training`}
        description={t`Elevate your ministry with our specially curated selection of training resources. Dive into expert-led sessions designed to empower pastors, worship leaders, and church staff.`}
      />
      <Hero title={t`Training`} imgSources={{ jpg: background }} fullWidth={false} location={location} imgStyles={{ darkenBy: "0.6", position: "center bottom" }} />
      {/* <section className="bg-secondary-85">
        <div className="container reduced-width py-4">
          <h4 className="text-white mb-0">
            <strong>{t`Training`}</strong>
          </h4>
        </div>
      </section> */}

      {/* <section
        className="position-relative"
        style={{
          minHeight: 275,
        }}
      >
        <BackgroundImage
          jpgSrc={background}
          altText="Training"
          darkenBy="0.75"
          position="center bottom"
        />
        <LiveSearchBox theWidth="reduced-width" location={location} />
      </section> */}

      {/* Free training section */}
      <section id="workshops">
        <div className="container reduced-width mt-5 py-3">
          <div className="d-flex align-items-center justify-content-center mb-4">
            <img src={workshopIcon} style={{ height: 75 }} className="mr-3" />
            <h1 class="text-secondary display-4 kapra mb-0">{t`Training to Sharpen Your Skills`}</h1>
          </div>

          <div class="row gx-5 mb-5 pt-5">
            <div class="col-12 col-md-6">
              <img
                src={trainingToSharpen}
                alt=""
                class="w-100"
                loading="lazy"
              />
            </div>
            <div class="col-12 col-md-6">
              <p className="mb-5">
                {t`Get the biblical education you need without going to seminary. Portland Bible College's full catalog of courses is now available to audit online at `}
                <a
                  style={{ fontWeight: 600 }}
                  className="text-secondary"
                  href="https://www.pbcaccess.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >{t`www.pbcaccess.com`}</a>
                . {t`Sign up today to access free lectures and full courses.`}
              </p>
              <p className="mb-5">
                <a
                  href="https://www.pbcaccess.com/pages/free-lectures"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-shadow text-white mt-3 btn-sm"
                >{t`Browse Free Training`}</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full courses section */}
      <section id="full-courses" className="bg-light">
        <div className="container reduced-width my-5 py-md-3">
          <div className="d-flex align-items-center justify-content-center mb-4">
            <img src={courseIcon} style={{ height: 75 }} className="mr-3" />
            <h1 class="text-primary display-4 kapra mb-0">{t`Full Courses To Go Deeper`}</h1>
          </div>
          <p className="mb-5 text-center">{t`Do a deep dive on topics by auditing full courses from Portland Bible College. Access trusted theology and tested ministry courses to develop yourself and your leaders.`}</p>
          <p className="text-primary text-center text-uppercase h5 mt-4 mb-4">
            <strong>{t`Featured Courses`}</strong>
          </p>
          <div className="row py-3">
            <a
              href="https://www.pbcaccess.com/courses/pauline-epistles"
              target="_blank"
              rel="noopener noreferrer"
              className="col-12 col-md-3"
            >
              <CourseImage
                src="https://import.cdn.thinkific.com/15788/courses/1201008/8sRZRsF0SAOomaRtkqiu_Pauline%20Epistles_t.jpg"
                loading="lazy"
              />
              <p className="mt-2 text-dark">{t`Pauline Epistles`}</p>
            </a>
            <a
              href="https://www.pbcaccess.com/courses/decision-making"
              target="_blank"
              rel="noopener noreferrer"
              className="col-12 col-md-3"
            >
              <CourseImage
                src="https://import.cdn.thinkific.com/15788/courses/1597611/1a8HpqwnTpW4rHxRpz1M_Decision%20Making.jpg"
                loading="lazy"
              />
              <p className="mt-2 text-dark">{t`Descision Making`}</p>
            </a>
            <a
              href="https://www.pbcaccess.com/courses/worldviews"
              target="_blank"
              rel="noopener noreferrer"
              className="col-12 col-md-3"
            >
              <CourseImage
                src="https://import.cdn.thinkific.com/15788/courses/1200132/dHwJBw8StMtV4St0vuvQ_Worldviews.jpg"
                loading="lazy"
              />
              <p className="mt-2 text-dark">{t`Worldviews`}</p>
            </a>
            <a
              href="https://www.pbcaccess.com/courses/old-testament-survey"
              target="_blank"
              rel="noopener noreferrer"
              className="col-12 col-md-3"
            >
              <CourseImage
                src="https://files.cdn.thinkific.com/courses/course_card_image_001/045/7291606258167.original.jpg"
                loading="lazy"
              />
              <p className="mt-2 text-dark">{t`Old Testament Survey`}</p>
            </a>
          </div>
          <p className="text-center small mb-0">
            <Link
              to={"https://www.pbcaccess.com/courses"}
              className="text-uppercase text-primary"
              target="_blank"
            >
              <strong>{t`Browse All`}</strong>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2"
                style={{ color: "#ef4123" }}
              />
            </Link>
          </p>
        </div>
      </section>

      {/* Curated bundles section */}
      <section id="curated-bundles">
        <div className="container reduced-width my-5 py-md-3">
          <div className="d-flex align-items-center justify-content-center mb-4">
            <img src={workshopIcon} style={{ height: 75 }} className="mr-3" />
            <h1 class="text-secondary display-4 kapra mb-0">{t`Course Bundles curated for specific ministries`}</h1>
          </div>
          <p className="mb-5 text-center">
            {t`Develop and equip your leaders in all areas of ministry. Access multiple courses for one affordable monthly price. Start and stop anytime.`}
          </p>

          <p className="text-secondary text-center text-uppercase h5 mt-4 mb-4">
            <strong>{t`Featured courses`}</strong>
          </p>
          <div className="row py-3">
            <a
              href="https://www.pbcaccess.com/bundles/foundations"
              target="_blank"
              rel="noopener noreferrer"
              className="col-12 col-md-3"
            >
              <CourseImage
                src="https://files.cdn.thinkific.com/bundles/bundle_card_image_000/077/795/1698946761.small.jpg"
                loading="lazy"
              />
              <p className="mt-2 text-dark">{t`Foundations`}</p>
            </a>
            <a
              href="https://www.pbcaccess.com/bundles/helping-people"
              target="_blank"
              rel="noopener noreferrer"
              className="col-12 col-md-3"
            >
              <CourseImage
                src="https://files.cdn.thinkific.com/bundles/bundle_card_image_000/113/645/1681338406.small.jpg"
                loading="lazy"
              />
              <p className="mt-2 text-dark">{t`Helping People`}</p>
            </a>
            <a
              href="https://www.pbcaccess.com/bundles/youth-pastor-bundle"
              target="_blank"
              rel="noopener noreferrer"
              className="col-12 col-md-3"
            >
              <CourseImage
                src="https://files.cdn.thinkific.com/bundles/bundle_card_image_000/109/689/1675962650.small.jpg"
                loading="lazy"
              />
              <p className="mt-2 text-dark">{t`Youth Pastor`}</p>
            </a>
            <a
              href="https://www.pbcaccess.com/bundles/navigating-culture-bundle"
              target="_blank"
              rel="noopener noreferrer"
              className="col-12 col-md-3"
            >
              <CourseImage
                src="https://import.cdn.thinkific.com/15788/C1OhVhDSRSu3HTzISbWg_Navigating%20Culture%20Bundle%20Card.jpg"
                loading="lazy"
              />
              <p className="mt-2 text-dark">{t`Navigating Culture`}</p>
            </a>
          </div>
          <p className="text-center small mb-0">
            <Link
              to={"https://www.pbcaccess.com/collections/bundles"}
              className="text-uppercase text-secondary"
              target="_blank"
            >
              <strong>{t`Browse All`}</strong>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2"
                style={{ color: "#111c30" }}
              />
            </Link>
          </p>
        </div>
      </section>

      {/* PRIME Interships section */}
      <section className="bg-light">
        <div className="container reduced-width py-4">
          <div className="row gx-5 mb-5 pt-5">
            <div className="col-12 col-md-5">
              <div className="position-relative">
                <img src={dos} alt="" className="w-100" loading="lazy" />
                <div
                  className="position-absolute"
                  style={{
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.4)",
                  }}
                ></div>
              </div>
            </div>
            <div className="col-12 col-md-7">
              <h1 className="text-primary display-6 kapra">{t`Prime Program`}</h1>
              <p className="mt-3">
                {t`PRIME is a series of lectures on Biblical Doctrine, Worldviews and Spiritual Formation designed to ground students in their faith and help them find answers to the big questions of life in the Word of God.`}
              </p>
              <div
                className="d-flex flex-wrap justify-content-between mb-4"
                style={{ maxWidth: 400, width: "100%" }}
              >
                <a
                  href="https://www.pbcaccess.com/courses/prime"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-shadow text-white mt-3 btn-sm"
                >{t`Get more info on the Prime Intership`}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PBC Cross-sell section */}
      <section id="pbc" className="container reduced-width">
        <div className="row my-5">
          <PbcInfo className="col-12 position-relative my-5">
            <img
              src={pill}
              className="pbc-logo"
              alt="Portland Bible College logo"
            />
            <div className="py-5 pbc-content">
              <div className="d-flex">
                <span className="text-md-right">
                  <h1 className="mb-0 freight font-weight-bold display-4">
                    <em>{t`want to pursue a degree?`}</em>
                  </h1>
                  <p className="text-primary h3 freight font-weight-bold">
                    <em>{t`join us online or at our portland campus`}</em>
                  </p>
                </span>
              </div>
              <p className="mb-0 mt-3 h5 freight">{t`Get trained for ministry! For over 50 years, Portland Bible College has been training leaders in strong biblical foundations and helping churches build strong discipleship pipelines to build strong healthy churches.`}</p>
              <div className="d-flex align-items-between mt-5 flex-column flex-md-row">
                <span className="d-flex w-100 w-md-50">
                  <Button
                    href="https://portlandbiblecollege.org/online-program/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="left"
                  >{t`Online Program`}</Button>
                  <Button
                    href="https://portlandbiblecollege.org/academics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="right"
                  >{t`See All Programs`}</Button>
                </span>
                <span className="d-flex w-100 w-md-50 mt-3 mt-md-0">
                  <Button
                    href="https://portlandbiblecollege.org/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-md-3 left bg-primary"
                  >{t`About PBC`}</Button>
                  <Button
                    href="https://portlandbiblecollege.org/pastors-and-churches/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="right"
                  >{t`Church Programs`}</Button>
                </span>
              </div>
            </div>
          </PbcInfo>
        </div>
      </section>
    </Layout>
  )
}

export default Train
