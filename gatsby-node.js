/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const { createStorefrontApiClient } = require('@shopify/storefront-api-client');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const client = require('https');

// secret or salt to be hashed with
const secret = 'mhresource';
const fetch = require('node-fetch');

// Memo for data fetching
const memo = {
  raw: {},
  books: {},
  courses: {},
  resources: {},
  config: {},
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
}

/**
 * Takes in the config object and updates the SCSS variables with the data from Hygraph
 * @param {object} config The config object from Hygraph
 */
const assignWhitelabelSettings = (config) => {
  const { whitelabelColors: colors, copyrightInformation, logo } = config;

  // Update the brand colors in the SCSS variables
  let variables = fs.readFileSync(
    `./src/components/styles/scss/_variables.scss`,
    { encoding: 'utf8' }
  );
  if (variables) {
    let regex;

    regex = new RegExp(`\\$primary:[^;]*`, 'gmi');
    variables = variables.replace(
      regex,
      `$primary: ${colors.primary.hex} !default`
    );

    regex = new RegExp(`\\$secondary:[^;]*`, 'gmi');
    variables = variables.replace(
      regex,
      `$secondary: ${colors.secondary.hex} !default`
    );

    regex = new RegExp(`\\$tertiary:[^;]*`, 'gmi');
    variables = variables.replace(
      regex,
      `$tertiary: ${colors.tertiary?.hex || colors.secondary.hex} !default`
    );

    regex = new RegExp(`\\$buttons:[^;]*`, 'gmi');
    variables = variables.replace(
      regex,
      `$buttons: ${colors.buttons?.hex || colors.primary.hex} !default`
    );

    regex = new RegExp(`\\$navbar:[^;]*`, 'gmi');
    variables = variables.replace(
      regex,
      `$navbar: ${colors.navbar?.hex || colors.primary.hex} !default`
    );

    regex = new RegExp(`\\$footer:[^;]*`, 'gmi');
    variables = variables.replace(
      regex,
      `$footer: ${colors.footer?.hex || colors.secondary.hex} !default`
    );

    fs.writeFileSync(`./src/components/styles/scss/_variables.scss`, variables);
  }

  // Update the copyright information in the site footer
  let copyrightJs = fs.readFileSync(`./src/components/universal/Footer.js`, {
    encoding: 'utf8',
  });
  if (copyrightJs) {
    copyrightJs = copyrightJs.replace(
      /(?!(<small>Copyright\s©{year}\s))[\w][a-z0-9\.\s\']*(?=,\sAll Rights Reserved.<\/small>)/gim,
      copyrightInformation.copyrightOwner
    );

    fs.writeFileSync(`./src/components/universal/Footer.js`, copyrightJs);
  }

  // Update the logo in the site navbar
  let navbarJs = fs.readFileSync(`./src/components/navigation/Primary.js`, {
    encoding: 'utf8',
  });
  if (navbarJs) {
    navbarJs = navbarJs.replace(/(?<=<img\s+src=")([^"]+)(?=")/gim, logo.url);

    fs.writeFileSync(`./src/components/navigation/Primary.js`, navbarJs);
  }

  // Set allowLoginWithPbcAccess on login and signup pages
  const allowLoginRegEx = /(canUsePbcSSO = )(true|false)/m;
  let loginJs = fs.readFileSync(`./src/pages/signin.js`, {
    encoding: 'utf8',
  });
  if (loginJs) {
    loginJs = loginJs.replace(
      allowLoginRegEx,
      `$1${config.allowLoginWithPbcAccess}`
    );

    fs.writeFileSync(`./src/pages/signin.js`, loginJs);
  }
  let signupJs = fs.readFileSync(`./src/pages/signup.js`, {
    encoding: 'utf8',
  });
  if (signupJs) {
    signupJs = signupJs.replace(
      allowLoginRegEx,
      `$1${config.allowLoginWithPbcAccess}`
    );

    fs.writeFileSync(`./src/pages/signup.js`, signupJs);
  }
};

// Takes in a Hygraph object and returns the same data in the schema for a Shopify object
function conformHygraphToShopifySchema(data) {
  const handle = data.title
    .replaceAll(/([^A-Z\s])/gi, '')
    .replaceAll(/\s/gi, '-');

  Object.assign(data, {
    title: {
      en: data.title,
      es: data.title,
    },
    isExternal: true,
    handle: handle,
    tags: [data.category],
    variants: [
      {
        price: data.price,
        handle: handle,
        compareAtPrice: false,
        img: data.image.url,
      },
    ],
  });

  return data;
}

/**
 * This function will take a string and a language code and return the translated string.
 * It will first check if the translation is cached in the cachedTranslations object.
 * If it is not, it will fetch the translation from the Google Translate API and cache it.
 *
 * @param {string} str The string to be translated
 * @param {string} lang The desired output language
 * @returns The translated string
 */
async function translate(str, lang) {
  // Data for translation caching
  const cachedTranslations = {};
  // create a sha-256 hasher
  const sha256Hasher = crypto.createHmac('sha256', secret);
  // hash the string and set the output format
  const hash = sha256Hasher.update(str).digest('hex');

  if (!cachedTranslations.lang) {
    cachedTranslations.lang = fs.readFileSync(
      `./src/translations/${lang}_cache.json`
    );
    cachedTranslations.lang = JSON.parse(cachedTranslations.lang);
  }

  const { lang: json } = cachedTranslations;

  if (json && json[hash]) {
    // console.log('Translation already exists', json[hash]);
    return json[hash];
  } else {
    // console.log(`No cached translation for ${hash}. Fetching...`);
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          q: str,
          target: lang,
        }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res.data.translations[0].translatedText;
      });

    if (json) {
      json[hash] = res;
      // console.log('Added: ' + json[hash]);
      fs.writeFileSync(
        `./src/translations/${lang}_cache.json`,
        JSON.stringify(json)
      );
    }

    return res;
  }
}

