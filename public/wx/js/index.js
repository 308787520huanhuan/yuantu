/**
 * Created by Administrator on 2016/7/15.
 */
var data = new Date();
console.info(data);
var data1 = new Date() * 1;
console.info(data1);
var $pic = $("#pic");
var $num = $("#num");

//构造函数
function Slider(opts) {

  console.info("sadsadasd");

    //构造函数需要的参数
    this.picLi = opts.picLi;
    this.numLi = opts.numLi;

    //长度
    this.len = this.picLi.length;

    //当前所在位置
    this.index = 0;

    //自动轮播
    this.interval();

    //事件
    this.bindDOM();
}

//第一步 -- 自动轮播
Slider.prototype.interval = function () {
    var that = this;
    this.timer = setInterval(function () {
        that.index = (that.index == that.len - 1) ? 0 : (that.index + 1);
        that.show(that.index);
    }, 5000);
};

//显示
Slider.prototype.show = function (num) {
    this.picLi.removeClass("active").eq(num).addClass("active");
    this.numLi.removeClass("aa").eq(num).addClass("aa");
};

//第三步 -- 绑定 DOM 事件
Slider.prototype.bindDOM = function () {

    var self = this;

    //绑定事件
    $.each(self.numLi, function () {
        var $this = $(this);
        console.log($this.index());
    })
};

//初始化Slider 实例
new Slider({
    picLi: $pic.find("li"),
    numLi: $num.find("li")
});
