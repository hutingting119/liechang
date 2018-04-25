<template>
  <div>
    <el-card class="box-card1 box-card">
      <div slot="header" class="clearfix">
        <span>个人中心</span>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-row>
              <el-col :span="8">
                <div class="profile_heading" @click="imageUploadDialog = true">
                  <el-tooltip effect="light" content="点击修改头像" placement="top-start">
                    <img class="headerImage" :src="userPicter" :alt="nickName">
                  </el-tooltip>
                </div>
              </el-col>
              <!--上传的图片dialog-->
              <el-dialog
                title="头像上传"
                :visible.sync="imageUploadDialog"
                width="30%">
                <el-upload
                  class="avatar-uploader"
                  :action="action"
                  list-type="picture-card"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-dialog>
              <el-col :span="16">
                <div class=" detailContainer">
                  <h2 class="profile__heading_name">
                    <span v-if="nickName===''?false:true">{{nickName}}</span>
                    <span v-if="nickName===''?true:false" style="font-size: 14px;color:#999">
                      暂无昵称
                    </span>
                    <el-popover
                      ref="popover2"
                      placement="bottom"
                      width="250"
                      v-model="visiblepopover"
                      trigger="click">
                      <div class="nickName-c">
                        <el-form :model="formLabelAlign" :label-position="labelPosition" :rules="rules"  ref="formLabelAlign" status-icon clearable>
                          <el-form-item label="昵称修改" prop="nickName">
                            <el-input
                              placeholder="昵称不能超过4个字符"
                              v-model="formLabelAlign.nickName">
                              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
                            </el-input>
                          </el-form-item>
                          <div class="submit-c">
                            <el-button type="primary"  size="small" plain @click="resetNickName('formLabelAlign')">修改</el-button>
                          </div>
                        </el-form>
                      </div>
                    </el-popover>
                    <span class="editNickName-c" v-popover:popover2 ><i class="el-icon-edit"></i></span>
                  </h2>
                  <div class="list-cc"><i class="el-icon-location icon-s"></i><span class="detail-f">{{localAddress}}</span></div>
                  <div class="list-cc"><i class="fa fa-user-circle-o icon-s"></i><span  class="detail-f">{{userName}}</span></div>
                  <div class="list-cc"><i class="fa fa-users icon-s"></i><span class="detail-f">{{arterPlay}}</span></div>
                  <div class="list-cc">
                    <i class="fa fa-star icon-s"></i>
                    <span class="score-s">
                        <span class="icon-s no-score detail-f" v-if="userScore===0?true:false">暂无评分</span>
                        <i class="fa fa-star icon-s" v-for="item in userScore"></i>
                      </span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card-panel">
              <div slot="header" class="clearfix">
                <span>最近发布职位</span>
                <el-button style="float: right; padding: 3px 0;color:#009a61;" type="text">查看更多</el-button>
              </div>
              <div v-for="o in 4" :key="o" class="text item">
                <i class="fa fa-flag-checkered" aria-hidden="true"></i>
                <span class="pos-list">服务端开发java</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
          <el-row>
            <el-col :span="24">
              <template>
                <el-table
                  :data="tableData"
                  :row-class-name="tableRowClassName"
                  style="width: 100%">
                  <el-table-column
                    label="">
                    <template slot-scope="scope">
                      <i :class="scope.row.iconClass"></i>
                      <span style="margin-left: 10px">{{ scope.row.attr}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="val"
                    label="">
                  </el-table-column>
                </el-table>
              </template>
            </el-col>
          </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  import userPicter from './../images/user.png'
  import axios from 'axios'
  export default {
    name: "persondata",
    data() {
      let nickNamerRule = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('要修改的昵称不能为空'))
        }else{
          setTimeout(() => {
            if(value.length>4){
              callback(new Error('昵称不能超过四个字符'))
            }else{
              callback()
            }
          }, 300)
        }
      }
      return {
        rules:{
          nickName:[
            { validator:nickNamerRule, trigger: 'blur'}
          ]
        },
        labelPosition: 'right',
        formLabelAlign: {
          nickName: ''
        },
        action:this.serviceUrl+'/ImageUpload/ImageUp',
        userPicter: userPicter,
        userName:'',
        userScore:0,
        visiblepopover:false,
        arterPlay:'',
        imageUploadDialog:false,
        localAddress:'',
        imageUrl: '',
        nickName:'',
        tableData: [{
          attr: '账号',
          val: '13474335166',
          iconClass: 'fa fa-user-circle-o'
        },{
          attr: '昵称',
          val: 'viyoung',
          iconClass: 'fa fa-tags'
        },{
          attr: '电话',
          val: '13474335166',
          iconClass: 'fa fa-phone'
        }, {
          attr: '性别',
          val: '男',
          iconClass: 'fa fa-venus-mars'
        },{
          attr: '角色',
          val: 'HR',
          iconClass: 'fa fa-users'
        }, {
          attr: '就职公司',
          val: '中软国际',
          iconClass: 'fa fa-building-o'
        }, {
          attr: '工号',
          val: '1234567',
          iconClass: 'fa fa-user-o'
        },
          {
            attr: '评价分数',
            val: '3分',
            iconClass: 'fa fa-star'
          },
          {
            attr: '最近一次登录时间',
            val: '2018-03-15',
            iconClass: 'fa fa-clock-o'
          }]
      }
    },
    mounted(){
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
        this.getUserDetails()
      }
    },
    methods: {
      resetNickName(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let refershMeessage={
              headPic: this.userPicter,
              nickName: this.formLabelAlign.nickName
            }
            axios.post(this.serviceUrl+'/api/auth/changeUserInfo',refershMeessage)
              .then((response)=>{
                console.log(response)
                if(response.status===200){
                  this.nickName=this.formLabelAlign.nickName
                  this.tableData[1].val=this.formLabelAlign.nickName
                  this.$message.success('昵称修改成功!')
                }else{
                  this.$message.error('昵称修改失败!')
                }
                this.visiblepopover=false
                this.formLabelAlign.nickName=''
              })
              .catch((err)=>{
                console.log(err.response.headers)
                let alert=decodeURI(err.response.headers['x-alert'])
                this.el_alert('error',alert)
              })
          } else {
            this.el_alert('warning','昵称修改信息有误，请重新填写')
            return
          }
        })

      },
      resetPersonMessage(){
        let refershMeessage={
          headPic: this.userPicter,
          nickName: this.nickName
        }
        axios.post(this.serviceUrl+'/api/auth/changeUserInfo',refershMeessage)
          .then((response)=>{
            console.log(response)
            if(response.status===200){
              this.$message.success('上传头像成功!');
              this.$store.dispatch({
                type: 'reste',
                headerImgUrl: this.userPicter
              });
            }else{
              this.$message.error('上传头像失败!');
            }
          })
          .catch((err)=>{
            console.log(err.response.headers)
            let alert=decodeURI(err.response.headers['x-alert'])
            this.el_alert('error',alert)
          })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        if(res.url!=''){
          this.userPicter=res.url
          this.resetPersonMessage()
        }else{
          return
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2==0) {
          return '';
        } else{
          return 'success-row';
        }
      },
      el_alert(type,message) {
        this.$message({
          showClose: true,
          message:message,
          type: type
        });
      },
      getUserDetails(){
       axios.get(this.serviceUrl+'/api/auth/getLoggedUser?userToken='+sessionStorage.getItem('token'))
         .then((res)=>{
            console.log('用户详细信息')
            console.log(res)
           if(res.data!==''){
             this.userPicter=res.data.headPic===undefined?userPicter:res.data.headPic
             this.nickName=res.data.nickName===undefined?'':res.data.nickName
             this.userName=res.data.username
             this.arterPlay=res.data.type
             this.localAddress=res.data.company.address
             this.userScore=parseInt(res.data.score)
             this.tableData=[{
               attr: '账号',
               val: res.data.username,
               iconClass: 'fa fa-user-circle-o'
             },{
               attr: '昵称',
               val: res.data.nickName,
               iconClass: 'fa fa-tags'
             },{
               attr: '电话',
               val: res.data.cellphone,
               iconClass: 'fa fa-phone'
             },{
               attr: '角色',
               val: res.data.type,
               iconClass: 'fa fa-users'
             }, {
               attr: '就职公司',
               val: res.data.company.name,
               iconClass: 'fa fa-building-o'
             }, {
               attr: '工号',
               val: res.data.jobNumber,
               iconClass: 'fa fa-user-o'
             },
               {
                 attr: '评价分数',
                 val: res.data.score,
                 iconClass: 'fa fa-star'
               },
               {
                 attr: '最近一次登录时间',
                 val: new Date(res.data.lastLoginTime).toLocaleDateString(),
                 iconClass: 'fa fa-clock-o'
               }]
           }else{
             this.el_alert('warning','获取信息为空')
           }
         })
         .catch((err)=>{
           console.log(err.response.headers)
           let alert=decodeURI(err.response.headers['x-alert'])
           this.el_alert('error',alert)
         })
      }
    }
  }
