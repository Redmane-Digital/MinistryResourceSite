import React from "react";
import PropTypes from "prop-types";
import  { withPrefix } from 'gatsby';


export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="deployed" contet="true" />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
        <script src={withPrefix("/assets/js/bootstrap.bundle.min.js")}></script>
        <script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-auth.js"></script>
        <script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-firestore.js"></script>
        <script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-functions.js"></script>
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}