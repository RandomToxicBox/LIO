const path = require('path');
require('dotenv').config();
const pkg = require('./package.json');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const SvgChunkWebpackPlugin = require('svg-chunk-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';
const APP_NAME = pkg.name;
const APP_DESCRIPTION = pkg.description;
const APP_VERSION = pkg.version;
const APP_AUTHOR = pkg.author;
const APP_KEYWORDS = pkg.keywords || [];

const APP_HOST = '0.0.0.0';
const APP_PORT = 9000;
const APP_BASE = '/';
const APP_PREFIX = '';
const APP_MIME = 'text/html';

const APP_CHARSET = 'utf-8';
const APP_VIEWPORT = 'width=device-width,initial-scale=1.0,viewport-fit=cover,maximum-scale=1,user-scalable=0';
const APP_DIR = 'ltr';
const APP_LANG = 'ru_RU';
const APP_LANGUAGE = 'Russian';
const APP_BACKGROUND = '#fff';
const APP_FOREGROUND = '#000';
const APP_URL = 'http://localhost';

const ROOT_DIR = __dirname;
const SRC_DIR = path.resolve(ROOT_DIR, 'src');
const DIST_DIR = path.resolve(ROOT_DIR, 'docs');

const TEMPLATE_PATH = 'index.html';
const FONTS_PATH = 'fonts';
const FINERY_PATH = 'finery';
const SCRIPTS_PATH = 'scripts';
const STYLES_PATH = 'styles';
const LOGO_PATH = path.join(FINERY_PATH, 'logo@light.svg');
const FAVICON_PATH = path.join(FINERY_PATH, 'favicon.ico');
const OG_IMAGE_PATH = path.join(FINERY_PATH, 'apple-touch-startup-image-1334x750.png');
const TW_IMAGE_PATH = path.join(FINERY_PATH, 'apple-touch-startup-image-1792x828.png');

const ENTRIES = [
    'error',
    'index',
];

module.exports = {
    entry: {
        ...ENTRIES.reduce((entries, entry) => ({
            ...entries,
            [entry]: {
                import: path.resolve(SRC_DIR, `${entry}.js`)
            }
        }), {})
    },
    output: {
        path: DIST_DIR,
        filename: path.join(APP_BASE, SCRIPTS_PATH, '[name].js')
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: SvgChunkWebpackPlugin.loader
                    }
                ]
            },
            {
                test: /\.(png|jpe?g)$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/'
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [ 'babel-loader' ]
            },
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    enforce: true,
                },
                core: {
                    test: /\.[js|scss]/,
                    name: 'core',
                    minChunks: 2,
                    chunks: 'all',
                    enforce: true,
                },
                error: {
                    type: 'css/mini-extract',
                    name: 'error',
                    chunks: (chunk) => chunk.name === 'error',
                },
                index: {
                    type: 'css/mini-extract',
                    name: 'index',
                    chunks: (chunk) => chunk.name === 'index',
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [ {
                from: path.resolve(SRC_DIR, 'fonts'),
                to: path.resolve(DIST_DIR, 'fonts')
            } ]
        }),
        new SvgChunkWebpackPlugin(),
        new FaviconWebpackPlugin({
            mode: 'webapp',
            devMode: 'light',
            prefix: APP_PREFIX,
            publicPath: path.join(APP_BASE, FINERY_PATH),
            logo: path.resolve(SRC_DIR, LOGO_PATH),
            outputPath: path.resolve(DIST_DIR, FINERY_PATH),
            favicons: {
                appName: APP_NAME,
                appDescription: APP_DESCRIPTION,
                version: APP_VERSION,
                developerName: APP_AUTHOR,
                background: APP_BACKGROUND,
                theme_color: APP_FOREGROUND,
                dir: APP_DIR,
                lang: APP_LANG,
                start_url: APP_BASE,
            },
        }),
        new HtmlWebpackPlugin({
            filename: IS_PROD ? '[name].[contenthash].html' : '[name].html',
            template: path.resolve(SRC_DIR, TEMPLATE_PATH),
            favicon: path.resolve(SRC_DIR, FAVICON_PATH),
            publicPath: APP_BASE,
            templateParameters: {
                title: APP_NAME,
                dir: APP_DIR,
                lang: APP_LANG
            },
            meta: {
                charset: { charset: APP_CHARSET },
                contentType: { 'http-equiv': 'Content-Type', content: `${APP_MIME}; charset=${APP_CHARSET}` },
                viewport: APP_VIEWPORT,
                ...(IS_PROD ? {
                    title: APP_NAME,
                    description: APP_DESCRIPTION,
                    keywords: APP_KEYWORDS.join(', '),
                    language: APP_LANGUAGE,
                    'og:locale': APP_LANG,
                    'og:site_name': APP_NAME,
                    'og:title': APP_NAME,
                    'og:description': APP_DESCRIPTION,
                    'og:type': 'website',
                    'og:url': [ APP_URL, APP_BASE ].join(''),
                    'og:image': [ APP_URL, path.join(APP_BASE, OG_IMAGE_PATH) ].join(''),
                    'twitter:card': 'summary_large_image',
                    'twitter:title': APP_NAME,
                    'twitter:description': APP_DESCRIPTION,
                    'twitter:url': [ APP_URL, APP_BASE ].join(''),
                    'twitter:image': [ APP_URL, path.join(APP_BASE, TW_IMAGE_PATH) ].join(''),
                } : {
                    title: `DEV :: ${APP_NAME} :: IN PROGRESS`,
                })
            },
            minify: IS_PROD
        }),
        new MiniCssExtractPlugin({
            filename: path.join(APP_BASE, STYLES_PATH, IS_PROD ? '[name].[contenthash].css' : '[name].css'),
            chunkFilename: path.join(APP_BASE, STYLES_PATH, IS_PROD ? '[id].[contenthash].css' : '[id].css')
        }),
        ...(IS_PROD ? [
            new CssMinimizerPlugin(),
        ] : [
            new webpack.HotModuleReplacementPlugin(),
        ])
    ],
    devServer: {
        host: 'localhost',
        port: 9000,
        static: [
            {
                directory: DIST_DIR,
                serveIndex: true,
                watch: true
            }
        ],
        watchFiles: SRC_DIR,
        open: `/`
    }
};