<template>
  <div class="register-container" id="registerCon">
    <div style="width:100%; height:1024px;">
      <div style="width: 400px;margin:0 auto;">
        <div style="text-align: center;padding: 80px 0px 20px 0px;">
          <img :src="lc" alt="LOGO">
        </div>
        <div class="grid-content bg-purple">
          <div class="login-header">
            <p>HR注册</p>
          </div>
          <el-form :label-position="labelPosition" :rules="rules" :model="registerObj" ref="registerObj" status-icon clearable >
            <el-form-item label="" size="medium">
              <el-select v-model="companyCurrentId" placeholder="选择企业" prefix-icon="fa fa-building-o">
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="jobNumber">
              <el-input v-model.number="registerObj.jobNumber"  placeholder="工号" prefix-icon="fa fa-user-circle-o"></el-input>
            </el-form-item>
            <el-form-item label="" prop="idCard">
              <el-input v-model="registerObj.idCard"   placeholder="身份证号" prefix-icon="fa fa-address-card-o"></el-input>
            </el-form-item>
            <el-form-item label="" prop="phoneNumber">
              <el-input v-model="registerObj.phoneNumber" placeholder="手机号" prefix-icon="el-icon-mobile-phone"></el-input>
            </el-form-item>
            <el-form-item label="" prop="verificationCode">
              <el-row>
                <el-col :span="13">
                  <el-input v-model="registerObj.verificationCode" placeholder="手机验证码"
                            prefix-icon="el-icon-message"></el-input>
                </el-col>
                <el-col :span="10" :offset="1">
                  <el-button type="success" :disabled="registerObj.buttonDisabled" @click="obtainMessageCode"><span v-if="registerObj.buttonDisabled">{{registerObj.verificationCodeTime}}后</span>{{registerObj.buttonMessage}}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input v-model="registerObj.password" placeholder="密码" type="password"
                        prefix-icon="fa fa-key"></el-input>
            </el-form-item>
          </el-form>
            <el-row>
              <el-button type="success" size="medium " :span="20" class="login-btn" @click="submitForm('registerObj')">注册</el-button>
            </el-row>
          <div class="text-tip">有账号?
            <router-link :to="{ path: '/login' }" tag="a" class="link-signup">立即登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import lc from './../images/LC.png'
  import axios from 'axios'
  export default {
    name: "register",
    data() {
      let idCardRule = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('身份证号不能为空'))
          }else{
            setTimeout(() => {
              if (value.length!==18) {
                callback(new Error('身份证号必须为18位'))
              } else {
                callback()
              }
            }, 300)
          }

      }
      let phoneNumberRule = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        }else{
          setTimeout(() => {
            if(value.length!==11){
              callback(new Error('手机号位数为11位'))
            }else{
              let reg = /^1[3|4|5|7|8][0-9]{9}$/
              if (!reg.test(value)) {
                callback(new Error('手机号不合法'))
              } else {
                callback()
              }
            }
          }, 300)
        }
      }
      let passwordRule = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'))
        }else{
          setTimeout(() => {
            if (9>value.length) {
              callback(new Error('密码强度请保证在8位以上'))
            }else{
              callback()
            }
          }, 300)
        }

      }
      return {
        lc:lc,
        headers: {
          contentType: 'application/json; charset=UTF-8'
        },
        labelPosition: 'right',
        rules:{
          jobNumber:[
            { required: true, message: '工号不能为空'},
            { type: 'number', message: '工号必须为数字值'}
          ],
          idCard:[
            { validator:idCardRule, trigger: 'blur'}
          ],
          phoneNumber:[
            { validator:phoneNumberRule, trigger: 'blur'}
          ],
          verificationCode:[
            { required: true, message: '验证码不能为空'}
          ],
          password:[
            { validator: passwordRule, trigger: 'blur'}
          ]
        },
        registerObj: {
          buttonMessage:'获取验证码',
          workNumber: '',
          idCard: '',
          phoneNumber: '',
          verificationCode: '',
          password:'',
          jobNumber:'',
          verificationCodeTime:60,
          buttonDisabled:false
        },
        companyList: [],
        companyCurrentId: ''
      }
    },
    mounted(){
      axios.defaults.headers = {
        'X-UserToken': ''
      }
      this.getCompanyList()
      this.keydownRes()
    },
    methods: {
      keydownRes(){
        let nodeId=document.getElementById('registerCon')
        nodeId.onkeydown = (event)=> {
          var e = event || window.event || arguments.callee.caller.arguments[0];
          if (e && e.keyCode == 13) {
            this.submitForm('registerObj')
          }
        }
      },
      obtainMessageCode(){
        let obtainMessageObj={
          cellphone: this.registerObj.phoneNumber,
          type: 'Register',
          platformType: 'HR'
        }
        axios.post(this.serviceUrl+'/api/auth/sendCode',obtainMessageObj)
          .then((response) => {
            console.log('获取验证码返回数据')
            console.log(response)
            if(response.status===200){
              this.registerObj.buttonDisabled=true
              this.el_alert('success','验证码已发送！')
              let time=setInterval(() =>{
                if(this.registerObj.verificationCodeTime!==0){
                  this.registerObj.verificationCodeTime-=1
                }else{
                  window.clearInterval(time)
                  this.registerObj.buttonDisabled=false
                  this.registerObj.buttonMessage='获取验证码'
                }
              },1000)
            }else{
              this.registerObj.buttonDisabled=false
              this.registerObj.buttonMessage='获取验证码'
              this.el_alert('error','获取验证码失败！')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert=decodeURI(error.response.headers['x-alert'])
            this.el_alert('error',alert)
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.registerPost()
          } else {
            this.el_alert('warning','注册选项信息有误或不完整，注册失败')
            return
          }
        })
      },
     el_alert(type,message) {
        this.$message({
          showClose: true,
          message: message,
          type: type
        });
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      getCompanyList(){
        axios.get(this.serviceUrl+'/api/company/companies')
          .then((response) => {
            console.log('公司列表数据')
            console.log(response)
            this.companyList = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      },
      registerPost(){
        let register={
          cellphone: this.registerObj.phoneNumber,
          companyId: this.companyCurrentId,
          idCardNumber: this.registerObj.idCard,
          jobNumber: this.registerObj.jobNumber,
          password: this.registerObj.password,
          verificationCode: this.registerObj.verificationCode
        }
        axios.post(this.serviceUrl+'/api/auth/hrRegister', register,this.headers)
          .then((response) => {
            console.log('提交HR注册返回数据')
            console.log(response)
            if(response.data.token){
              sessionStorage.setItem('token',response.data.token)
              this.el_alert('success','注册成功！等待审核');
              this.$router.push({path: '/login'})
            }else{
              this.el_alert('error','注册失败！');
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert=decodeURI(error.response.headers['x-alert'])
            this.el_alert('error',alert)
          })
      }
    }
  }
</script>
<style>
  .register-container input{
    border: 1px solid #505f6d !important;
    background-color: #414d59;
    color: #ffffff;
  }
</style>
<style scoped>
  .btn-col{
    background: #5dd5c8;
    border:0;
  }
  .register-container {
    background: url("./../images/LRBG.png") no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
  }

  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .text-tip a {
    color: #67c23a;
  }

  .text-tip {
    color: #9fa3b0;
    text-align: center;
    padding: 28px 0 36px;
    font-size: 14px;
  }

  .login-btn {
    width: 100%;
    background-color: #323949;
  }

  .el-col-14 {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .login-header {
    font-weight: 400;
    font-size: 32px;
    line-height: 32px;
    position: relative;
    text-align: center;
  }

  .el-select {
    width: 100%;
  }

  .bg-purple {
    background: #fff;
  }

  .grid-content {
    border: 1px solid rgba(54, 64, 74, 0.1);
    padding: 20px 30px;
    border-radius: 4px;
    min-height: 36px;
    background-color: rgba(0,0,0,.55);
    color: #fff;
  }
</style>
