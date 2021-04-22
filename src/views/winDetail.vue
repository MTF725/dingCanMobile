<template>
	<div class="win-detail">
		<!-- 顶部导航 -->
		<top-fixed-nav :title="winName"></top-fixed-nav>
		
			<div class="win-detail-top">
				<img class="win-img" :src="winPic">
				<p class="win-name">{{this.$route.query.winName}}</p>
				<p class="sell-num"><van-rate readonly v-model="winStarScore" /><span>月售{{this.$route.query.orderCount}}单</span></p>
				<p class="send-price">
					<span v-show="this.$route.query.deliveryMinAmount">起送￥{{this.$route.query.deliveryMinAmount}}  </span>
					<span>配送￥{{this.$route.query.deliveryFee}}</span>
				</p>
			</div>
			<div class="goods-type-wrap">
				<div class="goods-type-tab">
					<a data-num="1" @click="goodsTypeTab($event)" href="javascript:;" :class="{active:num==1}">商品</a>
					<a data-num="2" @click="goodsTypeTab($event)" href="javascript:;" :class="{active:num==2}">评价</a>
					<a data-num="3" @click="goodsTypeTab($event)" href="javascript:;" :class="{active:num==3}">商家</a>
				</div>
				<div class="goods-type-main">
					<div :class="{'goodst-type-item':true,show:num==1}">
							<div class="goods-type-left" :style="{height:(winHeight-260)+'px'}">
								<!-- 商品分类 -->
								<ul>
									<li :data-goodstype="'goodsType' + item.gKindId" :data-typename="item.gKindName" :class="{active:typeNum==index}" :data-id="item.gKindId" :data-type="index" @click="typeTab($event)" v-for="(item,index) in goodsTypeArr">{{item.gKindName}}</li>
								</ul>
							</div>
							<!-- 商品分类列表 -->
							<div class="goods-type-right" :style="{height:(winHeight-260)+'px'}" id="goodsListWrap">
								<div :ref="'#goodsType' + item.gKindId" v-for="(item,index) in goodsTypeArr" :id="'goodsType' + item.gKindId">
									<p class="p-goods-tit">{{item.gKindName}}</p>
									<ul class="goods-list">
										<li v-for="goodsItem in item.goodsList">
											<div class="goods-img">
												<img :src="goodsItem.gPic">
												<van-tag v-show="goodsItem.gRecommend==1" color="#E03737" class="g-tag">推荐</van-tag>
											</div>
											<p class="goods-name">{{goodsItem.gName}}</p>
											<p class="sell-num">销量：{{goodsItem.gSellCounter}}</p>
											<div class="goods-price">￥{{goodsItem.gPrice}}
												<div class="counter">
													<span v-show="goodsItem.goodsNum>0" class="min iconfont icon-jianhao" v-on:click="minGoods(goodsItem)"></span>
													<input v-show="goodsItem.goodsNum>0" type="number" readonly v-model="goodsItem.goodsNum">
													
													<!-- $route.query.winState!=1为休息中，其他都是营业中 -->
													<span v-show="$route.query.winState!=1" class="add iconfont icon-jia1" v-on:click="addGoods(goodsItem,$event,goodsItem.goodsNum)"></span>
												</div>	
											</div>
										</li>
									</ul>
								</div>
							</div>
					</div>
					<div :class="{'goodst-type-item':true,show:num==2}" :style="{height:(winHeight-260)+'px'}" id="assessWrap">
						<div class="score-wrap">
							<div class="score-top" style="display: none;">
								<span class="score-num">{{score}}</span><van-rate readonly v-model="score" />
								<p class="score-tip">100名同学参与菜品反馈</p>
							</div>
							<!-- 评价列表 -->
							<div class="dis-list">
								<ul v-if="sellerAssess.length>0">
									<li v-for="(item,index) in sellerAssess">
										<img class="head-img" src="../../public/static/images/icon/default_head.png" alt="">
										<p class="dis-user-name"><span class="dis-name">{{item.pName?item.pName:'匿名'}}</span><span class="dis-date">{{item.createTime}}</span></p>
										<!-- <div class="dis-score">
											<p><span>评分：</span><van-rate readonly v-model="disScore" /></p>
											<p><span>口味：</span><van-rate readonly v-model="disScore" /></p>
											<p><span>包装：</span><van-rate readonly v-model="disScore" /></p>
										</div> -->
										<p class="dis-remark">{{item.commentContent}}</p>
									</li>
								</ul>
								<p v-else style="text-align: center;margin: 20px;">暂无评价</p>
							</div>
						</div>
					</div>
					<div :class="{'goodst-type-item':true,show:num==3}" :style="{height:(winHeight-260)+'px'}">
						<!-- 商家信息 -->
						<div class="seller-info" style="border-bottom: none;padding: 0;margin-top: -1px;">
							<van-cell-group>
							  <van-cell title="负责人" :value="sellerName" />
							  <van-cell title="商家电话" :value="sellerPhone" />
							  <van-cell title="营业时间" value-class="open-time-cell" :value="sellerOpenTime" />
							  <van-cell title="商家地址" :value="winAddress" />
							  <van-cell title="窗口照片" is-link v-on:click="openMclz" />
							  <van-cell title="资质证照" is-link v-on:click="openZz" />
							  <van-cell title="员工健康证" is-link v-on:click="openHealth" />
							</van-cell-group>
						</div>
					</div>
				</div>
			</div>
		
		<!-- 购物车 v-if="$route.query.winState==1" -->
		<div class="shop-car" >
			<div class="shop-car-main">
				<span id="shopCarIcon" class="shop-car-icon iconfont icon-gouwuche" v-on:click="openShopCar"><van-tag color="#EA4646" round class="shop-tag">{{shopCarGoodsNum}}</van-tag></span>
				<div class="shop-car-info">
					<p class="shop-car-price">￥{{goodsTotal.toFixed(2)}}</p>
					<p>配送费:￥{{parseFloat(this.$route.query.deliveryFee)}} <span style="margin-left: 6px;"><i v-for="item in deliveryMode">{{item=='1'?'外送|':item=='2'?'自提|':'到店用餐|'}}</i></span></p>
				</div>
				
				<!-- <a v-if="!isLogin" href="javascript:;" class="shop-car-count-btn" v-on:click="$router.push({path:'/logIn'})">登录</a> -->
				<!-- <template v-else> -->
					<a v-if="this.$route.query.deliveryMinAmount<=goodsTotal" href="javascript:;" class="shop-car-count-btn" v-on:click="goAccount">去结算</a>
					<span v-else class="shop-car-qs-tip">差{{this.$route.query.deliveryMinAmount-goodsTotal}}起送</span>
				<!-- </template> -->
				
			</div>
		</div>
		
		<!-- 购物车详情 -->
		<van-popup duration="0.2" position="bottom" :style="{ width: '100%',height:'300px'}" v-model="ShopDetailShow">
			<div class="shop-car-detail">
				<p class="shop-car-detail-tit"><span>购物车</span><span v-on:click="clearShopCar"><i class="iconfont icon-qingkong" style="margin-right: 4px;"></i>清空</span></p>
				<ul class="goods-list shop-car-list">
					<li v-show="item.goodsNum>0" v-for="item in goodsList">
						<div class="goods-img">
							<img :src="item.gPic">
							<van-tag v-show="item.gRecommend==1" color="#E03737" class="g-tag">推荐</van-tag>
						</div>
						<p class="goods-name">{{item.gName}}</p>
						<div class="goods-price">￥{{item.gPrice}}
							<div class="counter">
								<span v-show="item.goodsNum>0" class="min iconfont icon-jianhao" v-on:click="minGoods(item)"></span>
								<input v-show="item.goodsNum>0" type="number" readonly v-model="item.goodsNum">
								<span class="add iconfont icon-jia1" v-on:click="addGoods(item,'',item.goodsNum)"></span>
							</div>	
						</div>
					</li>
				</ul>
			</div>
		</van-popup>
		
		<!-- 提交订单 -->
		<van-popup position="right" v-model="goodsOrderShow" :style="{width:'100%', height: '100%',background:'#eee',boxSizing:'border-box'}">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="goodsOrderShow=false"></span>提交订单
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" :style="{height:(winHeight-40)+'px',paddingBottom:'65px',boxSizing:'border-box'}">
				<van-cell-group>
				  <van-cell title="订餐方式" :value="orderWay" is-link v-on:click="openOrderWay" />
				</van-cell-group>
				
				<!-- 外送 -->
				<van-cell-group v-show="wsShow">
				  <van-cell is-link :title="wsName+wsSex+wsPhone" :label="wsAddress" v-on:click="openSelectAddressPopup" />
				  <van-cell is-link title="期望送达时间" :value="wsTime" v-on:click="wsTimePopup=true" />
				</van-cell-group>
				
				<!-- 自提 -->
				<van-cell-group v-show="ztShow">
				  <van-field input-align="right" :label="ztName" v-model="ztPhone" />
				  <van-cell title="自提地点" :value="winAddress" />
				  <van-cell is-link title="自提时间" :value="ztTime" v-on:click="ztTimePopup=true" />
				</van-cell-group>
				
				<!-- 到店用餐 -->
				<van-cell-group v-show="ddycShow">
				  <van-field input-align="right" :label="ztName" v-model="ztPhone" />
				  <van-cell title="商家地址" :value="winAddress" />
				  <van-cell is-link title="用餐时间" :value="ddTime" v-on:click="ddTimePopup=true" />
				</van-cell-group>
				
				<!-- 提交订单 -->
				<div class="my-order-list">
					<ul>
						<li v-for="item in myOrder">
							<p class="my-order-name"><img :src="item.gPic" alt="">{{item.gName}}</p>
							<p class="price">￥{{item.gPrice}} x {{item.goodsNum}}</p>
						</li>
					</ul>
					<div class="send-wrap">
						<p v-show="orderWay=='外送'"><span>配送费</span><span>￥{{this.$route.query.deliveryFee}}</span></p>
						<p><span>环保费</span><span>￥{{greenMoney}}</span></p>
					</div>
					<p class="total-price">小计<span>￥{{orderWay=='外送'?(goodsTotal+parseFloat(this.$route.query.deliveryFee)+greenMoney).toFixed(2):((goodsTotal+greenMoney).toFixed(2))}}</span></p>
				</div>
				<!-- 备注 -->
				<p style="background: #fff;padding-left: 15px;padding-top: 10px;">备注</p>
				<van-field v-model="orderRemark" rows="3" autosize type="textarea" maxlength="100" placeholder="请输入口味/偏好等要求" show-word-limit />
				
				
			</div>
			<!-- 订单详情里的提交按钮 -->
			<div class="shop-car" style="position: absolute;background: #eee;">
				<div class="shop-car-main">
					<div class="shop-car-info">
						<p class="shop-car-price" style="position: absolute;left: 20px;top: 10px;">￥{{orderWay=='外送'?(goodsTotal+parseFloat(this.$route.query.deliveryFee)+greenMoney).toFixed(2):((goodsTotal+greenMoney).toFixed(2))}}</p>
					</div>
					<a style="    border-top-right-radius: 20px;border-bottom-right-radius: 20px;" href="javascript:;" class="shop-car-count-btn" v-on:click="submitOrder">提交订单</a>
				</div>
			</div>
		</van-popup>
		
		<!-- 选择地址、修改地址 -->
		<van-popup position="right" :style="{width:'100%', height: '100%'}" v-model="selectAddressPopupShow">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="receiveAddressBack"></span>收货地址
				<span style="position: absolute;font-size: 14px;padding: 0 10px;right: 0;" v-on:click="addAddressPopup=true;userName='';userPhone='';schoolArea='';schoolAreaId='';buildName='';buildId='';detailAddress='';setDefaultAdd=false;addAddressTit='新增地址';addressId='';">新增地址</span>
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="address-list">
					<ul>
						<li v-for="item in allAddresArr">
							<input type="radio" :checked="item.defaultAddress==1" name="selectAddRadio" :value="item.contact+','+item.phone+','+item.cAreaName+item.buildName+item.address+','+item.sex+','+item.buildId" v-model="checkAddress">
							<p class="address-add">{{item.cAreaName}}{{item.buildName}}{{item.address}}</p>
							<p class="address-name"><span>{{item.contact}}</span><span style="margin-right: 10px;">{{item.phone}}</span><van-tag round v-show="item.defaultAddress==1">默认</van-tag></p>
							<span class="edit-add iconfont icon-xitongshezhibeifen" v-on:click="openEditAddressPopup(item.addressId)"></span>
						</li>
					</ul>
					<!-- <div class="big-btn-wrap">
						<van-button type="primary" color="#F4BE42" block v-on:click="selectAddressBtn">确定</van-button>
					</div> -->
				</div>
			</div>
		</van-popup>
		
		<!-- 新增地址 -->
		<van-popup position="right" :style="{width:'100%', height: '100%'}" v-model="addAddressPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="addAddressPopup=false"></span>{{addAddressTit}}
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<van-cell-group>
				  <van-field required v-model="userName" input-align="right" label="姓名" />
				  <van-field name="radio" label="性别" input-align="right">
				    <template #input>
				      <van-radio-group v-model="sex" direction="horizontal" checked-color="#F4BE42">
				        <van-radio name="男">男</van-radio>
				        <van-radio name="女">女</van-radio>
				      </van-radio-group>
				    </template>
				  </van-field>
				  <van-field required v-model="userPhone" input-align="right" label="手机号"/>
				  <van-cell required title="校区" :value="schoolArea" is-link v-on:click="selectAreaShow=true;getSchoolArea()" />
				  <van-cell required title="楼宇" :value="buildName" is-link v-on:click="schoolArea==''?$toast('请选择校区'):selectBuildShow=true" />
				  <van-field v-model="detailAddress" input-align="right" label="详细地址"/>
				  <van-field name="switch" label="设为默认地址" input-align="right">
				    <template #input>
				      <van-switch active-color="#F4BE42" v-model="setDefaultAdd" size="20" />
				    </template>
				  </van-field>
				</van-cell-group>
				
				<div class="big-btn-wrap">
					<van-button type="primary" color="#F4BE42" block v-on:click="saveAddress">保存地址</van-button>
				</div>
			</div>
		</van-popup>
		
		<!-- 窗口照片、资质证照、员工健康证 -->
		<van-popup position="right" :style="{width:'100%', height: '100%'}" v-model="idCardPhotoPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="idCardPhotoPopup=false"></span>{{idCardPhotoTit}}
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="zizhi-photo-wrap">
					<p class="zanwu" v-show="idCardPhotoList.length<=0">暂无图片</p>
					<ul>
						<li v-for="(item,index) in idCardPhotoList" v-on:click="prevIdPhone(index)">
							<div class="zizhi-img" :style="{backgroundImage:'url('+item.picUrl+')'}"></div>
						</li>
					</ul>
				</div>
			</div>
		</van-popup>
		
		
		<!-- 支付 -->
		<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="payPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="payPopup=false"></span>支付
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="pay-wrap">
					<!-- <p>支付剩余时间：<span id="time"></span></p> -->
					<p class="pay-total">￥{{orderWay=='外送'?(goodsTotal+parseFloat(this.$route.query.deliveryFee)+greenMoney).toFixed(2):((goodsTotal+greenMoney).toFixed(2))}}</p>
					<p>订单编号-{{payOrderNum}}</p>
				</div>
				<div class="pay-way">
					<van-radio-group v-model="payRadio" disabled >
					  <van-cell-group>
					    <van-cell title="微信" >
					      <template #right-icon>
					        <van-radio name="1" checked-color="red" />
					      </template>
					    </van-cell>
					  </van-cell-group>
					</van-radio-group>
				</div>
				<p class="pay-btn" v-on:click="confirmPay">确认支付 ￥{{orderWay=='外送'?(goodsTotal+parseFloat(this.$route.query.deliveryFee)+greenMoney).toFixed(2):((goodsTotal+greenMoney).toFixed(2))}}</p>
			</div>
		</van-popup>
		
		<!-- 登录 -->
		<van-popup position="right" :style="{width:'100%', height: '100%'}" v-model="loginPopup">
			<!-- popup内头部 -->
			<!-- <div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="loginPopup=false"></span>登录
			</div> -->
			<!-- popup内容区 -->
			<div class="popup-main" style="height: 100%">
				<div class="login">
					<div class="back iconfont icon-zuojiantou" style="position: absolute;left: 0;top: 0;z-index: 10;width: 40px;height: 40px;text-align: center;line-height: 40px;color: #fff;font-size: 20px;" v-on:click="loginPopup=false"></div>
					<div class="bg"><img src="../assets/login/login-bg.png" alt=""></div>
					<div class="bg-food"><img src="../assets/login/login-bgfood.png" alt=""></div>
					<div class="content">
						<div class="title">
							<p style="color: #fff;">网上订餐</p>
						</div>
						<div>
							<div class="input-item">
								<img src="../assets/login/username.png" alt="">
								<van-field class="login-input" v-model="loginName"  placeholder="用户名" />
							</div>
							<div class="input-item">
								<img src="../assets/login/password.png" alt="">
								<van-field class="login-input" v-model="loginPassword" type="password"  placeholder="密码" />
							</div>
						</div>
						<div class="confirm">
							<van-button color="#F4BE42" type="primary" block @click="logIn()">登录</van-button>
						</div>
					</div>
				</div>
			</div>
		</van-popup>
		
		<!-- 选择订餐方式 -->
		<van-action-sheet close-on-click-action v-model="orderWayshow" :actions="orderWayActions" @select="onSelectOrderWay" />
		
		<!-- 选择校区action -->
		<van-action-sheet overlay close-on-click-action v-model="selectAreaShow" :actions="selectAreaAction" @select="onSelectAreaAction" />
		
		<!-- 选择楼宇action -->
		<van-action-sheet overlay close-on-click-action v-model="selectBuildShow" :actions="selectBuildAction" @select="onSelectBuildAction" />
		
		<!-- 外送时间选择popup -->
		<van-popup v-model="wsTimePopup" position="bottom" :style="{width:'100%', height: '270px'}">
			<van-datetime-picker v-on:confirm="getWsTime" v-on:cancel="wsTimePopup=false"  v-model="wsTime" type="time" title="选择时间" :min-hour="new Date(new Date().getTime() + 1000*60*30).getHours()" :min-minute="new Date(new Date().getTime() + 1000*60*30).getMinutes()"/>
		</van-popup>
		
		<!-- 自提时间选择popup -->
		<van-popup v-model="ztTimePopup" position="bottom" :style="{width:'100%', height: '270px'}">
			<van-datetime-picker v-on:confirm="getZtTime" v-on:cancel="ztTimePopup=false"  v-model="ztTime" type="time" title="选择时间" :min-hour="new Date(new Date().getTime() + 1000*60*30).getHours()"  :min-minute="new Date(new Date().getTime() + 1000*60*30).getMinutes()"/>
		</van-popup>
		
		<!-- 到店用餐时间选择popup -->
		<van-popup v-model="ddTimePopup" position="bottom" :style="{width:'100%', height: '270px'}">
			<van-datetime-picker v-on:confirm="getDdTime" v-on:cancel="ddTimePopup=false"  v-model="ddTime" type="time" title="选择时间" :min-hour="new Date(new Date().getTime() + 1000*60*30).getHours()"  :min-minute="new Date(new Date().getTime() + 1000*60*30).getMinutes()"/>
		</van-popup>
		
		
		
	</div>
