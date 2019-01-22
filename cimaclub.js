'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = {
    DOMAIN: 'http://cimaclub.com',
    SEARCH: function SEARCH(title) {
        return 'http://cimaclub.com/?s=' + encodeURIComponent(title);
    },
    STREAM: function STREAM(q, i) {
        return 'http://cimaclub.com/wp-content/themes/Cimaclub/servers/server.php?q=' + q + '&i=' + i;
    },
    HEADERS: {
        'Origin': '',
        'Accept-Language': 'vi-VN,vi;q=0.8,fr-FR;q=0.6,fr;q=0.4,en-US;q=0.2,en;q=0.2',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

var CimaClub = function () {
    function CimaClub(props) {
        _classCallCheck(this, CimaClub);

        this.libs = props.libs;
        this.movieInfo = props.movieInfo;
        this.settings = props.settings;

        this.state = {};
    }

    _createClass(CimaClub, [{
        key: 'searchDetail',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _libs, httpRequest, cheerio, stringHelper, cryptoJs, _movieInfo, title, year, season, episode, type, detailUrl, pageUrl, html, $, movies, data, _html, _$, shows, url, u, data_filter;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _libs = this.libs, httpRequest = _libs.httpRequest, cheerio = _libs.cheerio, stringHelper = _libs.stringHelper, cryptoJs = _libs.cryptoJs;
                                _movieInfo = this.movieInfo, title = _movieInfo.title, year = _movieInfo.year, season = _movieInfo.season, episode = _movieInfo.episode, type = _movieInfo.type;
                                detailUrl = false;
                                pageUrl = URL.SEARCH(title);

                                if (!(type == 'movie')) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.next = 7;
                                return httpRequest.getHTML(pageUrl);

                            case 7:
                                html = _context.sent;
                                $ = cheerio.load(html);
                                movies = $('body > div.main-content > div.sections > div > div > div');

                                movies.each(function () {
                                    var hrefMovie = $(this).find('a').attr('href');
                                    if (hrefMovie != undefined) {
                                        var name = $(this).find('img').attr('alt');
                                        if (name.includes(title) && name.includes(year)) detailUrl = hrefMovie;
                                    }
                                });
                                _context.next = 36;
                                break;

                            case 13:
                                data = '#mpbreadcrumbs > span:nth-child(3) > a';
                                _context.next = 16;
                                return httpRequest.getHTML(pageUrl);

                            case 16:
                                _html = _context.sent;
                                _$ = cheerio.load(_html);
                                shows = _$('body > div.main-content > div.sections > div > div > div');
                                url = false;

                                if (!shows) {
                                    _context.next = 28;
                                    break;
                                }

                                u = _$(shows[0]).find('a').attr('href');
                                _context.t0 = _$;
                                _context.next = 25;
                                return httpRequest.getHTML(u);

                            case 25:
                                _context.t1 = _context.sent;
                                _context.t2 = data;
                                url = (0, _context.t0)(_context.t1).find(_context.t2).attr('href');

                            case 28:
                                data_filter = false;

                                if (!(url !== false)) {
                                    _context.next = 35;
                                    break;
                                }

                                _context.next = 32;
                                return httpRequest.getHTML(url);

                            case 32:
                                _html = _context.sent;

                                _$ = cheerio.load(_html);
                                _$('#TabsContents > div.tab.active > div > div.seasons').find('div').each(function () {
                                    var s = _$(this).text().replace('موسم', '').trim();
                                    if (s == season) {
                                        data_filter = _$(this).attr('data-filter');
                                        _$('#TabsContents > div.tab.active > div > div.episodes').children().each(function () {
                                            if (_$(this).attr('class') == 'episode' && _$(this).attr('data-season') == data_filter) {
                                                var text = _$(this).find('a').text().replace('الحلقة', '').trim();
                                                if (text == episode) {
                                                    detailUrl = _$(this).find('a').attr('href');
                                                    return;
                                                }
                                            }
                                        });
                                        return false;
                                    }
                                });

                            case 35:
                                if (data_filter != false) {}

                            case 36:

                                // your code here


                                this.state.detailUrl = detailUrl;
                                return _context.abrupt('return');

                            case 38:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function searchDetail() {
                return _ref.apply(this, arguments);
            }

            return searchDetail;
        }()
    }, {
        key: 'getHostFromDetail',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var _libs2, httpRequest, cheerio, url, html, $, hosts, id, i, iframe, frame;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _libs2 = this.libs, httpRequest = _libs2.httpRequest, cheerio = _libs2.cheerio;

                                if (this.state.detailUrl) {
                                    _context2.next = 3;
                                    break;
                                }

                                throw new Error('NOT_FOUND');

                            case 3:
                                url = this.state.detailUrl + '?view=1';
                                _context2.next = 6;
                                return httpRequest.getHTML(this.state.detailUrl + '?view=1');

                            case 6:
                                html = _context2.sent;
                                $ = cheerio.load(html);
                                hosts = [];
                                id = false;

                                $('head').find('link').each(function () {
                                    var tag = $(this);
                                    if (tag.attr('rel') == 'shortlink') {
                                        id = tag.attr('href').replace('http://cimaclub.com/?p=', '');
                                        return false;
                                    }
                                    console.log();
                                });
                                i = 1;

                            case 12:
                                if (!(i <= $('#TabsContents > div.tab.active > div > ul').children().length - 1)) {
                                    _context2.next = 25;
                                    break;
                                }

                                _context2.next = 15;
                                return httpRequest.getHTML(URL.STREAM(id, i));

                            case 15:
                                iframe = _context2.sent;
                                frame = iframe.match(/(src\=\'([^\']+))|(src\=\"([^\"]+))/i);

                                frame = frame != false ? frame[4] : false;
                                if (frame && frame.indexOf('http') < 0) frame = 'http:' + frame;
                                if (frame) frame = frame.split(' ')[0];
                                frame && hosts.push({
                                    provider: {
                                        url: this.state.detailUrl,
                                        name: 'cimaclub (AR)'
                                    },
                                    result: {
                                        file: frame,
                                        label: 'embed',
                                        type: 'embed'
                                    }
                                });
                                console.log(frame);

                            case 22:
                                i++;
                                _context2.next = 12;
                                break;

                            case 25:
                                console.log(this.state.detailUrl);

                                this.state.hosts = hosts;

                            case 27:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getHostFromDetail() {
                return _ref2.apply(this, arguments);
            }

            return getHostFromDetail;
        }()
    }]);

    return CimaClub;
}();

exports.default = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(libs, movieInfo, settings) {
        var httpRequest, cloneMe, bodyPost;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        httpRequest = libs.httpRequest;
                        cloneMe = new CimaClub({
                            libs: libs,
                            movieInfo: movieInfo,
                            settings: settings
                        });
                        bodyPost = {
                            name_source: 'CimaClub',
                            is_link: 0,
                            type: movieInfo.type,
                            season: movieInfo.season,
                            episode: movieInfo.episode,
                            title: movieInfo.title,
                            year: movieInfo.year
                        };
                        _context3.next = 5;
                        return cloneMe.searchDetail();

                    case 5:
                        if (!cloneMe.state.detailUrl) {
                            bodyPost.is_link = 0;
                        } else {
                            bodyPost.is_link = 1;
                        }
                        _context3.next = 8;
                        return cloneMe.getHostFromDetail();

                    case 8:
                        if (cloneMe.state.hosts.length == 0) {
                            bodyPost.is_link = 0;
                        } else {
                            bodyPost.is_link = 1;
                        }
                        httpRequest.post('https://api.teatv.net/api/v2/mns', {}, bodyPost);
                        return _context3.abrupt('return', cloneMe.state.hosts);

                    case 11:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
    };
}();
exports.testing = CimaClub;
