"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ArticleService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var article_entity_1 = require("./entities/article.entity");
var category_entity_1 = require("../category/entities/category.entity");
var tag_entity_1 = require("../tag/entities/tag.entity");
var ArticleService = /** @class */ (function () {
    function ArticleService(articleRepository, categoryRepository, tagRepository) {
        this.articleRepository = articleRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }
    // 获取全部博文
    // 分页数据类型
    ArticleService.prototype.getAllArticles = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, _a, result, total, count;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, limit = params.limit;
                        return [4 /*yield*/, this.articleRepository.findAndCount({
                                skip: (page - 1) * limit,
                                take: limit,
                                relations: ['category']
                            })];
                    case 1:
                        _a = _b.sent(), result = _a[0], total = _a[1];
                        count = Math.ceil(total / limit);
                        if (page > count) {
                            return [2 /*return*/, {
                                    code: 404,
                                    msg: '敬请期待,更多精彩内容~'
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    code: 200,
                                    data: result,
                                    total: total,
                                    page: page,
                                    count: count,
                                    msg: '获取成功'
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 获取博文
    ArticleService.prototype.getArticle = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var articleInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.articleRepository
                            .createQueryBuilder('article')
                            .leftJoinAndSelect('article.category', 'category')
                            .where('article.article_id = :id', { id: id })
                            .getOne()];
                    case 1:
                        articleInfo = _a.sent();
                        return [2 /*return*/, articleInfo];
                }
            });
        });
    };
    // 新增博文
    ArticleService.prototype.createArticle = function (createArticleDto) {
        return __awaiter(this, void 0, Promise, function () {
            var article, article_id, article_title, article_content, article_summary, article_cover, article_top, article_like_count, article_comment_count, article_read_count, article_user_id, article_update_user_id, article_create_time, article_update_time, category_id, tag_id, category_info, tag_info, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        article = new article_entity_1.Article();
                        article_id = createArticleDto.article_id, article_title = createArticleDto.article_title, article_content = createArticleDto.article_content, article_summary = createArticleDto.article_summary, article_cover = createArticleDto.article_cover, article_top = createArticleDto.article_top, article_like_count = createArticleDto.article_like_count, article_comment_count = createArticleDto.article_comment_count, article_read_count = createArticleDto.article_read_count, article_user_id = createArticleDto.article_user_id, article_update_user_id = createArticleDto.article_update_user_id, article_create_time = createArticleDto.article_create_time, article_update_time = createArticleDto.article_update_time, category_id = createArticleDto.category_id, tag_id = createArticleDto.tag_id;
                        return [4 /*yield*/, this.categoryRepository.findOne({
                                where: { category_id: category_id }
                            })];
                    case 1:
                        category_info = _a.sent();
                        if (!category_info)
                            return [2 /*return*/, { code: 500, msg: '文章分类不存在!' }];
                        else
                            article.category = category_info;
                        return [4 /*yield*/, this.tagRepository.findOne({
                                where: { tag_id: tag_id }
                            })];
                    case 2:
                        tag_info = _a.sent();
                        if (!tag_info)
                            return [2 /*return*/, { code: 500, msg: '文章标签不存在!' }];
                        else
                            article.tag = tag_info;
                        article.article_user_id = 1; // 发表用户id
                        article.article_update_user_id = 1; // 更新用户id
                        article.article_like_count = 0; // 点赞数
                        article.article_comment_count = 0; // 评论数
                        article.article_read_count = 0; // 浏览数
                        // article.article_id = article_id; // 文章id
                        article.article_title = article_title; // 标题
                        article.article_content = article_content; // 内容
                        article.article_summary = article_summary; // 摘要
                        article.article_cover = article_cover; // 封面
                        article.article_top = article_top; // 是否置顶
                        article.article_create_time = Date.now(); // 创建时间戳
                        article.article_update_time = Date.now(); // 更新时间戳
                        return [4 /*yield*/, this.articleRepository.save(article)];
                    case 3:
                        res = _a.sent();
                        console.log(res);
                        if (res) {
                            return [2 /*return*/, { code: 200, msg: '发布成功' }];
                        }
                        else {
                            return [2 /*return*/, { code: 500, msg: '发布失败!' }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ArticleService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(article_entity_1.Article)),
        __param(1, typeorm_1.InjectRepository(category_entity_1.Category)),
        __param(2, typeorm_1.InjectRepository(tag_entity_1.Tag))
    ], ArticleService);
    return ArticleService;
}());
exports.ArticleService = ArticleService;
