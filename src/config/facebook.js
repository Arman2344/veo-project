require('dotenv').config();

module.exports = {
  appId: process.env.FACEBOOK_APP_ID,
  appSecret: process.env.FACEBOOK_APP_SECRET,
  pageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  pageId: process.env.FACEBOOK_PAGE_ID,
  apiVersion: 'v20.0',
  get baseUrl() {
    return `https://graph.facebook.com/${this.apiVersion}`;
  },
};
