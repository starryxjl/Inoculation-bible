/*
 * @Author: your name
 * @Date: 2020-03-21 17:44:37
 * @LastEditTime: 2020-04-06 15:11:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myNotes\H5C3\案例\孕育宝典\js\index.js
 */
//首页的iscroll
new IScroll(".home", {
	// click: true
});
var dates = null;//设置ajax请求返回数据为全局变量
var arr = ['yunqian', 'yunzhong', 'chanqian', 'chahou', 'chengzhang', 'fangzhi'];
var brr = ['孕前知识', '孕中知识', '产前知识', '分娩产后', '幼儿成长指标', '幼儿常见病防治'];

var ls = localStorage;
if(!ls.getItem('favNames')){
	ls.setItem('favNames','[]');
}
var favBrr = JSON.parse(ls.getItem('favNames'));
$.each(favBrr,function(index,value){
	$('#favorite').append("<div>"+index+"_"+value+"</div>");
})

//底部页面切换
function bindEvent() {
	$.ajax({
		url: "data/data.json",
		type: "get",
		dataType: "json",
		success: function (data) {
			datas = data;
		}
	})
	
	$(".container").on("click", 'a', function (e) {
		//为a元素绑定click事件
		e.preventDefault();
		var that = $(this).attr("href");
		var id = $(this).attr("id");
		//以下方式为直接给div元素设置style样式
		$(that).css({
			"transition": "all .5s",
			"transform": "translate3d(0,0,0)"
		}).siblings().css({
			"transform": "translate3d(100%,0,0)"
		})
		//以下为mark跟随
		if (e.target.parentNode.nodeName == "NAV" || e.target.parentNode.parentNode.nodeName == "NAV") {
			//index()为获取一个元素的索引值
			var index = $(this).index();

			$('mark').animate({
				left: index * 25 + '%'
			})
		}
		into($(this));

		if (that == "#list") {
			//确定进入列表页
			getId(id);
		}else if(that == "#article"){
			//确定进入文章页

			//根据文章是否已被收藏来确定收藏按钮的颜色
			if($.inArray($('.header-right').attr('title'),favBrr)!=-1){
				$('.header-right').find('i').css('color','rgb(249,205,173)');
			}else{
				$('.header-right').find('i').css('color','blue');
			}
			getRender($(this));
		}

	})
	$('.header-right').on('click',function(){
		if($.inArray($(this).attr('title'),favBrr)!=-1){
			alert('已经收藏过了');
		}else{
			$(this).find('i').css("color","blue");
			addFav($(this).attr('title'));
		}
	})
}
bindEvent();

function addFav(strTitle){
	//添加本地存储数据
	favBrr.push(strTitle);
	ls.setItem('favNames',JSON.stringify(favBrr));
}
function getId(id) {
	//通过id判断是否为列表页链接
	if($.inArray(id,arr) > -1){
		getLoad(id);
	}
}
//给列表页添加内容
function getLoad(id) {
	//注意这里因为id为变量，只能用[]的属性表示方法
	var fenlei = datas[id]["fenlei"];
	var str = "";
	//以下为fenlei数组的遍历，index为索引，val为对应与索引的值，此处为内容对象
	$.each(fenlei, function (index, val) {
		str += '<a href="#article" data-content="'+id+'_' + index+ '"><img src="./img/tu/' + val.img + '" alt=""><p>' + val.title + '</p></a>';
	})

	$("#listIscroll").html(str);
	new IScroll(".list");
}

//文章内容渲染页
function getRender(el){
	var strContent = '';
	var strTitle = '';
	var crr = el.data('content').split('_')
	strContent = datas[crr[0]]["fenlei"][crr[1]].content;
	$('.article-content').html(strContent);
	strTitle =datas[crr[0]]["fenlei"][crr[1]].title;
	$('.header-title').html(strTitle);
	$('.header-right').attr('title',strTitle);
	new IScroll("#article");
	
}

//改变标题及显示隐藏返回箭头等
function into(that) {
	//进入页面
	var title = that.attr('title');
	var fav = $('.header-right');
	var returns = $('#return');
	if (that.attr('href') == '#list') {
		//进入了列表页
		$(".header-title").html(title);
		returns.show();
		returns.attr('href', '#home');
		fav.hide();
	} else if (that.attr('href') == '#home') {
		//进入首页
		$('.header-title').html("孕育宝典");
		returns.hide();
	} else if (that.attr("href") == '#article') {
		fav.show();
		returns.attr('href', '#list');
		//获取id名
		var splits = $(that).data('content').split('_')[0]
		//获取与id对应的索引
		var idx = $.inArray(splits,arr);
		returns.attr('title',brr[idx]);
	}
}