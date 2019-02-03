const webpack = require("webpack");
const _ = require("lodash");
const Promise = require("bluebird");
const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);
const { store } = require(`./node_modules/gatsby/dist/redux`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    const fileNode = getNode(node.parent);
    const source = fileNode.sourceInstanceName;
    const separtorIndex = ~slug.indexOf("--") ? slug.indexOf("--") : 0;
    const shortSlugStart = separtorIndex ? separtorIndex + 2 : 0;

    createNodeField({
      node,
      name: `slug`,
      value: `${separtorIndex ? "/" : ""}${slug.substring(shortSlugStart)}`
    });

    createNodeField({
      node,
      name: `prefix`,
      value: separtorIndex ? slug.substring(1, separtorIndex) : ""
    });

    createNodeField({
      node,
      name: `source`,
      value: source
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  createRedirect({
    fromPath: `/node-express-mongodb-part-i/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-mongodb/`
  });

  createRedirect({
    fromPath: `/node-express-mongodb-part-ii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-mongodb/`
  });

  createRedirect({
    fromPath: `/node-express-mongodb-part-iii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-mongodb/`
  });

  createRedirect({
    fromPath: `/node-express-mongodb-part-iv/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-mongodb/`
  });

  createRedirect({
    fromPath: `/node-express-mongodb-part-v/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-mongodb/`
  });

  createRedirect({
    fromPath: `/node-express-static-wiki-part-i/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-static-wiki/`
  });

  createRedirect({
    fromPath: `/node-express-static-wiki-part-ii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-static-wiki/`
  });

  createRedirect({
    fromPath: `/node-express-static-wiki-part-iii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-static-wiki/`
  });

  createRedirect({
    fromPath: `/node-express-static-wiki-part-iv/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-static-wiki/`
  });

  createRedirect({
    fromPath: `/node-express-static-wiki-part-v/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/node-express-static-wiki/`
  });

  createRedirect({
    fromPath: `/unreal-engine-coding-standards-part-i/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/unreal-engine-coding-standards/`
  });

  createRedirect({
    fromPath: `/unreal-engine-coding-standards-part-ii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/unreal-engine-coding-standards/`
  });

  createRedirect({
    fromPath: `/unreal-engine-coding-standards-part-iii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/unreal-engine-coding-standards/`
  });

  createRedirect({
    fromPath: `/unreal-engine-coding-standards-part-iv/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/unreal-engine-coding-standards/`
  });

  createRedirect({
    fromPath: `/unreal-engine-coding-standards-part-v/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/unreal-engine-coding-standards/`
  });

  createRedirect({
    fromPath: `/react-under-the-hood-part-i/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/react-under-the-hood/`
  });

  createRedirect({
    fromPath: `/react-under-the-hood-part-ii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/react-under-the-hood/`
  });

  createRedirect({
    fromPath: `/react-under-the-hood-part-iii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/react-under-the-hood/`
  });

  createRedirect({
    fromPath: `/react-under-the-hood-part-iv/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/react-under-the-hood/`
  });

  createRedirect({
    fromPath: `/react-under-the-hood-part-v/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/react-under-the-hood/`
  });

  createRedirect({
    fromPath: `/react-under-the-hood-part-vi/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/react-under-the-hood/`
  });

  createRedirect({
    fromPath: `/react-under-the-hood-part-vii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/react-under-the-hood/`
  });

  createRedirect({
    fromPath: `/gatsby-wiki-part-i/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/gatsby-wiki/`
  });

  createRedirect({
    fromPath: `/gatsby-wiki-part-ii/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/gatsby-wiki/`
  });

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve("./src/templates/PostTemplate.js");
    const pageTemplate = path.resolve("./src/templates/PageTemplate.js");
    resolve(
      graphql(`
        {
          allMarkdownRemark(
            filter: { fileAbsolutePath: { regex: "//posts|pages//" } }
            limit: 1000
          ) {
            edges {
              node {
                fields {
                  slug
                  prefix
                  source
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create posts and pages.
        _.each(result.data.allMarkdownRemark.edges, edge => {
          const slug = edge.node.fields.slug;
          const source = edge.node.fields.source;
          const template = source === "posts" ? postTemplate : pageTemplate;

          createPage({ path: slug, component: template, context: { slug: slug } });
        });
      })
    );
  });
};
