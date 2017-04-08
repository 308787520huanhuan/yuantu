

//关闭弹出框
$("#close").on('click',function(){
        $("#black-overlay").addClass('hidden');
})

var Tools = {
    hasTime:function(time){
        if(time.indexOf('T') != -1){
            return time.replace('T',' ').replace('Z','');
        }else{
            return time
        }
        
    },
    notHasTime:function(time){
        if(time.indexOf('T') != -1){
            return time.split('T')[0];     
        }else{
            return time
        }
       
    },
    deleteFile:function(url){
        //删除文件
        $.ajax({
            url:'/views/index/deleteFile',
            type: 'POST',
            data: {'url':url},
            success: function(data){
                if(200 === data.code) {
                    console.info("删除成功");
                } else {
                    $.alert("上传失败,请稍后重试");
                }
            },
            error: function(){
                $.alert("抱歉,服务器在打瞌睡,请稍后重试");
            }
        });
    },
    //将毫秒数转换为日期 格式为 yyyy-m-d hh:mm:ss
    getDateTime: function (time) {
        if (time && parseInt(time)) {
            var date = new Date();
            date.setTime(time);

            var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1),
                day = (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate(),
                hour = (date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours(),
                minute = ((date.getMinutes()) < 10) ? ("0" + date.getMinutes()) : date.getMinutes(),
                second = (date.getSeconds()) < 10 ? ("0" + date.getSeconds()) : date.getSeconds();

            return date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        }
        else {
            return "";
        }
    },

    //将毫秒数转换为日期 格式为 yyyy-m-d
    getDate: function (time) {
        if (time && parseInt(time)) {
            var date = new Date();
            date.setTime(time);

            var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
            var day = (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate();

            return date.getFullYear() + "-" + month + "-" + day;
        }
        else {
            return "";
        }
    },
    DateAdd:function(interval,number,date){  
    /* 
    *   功能:实现VBScript的DateAdd功能. 
    *   参数:interval,字符串表达式，表示要添加的时间间隔. 
    *   参数:number,数值表达式，表示要添加的时间间隔的个数. 
    *   参数:date,时间对象. 
    *   返回:新的时间对象. 
    *   var   now   =   new   Date(); 
    *   var   newDate   =   DateAdd( "d ",5,now); 
    *---------------   DateAdd(interval,number,date)   ----------------- 
    */  
        switch(interval)  
        {  
                case   "y "   :   {  
                        date.setFullYear(date.getFullYear()+number);  
                        return   date;  
                }  
                case   "q "   :   {  
                        date.setMonth(date.getMonth()+number*3);  
                        return   date;  
                }  
                case   "m "   :   {  
                        date.setMonth(date.getMonth()+number);  
                        return   date;  
                }  
                case   "w "   :   {  
                        date.setDate(date.getDate()+number*7);  
                        return   date;  
                }  
                case   "d "   :   {  
                        date.setDate(date.getDate()+number);  
                        return   date;  
                }  
                case   "h "   :   {  
                        date.setHours(date.getHours()+number);  
                        return   date;    
                }  
                case   "m "   :   {  
                        date.setMinutes(date.getMinutes()+number);  
                        return   date;   
                }  
                case   "s "   :   {  
                        date.setSeconds(date.getSeconds()+number);  
                        return   date;   
                }  
                default   :   {  
                        date.setDate(d.getDate()+number);  
                        return   date;  
                }  
        }  
    } 
}
