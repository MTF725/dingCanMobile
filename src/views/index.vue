<template>
	<div class="index" style="padding-bottom: 40px;">
		
		<!-- 顶部搜索 -->
		<div style="height: 40px;">
			<div class="index-search-nav">
				<div class="address-wrap">
					<i class="iconfont icon-wodedizhi"></i>
					<p class="add">{{address}}</p>
				</div>
				<div class="address-search">
					<i class="iconfont icon-fangdajing" @click="searchBtn()"></i>
					<input type="text" autocomplete="off" placeholder="搜索你喜爱的菜品" v-model="searchText">
				</div>
			</div>
		</div>
		
		<!-- 下拉刷新 -->
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
		  
			<!-- 轮播图 -->
			<div class="slide-wrap">
				<van-swipe :autoplay="3000" indicator-color="white">
				  <van-swipe-item><img src="../../public/static/images/slide1.png" width="100%"></van-swipe-item>
				  <van-swipe-item><img src="../../public/static/images/slide2.png" width="100%"></van-swipe-item>
				  <van-swipe-item><img src="../../public/static/images/slide3.png" width="100%"></van-swipe-item>
				</van-swipe>
			</div>

			<div class="shop-nav-wrap">
				<van-grid :border="false" :column-num="4" clickable >
				  <van-grid-item v-for="(item,index) in shopList" @click="toWinList(index,item.shopId,item.shopName)" :data-id="item.shopId" :data-shopname="item.shopName">
					<img :src="item.shopPic">
					<p class="shop-name">{{item.shopName}}</p>
				  </van-grid-item>
				</van-grid>
			</div>

			<div class="middle-img" style="margin:0 10px;position: relative;top: -10px;">
				<img src="../../public/static/images/index_img.png" width="100%">
			</div>
			
			<div class="news-post">
				<div class="news-item" v-for="item in newsList">
					<van-cell-group>
					  <van-cell :title="item.kindName" />
					  <van-swipe style="height: 40px;" class="my-swipe" :autoplay="3000" indicator-color="white" vertical>
					    <van-swipe-item v-for="newsItem in item.newsList"><van-cell v-on:click="openNewsDetail(newsItem.newsId)" title-class="cell-title" :title="newsItem.title" /></van-swipe-item>
					  </van-swipe>
					</van-cell-group>
				</div>
			</div>
		
		</van-pull-refresh>
		
		<!-- 打开微信弹窗 -->
		<van-popup :close-on-click-overlay="false" :style="{width:'80%', height: '170px',borderRadius:'10px'}" v-model="openWeXinPopup">
			<div class="open-wexin-wrap">
				<p class="tit">温馨提示</p>
				<p class="txt">即将打开微信</p>
			</div>
			<a href="weixin://" class="comfirm-btn" v-on:click="closeBrowser">确定</a>
		</van-popup>
		
		<!-- 新闻公告详情 -->
		<van-popup position="right" :style="{width:'100%', height: '100%'}" v-model="newsDetailPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="newsDetailPopup=false"></span>公告详情
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<h1 class="newsdetail-tit">{{newsDetail.title}}</h1>
				<div class="newsdetail-content" v-html="newsDetail.content">{{newsDetail.content}}</div>
			</div>
		</van-popup>
		
	</div>
</template>