/**
 *
 * @param {string} key The dot-separated path to the value in the object
 * @param {*} lang The language to resolve the value in
 * @param {*} node The object containing a localizations key, in which to to search for the value
 * @returns The localized value at the path in the object, or the default value if the path does not exist
 */
function resolveLocalization(key, lang, node) {
  const localization = node.localizations?.find(
    (localization) => localization.locale === lang
  );

  let pathArray = key.split('.');

  return localization
    ? searchObject(localization, pathArray)
    : searchObject(node, pathArray);
}

/**
 * @param {object} obj The object to extract a value from
 * @param {array} pathArray The path to the value in the object, as an array of keys
 * @returns The value at the path in the object, or undefined if the path does not exist
 */
function searchObject(obj, pathArray) {
  let node = obj;
  for (const index in pathArray) {
    key = pathArray[index];
    if (key in node) {
      node = node[key];
    } else {
      node = undefined;
      break;
    }
  }
  return node;
}

async function sourceThinkific(createNode) {
  const config = {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'X-Auth-API-Key': `${process.env.THINKIFIC_API_KEY}`,
      'X-Auth-Subdomain': `${process.env.THINKIFIC_SUBDOMAIN}`,
    },
  };

  const instructors = {};
  const thinkificInstructors = await fetch(
    'https://api.thinkific.com/api/public/v1/instructors',
    config
  ).then((res) => res.json());
  const thinkificCourses = await fetch(
    'https://api.thinkific.com/api/public/v1/courses/?page=1&limit=1000',
    config
  ).then((res) => res.json());

  for (const instructor of thinkificInstructors.items) {
    instructors[instructor.id] = instructor;
  }

  thinkificCourses.items = thinkificCourses.items.filter((item) => {
    return !/mhr-hidden/gi.test(item.keywords);
  });

  // map into these results and create nodes
  for (let course of thinkificCourses.items) {
    const {
      id,
      name,
      slug,
      subtitle,
      product_id,
      course_card_image_url,
      course_card_text,
      description,
      duration,
      keywords,
      instructor_id,
    } = course;

    const names = {
      en: name,
      es: await translate(name, 'es'),
    };

    const subtitles = {
      en: subtitle,
      es: subtitle ? await translate(subtitle, 'es') : subtitle,
    };

    const descriptions = {
      en: description,
      es: description ? await translate(description, 'es') : description,
    };

    // Create your node object
    const courseNode = {
      // Required fields
      id: `${id}`,
      parent: `__SOURCE__`,
      internal: {
        type: `ThinkificCourse`, // name of the graphQL query --> allRandomUser {}
        // contentDigest will be added just after
        // but it is required
      },
      children: [],

      // Other fields that you want to query with graphQl
      name: names,
      slug: slug,
      subtitle: subtitles,
      product_id: product_id,
      course_card_image_url: course_card_image_url,
      course_card_text: course_card_text,
      description: descriptions,
      duration: duration,
      keywords: keywords,
      instructor: {
        first_name: '',
        last_name: '',
        full_name: '',
      },
      type: 'course',
    };

    if (instructors[instructor_id]) {
      courseNode.instructors = {
        ...instructors[instructor_id],
        full_name: instructors[instructor_id].full_name,
      };
    }

    // Get content digest of node. (Required field)
    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(courseNode))
      .digest(`hex`);
    // add it to userNode
    courseNode.internal.contentDigest = contentDigest;

    // Create node with the gatsby createNode() API
    createNode(courseNode);
  }
}

