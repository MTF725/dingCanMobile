<template>
	<div style="height: 40px;">
			<div class="top-fixed-nav">
				<div class="back iconfont icon-zuojiantou" @click="backPrevPage"></div>
				<span class="title">{{title}}</span>
			</div>
		</div>
</template>

<script type="text/javascript">
export default {
  name: 'topFixedNav',
  props: {
    title: String
  },
  methods:{
  	// 返回上一页
	backPrevPage(){
		this.$router.back(-1);
	},
  }
}
</script>

<style type="text/css" scoped>
/* 固定顶部导航 */
.top-fixed-nav{height: 40px;line-height: 40px;background: #F4BE42;position: fixed;width: 100%;left: 0;top: 0;text-align: center;z-index: 3;}
.top-fixed-nav .title{font-size: 18px;}
.top-fixed-nav .back{position: absolute;width: 40px;height: 40px;left: 0;top: 0;text-align: center;line-height: 40px;font-size: 20px;}
.top-fixed-nav .back:active{background: #fbca5b;}
</style>