<template>
	<div>
		<!-- 顶部导航 -->
		<top-fixed-nav :title="title"></top-fixed-nav>
		
			<!-- 下拉刷新 -->
		<van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
			<div class="order-list-wrap" style="min-height: 300px;">
				<p v-if="orderList.length<=0" style="text-align: center;margin: 15px;">暂无订单</p>
				<ul>
					<li v-for="item in orderList" v-on:click="openOrderDetail(item.orderNo)">
						<div class="win-tit-wrap">
							<img :src="item.picUrl" alt="">
							<p class="win-name">{{item.sellerWinName}}</p>
							<span class="state">{{item.orderType}}</span>
						</div>
						<div class="order-list">
							<p v-for="order in item.orderGoodses">{{order.gName}}*{{order.buyCounter}}</p>
						</div>
						<div class="order-total-wrap"><span>共{{item.goodsNum}}件商品</span><span>总计<i class="total">￥{{item.orderMode==2?item.totalAmount:item.totalAmount-item.deliveryFee}}</i></span></div>
						<div class="order-btn">
							<span v-if="item.orderState==1" v-on:click.stop="goPay(item.orderNo,item.sellerId,item.totalAmount)">立即支付</span>
							<span v-if="item.orderState==5||item.orderState==8" v-on:click.stop="cuiDan(item.orderNo)">催单</span>
							<span v-if="item.orderState==8" v-on:click.stop="confirmService(item.orderNo)">确认送达</span>
							<span v-if="item.orderState==9" v-on:click.stop="openAssessPopup(item.orderNo,item.picUrl,item.sellerWinName)">立即评价</span>
						</div>
					</li>
				</ul>
			</div>
		</van-pull-refresh>
		
		<!-- 订单详情 -->
		<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="orderDetailPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="orderDetailPopup=false"></span>订单详情
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="order-detail">
					<div class="order-detail-top" style="margin-bottom: -20px;">
						<p v-on:click="openOrderTrack(orderDetailData.orderNo)">订单跟踪 ></p>
					</div>
					<div class="order-detail-top" v-if="orderDetailData.orderState==1">
						<p>等待支付</p>
						<!-- <p>请在15分钟内完成支付，超时将自动取消。</p>
						<p>等待支付 <span class="time">15:00</span></p> -->
						
						<div class="big-btn-wrap">
							<van-button type="default" size="small" v-on:click="cancalOrder(orderDetailData.orderNo)">取消订单</van-button>
							<van-button type="default" size="small" color="#FFBD27" style="margin-left: 20px;" v-on:click="goPay(orderDetailData.orderNo,orderDetailData.sellerId,orderDetailData.totalAmount,true)">立即支付</van-button>
						</div>
					</div>
					
					<div class="my-order-list" style="margin: 10px;border-radius: 6px;overflow: hidden;">
						<div class="seller-info">
							<img :src="orderDetailData.picUrl" alt="">
							<p class="seller-name">{{orderDetailData.sellerWinName}}</p>
							<p>{{orderDetailData.sellerWinAddress}}</p>
						</div>
						<ul>
							<li v-for="item in orderDetailData.orderGoodses">
								<p class="my-order-name"><img :src="item.gPic" alt="">{{item.gName}}*{{item.buyCounter}}</p>
								<p class="price">￥{{item.totalPrice}}</p>
							</li>
						</ul>
						<div class="send-wrap">
							<p v-show="sendAddress.mealMode==2"><span>配送费</span><span>￥{{orderDetailData.deliveryFee}}</span></p>
							<p><span>环保费</span><span>￥{{orderDetailData.totalGreenMoney}}</span></p>
						</div>
						<p class="total-price">小计<span>￥{{sendAddress.mealMode==2?orderDetailData.totalPrice:orderDetailData.totalPrice-orderDetailData.deliveryFee}}</span></p>
						<a :href="'tel:'+orderDetailData.sellerPhone" class="seller-phone"><i class="iconfont icon-dianhua"></i>商家电话</a>
					</div>
					
					<div style="margin: 10px;border-radius: 6px;overflow: hidden;">
						<van-cell-group>
						  <van-cell title="订餐方式" :value="sendAddress.mealMode==1?'自提':sendAddress.mealMode==2?'外送':'到店用餐'" />
						  <van-cell title="期望送达时间" :value="sendAddress.arrivalTime" />
						  <van-cell :title="sendAddress.mealMode==1?'自提地址':sendAddress.mealMode==2?'配送地址':'用餐地址'" :value="sendAddress.address" />
						</van-cell-group>
					</div>
					<div style="margin: 10px;border-radius: 6px;overflow: hidden;">
						<van-cell-group>
						  <van-cell value-class="cell-value" title="订单号" :value="orderDetailData.orderNo" />
						  <van-cell title="订单提交日期" :value="orderDetailData.createTime" />
						  <van-cell title="备注" :value="orderDetailData.remark" />
						</van-cell-group>
					</div>
				</div>
			</div>
		</van-popup>
		
		<!-- 订单评价 -->
		<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="assessPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="assessPopup=false"></span>订单评价
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="assess-item">
					<p class="head-img"><img src="../../public/static/images/icon/default_head.png">{{sendName}}</p>
					<div class="pleased-wrap">
						<span :class="{'active':pleasedTab==1}" v-on:click="pleasedTabClick(1)"><i class="iconfont icon-manyi"></i>满意</span>
						<span :class="{'active':pleasedTab==2}" v-on:click="pleasedTabClick(2)"><i class="iconfont icon-feichangbumanyi"></i>不满意</span>
					</div>
					<div class="assess-msg">
						<span v-on:click="selectSendAssess($event)" v-for="sendAssessItem in sendAssessArr">{{sendAssessItem.commentWordText}}</span>
					</div>
				</div>
				<div class="assess-item">
					<p class="head-img"><img :src="assessWinPic">{{assessWinName}}</p>
					<div class="assess-star-wrap">
						<div class="star-assess" v-show="assessStarArr.length>0">评价：<van-rate v-model="assessStar" v-on:change="assessStarChange" /><span class="assessText">{{assessStarText}}</span></div>
						<div class="star-assess" v-show="tasteStarArr.length>0">口味：<van-rate v-model="tasteStar" v-on:change="tasteStarChange" /><span class="assessText">{{tastStarText}}</span></div>
						<div class="star-assess" v-show="packStarArr.length>0">包装：<van-rate v-model="packStar" v-on:change="packStarChange" /><span class="assessText">{{packStarText}}</span></div>
					</div>
					<div class="assess-remark">
						<van-field
						  v-model="assessRemark"
						  rows="3"
						  type="textarea"
						  maxlength="100"
						  placeholder="请输入留言"
						/>
					</div>
					<div class="upload-img">
						<van-uploader v-model="fileList" multiple :max-count="4" />
					</div>
				</div>
				<div class="assess-item">
					<van-checkbox checked-color="#F4BE42" v-model="nmChecked" v-on:change="nmCheckedChange">匿名评价</van-checkbox>
				</div>
				<div class="big-btn-wrap">
					<van-button block color="#F4BE42" v-on:click="submitBtn">提交</van-button>
				</div>
			</div>
		</van-popup>
		
		<!-- 订单跟踪 -->
		<van-popup :duration="0" position="bottom" :style="{width:'95%', height: '60%',background:'transparent',transform:'translateX(-50%)',marginLeft:'50%'}" v-model="orderTrackPopup">
			<div class="order-track-wrap">
				<p class="order-track-tit">订单跟踪</p>
				<div class="order-track-main">
					<ul class="order-track-list">
						<li v-for="item in orderTrackData">
							<div class="order-track-item">
								<span class="state">{{item.stateName}}</span><span class="date">{{item.createTime}}</span>
							</div>
							<div class="order-track-send-phone">
								<span>{{item.deliveryPersonName}}</span>
								<a :href="'tel:'+item.deliveryPersonPhone">{{item.deliveryPersonPhone}}</a>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<p class="order-track-cancel" v-on:click="orderTrackPopup=false">关闭</p>
		</van-popup>
	</div>

