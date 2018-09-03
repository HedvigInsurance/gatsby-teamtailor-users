# gatsby-teamtailor-users
A gatsby plugin for getting teamtailor users.

### Usage
Add to `gatsby-config.js`:

```javascript
    {
        resolve: 'gatsby-teamtailor-users',
        options: {
            token: YOUR_TEAMTAILOR_TOKEN
        }
    }
```

#### GraphQL query

```graphql
  allTeamtailorUser {
    edges {
      node {
        name
        title
        picture {
          standard
          large
        }
      }
    }
  }
```

### Missing fields
We've only implemented the fields we needed, but feel free to PR if you need some other field than those this plugin offers.

### Large picture type
We needed an image type that was significantly bigger than what Teamtailors standard was, so we took advantage och their cloudinary usage and mapped the url to serve a larger one, this is probably not that great as it would break if Teamtailor moves away from cloudinary, but 🤷‍♂️