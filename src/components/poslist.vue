<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>职位列表</span>
        <div class="f-r">
          <span class="item-ex"><span class="example-f">未发布</span><i class="fa fa-circle no-pub-c"></i></span>
          <span class="item-ex"><span class="example-f">审核失败</span><i class="fa fa-circle filed-c"></i></span>
          <span class="item-ex"><span class="example-f">审批中</span><i class="fa fa-circle wait-c"></i></span>
          <span class="item-ex"><span class="example-f">已发布</span><i class="fa fa-circle success-c"></i></span>
          <span class="item-ex"><span class="example-f">订单关闭</span><i class="fa fa-circle colse-c"></i></span>
        </div>
      </div>
          <el-row :gutter="20" class="titleList">
            <el-col :span="6" v-for="item in positionList" :key="item.id" class="text item">
              <el-card class="box-card-son">
                <i class="fa fa-circle no-pub-c f-p" v-if="item.state==='SUBMIT'?true:false"></i>
                <i class="fa fa-circle filed-c f-p" v-else-if="item.state==='AUDIT_FAILED'?true:false"></i>
                <i class="fa fa-circle wait-c f-p" v-else-if="item.state==='WAIT_AUDIT'?true:false"></i>
                <i class="fa fa-circle colse-c f-p" v-else-if="item.state==='COMPLETED'?true:false"></i>
                <i class="fa fa-circle success-c f-p" v-else></i>
                <div class="text item" @click="goPosDetailorReset(item.id,item.title,item.state)">
                  <h3>{{item.title}}</h3>
                  <p>{{ new Date(item.createTime).toLocaleDateString()}}</p>
                  <div class="x-disst">
                    <div>
                      <span class="custom-x">需求</span>
                      <span class="barII"></span>
                      <span class="custom-x">已招</span>
                    </div>
                    <div class="barIlog"></div>
                    <div>
                      <span class="custom-n">{{item.recruitingNumber}}</span>
                      <span class="barIII"></span>
                      <span class="custom-n">{{item.recruitedNumber}}</span>
                    </div>
                  </div>
                  <div class="attude"><span>待处理<span class="ing_ed_f-ds">{{item.waitingProcessNumber}}</span>人<span class="barI"></span></span><span>已处理<span class="ing_ed_f-ds">{{item.processedNumber}}</span>人<span
                    class="barI"></span></span><span>处理中<span class="ing_ed_f-ds">{{item.processingNumber}}</span>人</span></div>
                </div>
              </el-card>
            </el-col>
          </el-row>
      <div class="page-p">
        <el-pagination
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="totalElements">
        </el-pagination>
      </div>
    </el-card>
  </div>

</template>

<script>
  import axios from 'axios'
  export default {
    name: "poslist",
    data() {
      return {
        activeName: 'first',
        positionList: [],
        totalElements:0,
        pageSize:12
      };
    },
    mounted() {
      if (sessionStorage.getItem('token') === null) {
        return
      }else if(sessionStorage.getItem('token') === undefined){
        return
      }else if(sessionStorage.getItem('token') === ''){
        return
      }else{
        axios.defaults.headers = {
          'X-UserToken': sessionStorage.getItem('token')
        }
        this.getPositionList('',0,this.pageSize,'createTime,desc')
      }
    },
    methods: {
      handleCurrentChange(val){
        this.getPositionList('',val-1,this.pageSize,'createTime,desc')
      },
      em_alert(massage,type) {
        this.$message({
          showClose: true,
          message: massage,
          type: type
        });
      },
      goPosDetailorReset(id,title,state) {
        if(state==='SUBMIT'||state==='AUDIT_FAILED') {//未发布、审核失败均需要跳入职位修改重新提交
          this.$emit('resetPositionMessage',id)
        }else if(state==='WAIT_AUDIT'){//审批中，不跳转，需要提示用户
           this.em_alert('待审批，请耐心等待...','')
        }else{//说明不是已提交、审核，直接跳入职位候选页面(已发布)
          sessionStorage.setItem('currentId', id)
          sessionStorage.setItem('currentTitle', title)
          this.$router.push({
            path: '/prodetail'
          })
        }
      },
      getPositionList(title,page,size, sort) {
        axios.get(this.serviceUrl+'/api/jobDetail/getMyJobDetails?title='+title+
          '&page='+page+'&size='+size+'&sort='+sort)
          .then((response) => {
            console.log('返回列表数据')
            console.log(response)
            this.totalElements=parseInt(response.data.totalElements)
            console.log(this.totalElements)
            this.positionList = response.data.content;
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert=decodeURI(error.response.headers['x-alert'])
            this.em_alert(alert,'error')
          })
      }
    }

  }
</script>
<style>
</style>
<style scoped>
  .f-p{
    position: relative;
    right: -50%;
  }
  .item-ex{
  margin-right: 10px;
  }
  .example-f{
    font-size: 12px;
    color: #c0c4cc;
    padding: 0px 5px;
  }
  .no-pub-c{
    color:#C0C4CC;
  }
  .fa-circle{
    font-size: 18px;
  }
  .success-c{
    color:#67C23A;
  }
  .colse-c{
    color:#000;
  }
  .filed-c{
   color:#F56C6C;
  }
  .wait-c{
    color:#E6A23C;
  }
  .f-r{
    float: right;
  }
  .page-p{
    float: right;
  }
  .ing_ed_f-ds{
    color:#2bbbad;
  }
  .x-disst {
    font-weight: bold;
  }

  .custom-n {
    display: inline-block;
    margin-top: 5px;
    width: 35px;
    color:#2bbbad;
  }

  .custom-x {
    display: inline-block;
    margin-bottom: 5px;
  }
  .box-card-son:hover{
    transform: scale(1.1, 1.1);
  }
  .attude {
    font-size: 12px;
  }

  .text {
    font-size: 14px;

  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 83%;
    margin-left: 16%;
    min-height:768px;
    border: 0;
    margin-top: 70px;
  }

  .box-card-son {
    color:#566676;
    text-align: center;
    background: #F2F6FC;
    cursor: pointer;
  }

  p {
    margin-top: 0;
    font-size: 12px;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 0;
  }

  .barI {
    display: inline-block;
    width: 1px;
    height: 14px;
    background-image: linear-gradient(red, blue);
    margin: 0 3px;
    vertical-align: bottom;
  }

  .barIlog {
    width: 60%;
    height: 1px;
    background-image: linear-gradient(left, blue, red);
    background-image: -webkit-gradient(linear, left top, right top, from(blue), to(red));
    margin: 0 auto;
  }

  .barII {
    display: inline-block;
    width: 1px;
    height: 12px;
    background-color: blue;
    vertical-align: bottom;
    margin: 0 12px;
  }

  .barIII {
    display: inline-block;
    width: 1px;
    height: 12px;
    background-color: red;
    vertical-align: top;
    margin: 0 12px;
  }
</style>
