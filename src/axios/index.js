import 'es6-promise/auto'
import axios from 'axios'
import Cookies from 'js-cookie'
import store from '../store'
import router from '../router'

import {
  authorization,
  authorization_verify,
  authorization_refresh,
  modelPublicGoods,
  modelPublicCategory,
  modelPublicSubCategory,
  modelPublicSelection,
  adminImportGoodsViewSet,
  adminImportGoodsSetViewSet,
  adminPublicCategory,
  methodPrivateOrder,
  modelPublicGoodsImage,
  modelPublicGoodsMealInfo,
  modelsPublicGoodsInfo,
  modelsPublicGoodsWithInfo,
  modelsPublicGoodsStockInfo,
  modelsPublicGoodsLabelInfo
} from './BaseUrl'

const baseurl = 'http://127.0.0.1:8000';
const url = baseurl + '/api/v2/';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = url;
axios.defaults.withCredentials = true;

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export function getTokenJWT() {
  let token = Cookies.get('Token');
  if (token !== undefined) {
    return 'JWT ' + token
  }
}

function setTokenJWT(user, token) {
  Cookies.set('Token', token);
  Cookies.set('User', user);
  getTokenJWT()
}

function removeTokenJWT() {
  Cookies.remove('Token');
  Cookies.remove('User');
  store.state.auth.user.username = null;
  store.state.auth.token = null;
}

function AuthVerifyToken() {
  return axios.post(authorization_verify(), {
    'token': getTokenJWT()
  })
    .then(response => {
      if (response.status === 200 && response.statusText === "OK") {
        return response;
      }
      return null
    }).then((err) => {
      return err
    });
}

/* POST传参序列化(添加请求拦截器) */
axios.interceptors.request.use(config => {
    // console.log('request getTokenJWT', config);
    if (getTokenJWT()) {
      config.headers.Authorization = getTokenJWT();
      // console.log('config.headers', config.headers)
    }
    return config;
  },
  error => {
    console.log('request err', error.response);
    return Promise.reject(error.response);
  }
);

/* 需要优化 验证令牌有效性 */
/* 返回状态判断(添加响应拦截器) */
axios.interceptors.response.use(response => {
  console.log('axios.interceptors.response', response);
  return response
}, error => {
  console.log('response error', error.response);
  if (error.response.status === 401 && error.response.statusText === "Unauthorized") {
    /* 未经授权 跳转登录页面 */
    /*
    * data.detail Signature has expired. 验证过期
    * */
    router.push({name: 'auth:login'});
  }
  if (error.response.status === 403 && error.response.statusText === "Forbidden" && error.response.data.detail === "您没有执行该操作的权限。") {
    /* 未认证或者令牌失效 跳转登录页面 */
    // AuthVerifyToken().then(response => {
    //   router.push({name: 'auth:login'});
    // })
    router.push({name: 'auth:login'});
    // console.log('您没有权限操作', error.response.data.detail)
  }
  return Promise.resolve(error.response)
});


/* request status */
function Status(response) {
  /* 成功请求 */
  if (response.status === 200 && response.statusText === "OK") {
    return response;
  }
  return response
}

function respone_urls(objects, index) {
  /* 组合请求路径 */
  let url = objects();
  if (index) {
    url = objects(index);
  }
  return url
}

function respone_data(data, pagination) {
  /*
   * 处理data数据部分 */
  /*
   pagination: {
       index: 1,
       pageSize: 2,
       count: 1,
       next: null,
       previous: null
   }
   */
  if (pagination) {
    let offset = pagination.index;
    let limit = pagination.pageSize;
    if (offset && limit) {
      offset = Math.round(limit * (offset - 1) + 0.4);
      data['offset'] = offset;
      data['limit'] = limit;
    }
  }
  return data
}

