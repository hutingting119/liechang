<template>
  <div class="posshenpi">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>管理员审批</span>
        <el-switch
          v-model="swatch"
          active-text="未处理"
          inactive-text="已处理" @change="getPositionTableData">
        </el-switch>
      </div>
      <div class="onkeyoption" v-show="swatch">
        <el-button type="success" round  size="small"  @click="oneKeyAllow">一键通过</el-button>
        <el-button type="danger"  round size="small" @click="oneKeyRefuse">一键拒绝</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%" align="center">
        <el-table-column
          prop="jobDetailTitle"
          label="职位" align="center" width="150">
        </el-table-column>
        <el-table-column
          prop="jobDetailLevel"
          label="级别" align="center" width="100">
        </el-table-column>
        <el-table-column
          prop="jobDetailRecruitingNumber"
          label="数量" align="center" width="100">
        </el-table-column>
        <el-table-column
          prop="jobDetailPrice"
          label="单价（元）" align="center" width="100">
        </el-table-column>
        <el-table-column
          prop="sumMoney"
          label="总计（元）" align="center" width="100">
        </el-table-column>
        <el-table-column
          prop="hrComment"
          label="备注" align="center" width="200">
        </el-table-column>
        <el-table-column
          label="处理" align="center">
          <template slot-scope="scope">
            <i
              class=" button-i button-y el-icon-success"
              :class="scope.row.state===1?'greenClass':''"
              @click="handleEdit(scope.$index, scope.row)">通过</i>
            <i
              class=" button-i button-n el-icon-error"
              :class="scope.row.state===2?'redClass':''"
              @click="handleDelete(scope.$index, scope.row)">拒绝</i>
          </template>
        </el-table-column>
      </el-table>
      <div class="tijiao" v-show="ishaveData">
        <el-button type="success" v-show="swatch" @click="putPostion">提交</el-button>
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
    name: "posapprove",
    data() {
      return {
        swatch: true,
        multipleSelection: [],
        tableData: [],
        ishaveData:false
      }
    },
    mounted() {
      this.getPositionTableData()
    },
    methods: {
      oneKeyAllow() {
        if (this.swatch) {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].state = 1
          }
        } else {
          return
        }
      },
      oneKeyRefuse() {
        if (this.swatch) {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].state = 2
          }
        } else {
          return
        }
      },
      el_alert(message,type) {
        this.$message({
          showClose: true,
          message:message,
          type: type
        });
      },
      handleEdit(index, row) {
        console.log(index);
        console.log(row);
        if (this.swatch) {
          if (row.state === 0) {
            row.state = 1
          } else if (row.state === 1) {
            row.state = 0
          } else if (row.state === 2) {
            row.state = 1
          } else {
            return
          }
        } else {
          return
        }
      },
      handleDelete(index, row) {
        console.log(index);
        console.log(row);
        if (this.swatch) {
          if (row.state === 0) {
            row.state = 2
          } else if (row.state === 2) {
            row.state = 0
          } else if (row.state === 1) {
            row.state = 2
          } else {
            return
          }
        } else {
          return
        }
      },
      getPositionTableData() {
        console.log(this.swatch)
        if (this.swatch) {//调取未处理的数据
          this.gettableData(this.serviceUrl+'/api/jobDetail/getAuditJobDetails')
        } else {//调取已处理的数据
          this.gettableData(this.serviceUrl+'/api/jobDetail/getAuditedJobDetails')
        }
      },
      gettableData(url) {
        axios.get(url)
          .then((response) => {
            console.log("职位审批数据")
            console.log(response)
            if (response.data.content.length!==0) {
              this.ishaveData=true
              var arr = []
              if (this.swatch) {
                for (let i = 0; i < response.data.content.length; i++) {
                  let obj = {
                    jobDetailTitle: response.data.content[i].jobDetailTitle,
                    jobDetailRecruitingNumber: response.data.content[i].jobDetailRecruitingNumber,
                    jobDetailPrice: response.data.content[i].jobDetailPrice / 100,
                    jobDetailLevel: response.data.content[i].jobDetailLevel,
                    jobDetailCreatorUsername: response.data.content[i].jobDetailCreatorUsername,
                    id: response.data.content[i].id,
                    hrComment: response.data.content[i].hrComment,
                    sumMoney: (response.data.content[i].jobDetailPrice * response.data.content[i].jobDetailRecruitingNumber) / 100,
                    state: 0
                  }
                  arr.push(obj)
                }
              }else{
                for (let i = 0; i < response.data.content.length; i++) {
                  let obj = {
                    jobDetailTitle: response.data.content[i].jobDetailTitle,
                    jobDetailRecruitingNumber: response.data.content[i].jobDetailRecruitingNumber,
                    jobDetailPrice: response.data.content[i].jobDetailPrice / 100,
                    jobDetailLevel: response.data.content[i].jobDetailLevel,
                    jobDetailCreatorUsername: response.data.content[i].jobDetailCreatorUsername,
                    id: response.data.content[i].id,
                    hrComment: response.data.content[i].hrComment,
                    sumMoney: (response.data.content[i].jobDetailPrice * response.data.content[i].jobDetailRecruitingNumber) / 100,
                    state: response.data.content[i].auditResult==='Accept'?1:2
                  }
                  arr.push(obj)
                }
              }
              this.tableData=[]
              this.tableData = arr;
              console.log('arr')
              console.log(arr)
            } else {
              this.tableData=[]
              this.ishaveData=false
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert=decodeURI(error.response.headers['x-alert'])
            this.el_alert(alert,'warning')
          })
      },
      putPostion(){
        let postApproDat={
          detailAuditItems:[]
        }
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].state===0){
            continue
          }else{
            let obj={
              id: this.tableData[i].id,
              auditResult:this.tableData[i].state===1?'Accept':'Reject'
            }
            postApproDat.detailAuditItems.push(obj)
          }
        }
        console.log(postApproDat)
       axios.post(this.serviceUrl+'/api/jobDetail/batchAudit',postApproDat)
         .then((response)=>{
          console.log('提交职位审批表数据')
           console.log(response)
           if(response.status===200){
             this.el_alert('审批成功','success')
             this.getPositionTableData()
           }else{
             this.el_alert('审批失败','warning')
           }
         })
         .catch((error)=>{
           console.log(error.response.headers)
           let alert=decodeURI(error.response.headers['x-alert'])
           this.el_alert(alert,'warning')
         })
      }
    }
  }
