module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
  ],
  "plugins": [["@babel/plugin-proposal-class-properties", { "loose": true }]]
}
