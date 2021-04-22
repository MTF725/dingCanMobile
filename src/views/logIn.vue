<template>
	<div class="login">
		<div class="bg"><img src="../assets/login/login-bg.png" alt=""></div>
		<div class="bg-food"><img src="../assets/login/login-bgfood.png" alt=""></div>
		<div class="content">
			<div class="title">
				<p>网上订餐</p>
			</div>
			<div>
				<div class="input-item">
					<img src="../assets/login/username.png" alt="">
					<van-field class="login-input" v-model="userName"  placeholder="用户名" />
				</div>
				<div class="input-item">
					<img src="../assets/login/password.png" alt="">
					<van-field class="login-input" v-model="passWord" type="password"  placeholder="密码" />
				</div>
			</div>
			<div class="confirm">
				<van-button color="#F4BE42" type="primary" block @click="logIn()">登录</van-button>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	
	export default {
		data: function() {
			return {
				userName:"",
				passWord:""
			};
		},
		methods: {
			// 登录
			logIn() {
				var _this = this
				//判断输入框是否为空
				if(_this.userName==""){
					_this.$toast("请输入用户名");
					return;
				}
				if(_this.passWord==""){
					_this.$toast("请输入密码");
					return;
				}
				console.log(_this.userName)
				console.log(_this.passWord)
				var load = _this.$toast.loading({
					message: '登录中...',
					duration: 0,
					forbidClick: true,
				});
				_this.$axios({
					method: 'POST',
					url: port + '/v1/person/doLogin',
					params: {
						username : _this.userName,
						password :_this.passWord,
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
							_this.$router.push({path:'/index',query:{cId:localStorage.getItem('cId')}})
						},1000)
					}else{
						_this.$toast(data.data.msg);
					}
				}).catch(function() {
					
				});
			},

		},
		created: function() {
			
		}
	};
</script>
<style scoped="scoped" type="text/css">
html,body{height: 100%;}
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
		font-family: FZZongYi-M05S;
		font-weight: 400;
		color: white;
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
