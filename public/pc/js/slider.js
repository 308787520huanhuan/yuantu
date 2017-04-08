/**
 * Created by Administrator on 2016/7/15.
 */
 var $target = $("#fh5co-hero");

//构造函数
function Slider(opts) {

    //构造函数需要的参数
    this.target = opts.target;
    this.numLi = opts.numLi;

    //长度
    this.len = 3;

    //当前所在位置
    this.index = 0;

    //this.show(this.index);

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
    }, 10000);
};

//显示
Slider.prototype.show = function (num) {
    var srcUrl = "images/banner"+num+".png";
    this.target.css("background-image","url("+srcUrl+")");
    this.numLi.removeClass("aa").eq(num).addClass("aa");
};


//第三步 -- 绑定 DOM 事件
Slider.prototype.bindDOM = function ()
{
    var self = this;
    self.numLi.on("click",function()
    {
      var $this = $(this);
      self.index = $this.index();
      clearInterval(self.timer);

      //显示点击的那张
      self.show(self.index);
      
      //自动轮播
      self.interval();
    })
};

//初始化Slider 实例
new Slider({
    target: $target,
    numLi: $target.find("#num li")
});
