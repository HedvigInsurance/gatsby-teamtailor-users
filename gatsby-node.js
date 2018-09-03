const fetch = require('node-fetch');
const crypto = require('crypto')

exports.sourceNodes = async ({ boundActionCreators, createNodeId }, configOptions) => {
  const { createNode } = boundActionCreators;

  delete configOptions.plugins

  const { data: users } = await fetch("https://api.teamtailor.com/v1/users", {
    headers: {
      "Authorization": `Token token=${configOptions.token}`,
      "X-Api-Version": "20161108"
    }
  }).then(response => response.json())

  const transformedUsers = users.map(({ id, attributes }) => ({
    id,
    name: attributes.name,
    title: attributes.title,
    picture: {
      standard: attributes.picture ? attributes.picture.standard : null,
      large: attributes.picture ? attributes.picture.standard.replace("h_160", "h_1024").replace("w_160", "w_1024") : null
    }
  }))

  return transformedUsers.map(user =>
    createNode({
      ...user,
      id: createNodeId(`teamtailor-user-${user.id}`),
      children: [],
      parent: null,
      internal: {
        contentDigest: crypto
          .createHash('md5')
          .update(JSON.stringify(user))
          .digest('hex'),
        content: JSON.stringify(user),
        type: "TeamtailorUser"
      }
    })
  );;
};