</template>

<script type="text/javascript">
	var userId='';//用户id
	var pageNum=1;//页码
	export default{
		data:function(){
			return{
				title:'订单',
				orderList:[],//订单列表
				defaultImg:'./static/images/icon/default1.png',//默认图片
				orderDetailPopup:false,//订单详情
				orderDetailData:'',//订单详情
				sendAddress:'',//配送地址详情
				refreshLoading: false,//下拉刷新
				assessPopup:false,//订单评价
				sendChecked:false,//配送员匿名
				pleasedTab:0,//满意、不满意切换
				pleasedType:'',//配送员评价类型（满意、不满意）
				assessMsg:[],//选择的满意用语
				assessRemark:'',//留言
				nmChecked:false,//匿名评价
				sendPleasedMsg:[],//配送员满意用语
				sendDispleasedMsg:[],//配送员不满意用语
				fileList:[],//上传图片
				sendAssessArr:[],//配送员评价用语
				assessWinPic:'',//评价里当前窗口图片
				assessWinName:'',//评价里当前窗口名
				sendName:'',//评价里配送员
				sendPersonId:'',//配送员id
				userId:'',//用户id
				sellerId:'',//商家id
				orderNo:'',//订单号
				assessStar:0,//评价星级
				tasteStar:0,//口味星级
				packStar:0,//包装星级
				assessStarArr:[],//评价用语
				tasteStarArr:[],//口味用语
				packStarArr:[],//包装用语
				assessStarText:'',//评价星级提示用语
				tastStarText:'',//口味星级提示用语
				packStarText:'',//包装星级提示用语
				orderTrackPopup:false,//订单跟踪
				orderTrackData:[],//订单跟踪
				orderStatus:'',//支付时查询的订单状态
				// orderWay:'',//订单方式1：自提2：外送，3：到店用餐
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
			// 获取订单详情
			getOrderDetail(orderNo){
				var _this=this;
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/order/get',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    orderNo:orderNo
				  }
				}).then(function(data){
					console.log('订单详情',data)
					if (data.data.status==200) {
						_this.orderStatus=data.data.data.orderState//只有orderState为1时订单状态为用户已提交订单，才可以付款
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					_this.$toast('操作失败');
					console.log(error);
				});
			},
			// 打开订单跟踪
			openOrderTrack(orderNo){
				var _this=this;
				_this.orderTrackPopup=true;
				console.log(orderNo)
				
				
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/order/getStateInfo',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    orderNo:orderNo
				  }
				}).then(function(data){
					console.log('订单跟踪',data)
					if (data.data.status==200) {
						_this.orderTrackData=data.data.data;
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					_this.$toast('操作失败');
					console.log(error);
				});
			},
			// 评价星级点击事件
			assessStarChange(e){
				if(this.assessStarArr[e-1]){
					this.assessStarText=this.assessStarArr[e-1].commentItemContent
				}else{
					this.assessStarText='';
				}
			},
			// 口味星级点击事件
			tasteStarChange(e){
				if(this.tasteStarArr[e-1]){
					this.tastStarText=this.tasteStarArr[e-1].commentItemContent
				}else{
					this.tastStarText='';
				}
			},
			// 包装星级点击事件
			packStarChange(e){
				if(this.packStarArr[e-1]){
					this.packStarText=this.packStarArr[e-1].commentItemContent
				}else{
					this.packStarText='';
				}
			},
			// 匿名评价change
			nmCheckedChange(e){
				if(e){
					userId='';
				}else{
					userId=this.userId;
				}
				
				console.log(userId)
			},
			// 满意不满意切换
			pleasedTabClick(e){
				console.log(e)
				var _this=this;
				_this.pleasedTab=e;
				if(_this.pleasedTab==1){
					_this.pleasedType='满意';
				}
				if(_this.pleasedTab==2){
					_this.pleasedType='不满意';
				}
				_this.getSendAssess(e);
				var assessItem=document.querySelectorAll('.assess-msg span');
				for (var i=0;i<assessItem.length;i++) {
					assessItem[i].className='';
				}
				},
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
						this.getOrder(pageNum)
						console.log('到底了',pageNum)
					}
			},
			// 点击立即评价
			openAssessPopup(orderNo,winPic,winName){
				console.log(orderNo,winPic,winName)
				var _this=this;
				
				
				
				_this.assessPopup=true;
				_this.getSellerAssessMsg();//商家星级评价
				
				
				// 设置评价里窗口图片和窗口名
				_this.assessWinPic=winPic?winPic:'./static/images/icon/default1.png';
				_this.assessWinName=winName;
				
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/order/get',
					  headers:{'token':localStorage.getItem('token')},
					  params: {
						orderNo:orderNo
					  }
					}).then(function(data){
						console.log('评价-订单详情',data)
						if (data.data.status==200) {
							_this.sendName=data.data.data.deliveryPersonName;//配送员姓名
							_this.sendPersonId=data.data.data.deliveryPersonId;//配送员id
							_this.userId=data.data.data.personId;//用户id
							userId=data.data.data.personId;
							_this.sellerId=data.data.data.sellerId;//商家id
							_this.orderNo=data.data.data.orderNo;
						}
						if(data.data.status==600){
							_this.$toast(data.data.msg);
						}
						if(data.data.status==601||data.data.status==602||data.data.status==603){
							_this.$toast('请先登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						}
					}).catch(function(error){
						console.log(error);
					});
			},
			// 点击配送员评价用语
			selectSendAssess(e){
				if(e.target.className==''){
					e.target.className='active'
				}else{
					e.target.className=''
				}
				
				
			},
			// 获取配送员评价用语
			getSendAssess(type){
				var _this=this;
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/order/getCommentWord',
					  headers:{'token':localStorage.getItem('token')},
					  params: {
						cId:JSON.parse(localStorage.getItem('userInfo')).cId,
						commentTypeId:type//用语类型（0全部，1满意，2不满意）
					  }
					}).then(function(data){
						
						if (data.data.status==200) {
							_this.sendAssessArr=[];
							_this.sendAssessArr=data.data.data
							console.log('配送员评价用语',_this.sendAssessArr)
							
							
						}
						if(data.data.status==600){
							_this.$toast(data.data.msg);
						}
						if(data.data.status==601||data.data.status==602||data.data.status==603){
							_this.$toast('请先登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						}
					}).catch(function(error){
						console.log(error);
					});
			},
			// 获商家评价
			getSellerAssessMsg(){
				var _this=this;
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/order/getCommentItem',
					  headers:{'token':localStorage.getItem('token')},
					  params: {
						cId:JSON.parse(localStorage.getItem('userInfo')).cId,
						commentTypeId:0
					  }
					}).then(function(data){
						console.log('商家评价用语',data)
						if (data.data.status==200) {
							// 评价、口味、包装定义变量，下面排序赋值用
							var assessStarArr=[];
							var tasteStarArr=[];
							var packStarArr=[];
							// 评价、口味、包装先清空
							_this.assessStarArr=[];
							_this.tasteStarArr=[];
							_this.packStarArr=[];
							if(data.data.data.length>0){
								for (var i=0;i<data.data.data.length;i++) {
									// 评价用语单独抽离
									if(data.data.data[i].commentTypeId==1){
										assessStarArr.push({commentItemScore:data.data.data[i].commentItemScore,commentItemContent:data.data.data[i].commentItemContent})
									}
									// 口味用语抽离
									if(data.data.data[i].commentTypeId==2){
										tasteStarArr.push({commentItemScore:data.data.data[i].commentItemScore,commentItemContent:data.data.data[i].commentItemContent})
									}
									// 包装用语抽离
									if(data.data.data[i].commentTypeId==3){
										packStarArr.push({commentItemScore:data.data.data[i].commentItemScore,commentItemContent:data.data.data[i].commentItemContent})
									}
								}
								
								// 对评价根据分数排序
								_this.assessStarArr=assessStarArr.sort(function(a,b){
									return a.commentItemScore-b.commentItemScore
								})
								// 对口味评价根据分数排序
								_this.tasteStarArr=tasteStarArr.sort(function(a,b){
									return a.commentItemScore-b.commentItemScore
								})
								// 对包装评价根据分数排序
								_this.packStarArr=packStarArr.sort(function(a,b){
									return a.commentItemScore-b.commentItemScore
								})
								
								console.log('评价：',_this.assessStarArr,'口味：',_this.tasteStarArr,'包装',_this.packStarArr)
							}
						}
						console.log('满意：',_this.sendPleasedMsg,'不满意：',_this.sendDispleasedMsg)
						if(data.data.status==600){
							_this.$toast(data.data.msg);
						}
						if(data.data.status==601||data.data.status==602||data.data.status==603){
							_this.$toast('请先登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						}
					}).catch(function(error){
						console.log(error);
					});
			},
			// 提交评价
			submitBtn(){
				var _this=this;
				var starAssess=[];//星级评价
				// 如果有评价项
				if(_this.assessStarArr.length>0){
					starAssess.push({commentTipContent:_this.assessStarText,commentTypeId:"1",commentTypeName:"评价",pId:JSON.parse(localStorage.getItem("userInfo")).pId,score:_this.assessStar,sellerId:_this.sellerId,orderNo:_this.orderNo})
				}
				// 如果有口味评价项
				if(_this.tasteStarArr.length>0){
					starAssess.push({commentTipContent:_this.tastStarText,commentTypeId:"2",commentTypeName:"口味",pId:JSON.parse(localStorage.getItem("userInfo")).pId,score:_this.tasteStar,sellerId:_this.sellerId,orderNo:_this.orderNo})
				}
				// 如果有包装评价项
				if(_this.packStarArr.length>0){
					starAssess.push({commentTipContent:_this.packStarText,commentTypeId:"3",commentTypeName:"包装",pId:JSON.parse(localStorage.getItem("userInfo")).pId,score:_this.packStar,sellerId:_this.sellerId,orderNo:_this.orderNo})
				}
				
				console.log('星级提交',starAssess)
				var formData=new FormData();
				var sendAssessMsg=[];//配送员评价用语
				var imgArr=[];//上传图片
				for (var i=0;i<this.fileList.length;i++) {
					imgArr.push(this.fileList[i].file)
					formData.append('files',this.fileList[i].file)
				}
				// console.log('上传图片',imgArr)
				
				// 获取选中的配送员评价用语
				var assessItem=document.querySelectorAll('.assess-msg span');
				for (var i=0;i<assessItem.length;i++) {
					if(assessItem[i].className=='active'){
						sendAssessMsg.push(assessItem[i].innerHTML)
					}
				}
				
				
				if(sendAssessMsg.length==0&&imgArr.length==0&&_this.assessRemark==""){
					console.log('到这了');
					_this.$toast('您已放弃评价')
					_this.assessPopup=false;
					return;
				}
				
				
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
					  method: 'post',
					  url: port+'/v1/order/comment',
					  headers:{'token':localStorage.getItem('token')},//
					  data:formData,//文件
					  params: {
						  orderNo:_this.orderNo,
						  deliveryPersonId:_this.sendPersonId,//配送员id
						  commentWordTypeId:_this.pleasedTab,//评语所属类型id（满意1，不满意2）
						  commentWordTypeName:_this.pleasedType,//评语所属类型名称（满意，不满意）
						  commentWords:sendAssessMsg.toString(),//评语，格式:词语,词语
						  pId:userId,//用户id
						  sellerId:_this.sellerId,//商家id
						  commentContent:_this.assessRemark,//评论内容
						  sellerItemComments:JSON.stringify(starAssess).substring(1,JSON.stringify(starAssess).length-1),//商家星级评论项，去掉前后中括号
						  goodsComments:'',
					  }
					}).then(function(data){
						console.log('提交评价',data)
						load.clear();
						if (data.data.status==200) {
							_this.$toast('已评价');
							pageNum=1;
							_this.orderList=[];
							
							_this.assessPopup=false;
							_this.getOrder(pageNum);
							
							setTimeout(()=>{
								location.reload()
							},1000)
							
						}
						if(data.data.status==600){
							_this.$toast(data.data.msg);
						}
						if(data.data.status==601||data.data.status==602||data.data.status==603){
							_this.$toast('登录过期，请登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						}
					}).catch(function(error){
						console.log(error);
					});
				
			},
			// 下拉刷新
			 onRefresh() {
			       pageNum=1;
			       this.orderList=[];
			       this.getOrder(pageNum);
				   this.refreshLoading = false;
				  
			    },
			// 确定送达
			confirmService(orderNo){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
					  method: 'post',
					  url: port+'/v1/order/arrive',
					  headers:{'token':localStorage.getItem('token')},
					  params: {
						orderNo:orderNo,
					  }
					}).then(function(data){
						console.log('确定送达',data)
						load.clear();
						if (data.data.status==200) {
							_this.$toast('已确认送达');
							setTimeout(()=>{
								pageNum=1;
								_this.orderList=[];
								_this.getOrder(pageNum);
							},1000)
						}
						if(data.data.status==600){
							_this.$toast(data.data.msg);
						}
						if(data.data.status==601||data.data.status==602||data.data.status==603){
							_this.$toast('登录过期，请登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						}
					}).catch(function(error){
						console.log(error);
						_this.$toast('操作失败');
					});
			},
			// 查询地址详情
			getAddress(orderNo){
				var _this=this;
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/order/getOrderAddress',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    orderNo:orderNo,
				  }
				}).then(function(data){
					if (data.data.status==200) {
						_this.sendAddress=data.data.data;
						console.log('订单配送地址详情',_this.sendAddress)
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					_this.$toast('操作失败');
					console.log(error);
				});
			},
			// 催单
			cuiDan(orderNo){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				
				_this.$axios({
				  method: 'post',
				  url: port+'/v1/order/remind',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    orderNo:orderNo,
					tradeNo:'1'
				  }
				}).then(function(data){
					console.log('催单',data)
					load.clear();//关闭加载
					if (data.data.status==200) {
						_this.$toast('已催单');
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					_this.$toast('操作失败');
					console.log(error);
				});
			},
			// 立即支付
			goPay(orderNo,sellerId,totalAmount,isPopupPay){
				
				var _this=this;
				_this.getOrderDetail(orderNo)
				
				
				
				_this.$dialog.confirm({
				  title: '温馨提示',
				  message: '确定支付？',
				})
				  .then(() => {
					  
					  if(_this.orderStatus!=1){
						  _this.$toast('订单超时已取消！');
						  setTimeout(()=>{
							  // 如果是在订单详情里点击的立即支付，则关闭当前详情
							  if(isPopupPay){
								  _this.orderDetailPopup=false;
							  }
							  pageNum=1;
							  _this.orderList=[];
						  	_this.getOrder(pageNum);
						  },1000)
						  return;
					  }
				    var load=_this.$toast.loading({
				      message: '正在提交...',
				      duration:0,
				      forbidClick: true,
				    });
					
					
					// 真实支付
					// _this.$axios({
					//   method: 'get',
					//   url:JSON.parse(localStorage.getItem('userInfo')).wxPayUrl,
					//   params: {
					// 	totalFee:totalAmount*100,//金额（分）
					// 	body:'请支付',//标题
					// 	outTradeNo:orderNo,//订单编号
					// 	attach:sellerId,//商家id
					// 	notifyUrl:port+'/v1/order/wechatPayNotify'
					//   }
					// }).then(function(data){
					// 	console.log('支付',data)
					// 	load.clear();
					// 	var payUrl=data.data.data.payUrl+"&redirect_url="+payBackUrl+"/#/index";
					// 	_this.$router.push({'path':'/pay',query:{'payUrl':payUrl}});
						
					// }).catch(function(error){
					// 	console.log(error);
					// });
				    
					
					// 模拟支付
				    _this.$axios({
				      method: 'post',
				      url: port+'/v1/order/pay',
				      headers:{'token':localStorage.getItem('token')},
				      params: {
				        orderNo:orderNo,
						tradeNo:'1',
						sellerId:sellerId
				      }
				    }).then(function(data){
						console.log('立即支付',data)
						
				    	load.clear();//关闭加载
				    	if (data.data.status==200) {
							pageNum=1;
							_this.orderList=[];
				    		_this.getOrder(pageNum);
							_this.orderDetailPopup=false;
							_this.$toast('支付成功');
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
				    	_this.$toast('操作失败');
				    	console.log(error);
				    });
					
					
				  })
				  .catch(() => {
				    // on cancel
				  });
			},
			// 取消订单
			cancalOrder(orderNo){
				var _this=this;
				console.log(orderNo)
				_this.$dialog.confirm({
				  title: '温馨提示',
				  message: '确定取消订单？',
				})
				  .then(() => {
				    var load=_this.$toast.loading({
				      message: '提交中...',
				      duration:0,
				      forbidClick: true,
				    });
				    
				    _this.$axios({
				      method: 'post',
				      url: port+'/v1/order/updateState',
				      headers:{'token':localStorage.getItem('token')},
				      params: {
				        orderNo:orderNo
				      }
				    }).then(function(data){
						console.log('取消订单',data)
				    	load.clear();//关闭加载
				    	if (data.data.status==200) {
							pageNum=1;
							_this.orderList=[];
				    		_this.getOrder(pageNum);
							_this.orderDetailPopup=false;
							_this.$toast('已取消');
				    	}
				    	if(data.data.status==600){
				    		_this.$toast(data.data.msg);
				    	}
				    	if(data.data.status==601||data.data.status==602||data.data.status==603){
				    		_this.$toast('登录过期，请登录');
				    		setTimeout(()=>{
				    			_this.$router.push({'path':'/login'})
				    		},2000)
				    	}
				    }).catch(function(error){
				    	_this.$toast('操作失败');
				    	console.log(error);
				    });
				  })
				  .catch(() => {
				    // on cancel
				  });
			},
			// 订单详情
			openOrderDetail(orderNo){
				var _this=this;
				_this.orderDetailPopup=true
				
				_this.getAddress(orderNo);
				
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
				
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/order/get',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    orderNo:orderNo
				  }
				}).then(function(data){
					load.clear();//关闭加载
					if (data.data.status==200) {
						_this.orderDetailData=data.data.data
						console.log('订单详情',_this.orderDetailData)
						_this.orderDetailData.picUrl=sellerPort+_this.orderDetailData.picUrl
						var totalPrice=0;
						// 计算所有菜品的环保费
						var greenMoney=0;
						for (var i=0;i<_this.orderDetailData.orderGoodses.length;i++) {
							
							// 计算每个菜品的总价
							_this.orderDetailData.orderGoodses[i].totalPrice=_this.orderDetailData.orderGoodses[i].buyCounter*_this.orderDetailData.orderGoodses[i].gPrice;					
							
							greenMoney+=_this.orderDetailData.orderGoodses[i].buyCounter*_this.orderDetailData.orderGoodses[i].gGreenFee;
							_this.orderDetailData.totalGreenMoney=greenMoney;
							
							// 计算总价
							totalPrice+=_this.orderDetailData.orderGoodses[i].totalPrice;
						}
						
						_this.orderDetailData.totalPrice=totalPrice+greenMoney+_this.orderDetailData.deliveryFee;
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					_this.$toast('操作失败');
					console.log(error);
				});
				
				
			},
			// 查询订单列表
			getOrder(pageNum){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/order/query',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    personId:JSON.parse(localStorage.getItem('userInfo')).pId,
					  pageNum:pageNum,
				  	pageSize:10
				  }
				}).then(function(data){
					load.clear();//关闭加载
					if (data.data.status==200) {
						if (data.data.data.list.length>0) {
							for (var i=0;i<data.data.data.list.length;i++) {
								data.data.data.list[i].picUrl=sellerPort+data.data.data.list[i].picUrl;//窗口图片
								_this.orderList.push(data.data.data.list[i]);
							}
							
						}else {
							_this.$toast('已加载全部');
						}
						
						console.log('订单列表',_this.orderList);
						for (var i=0;i<_this.orderList.length;i++) {
							
							// 订单状态
							if(_this.orderList[i].orderState==0){
								_this.orderList[i].orderType='用户取消订单';
							}
							if(_this.orderList[i].orderState==1){
								_this.orderList[i].orderType='待支付';
							}
							if(_this.orderList[i].orderState==2){
								_this.orderList[i].orderType='待商家接单';
							}
							if(_this.orderList[i].orderState==3){
								_this.orderList[i].orderType='商家取消订单';
							}
							if(_this.orderList[i].orderState==4){
								if(_this.orderList[i].orderMode!=2){
									_this.orderList[i].orderType='出餐中';
								}else{
									_this.orderList[i].orderType='待配送员接单';
								}
							}
							if(_this.orderList[i].orderState==5){
								
								if(_this.orderList[i].outMealState==1){
									_this.orderList[i].orderType='待配送员取餐';
								}else{
									_this.orderList[i].orderType='出餐中';
								}
							}
							if(_this.orderList[i].orderState==6){
								_this.orderList[i].orderType='配送员已转单';
							}
							if(_this.orderList[i].orderState==7){
								if(_this.orderList[i].orderMode==1){
									_this.orderList[i].orderType='自提中';
								}else if(_this.orderList[i].orderMode==3){
									_this.orderList[i].orderType='待用餐';
								}else{
									if(!_this.orderList[i].deliveryPersonId){
										_this.orderList[i].orderType='待配送员接单';
									}else{
										_this.orderList[i].orderType='待配送员取餐';
									}
								}
								
								
							}
							if(_this.orderList[i].orderState==8){
								_this.orderList[i].orderType='配送中';
							}
							if(_this.orderList[i].orderState==9){
								_this.orderList[i].orderType='待评价';
							}
							if(_this.orderList[i].orderState==10){
								_this.orderList[i].orderType='已评价';
							}
							
							//添加商品数量字段
							var num=0;
							for (var j=0;j<_this.orderList[i].orderGoodses.length;j++) {
								num+=parseFloat(_this.orderList[i].orderGoodses[j].buyCounter);
								_this.orderList[i].goodsNum=num;
							}
						}
					}
					
					if(data.data.status==600||data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					// _this.$toast('登录过期，请重新登录');
					// setTimeout(()=>{
					// 	_this.$router.push({'path':'/login'})
					// },2000)
					console.log(error);
				});
			}
		},
		created:function(){
			if(!isLogin()){
				this.$router.push({path:'/login'})
				return;
			}
			var _this=this;
			pageNum=1;
			_this.orderList=[];
			_this.getOrder(pageNum)
			
		}
	};
