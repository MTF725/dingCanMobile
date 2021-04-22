<template>
	<div>
		
		<div class="user-head-wrap">
			<div class="user-head">
				<img src="../../public/static/images/icon/default_head.png" alt="">
				<p class="user-name">{{userName}}</p>
			</div>
		</div>
		<div class="user-set-wrap">
			<van-cell-group>
			  <van-cell is-link v-on:click="personDataPopup=true">
			    <!-- 使用 title 插槽来自定义标题 -->
			    <template #title>
					<i class="iconfont icon-gerenziliao"></i>
			      <span class="custom-title">个人资料</span>
			    </template>
			  </van-cell>
			  <van-cell is-link v-on:click="editPasswordPopup=true">
			    <!-- 使用 title 插槽来自定义标题 -->
			    <template #title>
			  		<i class="iconfont icon-xiugaimima"></i>
			      <span class="custom-title">修改密码</span>
			    </template>
			  </van-cell>
			  <van-cell is-link v-on:click="selectAddressPopupShow=true;getAddress()">
			    <!-- 使用 title 插槽来自定义标题 -->
			    <template #title>
			  		<i class="iconfont icon-wodedizhi" style="margin-right: 3px;"></i>
			      <span class="custom-title">我的地址</span>
			    </template>
			  </van-cell>
			  <van-cell is-link v-on:click="aboutUsPopup=true">
			    <!-- 使用 title 插槽来自定义标题 -->
			    <template #title>
			  		<i class="iconfont icon-guanyuwomen"></i>
			      <span class="custom-title">关于我们</span>
			    </template>
			  </van-cell>
			</van-cell-group>
		</div>
		<div class="big-btn-wrap">
			<van-button type="primary" block color="#F4BE42" v-on:click="quitLogin">退出登录</van-button>
		</div>
		
		
		<!-- 用户资料 -->
		<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="personDataPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="personDataPopup=false"></span>个人资料
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<van-cell-group>
				  <van-cell title="姓名" :value="name" />
				  <van-cell title="学号/工号" :value="userNo" />
				  <van-cell title="性别" :value="sex" />
				  <van-cell title="电话" :value="phone" />
				</van-cell-group>
			</div>
		</van-popup>
		
		<!-- 修改密码 -->
		<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="editPasswordPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="editPasswordPopup=false"></span>修改密码
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<van-cell-group>
				  <van-field input-align="right" v-model="newPassword" label="新密码"  />
				  <van-field input-align="right" v-model="confirmNewPassword" label="确认新密码"  />
				</van-cell-group>
				<div class="big-btn-wrap">
					<van-button type="primary" block color="#F4BE42" v-on:click="confirmEditBtn">确定</van-button>
				</div>
			</div>
		</van-popup>
		
		<!-- 关于我们 -->
		<van-popup position="right" :style="{width:'100%', height: '100%'}" v-model="aboutUsPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="aboutUsPopup=false"></span>关于我们
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="about-wrap">
					<p>兴港智慧公寓平台-云订餐系统——开启订餐新征程，是一款致力于解决便捷用餐、避免拥挤用餐的新产品，用户通过“兴港智慧公寓平台-云订餐系统”便捷下单购买各种商品以及服务，对于外卖配送的商品通过配送员抢单的方式，由抢得订单的配送员采办配送。该系统采用最新流行的微服务架构模式，将应用和服务分解成更小的、松散耦合的组件，使得整个系统的易用性、扩展性和维护性更加便捷。</p>
				</div>
			</div>
		</van-popup>
		
		<!-- 选择地址 -->
		<van-popup position="right" :style="{width:'100%', height: '100%'}" v-model="selectAddressPopupShow">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="selectAddressPopupShow=false"></span>收货地址
				<span style="position: absolute;font-size: 14px;padding: 0 10px;right: 0;" v-on:click="addAddressPopup=true;userName='';userPhone='';schoolArea='';schoolAreaId='';buildName='';buildId='';detailAddress='';setDefaultAdd=false;addAddressTit='新增地址';addressId='';">新增地址</span>
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="address-list">
					<ul>
						<li v-for="item in allAddresArr">
							<p class="address-add">{{item.cAreaName}}{{item.buildName}}{{item.address}}</p>
							<p class="address-name"><span>{{item.contact}}</span><span style="margin-right: 10px;">{{item.phone}}</span><van-tag round v-show="item.defaultAddress==1">默认</van-tag></p>
							<span class="edit-add iconfont icon-xitongshezhibeifen" v-on:click="openEditAddressPopup(item.addressId)"></span>
							<span class="edit-del iconfont icon-qingkong" v-on:click="delAddress(item.addressId)"></span>
						</li>
					</ul>
				</div>
			</div>
		</van-popup>
		
		<!-- 新增地址、修改地址 -->
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
		
		<!-- 选择校区action -->
		<van-action-sheet overlay close-on-click-action v-model="selectAreaShow" :actions="selectAreaAction" @select="onSelectAreaAction" />
		
		<!-- 选择楼宇action -->
		<van-action-sheet overlay close-on-click-action v-model="selectBuildShow" :actions="selectBuildAction" @select="onSelectBuildAction" />
		
	</div>
