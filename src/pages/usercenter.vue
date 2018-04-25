<template>
   <div>
     <navheader>
     </navheader>
     <siderbars>
       <el-menu-item index="1" @click="togglecontext('persondata')">
         <i class="fa fa-address-card-o"></i>
         <span slot="title">个人中心</span>
       </el-menu-item>
       <el-menu-item index="2" @click="togglecontext('resetpersondetail')">
         <i class="fa fa-user-plus"></i>
         <span slot="title">完善个人资料</span>
       </el-menu-item>
       <el-menu-item index="3" @click="togglecontext('poshistory')">
         <i class="fa fa-history"></i>
         <span slot="title">职位发布历史</span>
       </el-menu-item>
     </siderbars>
     <component :is="contains"></component>
   </div>
</template>

<script>
  import navheader from './../components/headernav'
  import siderbars from './../components/siderbar'
  import persondata from './../components/persondata'
  import poshistory from './../components/poshistory'
  import resetPersonDetail from './../components/resetpersondetail'
    export default {
        name: "usercenter",
        components:{
          navheader:navheader,
          siderbars:siderbars,
          persondata:persondata,
          poshistory:poshistory,
          resetpersondetail:resetPersonDetail,
        },
        data(){
            return {
              siderbarActive:'1',
              contains:'persondata'
            }
        },
        created(){
          this.tokenvident()
        },
        mounted(){

        },
        methods:{
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
          },
          togglecontext(text) {
            this.contains = text
          },
          goUserCenter(url){
            this.$router.push({path: '/'+url})
          }
        }
    }
</script>

<style scoped>

</style>
