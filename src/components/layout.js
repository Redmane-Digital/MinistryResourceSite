/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import "./styles/scss/bootstrap.scss";
import Primary from './navigation/Primary';
import Footer from './universal/Footer';
import { useSelector } from 'react-redux';
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"

config.autoAddCss = false;

const Layout = ({ children, location }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <>
      <Primary location={location} auth={{ isAuthenticated, user }} />
      { children}
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
