/* eslint-env node */
/* eslint-disable no-var */

var webpackConfig = require('./webpack.config');

module.exports = function karma(config) {
    config.set({
        basePath: '',
        frameworks: ['phantomjs-shim', 'mocha'],
        files: [
            {
                pattern: 'lib/test-helpers/test-helper.js',
                watched: false,
                included: true,
                served: true
            }
        ],
        client: {
            mocha: {
                timeout: 3000
            }
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: {
                colors: true
            },
            noInfo: true
        },
        preprocessors: {
            'lib/test-helpers/test-helper.js': ['webpack', 'sourcemap']
        },
        reporters: ['mocha', 'notify', 'junit'],
        junitReporter: {
            outputDir: 'build/',
            outputFile: 'junit.xml',
            useBrowserName: false
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true,
        browserNoActivityTimeout: 60000,
        browserConsoleLogOptions: {
            level: 'log',
            format: '%b %T: %m',
            terminal: true
        }
    });
};

/* eslint-enable no-var */
