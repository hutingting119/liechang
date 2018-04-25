<template>
  <div>
      <siderbars :active="siderbarActive" @resteActive="resteActive">
        <el-menu-item index="1" @click="toggleContext('polist')">
          <i class="fa fa-table"></i>
          <span slot="title">职位列表</span>
        </el-menu-item>
        <el-menu-item index="2" @click="toggleContext('addposition')">
          <i class="fa fa-plus-square"></i>
          <span slot="title">职位添加</span>
        </el-menu-item>
      </siderbars>
      <navheader>
        <li class="barActive" @click="goPositionProgress('list')">需求大厅</li>
      </navheader>
      <component :is="contains" @resetPositionList="goList" @removePositionId="removePositionId" @resetPositionMessage="goAdd" :restPositionId="restPositionId"></component>
  </div>
</template>

<script>
  import navheader from './../components/headernav'
  import polist from './../components/poslist'
  import siderbars from './../components/siderbar'
  import addposition from './../components/addposition'
  export default {
    name: "positionlist",
    components: {
      navheader: navheader,
      addposition: addposition,
      siderbars: siderbars,
      polist: polist,
    },
    data() {
      return {
        contains: 'polist',
        siderbarActive:'1',
        restPositionId:''
      }
    },
    created() {
      this.tokenvident()
    },
    mounted() {
    },
    methods: {
      removePositionId(){
        this.restPositionId=''
      },
      resteActive(index){
        this.siderbarActive=index
      },
      goList(){
        this.siderbarActive='1'
        this.contains='polist'
      },
      goAdd(id){
        this.siderbarActive='2'
        this.contains='addposition'
        this.restPositionId=id
      },
      goPositionProgress(url){
        if(url==='list'){
          this.$router.push({path:'/posList'})
        }
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
      },
      toggleContext(text) {
        this.contains = text
      }
    }
  }
</script>
<style scoped>
</style>
