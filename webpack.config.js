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
				use: [{
					loader: "style-loader",
					options: {
						injectType: "lazyStyleTag",
						// Do not forget that this code will be used in the browser and
						// not all browsers support latest ECMA features like `let`, `const`, `arrow function expression` and etc,
						// we recommend use only ECMA 5 features,
						// but it is depends what browsers you want to support
						insert: function insertIntoTarget(element, options) {
							var parent = options.target || document.head;

							parent.appendChild(element);
						},
					},
				}, "css-loader"]
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