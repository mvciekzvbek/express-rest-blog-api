export default class User {
  constructor ({id, name, avatar_url, githubToken}) {
    this._id = id
    this.name = name;
    this.avatar_url = avatar_url;
    this.githubToken = githubToken;
  }
}