async function sourceShopify(createNode) {
  const shopifyClient = createStorefrontApiClient({
    storeDomain: process.env.SHOPIFY_URL,
    apiVersion: process.env.SHOPIFY_API_VERSION,
    privateAccessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  });

  let first = 25;
  let hasNextPage = true;

  while (hasNextPage) {
    const operation = `
      query Products {
        search(productFilters: {tag: "mannahouseresource"}, query: "", first: ${first}) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              ... on Product {
                id
                handle
                title
                createdAt
                descriptionHtml
                options {
                  name
                  values
                }
                variants(first: 10) {
                  nodes {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                    }
                    compareAtPrice {
                      amount
                    }
                    image {
                      originalSrc
                    }
                  }
                }
                tags
                featuredImage {
                  originalSrc
                  src
                }
              }
            }
          }
        }
      }
    `;

    const { data, errors, extensions } = await shopifyClient.request(operation);

    for (const product of data.search.edges) {
      const {
        id,
        handle,
        title,
        createdAt,
        descriptionHtml,
        options,
        variants,
        tags,
        featuredImage,
      } = product.node;

      // Create your node object
      const productNode = {
        // Required fields
        id: `${id}`,
        parent: `__SOURCE__`,
        internal: {
          type: `ShopifyProduct`, // name of the graphQL query --> allRandomUser {}
          // contentDigest will be added just after
          // but it is required
        },
        children: [],

        // Other fields that you want to query with graphQl
        id,
        handle,
        title,
        createdAt,
        descriptionHtml,
        options,
        variants: variants.nodes.map((variant) => {
          return {
            ...variant,
            compareAtPrice: (variant.compareAtPrice = variant.compareAtPrice
              ?.amount
              ? variant.compareAtPrice.amount
              : variant.price.amount),
            price: variant.price.amount,
          };
        }),
        tags,
        featuredImage,
      };

      // Get content digest of node. (Required field)
      const contentDigest = crypto
        .createHash(`md5`)
        .update(JSON.stringify(productNode))
        .digest(`hex`);
      // add it to userNode
      productNode.internal.contentDigest = contentDigest;

      // Create node with the gatsby createNode() API
      createNode(productNode);
    }

    // Determine if we should go for another loop
    if (data.search.pageInfo.hasNextPage) {
      first += 25;
    } else {
      hasNextPage = false;
    }
  }
}