</template>

<script type="text/javascript">
	export default{
		data:function(){
			return{
				name:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).pName:'',//用户名
				phone:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).pMobile:'',//用户电话
				sex:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).pSex:'',//用户性别
				userNo:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).pNo:'',//用户工号、登录名
				personDataPopup:false,//个人资料
				editPasswordPopup:false,//修改密码
				aboutUsPopup:false,//关于我们
				newPassword:'',//新密码
				confirmNewPassword:'',//确认新密码
				selectAddressPopupShow:false,//收货地址
				allAddresArr:[],//查询所有收货地址
				addAddressPopup:false,//新增地址
				userName:'',
				userPhone:'',
				schoolArea:'',
				schoolAreaId:'',
				buildName:'',
				buildId:'',
				detailAddress:'',
				setDefaultAdd:false,//设为默认地址
				addAddressTit:'新增地址',//添加、修改地址状态栏标题
				addressId:'',
				selectAreaShow:false,//选择校区action
				selectAreaAction: [],//选择校区内容
				selectBuildShow:false,//选择楼宇action
				selectBuildAction:[],//选择楼宇内容
			};
		},
		methods:{
			// 删除地址
			delAddress(addressId){
				var _this=this;
				_this.$dialog.confirm({
				  title: '温馨提示',
				  message: '确定删除该地址？',
				})
				  .then(() => {
				    // on confirm
					var load=_this.$toast.loading({
					  message: '提交中...',
					  duration:0,
					  forbidClick: true,
					});
					
					_this.$axios({
					  method: 'DELETE',
					  url: port+'/v1/deliveryAddress/delete',
					  headers:{'token':localStorage.getItem('token')},
					  params: {
					    addressId:addressId
					  }
					}).then(function(data){
						load.clear();//关闭加载
						console.log('删除地址',data)
						if (data.data.status==200) {
							_this.getAddress();
							_this.$toast('已删除');
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
				  })
				  .catch(() => {
				    // on cancel
				  });
			},
			// 查询单位区域
			getSchoolArea(){
				var _this=this;
				_this.$axios({
				  method: 'get',
				  url: port+'/v1/deliveryAddress/queryCompanyArea',
				  headers:{'token':localStorage.getItem('token')},
				  params: {
				    cId:JSON.parse(localStorage.getItem('userInfo')).cId
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
						_this.$toast('登录过期，请重新登录');
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
					
					if(data.data.status==600||data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请重新登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					console.log(error);
				});
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
					_this.allAddresArr=[];
					if (data.data.status==200) {
						if(data.data.data.length<=0){
							_this.$toast('暂无地址');
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
							}
						}
						
					}
					
					if(data.data.status==600||data.data.status==601||data.data.status==602||data.data.status==603){
						_this.$toast('登录过期，请重新登录');
						setTimeout(()=>{
							_this.$router.push({'path':'/login'})
						},2000)
					}
				}).catch(function(error){
					_this.$toast('获取地址失败');
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},2000)
					console.log(error);
				});
			},
			// 修改密码确定
			confirmEditBtn(){
				var _this=this;
				if(_this.newPassword==''){
					_this.$toast('请输入新密码');
					return;
				}
				if(_this.confirmNewPassword==''){
					_this.$toast('请确认新密码');
					return;
				}
				if(_this.newPassword!=_this.confirmNewPassword){
					_this.$toast('两次输入不一致');
					return;
				}
				
				_this.$dialog.confirm({
				  title: '温馨提示',
				  message: '确定修改当前密码？',
				})
				  .then(() => {
				    // on confirm
					var load=_this.$toast.loading({
					  message: '提交中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'post',
						  url: port+'/v1/person/modPassword',
						  headers:{'token':localStorage.getItem('token')},
						  params: {
						  	pNo:JSON.parse(localStorage.getItem('userInfo')).pNo,
							psd:_this.newPassword,
							cId:JSON.parse(localStorage.getItem('unitInfo')).cId
						  },
						}).then(function(data){
							console.log('修改密码',data)
							load.clear();
							if (data.data.status==200) {
								_this.$toast('已修改');
								setTimeout(()=>{
									_this.$router.push({'path':'/login'})
								},1000)
							}
							
							if(data.data.status==600||data.data.status==601||data.data.status==602||data.data.status==603){
								_this.$toast(data.data.msg);
								setTimeout(()=>{
									_this.$router.push({'path':'/login'})
								},1000)
							}
						}).catch(function(error){
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},1000)
						});
				  })
				  .catch(() => {
				    // on cancel
				  });
				
			},
			// 退出登录
			quitLogin(){
				var _this=this;
				_this.$dialog.confirm({
				  title: '温馨提示',
				  message: '确定退出当前登录？',
				})
				  .then(() => {
				    // on confirm
					var load=_this.$toast.loading({
					  message: '加载中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'post',
						  url: port+'/v1/person/logout',
						  headers:{'token':localStorage.getItem('token')},
						  params:{
							  cId:JSON.parse(localStorage.getItem('unitInfo')).cId
						  },
						}).then(function(data){
							console.log('退出登录',data)
							load.clear();
							if (data.data.status==200) {
								// 清除缓存的token和用户信息
								localStorage.removeItem('userLogin');
								// localStorage.removeItem('token');
								// localStorage.removeItem('userInfo');
								_this.$router.push({'path':'/index'})
							}
							
							if(data.data.status==600||data.data.status==601||data.data.status==602||data.data.status==603){
								_this.$toast(data.data.msg);
								setTimeout(()=>{
									_this.$router.push({'path':'/login'})
								},1000)
							}
						}).catch(function(error){
							console.log(error);
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},1000)
						});
				  })
				  .catch(() => {
				    // on cancel
				  });
			}
			
		},
		created:function(){
			var _this=this;
			if(!isLogin()){
				_this.$router.push({path:'/login'})
			}
		}
	}