export default {

  getUrl: function () {
    return url
  },

  getBaseUrl: function () {
    return baseurl
  },

  /* 获取Token
   * POST 获取令牌
   * @param username: 用户名
   * @param password: 用户密码
   * @api POST: /api/v2/authorization/ */
  AuthTokenJwt: function (username, password) {
    return axios.post(authorization(), {
      'username': username,
      'password': password
    })
      .then(response => {
        if (response.status === 200 && response.statusText === "OK") {
          setTokenJWT(response.data.user.username, response.data.token);
          // router.push({name: 'admin:goods:index'});
        }
        return Status(response);
      }).then((err) => {
        return err
      });
  },

  /* 退出登录 清除cookie */
  AuthOutTokenJwt: function () {
    removeTokenJWT();
    // router.push({name: 'auth:login'});
  },

  /* 刷新令牌 更新cookie
   * POST 刷新令牌
   * @api POST: /api/v2/authorization-refresh/ */
  AuthRefreshTokenJwt: function () {
    return axios.post('/authorization-refresh/', {
      'token': getTokenJWT()
    })
      .then(response => {
        if (response.status === 200 && response.statusText === "OK") {
          setTokenJWT(response.data.user.username, response.data.token);
        }
        return Status(response);
      }).then((err) => {
        return err
      });
  },

  /* 验证令牌
   * POST 验证令牌
   * @api POST: /api/v2/authorization-verify/ */
  AuthVerifyTokenJwt: function () {
    return axios.post('/authorization-verify/', {
      'token': getTokenJWT()
    })
      .then(response => {
        if (response.status === 200 && response.statusText === "OK") {
          return response;
        }
        return null
      }).then((err) => {
        return err
      });
  },

  /* 获取商品列表接口
   * GET 获取商品列表
   * @param limit: 分类条目数量
   * @param page: 分页
   * @param filter: restful筛选器
   * @api GET: /api/v2/model-public/goods/
   * FILTER:
   *  name String: 商品名称
   *  money Decimal: 商品金额
   *  release Boolean: 商品发布状态
   *  release_version Int: 商品发布版本号
   *  time_add Date: 商品添加时间 */
  GoodsPublicGoods: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelPublicGoods, index), method, respone_data(data, pagination))
  },

  /* 商品首图
   * GET 查看
   * PATCH/PUT 修改
   * POST 创建
   * DELETE 删除
   *
   * @param method: 请求方法
   * @param data: 请求数据
   *  image File: 文件对象[open]
   *  defaule Boolean: 默认资源
   *  key ForeignKey: GoodsPublicGoods ID
   * @api [METHOD]: /api/v2/model-public/goods-image/ */
  GoodsPublicImage: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelPublicGoodsImage, index), method, respone_data(data, pagination))
  },

  /* 对商品进行修改操作
   * GET 查看
   * PATCH 修改
   * DELETE 删除
   * @param index: 商品ID[pk]
   * @param method: 请求方法
   * @param data: 请求数据
   *  name String: 商品名称
   *  connet String: 商品描述
   *  unix String: 商品unix
   * @api [METHOD]: /api/v2/model-public/goods/[@index]/ */
  GoodsIndexPublicGoods: function (method = 'PATCH', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelPublicGoods, index), method, respone_data(data, pagination))
  },

  /* 商品套餐信息操作接口
   * GET 查看
   * PATCH 修改
   * DELETE 删除
   * @param index: 商品ID[pk]
   * @param method: 请求方法
   * @param data: 请求数据
   *  name String: 商品名称
   *  connet String: 商品描述
   *  unix String: 商品unix
   * @api [METHOD]: /api/v2/model-public/goods/[@index]/ */
  PublicGoodsMealInfo: function (method = 'PATCH', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelPublicGoodsMealInfo, index), method, respone_data(data, pagination))
  },


  /* 对首页分类相关操作
   * GET 查看
   * PATCH/PUT 修改
   * POST 创建
   * DELETE 删除
   * @param method: 请求方法
   * @param data: 请求数据
   *  name String: 名称
   * @api [METHOD]: /api/v2/model-public/category/ */
  Category: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelPublicCategory, index), method, respone_data(data, pagination))
  },

  /* 对首页子分类相关操作
   * GET 查看
   * PATCH/PUT 修改
   * POST 创建
   * DELETE 删除
   * @param method: 请求方法
   * @param data: 请求数据
   *  name String: 名称
   *  url String: 链接地址
   *  level Int: 分类展示优先级[搜索]
   *  Classifykey ForeignKey: Category ID 分类键
   * @api [METHOD]: /api/v2/model-public/sub-category/ */
  SubCategory: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelPublicSubCategory, index), method, respone_data(data, pagination))
  },

  /* 商品筛选器修改操作
   * GET 查看
   * PATCH/PUT 修改
   * POST 创建
   * DELETE 删除
   * @param method: 请求方法
   * @param data: 请求数据
   *  t1 String: 商品品牌
   *  t2 String: 产品类型
   *  t3 String: 技术类型
   *  t4 String: 使用场景
   *  t5 String: 价格范围
   *  filter_id Int: 分类类型
   *  key ForeignKey: SubCategory ID 键
   * @api [METHOD]: /api/v2/model-public/selection/ */
  Selection: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelPublicSelection, index), method, respone_data(data, pagination))
  },

  /* 导入商品，上传文件修改操作
   * GET
   * POST 分片上传文件  (1)
   * PUT/PATCH 组合分片 (2)
   * @param method: 请求方法
   * @param data: 请求数据
   *  file File: 文件对象[open]
   *  filename String: 文件名
   *  relativePath String: 文件夹上传的时候文件的相对路径属性
   *  identifier String: 每个文件的唯一标示
   *  totalSize Int: 文件总大小
   *  currentChunkSize Int: 当前块的大小，实际大小
   *  chunkSize Int: 分块大小，根据 totalSize 和这个值你就可以计算出总共的块数。注意最后一块的大小可能会比这个要大
   *  totalChunks Int: 文件被分成块的总数
   *  chunkNumber Int: 当前块的次序，第一个块是 1，注意不是从 0 开始的
   *  status Int: 上传状态， 0 完成商品导入数据库
   * @api [METHOD]: /api/v2/admin/importgoods/ */
  ImportGoods: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(adminImportGoodsViewSet, index), method, respone_data(data, pagination))
  },

  /* 操作被上传的文件，ImportGoods组合完成的文件
   * GET 查看
   * POST 创建[请使用ImportGoods接口上传文件]
   *
   * @param method: 请求方法
   * @param data: 请求数据
   *  file File: 文件对象[open]
   *  unix Int: 资源路径
   *  status Int: 导入状态
   * @api [METHOD]: /api/v2/admin/importgoodsset/ */
  ImportGoodsSet: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(adminImportGoodsSetViewSet, index), method, respone_data(data, pagination))
  },

  PrivateOrder: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(methodPrivateOrder, index), method, respone_data(data, pagination))
  },

  /* 获取商品分类，梯级分类数据
       * GET 查看
       *
       * @param method: 请求方法
       * @param data: 请求数据
       *  file File: 文件对象[open]
       *  unix Int: 资源路径
       *  status Int: 导入状态
       * @api [METHOD]: /api/v2/admin/category/ */
  CategorySet: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(adminPublicCategory, index), method, respone_data(data, pagination))
  },

  /* 获取商品分类，梯级分类数据 */
  GoodsInfoPublic: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelsPublicGoodsInfo, index), method, respone_data(data, pagination))
  },

  ModelsPublicGoodsWithInfo: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelsPublicGoodsWithInfo, index), method, respone_data(data, pagination))
  },

  ModelsPublicGoodsStockInfo: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelsPublicGoodsStockInfo, index), method, respone_data(data, pagination))
  },

  ModelsPublicGoodsLabelInfo: function (method = 'GET', data = {}, index = null, pagination = {}) {
    return Axios(respone_urls(modelsPublicGoodsLabelInfo, index), method, respone_data(data, pagination))
  },

}

export function Axios(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    let params = null;

    if (method.toUpperCase() === 'GET') {
      params = data;
      data = null;
    }

    axios({
      method: method,
      url: url,
      params: params,
      data: data
    }).then((response) => {
      console.log('response resolve', response);
      resolve(response);
    }).catch((error) => {
      console.log('error')
      reject(error);
    })
  })
}

export function OPTIONS(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: "OPTIONS",
      url: url,
      params: data,
    }).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(error);
    })
  })
}

export function GET(url, data = {}) {
  return new Promise((resolve, reject) => {
    let context = '?';
    for (let key in data) {
      context += key;
      context += '=';
      context += data[key];
      context += '&'
    }

    url += context;
    axios.get(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
  })
}

export function POST(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
  })
}

export function PUT(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
  })
}

export function PATCH(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
  })
}

export function DELETE(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
  })
}

export function HEAD(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.head(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
  })
}