// Page creation function
async function createPagesFromCMSData(createPage) {
  const data = memo.raw.cms;
  const categories = [];
  const resources = [];

  // Create CATEGORY pages
  await data.allHygraphCategory.forEach(async (node) => {
    const category = { ...node, featured: [] };

    node.title = {
      en: node.title,
      es: resolveLocalization('title', 'es', node),
    };

    node.description = {
      en: node.description,
      es: resolveLocalization('description', 'es', node),
    };

    node.resource.forEach(async (resource) => {
      resource.title = {
        en: resource.title,
        es: resolveLocalization('title', 'es', resource),
      };

      if (resource.description) {
        resource.description.html = {
          en: resource.description.html,
          es: resolveLocalization('description.html', 'es', resource),
        };
      }

      // Check if resource is featured, based on tags
      if (resource.tags.some((tag) => tag.slug === 'featured')) {
        category.featured.push(resource);
      }
    });

    categories.push(category);

    createPage({
      path: `/resources/${category.slug}`,
      component: path.resolve(`src/templates/resourcesCategory.js`),
      context: {
        category: category,
      },
    });
  });

  // Create RESOURCE pages
  await data.allHygraphResource.forEach(async (node) => {
    node.type = 'resource';

    node.title = {
      en: node.title,
      es: await translate(node.title, 'es'),
    };

    node.tags.forEach(async (tag) => {
      tag.title = {
        en: tag.title,
        es: await translate(tag.title, 'es'),
      };
    });

    node.categories.forEach(async (category) => {
      category.title = {
        en: category.title,
        es: await translate(category.title, 'es'),
      };
    });

    if (node.description) {
      node.description.html = {
        en: node.description.html,
        es: await translate(node.description.html, 'es'),
      };
    }

    resources.push(node);

    createPage({
      path: `/resource/${node.slug}`,
      component: path.resolve(`src/templates/resource.js`),
      context: {
        // This time the entire product is passed down as context
        resource: node,
      },
    });
  });

  // Create RESOURCES page
  createPage({
    path: `/resources`,
    component: path.resolve(`src/templates/resourcesMain.js`),
    context: {
      resources: categories,
    },
  });

  // Create individual BOOK pages
  const booksArray = Object.values(memo.books);
  booksArray.forEach(async (book) => {
    book.type = 'book';
    book.title = {
      en: book.title,
      es: await translate(book.title, 'es'),
    };
    book.descriptionHtml = {
      en: book.descriptionHtml,
      es: await translate(book.descriptionHtml, 'es'),
    };

    createPage({
      path: `/book/${book.handle}`,
      component: path.resolve(`src/templates/book.js`),
      context: {
        book,
        recs: memo.books,
      },
    });
  });

  // Create BOOKS page
  createPage({
    path: `/books`,
    component: path.resolve(`src/templates/books.js`),
    context: {
      books: memo.books,
      keys: booksArray.map((book) => book.handle),
    },
  });

  // Create HOMEPAGE
  createPage({
    path: `/`,
    component: path.resolve(`src/templates/index.js`),
    context: {
      config: memo.config,
      categories,
      contentAreas: data.homepage.contentAreas.map((area) => {
        return {
          ...area,
          localizationsArray: area.localizations,
          localizations: area.localizations?.reduce((obj, localization) => {
            if (area.localizations.length === 0) return obj;

            return {
              ...obj,
              [localization.locale]: localization,
            };
          }, {}),
        };
      }),
    },
  });

  // Create ABOUT US page
  createPage({
    path: `/about`,
    component: path.resolve(`src/templates/about.js`),
    context: {
      partners: memo.config.partners,
      text: memo.config.aboutSite,
    },
  });

  // Create SEARCH page
  memo.raw.thinkific.edges = [
    ...memo.raw.thinkific.edges,
    ...memo.raw.cms.allHygraphCourseBundles.map((node) => ({
      node: {
        ...node,
        subtype: 'bundle',
        name: {
          en: node.name,
          es: resolveLocalization('name', 'es', node),
        },
        description: {
          en: node.description,
          es: resolveLocalization('description', 'es', node),
        },
      },
    })),
  ];

  createPage({
    path: `/search`,
    component: path.resolve(`src/templates/search.js`),
    context: {
      books: booksArray,
      resources,
      thinkific: memo.raw.thinkific,
    },
  });
}

async function prepConfig() {
  // Prepare config data
  memo.config = memo.raw.cms.siteConfig;

  // Update about page content with localization
  memo.config.aboutSite = {
    html: {
      en: memo.config.aboutSite.html,
      es: resolveLocalization('aboutSite.html', 'es', memo.config),
    },
  };

  // Update privacy policy content with localization
  memo.config.privacyPolicy = {
    html: {
      en: memo.config.privacyPolicy.html,
      es: resolveLocalization('privacyPolicy.html', 'es', memo.config),
    },
  };

  // Update partners contentArea with partners data from config
  for (const area of memo.raw.cms.homepage.contentAreas) {
    if (area.type === 'Partners') {
      area.data = memo.config.partners;
      break;
    }
  }

  // Remove unnecessary data
  delete memo.config.localizations;

  assignWhitelabelSettings(memo.config);
}

/*******************************************************************
 * Gatsby Node APIs                                                *
 * Documentation: https://www.gatsbyjs.com/docs/node-apis/         *
 *******************************************************************/
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  });
};

// Source nodes from Thinkific and Shopify APIs
exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;

  await sourceThinkific(createNode);
  await sourceShopify(createNode);

  return;
};

