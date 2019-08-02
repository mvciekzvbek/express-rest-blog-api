const prepareArticleFilter = (qs) => {
  let query = {};

  if (qs.categories) {
    let categoriesIds = qs.categories.split(',').map(el => parseInt(el, 10));
    query.categories_ids = {
      $in: categoriesIds
    }
  }

  if (qs.author_name) {
    query.author_name = {
      $in: [qs.author_name]
    }
  }

  if (qs.id) {
    query._id = {
      $in: [parseInt(qs.id)]
    }
  } 

  if(qs.text) {
    query.$text = {
      $search: qs.text
    }
  }

  return query;
};

const prepareUserFilter = (qs) => {
  let query = {};

  if (qs.name) {
    query.githubLogin = {
      $in: [qs.name]
    }
  }

  if (qs.id) {
    query._id = {
      $in: [parseInt(qs.id)]
    }
  } 
  
  return query;
}

const prepareCategoryFilter = (qs) => {
  if (qs.name) {
    query.name = {
      $in: [qs.name]
    }
  }

  if (qs.id) {
    query._id = {
      $in: [parseInt(qs.id)]
    }
  } 
}

export {
  prepareArticleFilter,
  prepareUserFilter,
  prepareCategoryFilter
}
