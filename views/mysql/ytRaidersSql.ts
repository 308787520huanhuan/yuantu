import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');
/**
 * 获得攻略列表
 * **/
class ytRaidersSql {

    constructor() {

    }

    getDB(): db.Pool {
        return pm.handle().yuantu_db;
    }

    //注册的时候检查是否已经注册过了
    // hasUserOrNot(phone): Promise<Array<any>> 
    // {

    //     var sql = "select * from user where id = " + id;
    //     return this.getDB().selectBySql(sql);
    // }
    

    //获得用户信息
    getUserInfo(id): Promise<Array<any>> 
    {

        var sql = "select * from user where id = " + id;
        return this.getDB().selectBySql(sql);
    }

    //获得游记详情
    getArticleInfo(id): Promise<Array<any>> 
    {
        var sql = "select * from articles,user where articles.id = " + id + " and articles.user_id = user.id";
        return this.getDB().selectBySql(sql);
    }

    //获得游记详情
    getArticleContentInfo(id): Promise<Array<any>> 
    {
        var sql = "select * from articles_content where articles_content.article_id = " + id + " order by num asc";
        return this.getDB().selectBySql(sql);
    }

    //删除联系人
    deleteClient(id):Promise<Array<any>> {
        var sql = "delete from user_client where id = " + id;
        return this.getDB().selectBySql(sql);
    }

     //批量删除
    deleteArr(ids,table):Promise<Array<any>> 
    {
        var sql = "delete from "+table+" where id in ( " + ids + " )";
        return this.getDB().selectBySql(sql);
    }
    
    //优惠券列表
    getCounponList(id):Promise<Array<any>> 
    {
        var sql = "select * from counpon where userId = " + id + " order by addTime desc";
        return this.getDB().selectBySql(sql);
    }

    //取消订单
    cancelOrder(id):Promise<Array<any>> 
    {
        return this.getDB().updateObject('orders', { "id": id,'status':'0'}, ["id"]);
    }

    changeStatus(table,id,status):Promise<Array<any>> 
    {
        return this.getDB().updateObject(table, { "id": id,'status':status}, ["id"]);
    }

    //删除订单
    deleteOrder(id):Promise<Array<any>> 
    {
        var sql = "delete from orders where id = " + id;
        return this.getDB().selectBySql(sql);
    }

    sureFinish(id):Promise<Array<any>> 
    {
        return this.getDB().updateObject('orders', { "id": id,'status':'3'}, ["id"]);
    }
    
    soldM(id):Promise<Array<any>> 
    {
        return this.getDB().updateObject('orders', { "id": id,'status':'0'}, ["id"]);
    }
    

    //批量更新
    updateArr(para,table):Promise<Array<any>> 
    {
        return this.getDB().updateArr(para, table);
    }
    
    //删除联系人
    deleteCollection(id):Promise<Array<any>> {
        var sql = "delete from collection where collection.id = " + id;
        return this.getDB().selectBySql(sql);
    }

    //删除游记 
    deleteArticle(id):Promise<Array<any>> {

        var sql = "delete from articles where articles.id = " + id;
        return this.getDB().selectBySql(sql);
    }

     //删除游记内容
    deleteArticleContent(id):Promise<Array<any>> {
        var sql = "delete from articles_content where articles_content.article_id = " + id;
        return this.getDB().selectBySql(sql);
    }

    //获得意见反馈列表
    getFeedbackList(id): Promise<Array<any>> {
        var sql = "select * from feedback where user_id = " + id;
        return this.getDB().selectBySql(sql);
    }

    //获得意见反馈列表
    getArticleList(id): Promise<Array<any>> {
        var sql = "select * from articles where user_id = " + id;
        return this.getDB().selectBySql(sql);
    }

    //获得联系人详情
    getClientInfo(id): Promise<Array<any>> {
        var sql = "select * from user_client where id = " + id;
        return this.getDB().selectBySql(sql);
    }

    //
    addFeedback(input): Promise<Array<any>> {
        return this.getDB().insertObject(input, "feedback");
    }

    //添加到收藏
    addToCollection(input): Promise<Array<any>> {
        return this.getDB().insertObject(input, "collection");
    }

    //编辑用户信息
    editUserInfo(input): Promise<Array<any>> {
        return this.getDB().updateObject('user', { "avatar": input['avatar'], "id": input['id'],'nickname':input['nickname'],'autograph':input['autograph'] }, ["id"]);
    }

    //获得攻略列表 有用户信息
    getRaidersList(): Promise<Array<any>> {
        var sql = "select * from user,travel_raiders where user.id = travel_raiders.user_id";
        return this.getDB().selectBySql(sql);
    }

    //订单列表
    getOrderList(status,userId): Promise<Array<any>> {
        //全部订单
        if(status == -1){
            var sql = "select * from activity,orders where activity.id = orders.activity_id and orders.user_id =" + userId + " order by add_time desc";
        }else{
            var sql = "select * from activity,orders where activity.id = orders.activity_id and orders.user_id =" + userId + " and orders.status =" + status + " order by add_time desc";;
        }
        
        return this.getDB().selectBySql(sql);
    }

