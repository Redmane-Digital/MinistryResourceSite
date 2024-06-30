/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useTranslations } from "gatsby-plugin-translate";

const NotFoundPage = ({ location }) => {
  const t = useTranslations();
  return (<Layout location={location}>
      <SEO title="404: Not found" />
      <h1>404: {t`Not Found`}</h1>
      <p>{t`This page doesn't exist.`}</p>
    </Layout>)
}

export default NotFoundPage