</script>
<style>
  .posshenpi .el-table{
    color:#c3c6c9
  }
  .posshenpi .el-table--border::after, .el-table--group::after, .el-table::before {
    background-color: #414d59;
  }
  .posshenpi .el-table--border td{
    border: 1px solid #414d59;
  }
  .posshenpi .el-table--border th{
    border: 1px solid #414d59;
  }
  .posshenpi .el-table--border{
    border: 1px solid #414d59;
  }
  .posshenpi .el-table tr {
    background-color: #36404a;
  }
  .posshenpi .el-table th {
    background-color: #36404a;
  }
</style>
<style scoped>
  .tijiao .el-button--success{
    color: #fff;
    background-color: #323949;
    border-color: #323949;
  }
  .el-button--success {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
  .tijiao {
    height: 40px;
    padding: 10px 10px;
  }

  .tijiao button {
    float: right;
  }

  .po-btn {
    display: inline-block;
    padding: 5px 6px;
    cursor: pointer;
  }

  .onkeyoption {
    float: right;
    font-size: 12px;
  }

  .box-card {
    width: 83%;
    margin-left: 16%;
    min-height:768px;
    border: 0;
    margin-top: 70px;
  }

  .button-i {
    margin: 10px;
    cursor: pointer;
  }

  .button-y:hover {
    color: #67C23A;
  }

  .button-n:hover {
    color: #F56C6C;
  }
   .greenClass{
     color: #67C23A;
   }
    .redClass{
      color: #F56C6C;
    }
</style>
