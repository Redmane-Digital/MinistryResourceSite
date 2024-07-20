/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import Hero from '../components/heroes/Resources';
import StartSearching from '../components/universal/search/StartSearching';
import {
  Categories,
  BooksHero,
  FeaturedResources,
  Partners,
  ResourcesHighlights,
} from '../components/pages/resources';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { useTranslations } from 'gatsby-plugin-translate';

// A helper function to dynamically render the content areas according to their type, order, and presence in the data
function RenderContentAreas({ data }) {
  const lookup = {
    Partners,
    FeaturedBook: BooksHero,
    FeaturedTraining: FeaturedResources,
    ResourcesHighlights,
  };

  let index = -1;

  return data.map((contentArea) => {
    const ContentArea = lookup[contentArea.type];

    if (!ContentArea) return null;

    index++;

    return (
      <ContentArea
        data={contentArea.data ? contentArea.data : contentArea}
        bgClass={index % 2 !== 0 ? '' : 'bg-light'}
      />
    );
  });
}

// Default export for the Home template
function Home({ location, pageContext }) {
  const t = useTranslations();
  const { categories, contentAreas, config } = pageContext;

  console.log(pageContext);

  return (
    <Layout location={location}>
      <SEO
        title={t`Home`}
        description={t`Empower your ministry with Mannahouse Resource. Explore free resources, invaluable books, and powerful courses designed to equip church leaders like you.`}
      />
      <Hero />
      <StartSearching location={location} />
      <Categories data={categories} linkToSearch={true} />
      <RenderContentAreas data={contentAreas} />
    </Layout>
  );
}

export default Home;
