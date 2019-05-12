import {GET, POST, PUT, PATCH, DELETE, HEAD,} from '@/axios'

const urls = 'http://dev.lhwill.com/api/v2/';

const auth = {
    authorization: 'authorization/',
    authorization_refresh: 'authorization-refresh/',
    authorization_verify: 'authorization-verify/'
};

const root = {
    admin: {
        import_goods: 'admin/importgoods/',
        import_goods_set: 'admin/importgoodsset/',
        category: 'admin/category/',
        // goods_with_info: 'admin/goods-info/'
    },
    model: {
        public: {
            category: 'model-public/category/',
            sub_category: 'model-public/sub-category/',
            goods_prefix_info: 'model-public/goods-prefix-info/',
            selection: 'model-public/selection/',
            card: 'model-public/card/',
            card_content: 'model-public/card-content/',
            goods: 'model-public/goods/',
            goods_with_info: "model-public/goods-with-info/",
            goods_meal_info: 'model-public/goods-meal-info/',
            goods_image: 'model-public/goods-image/',
            goods_stock_info: 'model-public/goods-stock-info/',
            goods_label_info: 'model-public/goods-label-info/',
            sowing_map: 'model-public/sowing-map/'
        },
        private: {
            user: 'model-private/user/',
            central_category: 'model-private/central-category/',
            bill: 'model-private/bill/',
            place: 'model-private/place/'
        }
    },
    method: {
        public: [],
        private: {
            order: 'method-private/order/',
            new_contract: 'method-private/new-contract/'
        }
    }
};

export function authorization() {
    /* 获取Token令牌 */
    return auth.authorization
}

export function authorization_refresh() {
    /* 刷新Token令牌 */
    return auth.authorization_refresh
}

export function authorization_verify() {
    /* 验证Token令牌 */
    return auth.authorization_verify
}

export function modelPublicCategory(index = null) {
    if (index) {
        return root.model.public.category + index + '/'
    }
    return root.model.public.category
}

export function modelPublicSubCategory(index = null) {
    if (index) {
        return root.model.public.sub_category + index + '/'
    }
    return root.model.public.sub_category
}

export function modelPublicSelection(index = null) {
    if (index) {
        return root.model.public.selection + index + '/'
    }
    return root.model.public.selection
}

export function modelPublicGoods(index = null) {
    if (index) {
        return root.model.public.goods + index + '/'
    }
    return root.model.public.goods
}

export function methodPrivateOrder(index = null) {
    if (index) {
        return root.method.private.order + index + '/'
    }
    return root.method.private.order
}

export function adminImportGoodsViewSet(index = null) {
    if (index) {
        return root.admin.import_goods + index + '/'
    }
    return root.admin.import_goods
}

export function adminImportGoodsSetViewSet(index = null) {
    if (index) {
        return root.admin.import_goods_set + index + '/'
    }
    return root.admin.import_goods_set
}

/* 商品首图
 * Url: /api/v2/model-public/goods-image/ */
export function modelPublicGoodsImage(index = null) {
    if (index) {
        return root.model.public.goods_image + index + '/'
    }
    return root.model.public.goods_image
}

/* 商品套餐信息
 * Url: /api/v2/model-public/goods-meal-info/ */
export function modelPublicGoodsMealInfo(index = null) {
    if (index) {
        return root.model.public.goods_meal_info + index + '/'
    }
    return root.model.public.goods_meal_info
}

/* 商品分类，梯级分类数据
 * Url: /api/v2/admin/ */
export function adminPublicCategory(index = null) {
    if (index) return root.admin.category + index + '/';
    return root.admin.category
}

/* 获取商品分类，梯级分类数据
 * Url: /api/v2/model-public/goods-info/?wareApp_key=4284 */
export function modelsPublicGoodsInfo(index = null) {
    if (index) return root.model.public.goods_prefix_info + index + '/';
    return root.model.public.goods_prefix_info
}

/* 获取商品参数信息，不同分类的商品参数信息不一致
 * Url: /api/v2/model-public/goods-with-info/ */
export function modelsPublicGoodsWithInfo(index = null) {
    if (index) return root.model.public.goods_with_info + index + '/';
    return root.model.public.goods_with_info
}

/* 商品库存信息
 * Url: /api/v2/model-public/goods-stock-info/ */
export function modelsPublicGoodsStockInfo(index = null) {
    if (index) return root.model.public.goods_stock_info + index + '/';
    return root.model.public.goods_stock_info
}

/* 商品标签信息
 * Url: /api/v2/model-public/goods-label-info/ */
export function modelsPublicGoodsLabelInfo(index = null) {
    if (index) return root.model.public.goods_label_info + index + '/'
    return root.model.public.goods_label_info
}

