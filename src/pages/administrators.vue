<template>
  <div>
    <navheader>
      <li class="barActive">管理员审批</li>
    </navheader>
    <siderbar :active="siderbarActive">
      <el-menu-item index="1" @click="togglecontext('hrapprove')">
        <i class="fa fa-user-circle"></i>
        <span slot="title">HR审批</span>
      </el-menu-item>
      <el-menu-item index="2" @click="togglecontext('posapprove')">
        <i class="fa fa-suitcase"></i>
        <span slot="title">职位审批</span>
      </el-menu-item>
      <el-menu-item index="3" @click="togglecontext('arwadhup')">
        <i class="fa fa-money"></i>
        <span slot="title">赏金库</span>
      </el-menu-item>
    </siderbar>
   <components :is="contains"></components>
  </div>
</template>

<script>
  import navheader from './../components/headernav'
  import siderbar from './../components/siderbar'
  import hrapprove from './../components/hrapprove'
  import posapprove from './../components/posapprove'
  import arwadhup from './../components/arwadhup'
    export default {
        name: "administrators",
        components:{
          navheader:navheader,
          siderbar:siderbar,
          hrapprove:hrapprove,
          posapprove:posapprove,
          arwadhup:arwadhup
        },
        data(){
          return{
            contains:'hrapprove',
            siderbarActive:'1'
          }
        },
      created(){
        this.tokenvident()
      },
      mounted(){

      },
      methods:{
        togglecontext(text) {
          this.contains = text
        },
        tokenvident() {
          if (sessionStorage.getItem('token') === null) {
            this.$router.push({path: '/login'})
          }else if(sessionStorage.getItem('token') === undefined){
            this.$router.push({path: '/login'})
          }else if(sessionStorage.getItem('token') === ''){
            this.$router.push({path: '/login'})
          }else{
            this.openFullScreen()
          }
        },
        openFullScreen() {
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          setTimeout(() => {
            loading.close();
          }, 800);
        }
      }
    }
</script>

<style scoped>

</style>
