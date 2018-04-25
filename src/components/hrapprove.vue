<template>
  <div class="hrsengpi">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>HR审批</span>
        <el-switch
          v-model="swatch"
          active-text="未处理"
          inactive-text="已处理" @change="getHrApproList">
        </el-switch>
      </div>
      <div class="onkeyoption" v-show="swatch">
        <el-button type="success" round @click="oneKeyAllow" size="small">一键通过</el-button>
        <el-button type="danger" round @click="oneKeyRefuse" size="small">一键拒绝</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%" align="center">
        <el-table-column
          prop="jobNumber"
          label="工号" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="idCardNumber"
          label="身份证号" align="center">
        </el-table-column>
        <el-table-column
          prop="position"
          label="部门" align="center">
        </el-table-column>
        <el-table-column
          label="处理" align="center">
          <template slot-scope="scope">
            <i
              class=" button-i button-y el-icon-success"
              :class="scope.row.state==='Using'?'greenClass':''"
              @click="handleEdit(scope.$index, scope.row)">通过</i>
            <i
              class=" button-i button-n el-icon-error"
              :class="scope.row.state==='Disabled'?'redClass':''"
              @click="handleDelete(scope.$index, scope.row)">拒绝</i>
          </template>
        </el-table-column>
      </el-table>
      <div class="tijiao" v-show="ishaveData">
        <el-button type="success" v-show="swatch" @click="putHRapproData">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "hrapprove",
    data() {
      return {
        swatch: true,
        multipleSelection: [],
        tableData: [],
        ishaveData:false
      }
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
        this.getHrApproList()
      }
    },
    methods: {
      em_alert(massage, type) {
        this.$message({
          showClose: true,
          message: massage,
          type: type
        });
      },
      oneKeyAllow() {
        if (this.swatch) {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].state = 'Using'
          }
        } else {
          return
        }
      },
      oneKeyRefuse() {
        if (this.swatch) {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].state = 'Disabled'
          }
        } else {
          return
        }
      },
      handleEdit(index, row) {
        console.log(index);
        console.log(row);
        if (this.swatch) {
          if (row.state === 'Auditing') {
            row.state = 'Using'
          } else if (row.state === 'Using') {
            row.state = 'Auditing'
          } else if (row.state === 'Disabled') {
            row.state = 'Using'
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
          if (row.state === 'Auditing') {
            row.state = 'Disabled'
          } else if (row.state === 'Disabled') {
            row.state = 'Auditing'
          } else if (row.state === 'Using') {
            row.state = 'Disabled'
          } else {
            return
          }
        } else {
          return
        }

      },
      getHrApproList() {
        if (this.swatch) {//调取未处理的数据
          this.gettableDate(this.serviceUrl+'/api/user/getAuditHrs')
        } else {//调取已处理的数据
          this.gettableDate(this.serviceUrl+'/api/user/getAuditedHrs')
        }
      },
      gettableDate(url) {
        axios.get(url)
          .then((response) => {
            console.log("hr审批数据")
            console.log(response)
            if (response.data.content.length !== 0) {
              this.ishaveData=true
              this.tableData = response.data.content
            } else {
              this.ishaveData=false
              this.tableData=[]
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      putHRapproData() {
        let hrApproDat = {
          hrAuditItems: []
        }
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].state === 'Auditing') {
           continue
          } else {
            let obj = {
              id: this.tableData[i].id,
              result: this.tableData[i].state === 'Using' ? 'Accept' : 'Reject'
            }
            hrApproDat.hrAuditItems.push(obj)
          }
        }
        axios.post(this.serviceUrl+'/api/user/auditHr', hrApproDat)
          .then((response) => {
            console.log("hr提交审批数据")
            console.log(response)
            if (response.status === 200) {
              this.em_alert('审批成功', 'success')
              this.getHrApproList()
            } else {
              this.em_alert('审批失败', 'warning')
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
  .hrsengpi .el-table{
    color:#c3c6c9
  }
  .hrsengpi .el-table--border::after, .el-table--group::after, .el-table::before {
    background-color: #414d59;
  }
  .hrsengpi .el-table--border td{
    border: 1px solid #414d59;
  }
  .hrsengpi .el-table--border th{
    border: 1px solid #414d59;
  }
  .hrsengpi .el-table--border{
    border: 1px solid #414d59;
  }
  .el-table td {
    border-bottom: 1px solid #414d59 !important;
  }
  .hrsengpi .el-table tr {
    background-color: #36404a;
  }
  .el-table td {
    border-bottom: 1px solid #414d59 !important;
  }
  .hrsengpi .el-table th {
    background-color: #36404a;
  }
</style>
<style>
  .el-switch {
    float: right;
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
    min-height: 768px;
    margin-left: 16%;
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
