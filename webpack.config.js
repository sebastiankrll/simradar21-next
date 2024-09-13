const ThreadsPlugin = require('threads-plugin')

module.exports = {
    plugins: [
        new ThreadsPlugin()
    ]
}

// https://github.com/geotiffjs/geotiff.js/pull/144/files#diff-04c6e90faac2675aa89e2176d2eec7d8R301-R315
// https://github.com/geotiffjs/geotiff.js/issues/126