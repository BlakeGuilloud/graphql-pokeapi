'use strict';

const {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
} = require('graphql');

let PokemonType = new GraphQLObjectType({
  name: 'Pokemon',
  description: 'A Pokemon',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The name of the Pokemon.',
    }
  })
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      pokemon: {
        type: new GraphQLList(PokemonType),
        resolve: () => [{ name: 'pikachu' }]
      }
    }
  })
});

module.exports.hello = function(event, context, cb) {
  const query = JSON.parse(event.body).query;

  return graphql(schema, query)
    .then((response) => {
      const returnVal = {
        body: JSON.stringify(response),
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
      cb(null, returnVal);
    })
    .catch((error) => {
      cb(error)
    });
};