</template>

<script type="text/javascript">
	var pageNum=1;//页码
	import { ImagePreview } from 'vant';
	export default{
		data:function(){
			return{
				loginName:'',//用户名
				loginPassword:'',//密码
				loginPopup:false,//登录popup
				winStarScore:JSON.parse(this.$route.query.starScore),//窗口评分数
				reachBottomShow:false,//下拉刷新
				isLogin:isLogin(),
				winPic:'./static/images/icon/default1.png',//窗口图片带
				winSplitImg:'',//不带前缀的窗口图片
				deliveryMode:this.$route.query.deliveryMode,//支持配送类型
				num: 1,//商品、评价、商家tab切换
				typeNum:0,//商品类别切换
				winId:this.$route.query.winId,//店铺传递的店铺id
				winName:this.$route.query.winName,//店铺传递的店铺名称
				star:3,//评分
				winHeight:0,//可视区高度
				goodsTypeArr:[],//菜品分类
				goodsList:[],//购物车菜品列表
				gTypeName:'',//菜品标题
				score:3,//总评分
				disScore:3,//评价列表评分
				ShopDetailShow:false,//购物车详情
				shopCarGoodsNum:0,//购物车数量角标
				goodsTotal:0,//总价
				goodsOrderShow:false,//订单详情
				orderWayshow: false,//订餐方式
				orderWay:'',//订餐方式
			    orderWayActions: [],//用餐方式
				wsShow:false,//外送
				ztShow:false,//自提
				ztTimePopup:false,//自提时间
				ztTime:setTimeLatter(30),//自提时间
				ddTimePopup:false,//到店用餐时间
				ddTime:setTimeLatter(30),//到店用餐时间
				ddycShow:false,//到店用餐
				selectAddressPopupShow:false,//收货地址
				allAddresArr:[],//查询所有收货地址
				addAddressPopup:false,//新增地址
				userName:'',//姓名
				userPhone:'',//手机号
				detailAddress:'',//详细地址
				sex:'男',//性别
				setDefaultAdd:false,//设为默认地址
				wsTime: setTimeLatter(30),//外送时间
				wsTimePopup:false,//外送时间选择
				selectAreaShow:false,//选择校区action
				schoolArea:'',//校区
				schoolAreaId:'',//校区id
				selectAreaAction: [],//选择校区内容
				selectBuildShow:false,//选择楼宇action
				selectBuildAction:[],//选择楼宇内容
				buildName:'',//楼宇名称
				buildId:'',//楼宇id
				wsName:'选择地址',//外送姓名
				wsPhone:'',//外送电话
				wsAddress:'',//外送地址
				wsSex:'',//外送性别
				checkAddress:'',//选择的收货地址
				winAddress:'',//商家窗口地址（自提地址、到店用餐地址）
				ztName:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).pName:'',//自提人姓名
				ztPhone:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).pMobile:'',//自提人电话
				ztSex:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).pSex:'',//自提人性别
				myOrder:[],//选择完商品的订单
				orderRemark:'',//提交订单里的备注
				addAddressTit:'新增地址',//添加、修改地址状态栏标题
				addressId:'',//地址id，修改地址用
				sellerName:'',//商家负责人
				sellerPhone:'',//商家电话
				sellerOpenTime:'',//商家营业时间
				idCardPhotoPopup:false,//证件照（窗口照片、资质证照、员工健康证）
				idCardPhotoTit:'',//证件照标题
				idCardPhotoList:[],//证件照图片
				fullAddress:'',//拼接的地址
				greenMoney:0,//环保费
				payPopup:false,//支付
				payRadio:'1',//支付选择方式，默认微信
				payOrderNum:'',//支付订单编号
				daoJiShi:'',//30分钟倒计时
				sellerAssess:[],//商家评价
				weXinPayUrl:'',//微信付款地址
				orderStatus:'',//支付时查询的订单状态
			};
		},
		components:{
			
		},
		mounted() {
			 // 滚动到底加载更多
			document.querySelector('#assessWrap').addEventListener('scroll',this.reachBottom)			  
		},
		methods:{
			// 滚动到底加载更多评价
			reachBottom(){
				  //滚动条高度
				  let scrollTop = document.querySelector('#assessWrap').scrollTop;
				  //可视区的高度
				  let clientHeight = document.querySelector('#assessWrap').clientHeight;
				  //总高度
				  let scrollHeight = document.querySelector('#assessWrap').scrollHeight;
				if(scrollTop+clientHeight >= scrollHeight){
					pageNum++;
					this.getSellerAssess(pageNum);
				}
			},
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
						_this.$toast('请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					_this.$toast('操作失败');
					console.log(error);
				});
			},
			// 商家评价
			getSellerAssess(pageNum){
				var _this=this;
				
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/ordermeal/queryCommentBySellerId',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    sellerId:_this.$route.query.sellerId,
					pageNum:pageNum,
					pageSize:20
				  }
				}).then(function(data){
					console.log('商家评价',data)
					if (data.data.status==200) {
						if(data.data.data.list.length>0){
							for (var i=0;i<data.data.data.list.length;i++) {
								_this.sellerAssess.push(data.data.data.list[i])
							}
						}else{
							_this.$toast('暂无评价');
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
			// 点餐抛物线动画
			parabolic() {
			          return function (e) {
			              //生成动画标签
			              var ball = document.createElement("div");
			              ball.id = 'ball';
			              document.body.appendChild(ball);
			 
			              var rect = e.getBoundingClientRect(); //getBoundingClientRect获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
			              ball.style.top = (rect.top+rect.height/2)+'px';
			              ball.style.left = rect.left+'px';
			              ball.style.transition = 'left 0s, top 0s';
			              //获取购物车标签
			              var buyCar=document.getElementById('shopCarIcon').getBoundingClientRect();
			              setTimeout(()=>{
			                  ball.style.top = window.innerHeight-(window.innerHeight-buyCar.top-buyCar.height/2)+'px';
			                  ball.style.left = (buyCar.left+buyCar.height/2)+'px';
			                  ball.style.transition = 'left 1s linear, top 1s ease-in';
			              }, 20);
			              //动画结束后自动删除
			              setTimeout(function () {
			                  document.body.removeChild(ball);
			              },1050);
			          };
			      },
			// 确认支付
			confirmPay(){
				console.log('确认支付');
				var _this=this;
				
				
				console.log('66',_this.orderStatus)
				
				_this.$dialog.confirm({
				  title: '温馨提示',
				  message: '确定支付？',
				}).then(() => {
				    // on confirm
					
					if(_this.orderStatus!=1){
						  _this.$toast('订单已取消！');
						  setTimeout(()=>{
							  _this.goodsOrderShow=false;//关闭提交订单
							  _this.payPopup=false;//关闭支付
						  },1500)
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
					// 	totalFee:(_this.goodsTotal+parseFloat(_this.$route.query.deliveryFee)+_this.greenMoney)*100,//金额（分）
					// 	body:'请支付',//标题
					// 	outTradeNo:_this.payOrderNum,//订单编号
					// 	attach:_this.$route.query.sellerId,//商家id
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
					
					
					////模拟支付
					_this.$axios({
					  method: 'post',
					  url: port+'/v1/order/pay',
					  headers:{'token':localStorage.getItem('token')},
					  params: {
					    orderNo:_this.payOrderNum,//订单编号
						tradeNo:'1',//交易编号
						sellerId:_this.$route.query.sellerId
					  }
					}).then(function(data){
						console.log('支付',data)
						if (data.data.status==200) {
							_this.$toast('支付成功');
							setTimeout(()=>{
								_this.$router.push({'path':'/orderList'});
							},2000)
						}
						if(data.data.status==600){
							_this.$toast(data.data.msg);
						}
						if(data.data.status==601||data.data.status==602||data.data.status==603){
							_this.$toast('登录过期，请重新登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'});
							},2000)
						}
					}).catch(function(error){
						console.log(error);
					});
					
					
					
				  }).catch(() => {
				    // on cancel
					console.log('取消')
				  });
				
			},
			// 倒计时
			countDown(){
			    var timer;
			    var time=1800;//30分钟换算成1800秒
			    timer=setInterval(function(){
			         if (time<=0) {
			            clearInterval(timer);
			            alert('时间到了');
			            return;
			        }
			        time--;
			        var minute=parseInt(time/60);
			        var second=parseInt(time%60);
			        if (minute<10) {
			            minute='0'+minute;
			        }
			        if (second<10) {
			            second='0'+second;
			        }
				   document.querySelector('#time').innerHTML=minute+':'+second;
			    },1000);
			},
			// 打开修改地址popup（实际上打开的是添加地址，两个共用），获取地址详情
			openEditAddressPopup(addressId){
				var _this=this;
				
				_this.schoolArea='';
				_this.schoolAreaId='';
				_this.buildName='';
				_this.buildId='';
				
				_this.addAddressTit='修改地址';
				_this.addAddressPopup=true;
				_this.addressId=addressId;
				
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/deliveryAddress/get',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    addressId:addressId
				  }
				}).then(function(data){
					console.log('地址详情',data)
					if (data.data.status==200) {
						_this.userName=data.data.data.contact;//姓名
						_this.sex=data.data.data.sex==1?'男':'女';//姓名
						_this.userPhone=data.data.data.phone;//手机号
						_this.detailAddress=data.data.data.address;//详细地址
						_this.schoolAreaId=data.data.data.cAreaId;//校区id
						_this.schoolArea=data.data.data.cAreaName;//校区
						_this.buildId=data.data.data.buildId;//楼宇id
						_this.buildName=data.data.data.buildName;//楼宇
						_this.setDefaultAdd=data.data.data.defaultAddress==1?true:false;//是否设为默认地址
						
						_this.getBuild(data.data.data.cAreaId);
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
			// 获取商家信息
			getSellerInfo(){
				var _this=this;
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/seller/get',
				  params: {
				    sellerId:_this.$route.query.sellerId
				  }
				}).then(function(data){
					console.log('商家信息',data)
					if (data.data.status==200) {
						if(!data.data.data.businessBeginTime1){data.data.data.businessBeginTime1=''}
						if(!data.data.data.businessEndTime1){data.data.data.businessEndTime1=''}
						if(!data.data.data.businessBeginTime2){data.data.data.businessBeginTime2=''}
						if(!data.data.data.businessEndTime2){data.data.data.businessEndTime2=''}
						if(!data.data.data.businessBeginTime3){data.data.data.businessBeginTime3=''}
						if(!data.data.data.businessEndTime3){data.data.data.businessEndTime3=''}
						
						_this.sellerName=data.data.data.sellerName;//商家负责人
						_this.sellerPhone=data.data.data.phone;//商家电话
						_this.winAddress=data.data.data.addr;//商家地址
						_this.sellerOpenTime=data.data.data.businessBeginTime1+'-'+data.data.data.businessEndTime1+' '+data.data.data.businessBeginTime2+'-'+data.data.data.businessEndTime2+' '+data.data.data.businessBeginTime3+'-'+data.data.data.businessEndTime3;//商家营业时间
						_this.fullAddress=data.data.data.winFullAddr
						//窗口头像 
						if(data.data.data.windowPic){
							_this.winPic=sellerPort+data.data.data.windowPic;
							_this.winSplitImg=data.data.data.windowPic;//不带前缀的窗口图片
						}else{
							_this.winPic='./static/images/icon/default1.png';
						}
						
					}
					
				}).catch(function(error){
					console.log(error);
				});
			},
			// 收货地址返回
			receiveAddressBack(){
				this.selectAddressPopupShow=false;
				if(this.checkAddress!=''){
					var addressSplit=this.checkAddress.split(',');//勾选的地址转为数组：addressSplit[0]:姓名，addressSplit[1]:电话，addressSplit[2]:地址
					this.wsName=addressSplit[0];//外送姓名
					this.wsPhone=addressSplit[1];//外送电话
					this.wsAddress=addressSplit[2];//外送地址
					this.wsSex=addressSplit[3]==1?'（男）':'（女）';//外送人性别
					this.buildId=addressSplit[4];//建筑id
					
				}
				
				console.log('收货地址返回',this.checkAddress)
			},
			
			// 查询单位区域
			getSchoolArea(){
				var _this=this;
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/deliveryAddress/queryCompanyArea',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    cId:JSON.parse(localStorage.getItem('unitInfo')).cId
				  }
				}).then(function(data){
					console.log('所有校区',data)
					if (data.data.status==200) {
						_this.selectAreaAction=[];
						for (var i=0;i<data.data.data.length;i++) {
							_this.selectAreaAction.push({name:data.data.data[i].optionText,id:data.data.data[i].optionId})
						}
						
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast(data.data.msg);
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					console.log(error);
				});
				
			},
			// 选择校区时查询楼宇
			onSelectAreaAction(e){
				var _this=this;
				_this.buildName='';
				_this.buildId='';
				_this.selectBuildAction=[];
				_this.schoolAreaId=e.id;
				_this.schoolArea=e.name;
				console.log('选择的区域',e)
				
				_this.getBuild(e.id);
			},
			// 查询楼宇
			getBuild(id){
				var _this=this;
				// 查询楼宇
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/deliveryAddress/queryBuild',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    cAreaId:id
				  }
				}).then(function(data){
					console.log('该区域所有楼宇',data)
					if (data.data.status==200) {
						if(data.data.data.length==0){
							_this.$toast('该区域内没有楼宇信息')
						}else{
							_this.selectBuildAction=[];
							for (var i=0;i<data.data.data.length;i++) {
								_this.selectBuildAction.push({name:data.data.data[i].optionText,id:data.data.data[i].optionId})
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
			// 选择楼宇
			onSelectBuildAction(e){
				console.log('选择的楼宇',e)
				this.buildName=e.name;
				this.buildId=e.id;
			},
			// 点击外送时间确定获取选中时间
			getWsTime(e){
				console.log(e)
				this.wsTimePopup=false
				this.wsTime=e
			},
			// 点击自提时间确定获取选中时间
			getZtTime(e){
				console.log(e)
				this.ztTimePopup=false
				this.ztTime=e;
			},
			// 点击到店用餐确定获取选中时间
			getDdTime(e){
				console.log(e)
				this.ddTimePopup=false
				this.ddTime=e;
			},
			// 获取收货地址
			getAddress(){
				var _this=this;
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/deliveryAddress/query',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
					personId:JSON.parse(localStorage.getItem('userInfo')).pId
				  }
				}).then(function(data){
					if (data.data.status==200) {
						if(data.data.data.length<=0){
							
						}else{
							_this.allAddresArr=data.data.data;
						}
						console.log('收货地址',data);
						for (var i=0;i<_this.allAddresArr.length;i++) {
							if(_this.allAddresArr[i].defaultAddress==1){
								_this.wsName=_this.allAddresArr[i].contact;//设置默认地址的姓名
								_this.wsPhone=_this.allAddresArr[i].phone;//设置默认地址的电话
								_this.buildId=_this.allAddresArr[i].buildId;//设置默认地址的建筑id
								_this.wsSex=_this.allAddresArr[i].sex==1?'（男）':'（女）';//设置默认地址的性别
								_this.wsAddress=_this.allAddresArr[i].cAreaName+_this.allAddresArr[i].buildName+_this.allAddresArr[i].address;//设置默认地址的地址
							}else{
								_this.allAddresArr[0].defaultAddress==1
								_this.wsName=_this.allAddresArr[0].contact;//设置默认地址的姓名
								_this.wsPhone=_this.allAddresArr[0].phone;//设置默认地址的电话
								_this.buildId=_this.allAddresArr[0].buildId;//设置默认地址的建筑id
								_this.wsSex=_this.allAddresArr[0].sex==1?'（男）':'（女）';//设置默认地址的性别
								_this.wsAddress=_this.allAddresArr[0].cAreaName+_this.allAddresArr[0].buildName+_this.allAddresArr[0].address;//设置默认地址的地址
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
					_this.$toast('获取地址失败');
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},2000)
				});
			},
			// 保存地址
			saveAddress(){
				var _this=this;
				var userInfo=JSON.parse(localStorage.getItem('userInfo'));
				
				if(_this.userName==''){
					_this.$toast('请输入姓名');
					return;
				}
				if(_this.userPhone==''){
					_this.$toast('请输入手机号');
					return;
				}
				if(!phongReg.test(_this.userPhone)){
					_this.$toast('手机号格式错误');
					return;
				}
				if(_this.schoolArea==''){
					_this.$toast('请选择校区');
					return;
				}
				if(_this.buildName==''){
					_this.$toast('请选择楼宇');
					return;
				}
				
				
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				// 新增地址
				if(_this.addAddressTit=='新增地址'){
					_this.$axios({
					  method: 'post',
					  url: port+'/v1/deliveryAddress/insert',
					  headers:{'token':localStorage.getItem('token')},
					  timeout: 10000,
					  params: {
						
					    personId:userInfo.pId,//用户id
						contact:_this.userName,//姓名
						sex:_this.sex=='男'?1:2,//性别1男2女
						phone:_this.userPhone,//手机号
						cId:userInfo.cId,//单位id
						cAreaId:_this.schoolAreaId,//区域id
						buildId:_this.buildId,//楼宇id
						address :_this.detailAddress,//详细地址
						defaultAddress:_this.setDefaultAdd==true?'1':'0',//是否是默认地址0不是1是
					  }
					}).then(function(data){
						load.clear();//关闭加载
						console.log('修改地址',data)
						if (data.data.status==200) {
							_this.$toast(data.data.msg);
							_this.getAddress();
							setTimeout(()=>{
								_this.addAddressPopup=false;
							},2000)
							
						}
						if(data.data.status==600){
							_this.$toast(data.data.msg);
						}
						if(data.data.status==601||data.data.status==602||data.data.status==603){
							_this.$toast('请登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						}
					}).catch(function(error){
						load.clear();//关闭加载
						_this.$toast('保存失败，服务错误');
						console.log(error);
					});
				}
				
				// 修改地址
				if(_this.addAddressTit=='修改地址'){
					_this.$axios({
					  method: 'put',
					  url: port+'/v1/deliveryAddress/update',
					  headers:{'token':localStorage.getItem('token')},
					  params: {
						addressId:_this.addressId,
					    personId:userInfo.pId,//用户id
						contact:_this.userName,//姓名
						sex:_this.sex=='男'?1:2,//性别1男2女
						phone:_this.userPhone,//手机号
						cId:userInfo.cId,//单位id
						cAreaId:_this.schoolAreaId,//区域id
						buildId:_this.buildId,//楼宇id
						address :_this.detailAddress,//详细地址
						defaultAddress:_this.setDefaultAdd==true?'1':'0',//是否是默认地址0不是1是
					  }
					}).then(function(data){
						load.clear();//关闭加载
						console.log('保存地址',data)
						if (data.data.status==200) {
							_this.$toast(data.data.msg);
							_this.getAddress();
							setTimeout(()=>{
								_this.addAddressPopup=false;
							},2000)
							
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
						load.clear();//关闭加载
						_this.$toast('保存失败，服务错误');
						console.log(error);
					});
				}
				
			},
			// 打开选择地址popup
			openSelectAddressPopup(){
				this.selectAddressPopupShow=true;
				
				
			},
			// 提交订单
			submitOrder(){
				var _this=this;
				var resultOrder=[];//最终生成的订单
				var greenMoney=0;//环保费
				
				// if(!JSON.parse(localStorage.getItem('userInfo')).wxPayUrl){
				// 	_this.$toast('当前未配置微信付款地址，请线下支付');
				// 	return;
				// }
				
				var userInfo=JSON.parse(localStorage.getItem('userInfo'));
				var name='';//联系人
				var sex='';//性别
				var phone='';//电话
				var address='';//地址
				var orderTime='';//配送时间/取餐时间/用餐时间
				
				if(_this.orderWay==''){
					_this.$toast('请选择订餐方式');
					return;
				}
				
				// 不同用餐方式提交订单，共用字段设置
				if(_this.orderWay=='外送'){
					name=_this.wsName;
					sex=_this.wsSex=='（男）'?1:2;
					phone=_this.wsPhone;
					address=_this.wsAddress;
					orderTime=_this.wsTime;//外送时间
					if(_this.wsAddress==''){
						_this.$toast('请选择外送地址');
						return;
					}
					if(_this.wsTime==''){
						_this.$toast('请选择外送时间');
						return;
					}
				}
				if(_this.orderWay=='自提'){
					_this.buildId='';
					name=_this.ztName;
					sex=userInfo.pSex=='男'?1:2;
					phone=_this.ztPhone;
					address=_this.fullAddress;
					orderTime=_this.ztTime;//自提时间
					if(_this.ztTime==''){
						_this.$toast('请选择自提时间');
						return;
					}
				}
				if(_this.orderWay=='到店用餐'){
					_this.buildId='';
					name=_this.ztName;
					sex=userInfo.pSex=='男'?1:2;
					phone=_this.ztPhone;
					address=_this.fullAddress;
					orderTime=_this.ddTime;//自提时间
					if(_this.ddTime==''){
						_this.$toast('请选择用餐时间');
						return;
					}
				}
				
				
				
				for (var i=0;i<_this.myOrder.length;i++) {
					resultOrder.push({
						gId:_this.myOrder[i].gId,
						amount:_this.myOrder[i].gPrice*_this.myOrder[i].goodsNum,//单个商品总价=单价*数量
						buyCounter:_this.myOrder[i].goodsNum,//购买数量
						gDescribe:_this.myOrder[i].gDescribe,//商品描述
						gKindName:_this.myOrder[i].gKindName,//商品类别名称
						gName:_this.myOrder[i].gName,//商品名称
						gNo:_this.myOrder[i].gNo,//商品编号
						gPic:_this.myOrder[i].gPic,//商品图片
						gPrice:_this.myOrder[i].gPrice,//商品价格
						gProperties:_this.myOrder[i].gProperties,//商品属性
						gUnit:_this.myOrder[i].gUnit,//商品计量单位
						gGreenFee:_this.myOrder[i].gGreenFee==null?0:_this.myOrder[i].gGreenFee,//环保费
					})
					_this.myOrder[i].amount=_this.myOrder[i].gPrice*_this.myOrder[i].gPrice.goodsNum;//单个商品总价=单价*数量
				}
				
				console.log('提交订单>>>','订餐方式：',_this.orderWay,'，提交订单：',resultOrder,'备注：',_this.orderRemark);
				
				console.log('单位id',userInfo.cId)
				console.log('用户id',userInfo.pId)
				console.log('商家id',_this.$route.query.sellerId)
				console.log('商家窗口地址',_this.winAddress)
				console.log('商家窗口名称',_this.$route.query.winName)
				console.log('总金额',_this.goodsTotal)
				console.log('配送费',parseFloat(_this.$route.query.deliveryFee))
				console.log('备注',_this.orderRemark)
				console.log('配送地址所属的建筑id',_this.buildId)
				console.log('订单',resultOrder)
				console.log('用餐方式',_this.orderWay=='外送'?2:_this.orderWay=='自提'?1:3)
				console.log('联系人',name)
				console.log('性别',sex)
				console.log('电话',phone)
				console.log('配送详细地址',address)
				console.log('配送时间/取餐时间/用餐时间',orderTime)
				
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				
				_this.$axios({
				  method: 'post',
				  url: port+'/v1/order/insert',
				  headers:{'token':localStorage.getItem('token'),'content-type':'application/json'},
				  data:resultOrder,//订单主体
				  params: {
				    cId:userInfo.cId,//单位id
				    personId:userInfo.pId,//用户id
					sellerId:_this.$route.query.sellerId,//商家id
					sellerWinAddress:_this.winAddress,//商家窗口地址
					sellerWinName:_this.$route.query.winName,//商家窗口名称
					totalAmount:_this.goodsTotal+parseFloat(_this.$route.query.deliveryFee)+_this.greenMoney,//总金额
					deliveryFee:parseFloat(_this.$route.query.deliveryFee),//配送费
					remark:_this.orderRemark,//备注
					sellerWinFullAddress:_this.fullAddress,//商家窗口全地址 _this.fullAddress
					toBuildId:_this.buildId,//配送地址所属的建筑id
					mealMode:_this.orderWay=='外送'?2:_this.orderWay=='自提'?1:3,//用餐方式1自提2配送3进店用餐
					contact:name,//联系人
					sex:sex,//性别
					phone:phone,//电话
					address:address,//配送详细地址（自提、到店用餐）
					arrivalTime:orderTime,//配送时间/取餐时间/用餐时间
					picUrl:_this.winSplitImg,//窗口图片
					sellerPhone:_this.sellerPhone,//商家短话
				  }
				}).then(function(data){
					load.clear();//关闭加载
					console.log('提交订单',data)
					if (data.data.status==200) {
						_this.$toast('已提交');
						_this.payOrderNum=data.data.data;//订单编号
						_this.getOrderDetail(_this.payOrderNum);
						setTimeout(()=>{
							_this.payPopup=true;//打开支付popup
						},2000)
						
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
					_this.$toast('提交失败');
				
					console.log(error);
				});
				
			},
		
			// 打开订餐方式ActionSheet 
			openOrderWay(){
				if(this.orderWayActions.length==0){
					this.$toast('商家未设置订餐方式');
					return;
				}
				this.orderWayshow=true
			},
			// 选择用餐方式
			onSelectOrderWay(item) {
				console.log(item.name)
				if(item.name=='外送'){
					this.wsShow=true;
					this.ztShow=false;
					this.ddycShow=false;
				}
				if(item.name=='自提'){
					this.wsShow=false;
					this.ztShow=true;
					this.ddycShow=false;
				}
				if(item.name=='到店用餐'){
					this.wsShow=false;
					this.ztShow=false;
					this.ddycShow=true;
				}
			     this.orderWay=item.name
			},
			// 计算总价
			countTotalPrice(){
				var count=0;//局部变量总价
				var _this=this;
				_this.goodsList.forEach(function(a,i){
					count+=a.goodsNum*a.gPrice;
				})
				_this.goodsTotal=parseFloat(count);
				console.log(_this.goodsTotal)
			},
			// 商品加
			addGoods(item,e,itemCounter){
				console.log(itemCounter)
				// console.log(e.target)//获取点击的this元素
				var ball=this.parabolic();
				
				// 商品数量最多为100
					if(itemCounter<100){
						item.goodsNum>=100?100:item.goodsNum++;
						if(e){
							ball(e.target);
						}
						this.shopCarGoodsNum++
						this.countTotalPrice();
					}
					
			},
			// 商品减
			minGoods(item){
				item.goodsNum<=0?0:item.goodsNum--;
				this.shopCarGoodsNum--
				if(this.shopCarGoodsNum<=0){
					this.ShopDetailShow=false;
				}
				this.countTotalPrice();
			},
			// 登录
			logIn() {
				var _this = this
				//判断输入框是否为空
				if(_this.loginName==""){
					_this.$toast("请输入用户名");
					return;
				}
				if(_this.loginPassword==""){
					_this.$toast("请输入密码");
					return;
				}
				
				var load = _this.$toast.loading({
					message: '登录中...',
					duration: 0,
					forbidClick: true,
				});
				_this.$axios({
					method: 'POST',
					url: port + '/v1/person/doLogin',
					params: {
						username : _this.loginName,
						password :_this.loginPassword,
						cId:JSON.parse(localStorage.getItem('unitInfo')).cId
					}
				}).then(function(data) {
					console.log('登录', data)
					if(data.data.status==200){
						load.clear();
						_this.$toast("登录成功");
						localStorage.setItem('userLogin',true)
						localStorage.setItem('token',data.data.data)
						// 获取登录人信息
						_this.$axios({
							method: 'get',
							url: port + '/v1/person/getPersonInfo',
							headers:{'token':data.data.data},
							params: {
								token : data.data.data,
								cId:JSON.parse(localStorage.getItem('unitInfo')).cId
							}
						}).then(function(data1) {
							console.log('获取登录人信息', data1)
							if(data1.data.status==200){
								localStorage.setItem('userInfo',JSON.stringify(data1.data.data))
							}
							
						}).catch(function() {
							
						});
						setTimeout(()=>{
							var greenMoney=0;//环保费
							_this.myOrder=[];
							_this.loginPopup=false;//关闭登录popup
							_this.goodsOrderShow=true;//打开提交订单popup
							_this.getAddress();//获取收货地址
							for(var i=0;i<_this.goodsList.length;i++){
								if(_this.goodsList[i].gGreenFee==null){
									_this.goodsList[i].gGreenFee=0;
								}
								if(_this.goodsList[i].goodsNum>0){
									_this.myOrder.push(_this.goodsList[i])
								}
							}
							
							// 计算每个商品的环保费
							for (var i=0;i<_this.myOrder.length;i++) {
								greenMoney+=parseFloat(_this.myOrder[i].goodsNum*_this.myOrder[i].gGreenFee)
							}
							_this.greenMoney=greenMoney;
						},1000)
					}else{
						_this.$toast(data.data.msg);
					}
				}).catch(function() {
					
				});
			},
			// 去结算
			goAccount(){
				var greenMoney=0;//环保费
				this.myOrder=[];
				
				if(this.$route.query.winState==1){
					this.$toast('休息中');
					return;
				}
				
				
				// 如果商品数量为0
				if(this.goodsTotal<=0){
					this.$toast('请添加菜品');
					return
				}
				
				for(var i=0;i<this.goodsList.length;i++){
					if(this.goodsList[i].goodsNum>=1){
						if(!(this.goodsList[i].gSellMin<=this.goodsList[i].goodsNum)){
							console.log(this.goodsList)
							this.$toast(this.goodsList[i].gName+'最小购买数量为'+this.goodsList[i].gSellMin)
							return;
						}
					}
					if(this.goodsList[i].gGreenFee==null){
						this.goodsList[i].gGreenFee=0;
					}
					if(this.goodsList[i].goodsNum>0){
						this.myOrder.push(this.goodsList[i])
					}
				}
				
				// 如果没登录，去登录
				if(!isLogin()){
					this.loginPopup=true;
					return;
				}
				
				// 计算每个商品的环保费
				for (var i=0;i<this.myOrder.length;i++) {
					greenMoney+=parseFloat(this.myOrder[i].goodsNum*this.myOrder[i].gGreenFee)
				}
				this.greenMoney=greenMoney;
				
				this.getAddress();//获取收货地址
				this.goodsOrderShow=true;//打开提交订单popup
				
			},
			//点击购物车打开购物车详情
			openShopCar(){
				if(!this.shopCarGoodsNum<=0){
					this.ShopDetailShow=true
				}
			},
			// 打开窗口照片
			openMclz(e){
				//设置共用的证件照popup标题 
				this.idCardPhotoTit=e.target.innerText;
				this.idCardPhotoPopup=true;
				this.getMclz()
			},
			// 打开资质证照
			openZz(e){
				//设置共用的证件照popup标题 
				this.idCardPhotoTit=e.target.innerText;
				this.idCardPhotoPopup=true;
				this.getZzzz()
			},
			// 打开健康证
			openHealth(e){
				//设置共用的证件照popup标题 
				this.idCardPhotoTit=e.target.innerText;
				this.idCardPhotoPopup=true;
				this.getHealthy();
			},
			// 预览商家证件照大图
			prevIdPhone(index){
				var imgArr=[];
				for (var i=0;i<this.idCardPhotoList.length;i++) {
					imgArr.push(this.idCardPhotoList[i].picUrl)
				}
				var _this=this;
				console.log(imgArr)
				ImagePreview({
				  images: imgArr,
				  startPosition: index,
				  loop:false,
				  onClose() {
				    // do something
				  },
				});
			},
			// 商品、评价、商家tab切换
			goodsTypeTab(e){
				this.num=e.target.dataset.num;
				
				if(this.num==2){
					pageNum=1;
					this.sellerAssess=[];
					this.getSellerAssess(pageNum);//获取商家评价
				}
				if(this.num==3){
					this.getSellerInfo();//获取商家信息
				}
			},
			// 查询窗口照片
			getMclz(){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
				
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/seller/querySellerPic',
				  params: {
				    sellerId:this.$route.query.sellerId
				  }
				}).then(function(data){
					load.clear();//关闭加载
					console.log('窗口照片',data)
					if (data.data.status==200) {
						if(data.data.data.length>=0){
							for (var i=0;i<data.data.data.length;i++) {
								data.data.data[i].picUrl=sellerPort+data.data.data[i].picUrl;
							}
							_this.idCardPhotoList=data.data.data;
						}else{
							_this.$toast(data.data.msg);
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
					_this.$toast('登录过期，请重新登录');
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},2000)
					console.log(error);
				});
			},
			// 查询资质证照
			getZzzz(){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
				
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/seller/queryPaper',
				  params: {
				    sellerId:this.$route.query.sellerId
				  }
				}).then(function(data){
					load.clear();//关闭加载
					console.log('资质证照',data)
					if (data.data.status==200) {
						if(data.data.data.length>=0){
							for (var i=0;i<data.data.data.length;i++) {
								data.data.data[i].picUrl=sellerPort+data.data.data[i].picUrl;
							}
							_this.idCardPhotoList=data.data.data;
						}else{
							_this.$toast(data.data.msg);
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
					_this.$toast('登录过期，请重新登录');
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},2000)
					console.log(error);
				});
			},
			
			// 查询员工健康证
			getHealthy(){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
				
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/seller/queryEmployee',
				  params: {
				    sellerId:this.$route.query.sellerId
				  }
				}).then(function(data){
					load.clear();//关闭加载
					console.log('员工健康证',data)
					if (data.data.status==200) {
						if(data.data.data.length>=0){
							for (var i=0;i<data.data.data.length;i++) {
								data.data.data[i].picUrl=sellerPort+data.data.data[i].picUrl;
							}
							_this.idCardPhotoList=data.data.data;
						}else{
							_this.$toast(data.data.msg);
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
					_this.$toast('登录过期，请重新登录');
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},2000)
					console.log(error);
				});
			},
			
			// 商品类别切换
			typeTab(event){
				var ele=event.target.dataset.goodstype//获取点击id，
				this.typeNum=event.target.dataset.type;//tab切换
				document.querySelector('#'+ele).scrollIntoView({behavior: "smooth"});//点击分类，找到对应的id元素滚动到可视区域内
			},

			//获取商品分类、商品分类对应的列表
			getGoodsType(){
				var _this=this;
				
				_this.goodsList=[];
				_this.goodsTypeArr=[];
				
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
				
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/ordermeal/queryGoodsKindBySellerId',
				  params: {
				    sellerId:this.$route.query.sellerId
				  }
				}).then(function(data){
					load.clear();//关闭加载
					console.log('所有商品',data)
					if (data.data.status==200) {
						if (data.data.data.length>0) {
							_this.goodsTypeArr=data.data.data;
							for(var i=0;i<_this.goodsTypeArr.length;i++){
								for(var j=0;j<_this.goodsTypeArr[i].goodsList.length;j++){
									_this.goodsTypeArr[i].goodsList[j].goodsNum=0
									if(!_this.goodsTypeArr[i].goodsList[j].gPic){
										_this.goodsTypeArr[i].goodsList[j].gPic='./static/images/icon/default1.png'//如果当前菜品没有图片，则设置默认图
									}else{
										_this.goodsTypeArr[i].goodsList[j].gPic=sellerPort+_this.goodsTypeArr[i].goodsList[j].gPic
									}
									_this.goodsList.push(_this.goodsTypeArr[i].goodsList[j])//把商品分类里的商品列表抽出来
								}
							}

							console.log('商品类别',_this.goodsTypeArr);
							console.log('所有商品列表',_this.goodsList)
						}else {
							_this.$toast('暂无商品信息');
						}
						
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					_this.$toast('登录过期，请重新登录');
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},2000)
					console.log(error);
				});
			},
			
			// 清空购物车
			clearShopCar(){
				this.getGoodsType();
				this.typeNum=0;//商品类别切换
				this.shopCarGoodsNum=0;//购物差角标归零
				this.goodsTotal=0;//总价归零
				this.ShopDetailShow=false;//关闭购物车详情
				console.log('清空购物车',this.goodsList)
			},
			// 获取微信付款地址
			getWeXinPayAdd(){
				var _this=this;
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/order/getWXPayUrl',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    cId:JSON.parse(localStorage.getItem('userInfo')).cId
				  }
				}).then(function(data){
					console.log('获取微信付款地址',data)
					if (data.data.status==200) {
						_this.weXinPayUrl=data.data.data;
					}
					if(data.data.status==600){
						_this.$toast(data.data.msg);
					}
					if(data.data.status==600||data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('请登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},1000)
					}
				}).catch(function(error){
					_this.$toast('请登录');
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},1000)
					console.log(error);
				});
			}

		},
		created:function(){
			
			console.log('窗口状态',this.$route.query.winState)
			
			console.log('分数',this.$route.query.starScore)
			this.getSellerInfo();//获取商家
			// this.getWeXinPayAdd();//获取微信付款地址
			var _this=this;
			_this.winHeight=document.documentElement.clientHeight;//窗口高度
			
			// 遍历传递过来的用餐方式
			if(_this.$route.query.deliveryMode){
				for (var i=0;i<_this.$route.query.deliveryMode.length;i++) {
					_this.orderWayActions.push({name:_this.$route.query.deliveryMode[i]=='1'?'外送':_this.$route.query.deliveryMode[i]=='2'?'自提':'到店用餐'})
				}
			}
			// 用餐方式
			var wayArr=[];
			for (var i=0;i<_this.orderWayActions.length;i++) {
				wayArr.push(_this.orderWayActions[i].name);
			}
			
			if(wayArr.indexOf('外送')!=-1){
				_this.wsShow=true;
				_this.orderWay='外送';
			}else if(wayArr.indexOf('自提')!=-1){
				_this.ztShow=true;
				_this.orderWay='自提';
			}else if(wayArr.indexOf('到店用餐')!=-1){
				_this.ddycShow=true;
				_this.orderWay='到店用餐';
			}
			
			console.log('用餐方式',wayArr)
			
			// _this.getAddress();//获取收货地址
			_this.getGoodsType();//商品类别
		}
	};