</script>
<style>
  .el-table .success-row {
    background: #f0f9eb;
  }
  .box-card1 .el-table{
    color:#c3c6c9
  }
  .box-card1 .el-table--border::after, .el-table--group::after, .el-table::before {
    background-color: #414d59;
  }
  .box-card1 .el-table--border td{
    border: 1px solid #414d59;
  }
  .box-card1 .el-table--border th{
    border: 1px solid #414d59;
  }
  .box-card1 .el-table--border{
    border: 1px solid #414d59;
  }
  .box-card1 .el-table td {
    border-bottom: 1px solid #414d59 !important;
  }
  .box-card1 .el-table tr {
    background-color: #36404a;
  }
  .box-card1 .el-table th {
    background-color: #36404a;
  }
</style>
<style scoped>
  .box-card-panel{
    color: #98a6ad;
    background-color: #414d59;
    border: 0;
  }
  .submit-c{
    text-align: center;
  }
  .nickName-c{
    padding:10px 15px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .profile__heading_name{
    margin-top: 0px;
  }
  .editNickName-c {
    font-size: 14px;
    display: inline-block;
  }

  .editNickName-c i {
    cursor: pointer;
  }
  .detail-f{
    font-size: 14px;
  }
  .editNickName-c i:hover {
    color: #85ce61;
  }

  .ml15 {
    margin: 0px 10px;
  }

  .pos-list {
    color: #999;
    font-size: 14px;
  }

  .fa-flag-checkered {
    margin-right: 10px;
  }

  .score-s {
    color: #f7ba2a
  }

  .list-cc {
    margin-bottom: 6px;
    color: #999;
  }
  .no-score{
    color: #999;
  }
  .icon-s {
    margin-right: 10px;
  }

  .detailContainer {
    margin: 0 10px;
  }

  a {
    cursor: pointer;
    color: #009a61;
    text-decoration: none;
    background: transparent;
    font-size: 14px;
  }

  .box-card1 {
    width: 83%;
    margin-left: 16%;
    min-height: 768px;
    border: 0;
    margin-top: 70px;

  }
  .profile_heading img:hover{
    transform: scale(1.05, 1.05);
  }
  .headerImage {
    cursor: pointer;
    background: #ffffff;
    width: 150px;
    height:150px;
    border-radius: 50%;
  }
</style>
