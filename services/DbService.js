const DbService = (provider) => {
  async function createArticle(article) {
    const now = new Date();
    const query = {
      text:
        'INSERT INTO articles(title, lead, body, image_url, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [
        article.title,
        article.lead,
        article.body,
        article.imageUrl,
        now,
        now,
      ],
    };

    const { rows } = await provider.query(query);
    return rows && rows[0];
  }

  async function getArticles() {
    const query = {
      text:
        'SELECT * FROM articles ORDER BY id DESC OFFSET $1 FETCH FIRST $2 ROWS ONLY',
      values: [0, 5],
    };

    const { rows } = await provider.query(query);
    return rows;
  }

  async function getAllCategories() {
    const query = {
      text: 'SELECT * FROM categories',
    };

    const { rows } = await provider.query(query);
    return rows;
  }

  return {
    createArticle,
    getArticles,
    getAllCategories,
  };
};

export default DbService;