</script>
<style type="text/css">
.win-detail-top{background: #fff;background: #fff;margin: 10px;padding: 10px;padding-right: 75px;position: relative;border-radius: 6px;}
.win-detail-top .win-name{font-size: 16px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-bottom: 4px;}
.win-detail-top .win-img{position: absolute;width: 60px;height: 60px;right: 10px;top: 10px;}
.win-detail-top .sell-num span{margin-left: 4px;color: #666;font-size: 13px;}
.win-detail-top .send-price{margin: 4px 0;}
.win-detail-top .send-price,.win-detail-top .win-tips{font-size: 13px;color: #999;}
.win-detail-top .win-tips .iconfont{color: #F4BE42;margin-right: 6px;}

.goods-type-wrap{background: #fff;}
.goods-type-wrap .goods-type-tab{border-bottom: 1px solid #eee;}
.goods-type-wrap .goods-type-tab a{color: #333;margin-right: 20px;padding: 10px;display: inline-block;}
.goods-type-wrap .goods-type-tab a.active{font-weight: bold;position: relative;}
.goods-type-wrap .goods-type-tab a.active::after{content: '';position: absolute;width: 100%;height: 3px;background: #F4BE42;left: 50%;bottom: 0;transform: translateX(-50%);}
.goods-type-main .goodst-type-item{display: none;overflow-y: auto;-webkit-overflow-scrolling: touch;}
.goods-type-main .goodst-type-item.show{display: block;}
.goods-type-wrap{margin: 10px;}

.goods-type-left{overflow-y: auto;width: 100px;box-sizing: border-box;border-right: 1px solid #eee;-webkit-overflow-scrolling: touch;float: left;}
.goods-type-left li{text-align: center;padding: 10px 0;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;color: #333;}
.goods-type-left li.active{background: #F8F8F8;font-weight: bold;}
.goods-type-right{margin-left: 100px;padding: 10px;box-sizing: border-box;-webkit-overflow-scrolling: touch;overflow-y: auto;}

.goods-list{overflow: hidden;-webkit-overflow-scrolling: touch;}
.goods-list .goods-img{width: 70px;height: 70px;float: left;margin-right: 10px;position: relative;}
.goods-list .goods-img img{width: 70px;height: 70px;}
.goods-list p{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.goods-list .goods-name{font-size: 14px;font-weight: bold;margin-bottom: 4px;}
.goods-list .sell-num{color: #999;}
.goods-list .goods-price{color: #EA4646;font-weight: bold;margin-top: 5px;position: relative;padding-right: 70px;}
.goods-list li{position: relative;overflow: hidden;margin-bottom: 10px;}
.p-goods-tit{margin-bottom: 10px;}

.counter{position: absolute;width: 70px;overflow: hidden;right: 0;top: 0;height: 20px;}
.counter span{width: 20px;height: 20px;border-radius: 50%;line-height: 20px;font-size: 12px;}
.counter span.min{border: 1px solid #ddd;left: 0;}
.counter span.add{background: #F4BE42;right: 0;}
.counter span,.counter input{width: 20px;box-sizing: border-box;color: #333;text-align: center;height: 20px;position: absolute;}
.counter input{border: none;font-weight: normal;left: 25px;}

.shop-car{padding: 10px;box-sizing: border-box;position: fixed;width: 100%;left: 0;bottom: 0;box-sizing: border-box;}
.shop-car .shop-car-main{padding-right: 80px;background: #0C0C0C;position: relative;height: 45px;border-radius: 100px;overflow: hidden;padding-left: 75px;}
.shop-car-count-btn{position: absolute;height: 45px;right: 0;top: 0;background: #F4BE42;color: #333;font-weight: bold;line-height: 45px;width: 80px;text-align: center;}
.shop-car-qs-tip{position: absolute;height: 45px;right: 0;top: 0;color: #333;font-weight: bold;line-height: 45px;padding: 0 10px;}
.shop-car-count-btn:active{opacity: .9;}
.shop-car-icon{position: absolute;width: 45px;height: 45px;left: 15px;top: 0;color: #fff;text-align: center;line-height: 45px;font-size: 26px;color: #F4BE42;}
.shop-tag{position: absolute;right: 0;top: 0;}
.shop-car-info{color: #fff;font-size: 12px;}
.shop-car-info .shop-car-price{font-size: 15px;font-weight: bold;margin: 2px 0;}

.score-top{padding: 15px;border-bottom: 1px solid #eee;}
.score-tip{color: #999;text-align: right;}
.score-num{font-size: 20px;font-weight: bold;margin-right: 10px;vertical-align: text-bottom;color: #F4BE42;}
.dis-list li{position: relative;border-bottom: 1px solid #eee;padding: 10px 10px 10px 60px;min-height: 40px;}
.dis-list li .head-img{position: absolute;width: 40px;height: 40px;left: 10px;top: 10px;border-radius: 50%;}
.dis-user-name{display: flex;justify-content: space-between;}
.dis-remark{font-size: 12px;color: #999;}
.dis-user-name .dis-name{font-size: 15px;margin-bottom: 10px;}
.dis-user-name .dis-date{font-size: 12px;color: #999;}
.dis-score{color: #999;font-size: 12px;margin: 5px 0;}
.dis-score span{vertical-align: super;}
.seller-info-top{padding: 10px 15px;}
.seller-info-top p{font-size: 12px;margin: 4px 0;}
.seller-info-top .tit{font-size: 15px;font-weight: bold;margin-bottom: 10px;}

.shop-car-detail{position: relative;box-sizing: border-box;padding: 10;}
.shop-car-detail-tit{display: flex;justify-content: space-between;}
.shop-car-detail-tit span{display: block;padding: 10px;}
.goods-list.shop-car-list{height: 260px;overflow-y: auto;margin: 0 10px;}
.goods-list.shop-car-list .goods-name{margin-bottom: 26px;}

.address-list{padding: 10px;}
.address-list li{position: relative;border-bottom: 1px solid #eee;padding: 10px 40px;}
.edit-add{position: absolute;width: 40px;height: 40px;text-align: center;line-height: 40px;right: 0;top: 10px;}
.address-list input[name='selectAddRadio']{position: absolute;-webkit-appearance: none;width: 20px;height: 20px;border: 1px solid #F4BE42;box-sizing: border-box;left: 0;top: 18px;border-radius: 50%;}
.address-list input[name='selectAddRadio']:checked::after{position: absolute;width: 14px;height: 14px;background-color: #F4BE42;content: '';border-radius: 50%;left: 2px;top: 2px;}

.zizhi-photo-wrap ul{overflow: hidden;margin: 5px;}
.zizhi-photo-wrap li{width: 50%;float: left;padding: 5px;box-sizing: border-box;}
.zizhi-photo-wrap .zizhi-img{height: 120px;background-position: center center;background-size: cover;background-repeat: no-repeat;}
.zizhi-photo-wrap .zanwu{text-align: center;margin: 15px;}

.pay-wrap{background: #fff;padding: 10px;margin: 10px;text-align: center;border-radius: 6px;}
.pay-wrap p{color: #A3A3A3;margin: 10px 0;}
.pay-wrap p.pay-total{font-size: 30px;color: #333;font-weight: bold;}
.pay-btn{position: absolute;width: 100%;background-color: #F4BE42;left: 0;bottom: 0;text-align: center;padding: 13px 0;}
.pay-btn:active{opacity: .9;color: #333;}
.pay-way{margin: 10px;border-radius: 6px;overflow: hidden;font-size: 16px;}

#ball{width:10px;height:10px;background: #F4BE42;border-radius: 50%;position: fixed;z-index: 2;bottom: 60px;left: 60px;}
.open-time-cell{flex: none;font-size: 13px;}
.g-tag{position: absolute;right: 0;top: 0;}

.login {
		position: fixed;
		width: 100%;
		height: 100%;

	}

	.bg {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.bg img {
		width: 100%;
		height: 100%;
		z-index: inherit;
	}

	.bg-food {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.bg-food img {
		width: 100%;
		height: 100%;
		z-index: inherit;
	}

	.content {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 2;
		padding: 0 20px;
		box-sizing: border-box;
	}

	.title {
		font-size: 30px;
		font-weight: 400;
		width: 100%;
		text-align: center;
		margin-top: 116px;
		margin-bottom: 60px;

	}

	.confirm {
		width: 100%;
		font-size: 20px;
		text-align: center;
		margin-top: 35px;
		border: 0;
	}

	.confirm-btn {
		background: #F4BE42;
		border: 0;
		border-radius: 6px;
		font-size: 20px;
		font-family: PingFang SC;
		font-weight: 500;
		color: white;
	}

	.input-box {
		background: #898482;	
	}

	.input-item {
		color: #FFFFFF;
		display: flex;
		align-items: center;
		background:#898482;		
		border-radius: 5px;
		margin-bottom: 20px;
		overflow: hidden;
	}

	.input-item img {
		width:24px;
		height: 24px;	
		margin:0 12px;
		margin-right: 0;
	}

	.login-input {
		background: #898482;	
	}
</style>