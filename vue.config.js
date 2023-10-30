module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
        wrapper: 'section',
        // markdown-it config
      });
    config
      .plugin('webpack-bundle-analyzer')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
};
