<template>
  <div class="resetCode-container">
    <el-container>
      <el-header>忘记密码</el-header>
      <el-main>
        <el-card  id="firstStep" class="box-card "v-show="!isStep2">
          <div slot="header" class="clearfix">
            <span>第一步：短信验证</span>
          </div>
          <el-form :label-position="labelPosition" label-width="80px" :rules="messageyanzRules" :model="messageyanz" ref="messageyanz" status-icon clearable>
            <el-form-item label="用户名"  prop="phoneNumber">
              <el-input v-model="messageyanz.phoneNumber" placeholder="手机号" prefix-icon="el-icon-mobile-phone"></el-input>
            </el-form-item>
            <el-row>
              <el-form-item label="验证码" prop="yancode">
              <el-col :span="13">
                <el-input v-model="messageyanz.yancode" placeholder="手机验证码"
                          prefix-icon="el-icon-message"></el-input>
              </el-col>
              <el-col :span="10" :offset="1">
                <el-button type="success":disabled="yanz.buttonDisabled" @click="ObtainMessageCode"><span
                  v-if="yanz.buttonDisabled">{{yanz.verificationCodeTime}}后</span>{{yanz.butttonMessage}}</el-button>
              </el-col>
              </el-form-item>
            </el-row>
          </el-form>
          <el-row>
            <el-button type="success" size="medium " class="codereset-btn" @click="submityanz('messageyanz')">验证</el-button>
          </el-row>
        </el-card>
        <el-card  id="secondStep" class="box-card " v-show="isStep2">
          <div slot="header" class="clearfix">
            <span>第二步：重置密码</span>
          </div>
          <el-form :label-position="labelPosition" label-width="80px" :rules="resetCodeRules" :model="resetCode" ref="resetCode" status-icon clearable>
            <el-form-item label="用户名"  prop="phoneNumber">
              <el-input v-model="resetCode.phoneNumber" placeholder="手机号" prefix-icon="el-icon-mobile-phone"></el-input>
            </el-form-item>
            <el-form-item label="密码"  prop="firstCode">
              <el-input v-model="resetCode.firstCode" placeholder="密码"  type="password" prefix-icon="fa fa-key"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="secondCode">
              <el-input v-model="resetCode.secondCode" placeholder="确认密码"  type="password" prefix-icon="fa fa-key"></el-input>
            </el-form-item>
          </el-form>
          <el-row>
            <el-button type="success" size="medium " class="codereset-btn" @click="submitrestCode('resetCode')">重置</el-button>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

  <script>
  import axios from 'axios'
  export default {
    name: "codereset",
    data() {
      let phoneNumberRule = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        } else {
          setTimeout(() => {
            if (value.length !== 11) {
              callback(new Error('手机号位数为11位'))
            } else {
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
        resetCodeRules:{
          phoneNumber: [
            {required: true, message: '手机号不能为空'},
            {validator: phoneNumberRule, trigger: 'blur'}
          ],
          firstCode: [
            {required: true, message: '密码不能为空'},
            {validator: passwordRule, trigger: 'blur'}
          ],
          secondCode:[
            {required: true, message: '密码不能为空'},
            {validator: passwordRule, trigger: 'blur'}
          ]
        },
        messageyanzRules:{
          phoneNumber: [
            {required: true, message: '手机号不能为空'},
            {validator: phoneNumberRule, trigger: 'blur'}
          ],
          yancode: [
            {required: true, message: '密码不能为空'}
          ],
        },
        labelPosition: 'right',
        isStep2:false,
        token:'',
        yanz:{
          buttonDisabled:false,
          verificationCodeTime:60,
          butttonMessage:'获取验证码'
        },
        messageyanz:{
          phoneNumber:'',
          yancode:''
        },
        resetCode:{
          phoneNumber:'',
          firstCode:'',
          secondCode:''
        }
      };
    },
    mounted() {
      axios.defaults.headers = {
        'X-UserToken': ''
      }
    },
    methods: {
      submitrestCode(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.putCodeReset()
          } else {
            this.el_alert('warning', '登录信息有误或不完整，请重新登录')
            return
          }
        })
      },
      putCodeReset(){
        if(this.resetCode.secondCode!==this.resetCode.firstCode){
          this.el_alert('warning', '密码和确认密码不一致！')
          return ''
        }else{
          let obtainMessageObj = {
            password: this.resetCode.secondCode,
            token : this.token,
            platformType:sessionStorage.getItem('plantype')
          }
          axios.post(this.serviceUrl + '/api/auth/setPasswordStep2', obtainMessageObj)
            .then((response) => {
              console.log('获取提交修改密码返回数据')
              console.log(response)
              if (response.status === 200) {
                this.$router.push({path: '/login'})
                this.el_alert('success', '重置成功！')
              } else {
                this.isStep2=true
                this.el_alert('warning', '重置失败！')
              }
            })
            .catch((error) => {
              console.log(error.response.headers)
              let alert = decodeURI(error.response.headers['x-alert'])
              this.el_alert('error', alert)
            })
        }
      },
      submityanz(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.vident()
          } else {
            this.el_alert('warning', '登录信息有误或不完整，请重新登录')
            return
          }
        })
      },
      vident(){
        let obtainMessageObj = {
          cellphone: this.messageyanz.phoneNumber,
          verificationCode : this.messageyanz.yancode,
          platformType:sessionStorage.getItem('plantype')
        }
        axios.post(this.serviceUrl + '/api/auth/setPassword', obtainMessageObj)
          .then((response) => {
            console.log('获取验证修改密码返回数据')
            console.log(response)
            if (response.status === 200) {
              this.token=response.data.token
              this.isStep2=true
              this.el_alert('success', '第一步验证成功！')
            } else {
              this.isStep2=false
              this.el_alert('warning', '第一步验证失败！')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert = decodeURI(error.response.headers['x-alert'])
            this.el_alert('error', alert)
          })
      },
      ObtainMessageCode() {
        let reg = /^1[3|4|5|7|8][0-9]{9}$/
        if (!reg.test(this.messageyanz.phoneNumber)) {
          this.el_alert('error', '手机号不合法！')
          return ''
        } else {
          let obtainMessageObj = {
            cellphone: this.messageyanz.phoneNumber,
            type: 'Forget',
            platformType:sessionStorage.getItem('plantype')
          }
          axios.post(this.serviceUrl + '/api/auth/sendCode', obtainMessageObj)
            .then((response) => {
              console.log('获取验证码返回数据')
              console.log(response)
              if (response.status === 200) {
                this.yanz.buttonDisabled = true
                this.el_alert('success', '验证码已发送！')
                let time = setInterval(() => {
                  if (this.yanz.verificationCodeTime !== 0) {
                    this.yanz.verificationCodeTime -= 1
                  } else {
                    window.clearInterval(time)
                    this.yanz.buttonDisabled = false
                    this.yanz.butttonMessage = '获取验证码'
                  }
                }, 1000)
              } else {
                this.yanz.buttonDisabled = false
                this.yanz.butttonMessage = '获取验证码'
                this.el_alert('error', '获取验证码失败！')
              }
            })
            .catch((error) => {
              console.log(error.response.headers)
              let alert = decodeURI(error.response.headers['x-alert'])
              this.el_alert('error', alert)
            })
        }
      },
      el_alert(type, message) {
        this.$message({
          showClose: true,
          message: message,
          type: type
        })
      }
    }
  }
</script>

<style scoped>
  .codereset-btn{
    width:100%;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    min-height:768px;
  }

  body > .el-container {
    margin-bottom: 40px;
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
    width: 500px;
    margin: 0 auto;
  }
</style>
