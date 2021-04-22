<template>
	<div class="win-list">
		
		<!-- 顶部导航 -->
		<top-fixed-nav :title="shopName"></top-fixed-nav>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<!-- 窗口列表 -->
			<div class="win-list" style="min-height: 300px;">
				<ul>
					<li v-for="item in winList" @click="toWinDetail(item.winName,item.winId,item.sellerId,item.deliveryMinAmount,item.deliveryFee,item.deliveryMode,item.businessState,item.orderCount,item.commentScore)">
						<img :src="item.winState" class="win-status">
						<div class="win-img"><img :src="item.windowPic"></div>
						<div class="win-info">
							<p class="win-name">{{item.winName}}</p>
							<p class="sell-num"><van-rate v-model="item.commentScore" color="#F4BE42" readonly count="5" /><span>月售{{item.orderCount}}单</span></p>
							<p class="price">
								<span v-show="item.deliveryMinAmount" style="margin-right: 5px;">起送￥{{item.deliveryMinAmount}}</span>
								<span>配送￥{{item.deliveryFee?item.deliveryFee:0}}</span>
							</p>

						</div>
						<p class="win-type">
							
							<span v-bind:class="[item1=='1'?'ws':item1=='2'?'zt':'dd']" v-for="item1 in item.deliveryMode">{{item1=='1'?'外送':item1=='2'?'自提':'到店用餐'}}</span>
						</p>
					</li>
				</ul>
			</div>
		</van-pull-refresh>
		
	</div>
</template>

<script type="text/javascript">
	var pageNum=1;//页码
	export default{
		data:function(){
			return{
				sellerId:'',//商家id
				shopName:'',//标题
				shopId:this.$route.query.shopId,//店铺传递的店铺id
				shopName:this.$route.query.shopName,//店铺传递的店铺名称
				winList:[],//窗口列表
				star:3,//评分
				// winStatus:'./static/images/icon/yuding_icon.png',//图片
				sellerState:[],//商家状态
				isLoading:false,//上拉刷新
			};
		},
		components:{
			
		},
		mounted() {
			 // 滚动到底加载更多
			window.addEventListener('scroll',this.reachBottom)			  
		},
		// 销毁监听滚动条事件
		destroyed(){
		    window.removeEventListener('scroll', this.reachBottom)
			console.log('销毁')
		  },
		methods:{
			// 滚动到底加载更多
			reachBottom(){
				  //变量scrollTop是滚动条滚动时，距离顶部的距离
				  let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
				  //变量windowHeight是可视区的高度
				  let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
				  //变量scrollHeight是滚动条的总高度
				  let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
					//滚动条到底部的条件
					if(scrollTop+windowHeight >= scrollHeight){
						pageNum++;
						this.getWinList(pageNum);
						console.log('到底了',pageNum)
					}
			},
			onRefresh() {
				  setTimeout(() => {
					  this.winList=[]
					  pageNum=1;
					  this.getWinList(pageNum);
					this.$toast('刷新成功');
					this.isLoading = false;
				  }, 1000);
				},
			// 获取窗口列表
			getWinList(pageNum){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
			  _this.$axios({
				  method: 'get',
				  url: port+'/v1/ordermeal/queryWindowByShopId',
				  params: {
				    shopId:_this.shopId,
					pageNum:pageNum,
					pageSize:10
				  }
				}).then(function(data){
					console.log('窗口列表',data);

					load.clear();//关闭加载
					if (data.data.status==200) {
						if (data.data.data.list.length<=0) {
							_this.$toast('暂无更多信息');
						}else {
							var arr=data.data.data.list;
							for (var i=0;i<arr.length;i++) {
								arr[i].commentScore=Math.round(arr[i].commentScore)//四舍五入评价
								if (arr[i].deliveryMode) {
									arr[i].deliveryMode=arr[i].deliveryMode.split(',');//商户状态字符串转为数组
								}
								// 窗口状态：businessState!=1为营业中，
								if(arr[i].businessState!=1){
									// 如果businessState!=1，再判断所有时间段是否都没选，都没选为营业，
									if(!arr[i].beginTime1&&!arr[i].endTime1&&!arr[i].beginTime2&&!arr[i].endTime2&&!arr[i].beginTime3&&!arr[i].endTime3){
										arr[i].businessState=0;
										arr[i].winState='./static/images/icon/yuding_icon.png'
										console.log(1)
									}else{
										// 否则判断系统时间是否在设置的时间段内，如果有一个在时间段内，则设置窗口为营业
										if(isDuringDate(arr[i].beginTime1,arr[i].endTime1)||isDuringDate(arr[i].beginTime2,arr[i].endTime2)||isDuringDate(arr[i].beginTime3,arr[i].endTime3)){
											console.log(2)
											arr[i].businessState=0;
											arr[i].winState='./static/images/icon/yuding_icon.png'
										}else{
											// 否则设置窗口营业状态为休息
											console.log(3)
											arr[i].businessState=1;
											arr[i].winState='./static/images/icon/rest_icon.png'
										}
									}
								}else{
									alert(4)
									arr[i].businessState=1;
									arr[i].winState='./static/images/icon/rest_icon.png'
								}
								
								if (!arr[i].windowPic) {
									arr[i].windowPic='./static/images/icon/default1.png';
								}else{
									arr[i].windowPic=sellerPort+arr[i].windowPic
								}
								
								_this.winList.push(arr[i])
							}
							
						}
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请重新登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					console.log(error);
				});
			},


			// 跳转到窗口详情（窗口名称、窗口id、商家id、起送、配送、配送类型（外送、自提、到店用餐），窗口营业状态（0可预订其他休息），月销量，星级分数）
			toWinDetail(winName,winId,sellerId,deliveryMinAmount,deliveryFee,deliveryMode,winState,orderCount,starScore){
				console.log(winName,winId,sellerId,deliveryMinAmount,deliveryFee,deliveryMode)
				this.$router.push({path:'/winDetail',query:{winName:winName,winId:winId,sellerId:sellerId,deliveryMinAmount:deliveryMinAmount,deliveryFee:deliveryFee?deliveryFee:0,deliveryMode:deliveryMode,winState:winState,orderCount:orderCount,starScore:starScore}});
				
			}
			
		},
		created:function(){
			pageNum=1;
			this.getWinList(pageNum);
			
		}
	};
</script>
<style type="text/css">
.win-list li{position: relative;background: #fff;padding: 10px;overflow: hidden;margin: 10px;padding-right: 50px;}
.win-list li .win-status{position: absolute;width: 50px;height: 50px;right: 0;top: 0;}
.win-list li .win-img{width: 75px;height: 75px;background: #eee;float: left;margin-right: 10px;}
.win-list li .win-img img{width: 75px;height: 75px;}
.win-list .win-name{font-size: 16px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;height: 20px;line-height: 20px;}
.win-list .sell-num{font-size: 12px;color: #999;margin: 5px 0;}
.win-list .sell-num span{margin-left: 4px;}
.win-list .sell-num,.win-list .price{font-size: 12px;color: #999;}
.win-list .win-type{font-size: 12px;position: absolute;bottom: 12px;right: 0;}
.win-list .win-type span{padding: 0 4px;margin-right: 2px;}
.win-list .win-type span.zt{background: #FFF5E8;color: #ECB061;}
.win-list .win-type span.ws{background: #F2FFE8;color: #86C669;}
.win-list .win-type span.dd{background: #E8F4FF;color: #69A1C6;}
</style>