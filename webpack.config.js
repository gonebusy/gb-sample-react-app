var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var path = require('path');

var loaders = [];

loaders.push({
	test: /\.jsx?$/,
	exclude: /(node_modules|public)/,
	loader: 'babel',
	query: {
		presets: ['es2015', 'react'],
		plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
	}
});

loaders.push({
	test: /\.(png|woff|woff2|eot|ttf|svg)$/,
	loader: 'url-loader?limit=100000'
});

loaders.push({
	test: /[\/\\]src[\/\\].*\.scss/,
	exclude: /(node_modules|public)/,
	loader: ExtractTextPlugin.extract('style', 'css-raw-loader!sass-loader!postcss-loader')
});

loaders.push({
	test: /\.json$/,
    loader: 'json'
});

var config = {	
	resolve: {
		root: path.resolve(__dirname),
		extensions: ['', '.js', '.jsx']
	},
	
	output: {
		path: path.join(__dirname + "/public"),
		filename: "/js/[name].min.js",
		publicPath: ''
	},

	module: {
		loaders: loaders
	},

	plugins:[
		new HtmlWebpackPlugin({
			template: './src/template.html',
			title: 'Gone Busy Sample React App',
			filename: 'index.html'
		})
	]
}

if (process.env.NODE_ENV === 'production') {

	config.entry = [
		'./src/js/main.js'
	];
	//config.plugins.push(new WebpackCleanupPlugin()),
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false,
			screw_ie8: true,
			drop_console: true,
			drop_debugger: true
		}
	}));
	config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
	config.plugins.push(new webpack.optimize.DedupePlugin());

}else{

	config.entry = [
		'webpack-dev-server/client?http://localhost:8080',
		'webpack/hot/only-dev-server',
		'./src/js/main.js'
	];
	config.debug = true;
	config.devtool = "source-map";
	config.devServer = {
		contentBase: "./public",
		// do not print bundle build stats
		noInfo: true,
		compress: true,
		// enable HMR
		hot: true,
		// embed the webpack-dev-server runtime into the bundle
		inline: true,
		// serve index.html in place of 404 responses to allow HTML5 history
		historyApiFallback: true,

		port: '8080',
		host: 'localhost',
		stats: { colors: true }
	};

	config.plugins.push(new webpack.NoErrorsPlugin());
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

config.plugins.push(new ExtractTextPlugin('/css/main.css', {
	allChunks: true,
}));

module.exports = config;