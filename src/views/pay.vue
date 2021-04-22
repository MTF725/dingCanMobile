<template>
	<div>
		<!-- 在默认浏览器打开背景层 -->
		<div v-show="payLayer" class="open-default-browser">
			<div class="img">
				<img src="../assets/login/default_browser.png" alt="">
			</div>
		</div>
		
	</div>
</template>

<script type="text/javascript">
	
	export default {
		data: function() {
			return {
				wePayPopup:false,
				payLayer:true,
				iframeSrc:'',
			};
		},
		methods: {
			

		},
		created: function() {
			 var _this=this;
			
			  var ua = navigator.userAgent.toLowerCase();
			  if(ua.match(/MicroMessenger/i)=="micromessenger"){
					// 在微信浏览器
			  }else{
				  _this.payLayer=false;
				window.location.href=_this.$route.query.payUrl
			  }
			}
	};
</script>
<style scoped="scoped" type="text/css">
	
.open-default-browser{position: fixed;width: 100%;height: 100%;background: rgba(0,0,0,.8);left: 0;top: 0;z-index: 99999999;}
.open-default-browser .img{width: 80%;position: absolute;left: 57%;transform: translate(-50%,-50%);top: 25%;}
.open-default-browser img{width: 100%;}
</style>
