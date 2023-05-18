const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');

const app = express();
const port = 4000;

const loadFiles = loadFilesSync('**/*', {
  extensions: ['graphql'], 
});

const loadResolvers = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));

const schema = makeExecutableSchema({
  typeDefs: loadFiles,
  resolvers: loadResolvers
});

const root = {
  posts: require('./posts/posts.model'),
  comments: require('./comments/comments.model')
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(port, () => {
  console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);
});