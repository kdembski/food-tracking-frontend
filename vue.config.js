module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        @import "@/styles/_variables.scss";
        @import "@/styles/_fonts.scss";
        @import "@/styles/_themes.scss";
        `,
      },
    },
  },
  devServer: {
    host: "localhost",
    port: 8080,
  },
};
