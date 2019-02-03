const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "Mike Polinowski :: Developer Blog", // <title>
  shortSiteTitle: "Mike Polinowski", // <title> ending for posts and pages
  siteDescription: "Mike Polinowski :: A Developer Blog and Personal Technology Playground",
  siteUrl: "https://mpolinowski.github.io",
  pathPrefix: "",
  siteImage: "preview.jpg",
  siteLanguage: "en",
  // author
  authorName: "mike polinowski",
  authorTwitterAccount: "mpolinowski",
  // info
  infoTitle: "mike polinowski",
  infoTitleNote: "developer blog",
  // manifest.json
  manifestName: "Mike Polinowski :: Developer Blog",
  manifestShortName: "Dev Blog", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.background,
  manifestThemeColor: colors.background,
  manifestDisplay: "standalone",
  // contact
  contactEmail: "mpolinowski@gmail.com",
  // social
  authorSocialLinks: [
    { name: "github", url: "https://resume.github.io/?mpolinowski" },
    { name: "twitter", url: "https://twitter.com/mpolinowski" },
    { name: "facebook", url: "https://facebook.com/mpolinowski" }
  ]
};
