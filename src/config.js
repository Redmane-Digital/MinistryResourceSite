const resourceSite = {
  enum: 'tfh_resource',
  slug: 'mannahouse-resources',
  title: 'TFH Resources',
};

// DO NOT EDIT BELOW THIS LINE

const resourceBrands = [resourceSite];

if (resourceSite.slug !== 'mannahouse-resource') {
  resourceBrands.push({
    enum: 'mannahouse_resource',
    slug: 'mannahouse-resource',
    title: 'Mannahouse Resource',
  });
}

module.exports = {
  resourceSite,
  resourceBrands,
};
