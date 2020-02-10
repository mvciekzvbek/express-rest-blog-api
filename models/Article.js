export default class Article {
  constructor({
    id, title, lead, content, image_url, author_name, categories_ids,
  }) {
    this._id = id;
    this.title = title;
    this.lead = lead;
    this.content = content;
    this.image_url = image_url;
    this.author_name = author_name;
    this.created_at = new Date().toISOString();
    this.categories_ids = categories_ids;
  }
}
