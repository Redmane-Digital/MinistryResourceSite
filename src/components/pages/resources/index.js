/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import parse from "html-react-parser"
// import Carousel, { Dots, slidesToShowPlugin } from "@brainhubeu/react-carousel"
import { useTranslations, useTranslateContext } from "gatsby-plugin-translate"
import "@brainhubeu/react-carousel/lib/style.css"
import styled from "styled-components"
import diversity from "../../../images/diversity.jpg"
import worship from "../../../images/worship-and-production.jpg"
import { translateLink } from "../../../hooks"
import BackgroundImage from "../../../ui/atoms/BackgroundImage"

const gridOrder = [
  "bible-and-theology",
  "leadership",
  "sermons",
  "positionpapers",
  "missions-&-outreach",
  "discipleship",
  "worship-and-production",
  "operations",
  "generations",
  "church-planting",
  "marketplace",
  "creative",
  "languages",
  "local-outreach",
  // 'culture-and-worldview'
]

const CategoriesGrid = ({ data, linkToSearch }) => {
  const { language } = useTranslateContext()
  let ratio, lg, sm, linkTo

  return data.map((edge, i) => {
    const { slug, title, thumbnail } = edge

    ratio = i < 2 ? "ratio ratio-16x7" : "ratio ratio-16x9"
    lg = i < 2 ? 6 : i < 5 ? 4 : 3
    sm = i < 3 ? 12 : 6
    linkTo = linkToSearch === true ? `/search/?categories=${slug}` : `/resources/${slug}`

    return (
      <Link
        to={translateLink(linkTo, language)}
        className={`col-${sm} col-lg-${lg} mb-4 img-grid-item`}
        key={slug}
        data-category={title}
      >
        <div className={"position-relative " + ratio}>
          <BackgroundImage
            jpgSrc={`https://media.graphassets.com/resize=fit:scale,width:300/output=format:jpg/${thumbnail.handle}`}
            webpSrc={`https://media.graphassets.com/resize=fit:scale,width:300/output=format:webp/${thumbnail.handle}`}
            className={ratio}
            altText=""
          />
          <div className="img-grid-item-overlay">
            <div className="img-grid-item-text">{title}</div>
          </div>
        </div>
      </Link>
    )
  })
}

export const Categories = ({ data, linkToSearch = false }) => {
  const t = useTranslations()
  const categoriesData = data
    .filter(node => gridOrder.includes(node.slug))
    .sort((a, b) => {
      return gridOrder.indexOf(a.slug) - gridOrder.indexOf(b.slug)
    })

  return (
    <section className="container reduced-width py-5 px-5 px-md-0">
      <h2 className="text-center pb-5 display-4 kapra">
        {t`I need help with`}...
      </h2>
      <div className="row flex-wrap">
        <CategoriesGrid data={categoriesData} linkToSearch={linkToSearch} />
      </div>
    </section>
  )
}