// Create individual resource static pages
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Sourcing courses data from Thinkific
  memo.raw.thinkific = await graphql(`
    query allResources {
      courses: allThinkificCourse {
        edges {
          node {
            id
            duration
            description {
              en
              es
            }
            course_card_image_url
            product_id
            subtitle {
              en
              es
            }
            slug
            name {
              en
              es
            }
            keywords
            instructor {
              first_name
              last_name
              full_name
            }
            type
          }
        }
      }
    }
  `).then(async (result) => result.data.courses);

  // Sourcing products data from Shopify
  memo.raw.shopify = await graphql(`
    query allShopifyProduct {
      allShopifyProduct {
        edges {
          node {
            id
            handle
            title
            createdAt
            descriptionHtml
            options {
              name
              values
            }
            variants {
              id
              title
              selectedOptions {
                name
                value
              }
              price
              compareAtPrice
              image {
                originalSrc
              }
            }
            tags
            featuredImage {
              originalSrc
              src
            }
          }
        }
      }
    }
  `).then(async (result) => {
    const data = result.data.allShopifyProduct;

    // Create the books object on the memo
    data.edges.forEach((edge) => {
      memo.books[edge.node.handle] = edge.node;
    });

    return data;
  });

  // Sourcing site config, resources, and other data from Hygraph
  memo.raw.cms = await graphql(`
    query allResources {
      Hygraph {
        siteConfig(where: { title: "Mannahouse Resource" }) {
          aboutSite {
            html
          }
          allowLoginWithPbcAccess
          copyrightInformation {
            copyrightLink
            copyrightOwner
          }
          locale
          localizations(includeCurrent: true, locales: [en, es]) {
            aboutSite {
              html
            }
            privacyPolicy {
              html
            }
          }
          logo {
            url
            fileName
            height
            width
            handle
            mimeType
          }
          overrides {
            ... on Hygraph_OverrideCategoryImage {
              category {
                title
                slug
                id
                localizations {
                  locale
                  title
                  description
                }
                description
                heroImage {
                  url
                  width
                  height
                  handle
                }
              }
            }
          }
          partners {
            partnerName
            partnerExternalLink
            partnerLogo {
              width
              url
              handle
              height
            }
          }
          privacyPolicy {
            html
          }
          title
          whitelabelColors {
            buttons {
              css
              hex
            }
            primary {
              css
              hex
            }
            secondary {
              hex
              css
            }
            tertiary {
              hex
              css
            }
            footer {
              hex
              css
            }
            navbar {
              css
              hex
            }
            themeBrightness
          }
          whitelabelId
          whitelabelUrl
        }
        allHygraphCategory: categories {
          title
          localizations {
            title
            locale
          }
          slug
          thumbnail {
            url
            handle
          }
          resource {
            title
            thumbnail {
              url
              handle
            }
            slug
            contentTypes
            description {
              html
            }
            tags {
              slug
            }
          }
          heroImage {
            url
            handle
          }
        }
        allHygraphResource: resources(
          where: {
            resourceSites_contains_some: [
              mannahouse_resource
              mannahouse_resource
            ]
          }
          first: 1000
          orderBy: createdAt_DESC
          locales: [en, es]
        ) {
          categories {
            title
            slug
          }
          tags {
            title
            slug
          }
          downloads {
            contentType
            asset {
              url
              fileName
              handle
            }
            title
          }
          title
          thumbnail {
            url
            handle
          }
          slug
          vimeoUrl
          contentTypes
          description {
            html
          }
          localizations {
            title
            locale
            description {
              html
            }
          }
        }
        allHygraphCourseBundles: courseBundles(
          where: { resourceSites: mannahouse_resource }
        ) {
          slug
          subtitle
          name
          instructor
          id
          course_card_image_url
          description
          categories {
            title
            slug
          }
          localizations {
            name
            description
            locale
          }
          type
        }
        homepage(where: { resourceSite: mannahouse_resource }) {
          contentAreas {
            ... on Hygraph_SectionFeaturedBook {
              localizations(locales: [en, es], includeCurrent: true) {
                title
                author
                description
                link
                locale
                cover {
                  handle
                  height
                  width
                  url
                }
              }
              type
            }
            ... on Hygraph_SectionResourcesHighlights {
              type
              highlightTwoTitle
              highlightTwoSubtitle
              localizations {
                highlightTwoTitle
                highlightTwoSubtitle
                highlightTwoDescription
                highlightOneTitle
                highlightOneSubtitle
                highlightOneDescription
                locale
              }
              highlightTwoDescription
              highlightOneTitle
              highlightOneDescription
              highlightOneSubtitle
              highlightOneImage {
                url
                height
                width
                handle
              }
              highlightTwoImage {
                url
                width
                handle
                height
              }
            }
            ... on Hygraph_PartnersSection {
              type
            }
            ... on Hygraph_SectionFeaturedTraining {
              id
              type
              localizations(includeCurrent: true, locales: [en, es]) {
                courseOneDescription
                courseOneTitle
                courseOneUrl
                courseTwoDescription
                courseTwoTitle
                courseTwoUrl
                locale
                courseOneThumbnail {
                  handle
                  height
                  width
                  url
                }
                courseTwoThumbnail {
                  width
                  url
                  handle
                  height
                }
              }
            }
          }
        }
      }
    }
  `).then(async (result) => result.data.Hygraph);

  await prepConfig();
  await createPagesFromCMSData(createPage);
};
