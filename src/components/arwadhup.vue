<template>
  <div class="award">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>赏金明细表</span>
      </div>
      <div class="awardMoney">账户余额:<span>{{arawermoney}}</span><span>元</span></div>
      <div class="filter-c">
        <el-date-picker
          v-model="dateValue"
          value-format="timestamp"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select v-model="selectValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="success" @click="filterData">筛选</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%" align="center">
        <el-table-column
          prop="createTime"
          label="日期" align="center">
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          label="订单号" align="center">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="金额" align="center">
        </el-table-column>
        <el-table-column
          prop="detail"
          label="备注" align="center">
        </el-table-column>
      </el-table>
      <div class="page-p">
        <el-pagination
          background
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
  axios.defaults.headers = {
    'X-UserToken': sessionStorage.getItem('token')
  }
  export default {
    name: "arwadhup",
    data() {
      return {
        dateValue: [],
        selectValue: '',
        arawermoney:'',
        options: [{
          value: 'RECHARGE',
          label: '充值'
        }, {
          value: 'ORDER_PAYMENT',
          label: '支付'
        },{
          value: 'ORDER_REFUND',
          label: '退款'
        }],
        swatch: true,
        multipleSelection: [],
        tableData: [],
        totalElements:0
      }
    },
    mounted() {
      this.dashmoney()
      this.getArwadData('','',0,10,'createTime,desc','')
    },
    methods: {
      handleCurrentChange(val){
        console.log(this.dateValue)
        let startTime=this.dateValue[0]
        let endTime=this.dateValue[1]
        if(startTime===undefined){
          startTime=''
        }
        if(endTime===undefined){
          endTime=''
        }
        this.getArwadData(startTime,endTime,val-1,10,'createTime,desc',this.selectValue)
      },
      em_alert(massage, type) {
        this.$message({
          showClose: true,
          message: massage,
          type: type
        });
      },
      filterData(){
        let startTime=this.dateValue[0]
        let endTime=this.dateValue[1]
        if(startTime===undefined){
          startTime=''
        }
        if(endTime===undefined){
          endTime=''
        }
        this.getArwadData(startTime,endTime,0,10,'createTime,desc',this.selectValue)
      },
      getArwadData(startTime,endTime,page,size,sort,changeType) {
        axios.get(this.serviceUrl+'/api/account/getCompanyAccountChangeLogs?startTime='
          +startTime+'&endTime='+endTime+'&page='+page+'&size='+size+'&sort='+sort+'&changeType='+changeType)
          .then((response) => {
            console.log("赏金列表数据")
            console.log(response)
            if (response.data.content.length !== []) {
              this.totalElements=parseInt(response.data.totalElements)
              for(let i=0;i<response.data.content.length;i++){
                response.data.content[i].createTime=new Date(response.data.content[i].createTime).toLocaleDateString()
                response.data.content[i].balance=response.data.content[i].balance/100
              }
              this.tableData = response.data.content
            } else {
              this.em_alert('获取失败', 'waring')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert=decodeURI(error.response.headers['x-alert'])
            this.em_alert(alert,'error')
          })
      },
      dashmoney(){
        axios.get(this.serviceUrl+'/api/account/companyAccount')
          .then((response) => {
            console.log("赏金余额数据")
            console.log(response)
            if (response.data.balance!== '') {
              this.arawermoney = response.data.balance/100
            } else {
              this.em_alert('获取失败', 'waring')
            }
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
  .award .el-table{
    color:#c3c6c9
  }
  .award .el-table--border::after, .el-table--group::after, .el-table::before {
    background-color: #414d59;
  }
  .award .el-table--border td{
    border: 1px solid #414d59;
  }
  .award .el-table--border th{
    border: 1px solid #414d59;
  }
  .award .el-table--border{
    border: 1px solid #414d59;
  }
  .el-table td {
    border-bottom: 1px solid #414d59 !important;
  }
  .award .el-table tr {
    background-color: #36404a;
  }
  .el-table td {
    border-bottom: 1px solid #414d59 !important;
  }
  .award .el-table th {
    background-color: #36404a;
  }
</style>
<style scoped>
  .awardMoney{
    padding-bottom: 15px;
  }
  .awardMoney span:first-child{
    font-size: 20px;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }
  .box-card {
    width: 83%;
    min-height: 768px;
    margin-left: 16%;
    border: 0;
    margin-top: 70px;
  }
  .page-p{
    padding:20px 0px;
    float: right;
  }
  .filter-c{
    padding-bottom:10px;
    float: right;
  }
</style>
