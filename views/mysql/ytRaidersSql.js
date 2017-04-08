"use strict";
const pm = require("../scripts/manager");
/**
 * 获得攻略列表
 * **/
class ytRaidersSql {
    constructor() {
    }
    getDB() {
        return pm.handle().yuantu_db;
    }
    //注册的时候检查是否已经注册过了
    // hasUserOrNot(phone): Promise<Array<any>> 
    // {
    //     var sql = "select * from user where id = " + id;
    //     return this.getDB().selectBySql(sql);
    // }
    //获得用户信息
    getUserInfo(id) {
        var sql = "select * from user where id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //获得游记详情
    getArticleInfo(id) {
        var sql = "select * from articles,user where articles.id = " + id + " and articles.user_id = user.id";
        return this.getDB().selectBySql(sql);
    }
    //获得游记详情
    getArticleContentInfo(id) {
        var sql = "select * from articles_content where articles_content.article_id = " + id + " order by num asc";
        return this.getDB().selectBySql(sql);
    }
    //删除联系人
    deleteClient(id) {
        var sql = "delete from user_client where id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //批量删除
    deleteArr(ids, table) {
        var sql = "delete from " + table + " where id in ( " + ids + " )";
        return this.getDB().selectBySql(sql);
    }
    //优惠券列表
    getCounponList(id) {
        var sql = "select * from counpon where userId = " + id + " order by addTime desc";
        return this.getDB().selectBySql(sql);
    }
    //取消订单
    cancelOrder(id) {
        return this.getDB().updateObject('orders', { "id": id, 'status': '0' }, ["id"]);
    }
    changeStatus(table, id, status) {
        return this.getDB().updateObject(table, { "id": id, 'status': status }, ["id"]);
    }
    //删除订单
    deleteOrder(id) {
        var sql = "delete from orders where id = " + id;
        return this.getDB().selectBySql(sql);
    }
    sureFinish(id) {
        return this.getDB().updateObject('orders', { "id": id, 'status': '3' }, ["id"]);
    }
    soldM(id) {
        return this.getDB().updateObject('orders', { "id": id, 'status': '0' }, ["id"]);
    }
    //批量更新
    updateArr(para, table) {
        return this.getDB().updateArr(para, table);
    }
    //删除联系人
    deleteCollection(id) {
        var sql = "delete from collection where collection.id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //删除游记 
    deleteArticle(id) {
        var sql = "delete from articles where articles.id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //删除游记内容
    deleteArticleContent(id) {
        var sql = "delete from articles_content where articles_content.article_id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //获得意见反馈列表
    getFeedbackList(id) {
        var sql = "select * from feedback where user_id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //获得意见反馈列表
    getArticleList(id) {
        var sql = "select * from articles where user_id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //获得联系人详情
    getClientInfo(id) {
        var sql = "select * from user_client where id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //
    addFeedback(input) {
        return this.getDB().insertObject(input, "feedback");
    }
    //添加到收藏
    addToCollection(input) {
        return this.getDB().insertObject(input, "collection");
    }
    //编辑用户信息
    editUserInfo(input) {
        return this.getDB().updateObject('user', { "avatar": input['avatar'], "id": input['id'], 'nickname': input['nickname'], 'autograph': input['autograph'] }, ["id"]);
    }
    //获得攻略列表 有用户信息
    getRaidersList() {
        var sql = "select * from user,travel_raiders where user.id = travel_raiders.user_id";
        return this.getDB().selectBySql(sql);
    }
    //订单列表
    getOrderList(status, userId) {
        //全部订单
        if (status == -1) {
            var sql = "select * from activity,orders where activity.id = orders.activity_id and orders.user_id =" + userId + " order by add_time desc";
        }
        else {
            var sql = "select * from activity,orders where activity.id = orders.activity_id and orders.user_id =" + userId + " and orders.status =" + status + " order by add_time desc";
            ;
        }
        return this.getDB().selectBySql(sql);
    }
    //更改优惠券的状态
    changeCounponStatus(id) {
        return this.getDB().updateObject("counpon", { id: id, counponStatus: 2 }, ["id"]);
    }
    //订单列表
    addOrminus(type, table, name, id) {
        return this.getDB().updateOneBySql(type, table, name, id);
    }
    //获得某一条攻略的信息
    getRaiderInfo(id) {
        var sql = "select * from travel_raiders where travel_raiders.id = " + id;
        return this.getDB().selectBySql(sql);
    }
    //获得活动列表
    getActivityList() {
        var sql = "select * from activity order by addtime desc";
        return this.getDB().selectBySql(sql);
    }
    //判断是否已经点赞
    isUpYet(userId, objId, type) {
        var sql = "select * from up where user_id = " + userId + " and obj_id = " + objId + " and type = " + type + "";
        return this.getDB().selectBySql(sql);
    }
    //添加评论
    addUp(para) {
        return this.getDB().insertObject(para, "up");
    }
    //获得收藏列表
    getCollection(id) {
        var sql = "select * from activity,collection where collection.user_id = " + id + " and collection.activity_id = activity.id order by add_time desc";
        return this.getDB().selectBySql(sql);
    }
    //编辑顾客信息
    editUserClientInfo(input) {
        return this.getDB().updateObject("user_client", input, ["id"]);
    }
    //添加顾客信息
    addUserClientInfo(input) {
        return this.getDB().insertObject(input, "user_client");
    }
    //获得当前登录的用户的用户信息列表
    getUserClientList(userId) {
        var sql = "select * from user_client where user_id =" + userId;
        return this.getDB().selectBySql(sql);
    }
    //下订单的时候 选择的用户信息
    getUserClientInfo(para) {
        var sql = "select * from user_client where id in (" + para.join(',') + ")";
        return this.getDB().selectBySql(sql);
    }
    //下订单的时候 活动套餐列表
    getpackageList(para) {
        var sql = "select * from activity_package where activity_id =" + para;
        return this.getDB().selectBySql(sql);
    }
    //活动的评价列表
    getCommentList(para) {
        var sql = "select * from user,comment where activity_id =" + para + " and user.id = comment.user_id order by up desc";
        return this.getDB().selectBySql(sql);
    }
    //获得商品列表
    getGoodsList() {
        var sql = "select * from goods";
        return this.getDB().selectBySql(sql);
    }
    //为您推荐列表（活动风采、领队风采、团队风采）
    getRecommendList() {
        var sql = "select * from activity_style union(select * from leader_style) union(select * from team_style)";
        return this.getDB().selectBySql(sql);
    }
    //提交订单的时候添加订单
    addOrder(para) {
        return this.getDB().insertObject(para, "orders");
    }
    //支付订单成功后判断是不是首单
    isFirstOrder(id) {
        var sql = "select * from orders where user_id = " + id + " and status = 2";
        return this.getDB().selectBySql(sql);
    }
    //获取订单
    getOrders(id) {
        return this.getDB().select('orders', 'id', id);
    }
    //更新订单
    updateOrder(params) {
        return this.getDB().updateObject("orders", params, ["id"]);
    }
    //更新订单
    giveCounpon(params) {
        return this.getDB().insertObject(params, "counpon");
    }
    //提交订单之后 往order_client添加数据
    addOrderClient(para) {
        return this.getDB().insertArr(para, "order_client");
    }
    //提交订单之后 往order_goods添加数据
    addOrderGoods(para) {
        return this.getDB().insertArr(para, "order_goods");
    }
    //添加文章内容
    addArticleContent(para) {
        return this.getDB().insertArr(para, "articles_content");
    }
    //获得活动详情
    getActivityInfo(id) {
        var sql = "select * from activity where id =" + id;
        return this.getDB().selectBySql(sql);
    }
    //添加浏览次数
    addCountOfView(id, table, num) {
        return this.getDB().updateObject(table, { "count_of_view": num, "id": id }, ["id"]);
    }
    //addArticle
    addArticle(para) {
        return this.getDB().insertObject(para, "articles");
    }
    //添加评论
    addComment(para) {
        return this.getDB().insertObject(para, "comment");
    }
    updateArticle(para) {
        return this.getDB().updateObject("articles", para, ["id"]);
    }
}
module.exports = ytRaidersSql;
//# sourceMappingURL=ytRaidersSql.js.map