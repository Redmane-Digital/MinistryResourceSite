require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Ministry Resource Site`,
    siteUrl: `https://www.mistryresourcesite.com`,
    description: `Tools to help you take the next step forward.`,
    author: `@redmanedigital`,
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {},
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-TM7LRXG",
        includeInDevelopment: false,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/mannahouse-icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        // Arbitrary name for the remote schema Query type
        typeName: "Hygraph",
        // Field under which the remote schema will be accessible. You'll use this in your Gatsby query
        fieldName: "Hygraph",
        // Url to query from
        url: "https://us-west-2.cdn.hygraph.com/content/ckeag7ore7q7t01z77eto9jg6/master",
        headers: {
          Authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`,
        }
      },
    },
    {
      resolve: `gatsby-plugin-translate`,
      options: {
        sourceLanguage: 'en',
        targetLanguages: ['es']
      }
    },
  ],
};
