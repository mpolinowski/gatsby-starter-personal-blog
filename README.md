# PersonalBlog starter for Gatsby

[DEMO website](https://github.com/mpolinowski/gatsby-starter-personal-blog)

More details soon. For now a couple of annotations.

The starter is ready to play with. You should to know at least two things.

### Packages in beta

It uses two packages in beta stage: [gatsby-plugin-algolia](https://github.com/algolia/gatsby-plugin-algolia) and [material-ui-next](https://material-ui-next.com/)

### External services

The starter uses external services for some functions: contact form, comments, searching, analytics. To use them you have to secure some access data. No worries, all services are free or have generous free tiers big enough for a personal blog.

The starter needs an `.env` file like this in the root folder

```
GOOGLE_ANALYTICS_ID=...
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_ONLY_API_KEY=...
ALGOLIA_ADMIN_API_KEY=...
ALGOLIA_INDEX_NAME=...
FB_APP_ID=...
```