</script>
<style type="text/css" scoped>
.user-head-wrap{height: 200px;background-color: #F4BE42;display: flex;align-items: center;justify-content: center;}
.user-head-wrap .user-head{text-align: center;}
.user-head-wrap .user-head img{width: 90px;height: 90px;border-radius: 50%;}
.user-head-wrap .user-head .user-name{font-size: 18px;margin-top: 10px;font-weight: bold;}

.user-set-wrap{margin: 10px;border-radius: 6px;overflow: hidden;margin-top: -20px;}
.user-set-wrap .iconfont{margin-right: 10px;}
.user-set-wrap .iconfont.icon-gerenziliao{color: #FFAA00;}
.user-set-wrap .iconfont.icon-xiugaimima{color:  #2FC661;}
.user-set-wrap .iconfont.icon-wodedizhi{color: #65B5FE;}
.user-set-wrap .iconfont.icon-guanyuwomen{color: #01D0BA;}

.about-wrap{padding: 10px;}
.about-wrap p{text-indent: 2em;line-height: 2em;}

.address-list{padding: 10px;}
.address-list li{position: relative;border-bottom: 1px solid #eee;padding: 10px 80px 10px 0;}
.edit-add{position: absolute;width: 40px;height: 40px;text-align: center;line-height: 40px;right: 40px;top: 10px;}
.edit-del{position: absolute;width: 40px;height: 40px;text-align: center;line-height: 40px;right: 0;top: 10px;}

</style>