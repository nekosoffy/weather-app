const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	optimization: {
		usedExports: true,
	},
	devtool: 'eval-source-map',
	devServer: {
		watchFiles: ['./src/template.html'],
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
});
