var path = require('path');

module.exports = {
	mode: 'development',
	entry: '/src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			}
			// {
			// 	test: /\.js$/,
			// 	use: [
			// 		{
			// 			loader: "babel-loader",
			// 			options: {
			// 				presets: [ "@babel/preset-env" ]
			// 			},
			// 		},
			// 	],
			// 	exclude: /node_modules/,
			// }
		]
	},
	devtool: 'cheap-module-source-map',
	devServer: {
		//host : '127.0.0.1',
		//contentBase: path.join(__dirname, "/"),
		//compress: true,
		hot : true,
		//inline: true,
		port: 9001,
		open : true
	}
	
}