    //更改优惠券的状态
    changeCounponStatus(id): Promise<Array<any>> {
        return this.getDB().updateObject("counpon", {id:id,counponStatus:2}, ["id"]);
    }

    //订单列表
    addOrminus(type,table,name,id): Promise<Array<any>> 
    {
        return this.getDB().updateOneBySql(type,table,name,id);
    }

    //获得某一条攻略的信息
    getRaiderInfo(id): Promise<Array<any>> {
        var sql = "select * from travel_raiders where travel_raiders.id = " + id;
        return this.getDB().selectBySql(sql);
    }

    //获得活动列表
    getActivityList(): Promise<Array<any>> {
        var sql = "select * from activity order by addtime desc";
        return this.getDB().selectBySql(sql);
    }
    
    //判断是否已经点赞
    isUpYet(userId,objId,type): Promise<Array<any>> {
        var sql = "select * from up where user_id = "+userId+" and obj_id = "+objId+" and type = "+type+"";
        return this.getDB().selectBySql(sql);
    }

    //添加评论
    addUp(para): Promise<Array<any>> {
        return this.getDB().insertObject(para, "up");
    }

    //获得收藏列表
    getCollection(id): Promise<Array<any>> {
        var sql = "select * from activity,collection where collection.user_id = "+id+" and collection.activity_id = activity.id order by add_time desc";
        return this.getDB().selectBySql(sql);
    }

    //编辑顾客信息
    editUserClientInfo(input): Promise<Array<any>> {
        
        return this.getDB().updateObject("user_client", input, ["id"]);
    }

    //添加顾客信息
    addUserClientInfo(input): Promise<Array<any>> {
        
        return this.getDB().insertObject(input, "user_client");
    }

    //获得当前登录的用户的用户信息列表
    getUserClientList(userId): Promise<Array<any>> {
        var sql = "select * from user_client where user_id =" + userId;
        return this.getDB().selectBySql(sql);
    }

    //下订单的时候 选择的用户信息
    getUserClientInfo(para):Promise<Array<any>> {
        var sql = "select * from user_client where id in ("+para.join(',')+")";
        return this.getDB().selectBySql(sql);
    }
    
    //下订单的时候 活动套餐列表
    getpackageList(para):Promise<Array<any>> {
        var sql = "select * from activity_package where activity_id =" + para;
        return this.getDB().selectBySql(sql);
    }

    //活动的评价列表
    getCommentList(para):Promise<Array<any>> {
        var sql = "select * from user,comment where activity_id =" + para + " and user.id = comment.user_id order by up desc";
        return this.getDB().selectBySql(sql);
    }

    //获得商品列表
    getGoodsList():Promise<Array<any>> {
        var sql = "select * from goods";
        return this.getDB().selectBySql(sql);
    }
    
    //为您推荐列表（活动风采、领队风采、团队风采）
    getRecommendList():Promise<Array<any>> {

        var sql = "select * from activity_style union(select * from leader_style) union(select * from team_style)";
        return this.getDB().selectBySql(sql);
    }

    //提交订单的时候添加订单
    addOrder(para):Promise<Array<any>> 
    {
        return this.getDB().insertObject(para, "orders");
    }
    //支付订单成功后判断是不是首单
    isFirstOrder(id):Promise<Array<any>> 
    {
        var sql = "select * from orders where user_id = "+id+" and status = 2";
        return this.getDB().selectBySql(sql);
    }

    //获取订单
    getOrders(id):Promise<Array<any>> {
        return this.getDB().select('orders','id',id);
    }

    //更新订单
    updateOrder(params:any): Promise<Array<any>> {
        return this.getDB().updateObject("orders", params, ["id"]);
    }

    //更新订单
    giveCounpon(params:any): Promise<Array<any>> {
        return this.getDB().insertObject(params, "counpon");
    }

    //提交订单之后 往order_client添加数据
    addOrderClient(para):Promise<Array<any>> {
       return this.getDB().insertArr(para, "order_client");
    }

    //提交订单之后 往order_goods添加数据
    addOrderGoods(para):Promise<Array<any>> {

       return this.getDB().insertArr(para, "order_goods");
        
    }

    //添加文章内容
    addArticleContent(para):Promise<Array<any>> {
       return this.getDB().insertArr(para, "articles_content");
    }

    //获得活动详情
    getActivityInfo(id):Promise<Array<any>> {
        var sql = "select * from activity where id =" + id;
        return this.getDB().selectBySql(sql);
    }

    //添加浏览次数
    addCountOfView(id,table,num):Promise<Array<any>> {

        return this.getDB().updateObject(table, { "count_of_view": num, "id": id }, ["id"]);
    }
    
    //addArticle
    addArticle(para):Promise<Array<any>> {
        return this.getDB().insertObject(para, "articles");
    }

    //添加评论
    addComment(para):Promise<Array<any>> {
        return this.getDB().insertObject(para, "comment");
    }

    updateArticle(para):Promise<Array<any>> {
        return this.getDB().updateObject("articles", para, ["id"]);
    }
    
}

export = ytRaidersSql;