<script type="text/javascript">
	
	export default{
		data:function(){
			return{
				address:'',//学校地址
				searchText:'',//搜索框内容
				shopList:[],//店铺列表
				isLoading:false,
				openWeXinPopup:false,
				newsDetailPopup:false,//新闻公告
				newsList:[],//新闻公告
				newsDetail:{},//公告详情
			};
		},
		methods:{
			// 非微信浏览器下关闭当前浏览器标签
			closeBrowser(){
				window.opener=null;
				window.open('','_self');
				window.location.href="about:blank";
				window.close(); 
			},
			onRefresh() {
			      setTimeout(() => {
					  this.getShopList(localStorage.getItem('cId'));
			        this.$toast('刷新成功');
			        this.isLoading = false;
			      }, 1000);
			    },
			// 点击搜索
			searchBtn:function(){
				var _this=this;
				if(_this.searchText==''){
					_this.$toast('请输入菜品名称');
					return;
				}
				_this.$router.push({path:'/searchGoods',query:{searchText:_this.searchText}})
			},
			// 打开新闻详情
			openNewsDetail(newsId){
				var _this=this;
				_this.newsDetailPopup=true;
				
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/ordermeal/getNews',
					  params: {
						newsId:newsId
					  }
					}).then(function(data){
						console.log('新闻公告详情',data)
						if (data.data.status==200) {
							_this.newsDetail=data.data.data;
						}
						
					}).catch(function(error){
						console.log(error);
					});
				
				console.log(newsId)
			},
			// 获取新闻公告
			getNewsList(){
				var _this=this
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/ordermeal/queryNewsKindBycId',
					  params: {
						cId:localStorage.getItem('cId')
					  }
					}).then(function(data){
						console.log('新闻公告',data)
						if (data.data.status==200) {
							_this.newsList=data.data.data;
						}
						
					}).catch(function(error){
						console.log(error);
					});
			  
			},
			// 查询单位信息，用来查cId
			getUnitNo(no){
				localStorage.setItem('cNo',no);
				var _this=this;
				
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/ordermeal/queryCompanyBycNo',
					  params: {
						cNo:no
					  }
					}).then(function(data){
						console.log('查询单位信息',data)
						if (data.data.status==200) {
							_this.address=data.data.data.cName;
							localStorage.setItem('cId',data.data.data.cId)
							_this.getShopList(localStorage.getItem('cId'));//先通过参数编号查询cId，再拿到cId去当前单位店铺信息
							_this.getNewsList();//新闻公告
							// 存储单位信息
							localStorage.setItem('unitInfo',JSON.stringify(data.data.data))
						}
						
					}).catch(function(error){
						console.log(error);
					});
			},
			// 获取商铺列表
			getShopList(cId){
				var _this=this
					var load=_this.$toast.loading({
					  message: '加载中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'get',
						  url: port+'/v1/ordermeal/queryShopBycId',
						  params: {
							cId:cId
						  }
						}).then(function(data){
							console.log('店铺列表',data)
							load.clear();
							if (data.data.status==200) {
								_this.shopList=data.data.data
								_this.shopList.forEach(function(a){
									if (!a.shopPic) {
										a.shopPic='./static/images/icon/default1.png';
									}else{
										a.shopPic=winPort+a.shopPic;
									}
								})
								
							}
							
						}).catch(function(error){
							console.log(error);
						});
			  
			},

			// 跳转到窗口列表,把店铺id传递过去
			toWinList(index,id,shopName){
				this.$router.push({path:'/winList',query:{shopId:id,shopName:shopName}})
			}
			
		},
		created:function(){
			var _this=this;
			
			// 判断如果不是在微信浏览器，则打开提示弹窗
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i)!="micromessenger"){
				  // _this.openWeXinPopup=true;
			}
			
			var cNo=getUrlKey('cNo');//获取url编号参数
			if(cNo){
				localStorage.setItem('cNo',cNo);
			}
			_this.getUnitNo(localStorage.getItem('cNo'))//传入单位编号
		}
	}
</script>
<style type="text/css">

/* 首页顶部搜索 */
.index-search-nav{position: fixed;width: 100%;left: 0;top: 0;background: #F4BE42;height: 40px;line-height: 40px;padding-left: 150px;box-sizing: border-box;z-index: 3;}
.index-search-nav .address-wrap{position: absolute;padding-left: 40px;left: 0;top: 0;width: 32%;}
.index-search-nav .address-wrap .iconfont{position: absolute;left: 0;top: 0;width: 40px;height: 40px;text-align: center;line-height: 40px;color: #fff;}
.index-search-nav .address-wrap .add{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 12px;}
.index-search-nav .address-search{border-radius: 40px;overflow: hidden;background: #fff;height: 30px;top: 5px;padding-left: 30px;box-sizing: border-box;position: absolute;right: 10px;width: 55%;}
.index-search-nav .address-search .iconfont{position: absolute;left: 0;top: 0;width: 30px;height: 30px;text-align: center;line-height: 30px;color: #F4BE42;}
.index-search-nav .address-search .iconfont:active{background: #f9f9f9;}
.index-search-nav .address-search input{width: 80%;height: 100%;border: none;position: absolute;}
.index-search-nav .address-search input::-webkit-input-placeholder{font-size: 12px;color: #999;}

.shop-nav-wrap{background: #fff;margin: 0 10px;position: relative;top: -20px;border-radius: 6px;overflow: hidden;}
.shop-nav-wrap img{width: 50px;height: 50px;}
.shop-nav-wrap .shop-name{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: block;width: 58px;text-align: center;color: #666;margin-top: 4px;font-size: 12px;}
.open-wexin-wrap{text-align: center;}
.open-wexin-wrap .tit{font-size: 18px;padding: 20px 0;}
.comfirm-btn{position: absolute;width: 100%;left: 0;bottom: 0;padding: 15px 0;text-align: center;font-size: 18px;border-top: 1px solid #eee;color: #1989fa;}
.comfirm-btn:active{background: #f9f9f9;}

.news-post{margin: 0 10px 10px 10px;}
.news-post .van-cell{display: block;}
.news-post .van-cell span{display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.news-post .news-item{margin-bottom: 10px;border-radius: 10px;overflow: hidden;}
.news-post .cell-title{color: #999;}

.newsdetail-tit{text-align: center;font-size: 16px;font-weight:bold;margin: 10px;}
.newsdetail-content{margin: 10px;}
.newsdetail-content img{max-width: 100%!important;}
</style>