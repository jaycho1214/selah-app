module.exports = {
  src: ".",
  schema: "./schema.graphql",
  language: "typescript",
  artifactDirectory: "./lib/relay/__generated__",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
  persistConfig: {
    file: "../selah-web/persisted_queries_mobile.json",
    algorithm: "MD5",
  },
};
