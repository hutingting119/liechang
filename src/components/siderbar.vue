<template>
  <div class="siderBar">
    <EasyScrollbar :barOption="opt">
      <div style="height:768px;background-color:#36404a;border-radius: 4px;">
        <el-menu
          :default-active="active"
          class="el-menu-vertical-demo"
          @select="resetActive"
          @open="handleOpen"
          @close="handleClose"
          background-color="#36404a"
          text-color="#fff"
          active-text-color="#ffd04b">
          <slot></slot>
        </el-menu>
      </div>
    </EasyScrollbar>
  </div>
</template>
<script>
  export default {
    name: "siderbar",
    props:{
      active:{
        type:String,
        default:'1'
      }
    },
    data() {
      return {
        opt: {
          barColor: "#959595",   //滚动条颜色
          barWidth: 6,           //滚动条宽度
          railColor: "#eee",     //导轨颜色
          barMarginRight: 0,     //垂直滚动条距离整个容器右侧距离单位（px）
          barMaginBottom: 0,     //水平滚动条距离底部距离单位（px)
          barOpacityMin: 0.3,      //滚动条非激活状态下的透明度
          zIndex: "auto",        //滚动条z-Index
          autohidemode: true,     //自动隐藏模式
          horizrailenabled: true,//是否显示水平滚动条
        }
      }
    },
    methods: {
      resetActive(index){
        this.$emit('resteActive',index);
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style>
</style>
<style scoped>
  .siderBar {
    width: 14%;
    position: fixed;
    top: 0;
    left: 1%;
    margin-top: 70px;
    transition: padding-top .3s;
    height: 100%
  }

  .el-menu-vertical-demo {
    border: 0;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
