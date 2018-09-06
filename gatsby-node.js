const fetch = require("node-fetch");
const crypto = require("crypto");

const getTeamtailorUsers = async ({ token, url }) => {
  const { data, links } = await fetch(url, {
    headers: {
      Authorization: `Token token=${token}`,
      "X-Api-Version": "20161108"
    }
  })
    .then(response => response.json())
    .catch(() => {
      throw new Error("Failed to fetch teamtailor users");
    });

  if (links.next) {
    const nextData = await getTeamtailorUsers({ token, url: links.next });
    return [...data, ...nextData];
  }

  return data;
};

exports.sourceNodes = async (
  { boundActionCreators, createNodeId },
  configOptions
) => {
  const { createNode } = boundActionCreators;

  delete configOptions.plugins;

  const users = await getTeamtailorUsers({
    token: configOptions.token,
    url: "https://api.teamtailor.com/v1/users"
  });

  const transformedUsers = users.map(({ id, attributes }) => ({
    teamtailorId: id,
    name: attributes.name,
    title: attributes.title,
    picture: {
      standard: attributes.picture ? attributes.picture.standard : null,
      large: attributes.picture
        ? attributes.picture.standard
            .replace("h_160", "h_1024")
            .replace("w_160", "w_1024")
        : null
    }
  }));

  return transformedUsers.map(user =>
    createNode({
      ...user,
      id: createNodeId(`teamtailor-user-${user.teamtailorId}`),
      children: [],
      parent: null,
      internal: {
        contentDigest: crypto
          .createHash("md5")
          .update(JSON.stringify(user))
          .digest("hex"),
        content: JSON.stringify(user),
        type: "TeamtailorUser"
      }
    })
  );
};