</script>
<style type="text/css">
.order-list-wrap .shop-tit{position: relative;padding-right: 100px;}
.order-list-wrap li{background: #fff;overflow: hidden;margin: 10px;padding: 10px;border-radius: 4px;}
.win-tit-wrap{padding-right: 80px;position: relative;border-bottom: 1px solid #eee;padding-bottom: 10px;}
.win-tit-wrap img{width: 50px;height: 50px;float: left;margin-right: 10px;}
.win-name{line-height: 50px;font-size: 16px;color: #333;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.win-tit-wrap .state{position: absolute;right: 0;line-height: 50px;top: 0;font-size: 12px;color: #999;}

.order-list p{color: #666;margin-top: 4px;}
.order-total-wrap{text-align: right;}
.order-total-wrap span:nth-child(1){margin-right: 10px;}
.order-total-wrap .total{font-weight: bold;}
.order-total-wrap{border-bottom: 1px solid #eee;padding-bottom: 5px;}
.order-btn{text-align: right;}
.order-btn span{font-size: 14px;color: #333;border: 1px solid #ddd;padding: 5px 10px;display: inline-block;border-radius: 5px;margin-right: 10px;margin-top: 10px;}
.order-btn span:active{background: #f9f9f9;}
.order-btn span:last-child{margin-right: 0;}

.order-detail-top{background: #fff;text-align: center;margin: 10px;padding: 10px;border-radius: 6px;}
.order-detail-top p{margin: 4px 0;}
.order-detail-top .time{color: #FFBD27;}

.seller-phone{text-align: center;padding: 10px;background: #fff;color: #333;display: block;border-top: 1px solid #eee;}
.seller-phone .iconfont{color: #FFBD27;margin-right: 5px;}

.seller-info{background: #fff;border-bottom: 1px solid #eee;padding: 15px;overflow: hidden;}
.seller-info img{width: 40px;height: 40px;float: left;margin-right: 10px;}
.seller-info p{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.seller-info p.seller-name{font-weight: bold;}

.assess-item{background: #fff;margin: 10px;border-radius: 6px;padding: 10px;}
.assess-item .head-img img{width: 40px;height: 40px;margin-right: 10px;}
.assess-item .head-img{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}

.pleased-wrap{display: flex;margin-top: 10px;}
.pleased-wrap span{flex: 1;text-align: center;height: 35px;line-height: 35px;background: #F5F5F5;border-radius: 4px;}
.pleased-wrap span .iconfont{color: #999;margin-right: 6px;}
.pleased-wrap span.active{background: #FEF9E6;color: #FFB200;}
.pleased-wrap span.active .iconfont{color: #FFB200;}
.pleased-wrap span:nth-child(1){margin-right: 10px;}

.assess-msg{margin-top: 10px;}
.assess-msg span{background: #f5f5f5;padding: 4px 8px;display: inline-block;margin-right: 10px;border-radius: 3px;font-size: 12px;margin-bottom: 10px;}
.assess-msg span.active{background: #F4BE42;}

.assess-star-wrap{margin:10px 0;}
.assess-remark .van-cell{background: #f5f5f5;}
.upload-img{margin-top: 10px;}

.star-assess{margin-top: 5px;}
.star-name{margin-right: 10px;vertical-align: super;}
.assess-star-wrap .assessText{color: #999;margin-left: 10px;}

.order-track-wrap{position: absolute;width: 100%;background: #fff;left: 0;bottom: 60px;border-radius: 6px;}
.order-track-wrap .order-track-tit{padding: 10px;text-align: center;font-size: 16px;border-bottom: 1px solid #eee;}
.order-track-wrap .order-track-main{height: 250px;overflow-y: auto;padding: 10px;box-sizing: border-box;}
.order-track-cancel{padding: 10px;text-align: center;font-size: 16px;position: absolute;width: 100%;background: #fff;left: 0;bottom: 10px;border-radius: 6px;box-sizing: border-box;}

.order-track-list li{position: relative;margin-bottom: 15px;}
.order-track-list li .order-track-send-phone a{color: #F4BE42;}
.order-track-list .order-track-item{display: flex;justify-content: space-between;padding-left: 20px;}
.order-track-list li:before{content: '';position: absolute;width: 5px;height: 5px;background: #F4BE42;border-radius: 50%;left: 5px;top: 6px;}
.order-track-list li:after{content: '';position: absolute;width: 1px;height: 120%;left: 7px;top: 14px;background: #F4BE42;}
.order-track-list li:last-child:after{display: none;}
.order-track-list .date{color: #999;font-size: 12px;}
.order-track-send-phone{padding-left: 20px;margin-top: 4px;color: #666;}
.cell-value{flex: none;}
</style>