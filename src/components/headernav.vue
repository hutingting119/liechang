<template>
  <div class="topBar">
    <header class="topBarP">
      <div class="logoParent f-l" @click="goIndex"><img :src="logoSrc" alt="" class="logocontainer"><div class="logName">猎场</div></div>
      <ul class="topBarContainer f-l">
        <slot></slot>
      </ul>
      <ul class="topBarContainer1 f-r">
        <li>
          <el-badge :value="2" class="item">
            <i class="el-icon-bell"></i>
          </el-badge>
        </li>
        <li v-popover:popover2>
          <el-popover
            ref="popover2"
            placement="bottom"
            width="180"
            trigger="hover">
            <div>
              <ul>
                <li @click="goUserCenter" class=" person-li"><span class="icon-h"><i class="fa fa-user-circle-o"></i></span><span class="c-p">个人中心</span></li>
                <li @click="logoOut" class=" person-li"><span class="icon-o"><i class="fa fa-power-off"></i></span><span class="c-p">退出登录</span></li>
              </ul>
            </div>
          </el-popover>
          <div class="f-l"><img :src="headerImg" alt="头像"></div><div class="username f-l">{{userName}}</div>
        </li>
      </ul>
      <ul class="f-r scanf-c" v-if="ishaveScanf">
        <li>
          <img :src="scanfimg" alt="">
        </li>
      </ul>
    </header>
  </div>
</template>

<script>
  import logoSrc from './../images/logo.png'
  import scanfimg from './../images/scanf.png'
  import noheaderImage from './../images/user.png'
  export default {
    name: "headernav",
    data() {
      return {
        logoSrc:logoSrc,
        scanfimg:scanfimg,
        userName:  sessionStorage.getItem('username'),
        ishaveScanf:false
      }
    },
    computed:{
      headerImg(){
        return this.$store.state.headerImgUrl==''?noheaderImage:this.$store.state.headerImgUrl
      }
    },
    mounted(){
      this.plantType()
    },
    methods:{
      goIndex(){
        this.$router.push({path: sessionStorage.getItem('indexPath')})
      },
      goUserCenter(){
        this.$router.push({path: '/usercenter'})
      },
      plantType(){
        if(sessionStorage.getItem('plantFrom')==='HR'){
          this.ishaveScanf=true
        }else{
          this.ishaveScanf=false
        }
      },
      logoOut(){
        sessionStorage.clear()
        this.$router.push({path: '/login'})
      }
    }
  }
</script>
<style>
  .el-popover{
    padding:12px 0px
  }
  .el-popper[x-placement^=bottom] {
    margin-top: 0px;
  }
  .el-badge__content{
    border:0;
    top:12px !important;
  }
</style>
<style scoped>
  .icon-h{
    display: inline-block;
    height: 30px;
    width:30px;
    border-radius: 50%;
    background-color: #67c23a;
    line-height: 30px;
    text-align: center;
    color:#fff;
    margin-right: 10px;
  }
  .icon-o{
    display: inline-block;
    height: 30px;
    width:30px;
    border-radius: 50%;
    background-color: #f56c6c;
    line-height: 30px;
    text-align: center;
    color:#fff;
    margin-right: 10px;
  }
  .person-li{
    color: #6c8094;
    line-height: 20px;
    padding: 4px 10px;
  }
  .person-li:hover{
    color: #36404a;
    text-decoration: none;
    background-color: #f8f9fa;
  }
  .logName{
    display: inline-block;
    font-size: 20px;
    line-height: 30px;
    height: 60px;
    position: relative;
    bottom: 20px;
    padding: 0px 10px;
    color:#61dafb;
  }
  .logoParent{
    cursor: pointer;
    height:60px;
    padding-right: 20px;
  }
  .logocontainer{
    display: inline-block;
    width:auto;
    height:40px;
    margin: 10px 0px;
  }
  .username {
    display: inline-block;
    padding: 0 14px;
    width:40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }

  .topBarP {
      width: 95%;
      margin: 0 auto;
    }
  .scanf-c li{
    padding: 16px 5px 0px 5px
  }
  .scanf-c li img{
    height: 30px;
    width: auto;
    cursor: pointer;
  }
  .f-r {
    float: right;
  }

  .f-l {
    float: left;
  }
   .c-p{
     cursor: pointer;
     display: inline-block;
   }
  .topBar {
    background-color: #5fbeaa;
    border-radius: 0;
    margin-bottom: 0;
    padding: 0 10px 0 0;
    min-height: 60px;
    color: #fff;
    font-size: 14px;
    position: fixed;
    box-shadow: 0 4px 8px 0 rgba(7,17,27,.1);
    z-index:900;
    width:100%;
    top:0px;
  }

  .topBarContainer li {
    float: left;
    line-height: 59px;
    padding: 0 15px;
    list-style: none;
    cursor: pointer;
    position: relative;
    transition: border-color .3s, background-color .3s, color .3s;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .topBarContainer li:hover {
    background-color: #303133;
    border-bottom: 2px solid #ffd04b;
  }

  .topBarContainer1 li {
    float: left;
    line-height: 60px;
    padding: 0 15px;
    list-style: none;
    cursor: pointer;
    position: relative;
    transition: border-color .3s, background-color .3s, color .3s;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .topBarContainer1 img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
  }

  .topBarContainer1 i {
    font-size: 20px;
  }

  .topBarContainer1 li:hover {
    background-color: #303133;
  }

  .barActive {
    background-color: #303133;
    border-bottom: 2px solid #ffd04b;
    color: #ffd04b
  }
</style>
