<template>
  <div id="app">
	  
	  <!-- 底部导航 -->
	  	<div class="index-footer-nav" v-show="$route.name != 'login'&&$route.name != 'winList'&&$route.name != 'orderList'&&$route.name != 'winDetail'&&$route.name != 'pay'&&$route.name != 'searchGoods'">
	  		
			<router-link to="/index">
				<i class="iconfont icon-shouye"></i>
				<p>首页</p>
			</router-link>
			<router-link to="/orderList">
				<i class="iconfont icon-huabanfuben"></i>
				<p>订单</p>
			</router-link>
			<router-link to="/my">
				<i class="iconfont icon-dangqianzhanghao-"></i>
				<p>我的</p>
			</router-link>
	  	</div>
	  
	    <router-view></router-view>
          
		  
  </div>
</template>

<script type="text/javascript">
 export default{
 	data:function(){
 		return{
 			
 		};
 	},
 	methods:{
 		
 	},
 	created:function(){
 		
 	}
 }
</script>
<style>


</style>