export const BooksHero = ({ data }) => {
  const state = data
  const { cover, title, author, description, link } = state
  const t = useTranslations()
  const { language } = useTranslateContext()

  return (
    <section>
      <div className="container reduced-width py-5">
        <div className="d-flex align-items-center mb-5">
          <h1 className="mb-0 kapra display-4">
            <strong>{t`Books`}</strong>
          </h1>
          <Link to={translateLink("/books", language)} className="ml-3">
            {t`Browse All`}{" "}
            <FontAwesomeIcon icon={faArrowRight} style={{ color: "red" }} />
          </Link>
        </div>
        <div className="row gx-5">
          <div className="col-12 col-sm-5 col-md-4 col-lg-3">
            <img
              src={cover.url}
              alt={`Cover for ${title[language]} by ${author}`}
              className="w-100"
              loading="lazy"
            />
          </div>
          <div className="col-12 offset-lg-1 col-sm-7 col-md-8 d-flex align-items-center mt-3 mt-sm-0 mb-sm-5">
            <span>
              <h1 className="mb-4 kapra">{title[language]}</h1>
              <div className="mb-4">{parse(description.html[language])}</div>
              <Link to={translateLink(`/book/${link}`, language)}>
                <input
                  type="button"
                  className="btn btn-primary btn-sm btn-shadow text-white"
                  value={t`Learn More`}
                />
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Also FeaturedTraining
export const FeaturedResources = ({ data: state, bgClass }) => {
  const t = useTranslations()
  const { language } = useTranslateContext()
  const {
    courseTwoDescription,
    courseOneUrl,
    courseOneTitle,
    courseOneDescription,
    courseOneThumbnail,
    courseTwoThumbnail,
    courseTwoTitle,
    courseTwoUrl,
  } = state.localizations[language]

  return (
    <section className={bgClass}>
      <div className="container reduced-width py-4">
        <div className="d-flex align-items-center mt-5 mb-3">
          <p className="h1 text-center kapra display-4">{t`Featured Training`}</p>
          <Link to={translateLink("/training", language)} className="ml-3">
            {t`Browse All`}{" "}
            <FontAwesomeIcon icon={faArrowRight} style={{ color: "red" }} />
          </Link>
        </div>
        <div className="row gx-5 mt-5 pt-5">
          <div className="col-12 col-md-6 pr-md-5 mb-md-0 mb-4">
            <img
              src={`https://media.graphassets.com/resize=fit:scale,width:406/output=format:jpg/${courseOneThumbnail.handle}`}
              alt="Worldviews"
              className="w-100"
              loading="lazy"
            />
          </div>
          <div className="col-12 col-md-6 ">
            <p className="h1 kapra">{courseOneTitle}</p>
            <p className="mt-3 h5">{courseOneDescription}</p>
            <a
              href={courseOneUrl}
              className="btn btn-primary btn-shadow btn-sm text-white mt-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t`See Course`}
            </a>
          </div>
        </div>
        <div className="row gx-5 my-5 pt-5">
          <div className="col-12 col-md-6 order-last order-md-first">
            <p className="h1 kapra">{courseTwoTitle}</p>
            <p className="mt-3 h5">{courseTwoDescription}</p>
            <a
              href={courseTwoUrl}
              className="btn btn-primary btn-shadow text-white mt-3 btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t`See Course`}
            </a>
          </div>
          <div className="col-12 col-md-6 pl-md-5 mb-md-0 mb-4">
            <img
              src={`https://media.graphassets.com/resize=fit:scale,width:406/output=format:jpg/${courseTwoThumbnail.handle}`}
              alt={t`Old Testament Survey`}
              className="w-100"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export const MoreFeaturedResources = props => {
  const t = useTranslations()
  const { language } = useTranslateContext()
  return (
    <section>
      <div className="container reduced-width py-4">
        <div className="row gx-5 mt-5 pt-5">
          <div className="col-12 col-md-6 pr-md-5 mb-md-0 mb-4">
            <img src={diversity} alt="" className="w-100" loading="lazy" />
          </div>
          <div className="col-12 col-md-6">
            <p className="text-uppercase text-primary font-weight-bold mb-0">{t`We're With You`}</p>
            <p className="h1 kapra">{t`It's About Adding Margin`}</p>
            <p className="mt-3 h5">{t`Tools to help you take the next step forward. Free resources from job descriptions to position papers, organizational charts to facility documents.`}</p>
            <Link
              to={translateLink("/resources", language)}
              className="btn btn-primary btn-shadow text-white mt-3 btn-sm"
            >{t`See Resources`}</Link>
          </div>
        </div>
        <div className="row gx-5 my-5 pt-5">
          <div className="col-12 col-md-6 order-last order-md-first">
            <p className="text-uppercase text-primary font-weight-bold mb-0">{t`Make A Joyful Noise`}</p>
            <p className="h1 kapra">{t`We've Got Your Back`}</p>
            <p className="mt-3 h5">{t`Trusted resources curated from proven churches in the Mannahouse Global Family.`}</p>
            <Link
              to={translateLink("/resources", language)}
              className="btn btn-primary btn-shadow text-white mt-3 btn-sm"
            >{t`See Resources`}</Link>
          </div>
          <div className="col-12 col-md-6 pl-md-5 mb-md-0 mb-4">
            <img src={worship} alt="" className="w-100" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}

const Partner = styled.img`
  max-height: 75px;
  max-width: 100%;
  @media only screen and (max-width: 576px) {
    height: auto;
    max-height: 60px;
  }
`

export const Partners = ({ data: partners, bgClass }) => {
  return (
    <section className={bgClass}>
      <div className="container reduced-width py-5">
        <div
          className="py-5 px-5 px-sm-auto justify-content-between text-gray row gx-5"
          style={{ color: "gray" }}
        >
          {partners.slice(0, 5).map((partner, i) => {
            const sm = i < 2 ? 6 : 4
            const mb = i < 2 ? " mb-4" : ""
            return (
              <a
                href={partner.externalLink}
                className={`col-${sm} col-lg-2 my-2 d-flex justify-content-center${mb}`}
                target="_blank"
                key={partner.partnerName}
              >
                <Partner src={partner.partnerLogo.url} alt={partner.partnerName} loading="lazy" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// const Testimonial = styled.div`
//   border-radius: 5px;
//   width: 100%;
//   background: #ffffff;
//   padding: 20px;
//   border: 1px solid #eeedee;
// `

// export const Testimonials = () => {
//   const [value, setValue] = useState(1)
//   const onchange = value => setValue(value)
//   const data = []

//   return (
//     <section className="bg-light">
//       <div className="container reduced-width py-5">
//         <Carousel
//           value={value}
//           onChange={onchange}
//           plugins={[
//             "infinite",
//             "centered",
//             {
//               resolve: slidesToShowPlugin,
//               options: {
//                 numberOfSlides: 3,
//               },
//             },
//           ]}
//           breakpoints={{
//             1024: {
//               plugins: [
//                 {
//                   resolve: slidesToShowPlugin,
//                   options: {
//                     numberOfSlides: 1,
//                   },
//                 },
//               ],
//             },
//           }}
//         >
//           {data.map((item, index) => (
//             <Testimonial key={index + item.name}>
//               <div>
//                 <div className="d-flex mb-3 align-items-center">
//                   <img
//                     src={item.image.url}
//                     className="rounded-circle float-left mr-3"
//                     style={{ width: 75 }}
//                     alt={item.name}
//                   />
//                   <span>
//                     <p className="text-uppercase text-secondary font-weight-bold mb-0">
//                       {item.name}
//                     </p>
//                     <p className="mb-0">{item.description}</p>
//                   </span>
//                 </div>
//                 <p>{item.testimonial}</p>
//               </div>
//             </Testimonial>
//           ))}
//         </Carousel>
//         <Dots value={value} onChange={e => onchange(e)} number={3} />
//       </div>
//     </section>
//   )
// }
