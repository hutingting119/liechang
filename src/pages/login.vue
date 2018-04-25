<template>
  <div class="login-container">
    <div style="width:100%; height:1024px;">
      <div style="width: 400px;margin:0 auto;">
        <div style="text-align: center;padding: 80px 0px 20px 0px;">
          <img :src="lc" alt="LOGO">
        </div>
        <div class="grid-content bg-purple">
          <div class="login-header">
            <p>Hunter AI</p>
          </div>
          <el-row class="choseArt">
            <el-radio-group v-model="toggleart">
              <el-radio-button label="HR">我是HR</el-radio-button>
              <el-radio-button label="HR_MANAGER">我是管理员</el-radio-button>
            </el-radio-group>
          </el-row>
          <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
            <el-tab-pane label="密码登录" name="first">
              <el-form :label-position="labelPosition" :rules="rules" :model="login" ref="login" status-icon clearable>
                <el-form-item label="" prop="phoneNumber">
                  <el-input v-model="login.phoneNumber" placeholder="手机号"
                            prefix-icon="el-icon-mobile-phone"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                  <el-input v-model="login.password" placeholder="密码" type="password"
                            prefix-icon="fa fa-key"></el-input>
                </el-form-item>
                <el-form-item label="" prop="yzcode" class="yanz-li">
                  <el-row>
                    <el-col :span="15">
                      <el-input v-model="login.yzcode" placeholder="验证码"
                                prefix-icon="fa fa-puzzle-piece"></el-input>
                    </el-col>
                    <el-col :span="8" :offset="1">
                      <img :src="erweima" alt="验证码" class="yazhen-c">
                      <span class="pc-re">看不清？<span class="genhuan-s" @click="resetYanz">换一张</span></span>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
              <el-row>
                <el-col :span="16">
                  <el-button type="success" size="medium " class="login-btn" @click="submitForm('login')">登录
                  </el-button>
                </el-col>
                <el-col :span="8" class="restcode">
                  <el-button type="text" @click="resetCode">忘记密码</el-button>
                </el-col>
              </el-row>
              <div class="text-tip">没有账号?
                <router-link :to="{ path: '/register' }" tag="a" class="link-signup">立即注册</router-link>
              </div>
            </el-tab-pane>
            <el-tab-pane label="短信登录" name="second">
              <el-form :label-position="labelPosition" :rules="messageRules" :model="messageLogin" ref="messageLogin"
                       status-icon clearable>
                <el-form-item label="" prop="phoneNumber">
                  <el-input v-model="messageLogin.phoneNumber" placeholder="手机号"
                            prefix-icon="el-icon-mobile-phone"></el-input>
                </el-form-item>
                <el-form-item label="" prop="verificationCode">
                  <el-row>
                    <el-col :span="13">
                      <el-input v-model="messageLogin.verificationCode" placeholder="手机验证码"
                                prefix-icon="el-icon-message"></el-input>
                    </el-col>
                    <el-col :span="10" :offset="1">
                      <el-button type="success" @click="ObtainMessageCode" :disabled="messageLogin.buttonDisabled"><span
                        v-if="messageLogin.buttonDisabled">{{messageLogin.verificationCodeTime}}后</span>{{messageLogin.butttonMessage}}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
              <el-row>
                <el-button type="success" size="medium " :span="20" class="message-login-btn"
                           @click="messageSubmitForm('messageLogin')">登录
                </el-button>
              </el-row>
              <div class="text-tip">没有账号?
                <router-link :to="{ path: '/register' }" tag="a" class="link-signup">立即注册</router-link>
              </div>
            </el-tab-pane>
            <!--<el-tab-pane label="扫码登录" name="third">-->
            <!--<p>扫码登录界面</p>-->
            <!--</el-tab-pane>-->
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import erweima from './../images/erweima.png'
  import lc from './../images/LC.png'

  export default {
    name: "login",
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
      return {
        lc:lc,
        toggleart: 'HR',
        labelPosition: 'right',
        login: {
          password: '',
          phoneNumber: '',
          yzcode: ''
        },
        messageLogin: {
          phoneNumber: '',
          verificationCode: '',
          butttonMessage: '获取验证码',
          buttonDisabled: false,
          verificationCodeTime: 60
        },
        value: '',
        activeName: 'first',
        yanzToken: '',
        erweima: erweima,
        loading: '',
        rules: {
          phoneNumber: [
            {validator: phoneNumberRule, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空'}
          ],
          yzcode: [
            {required: true, message: '验证码不能为空'}
          ]
        },
        messageRules: {
          phoneNumber: [
            {validator: phoneNumberRule, trigger: 'blur'}
          ],
          verificationCode: [
            {required: true, message: '验证码不能为空'}
          ]
        }
      }
    },
    mounted() {
      axios.defaults.headers = {
        'X-UserToken': ''
      }
      this.obtainYanCode()
      this.keydownLogin()
    },
    methods: {
      resetCode(){
        sessionStorage.setItem('plantype',this.toggleart)
        this.$router.push({path: '/codereset'})
      },
      keydownLogin() {
        let panlefirst=document.getElementById('pane-first')
        panlefirst.onkeydown = (event)=> {
          var e = event || window.event || arguments.callee.caller.arguments[0];
          if (e && e.keyCode == 13) {
            this.submitForm('login')
          }
        };
        let panlesecond=document.getElementById('pane-second')
        panlesecond.onkeydown = (event)=> {
          var e = event || window.event || arguments.callee.caller.arguments[0];
          if (e && e.keyCode == 13) {
            this.messageSubmitForm('messageLogin')
          }
        };
      },
      resetYanz() {
        this.obtainYanCode();
      },
      obtainYanCode() {
        this.yanzToken = this.randomWord(false, 32)
        this.erweima = this.serviceUrl + '/api/auth/defaultKaptcha?token=' + this.yanzToken
      },
      randomWord(randomFlag, min, max) {
        let pos = ''
        let str = "",
          range = min,
          arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min;
        }
        for (let i = 0; i < range; i++) {
          pos = Math.round(Math.random() * (arr.length - 1));
          str += arr[pos];
        }
        return str;
      },
      ObtainMessageCode() {
        let obtainMessageObj = {
          cellphone: this.messageLogin.phoneNumber,
          type: 'Login',
          platformType: this.toggleart
        }
        axios.post(this.serviceUrl + '/api/auth/sendCode', obtainMessageObj)
          .then((response) => {
            console.log('获取验证码返回数据')
            console.log(response)
            if (response.status === 200) {
              this.messageLogin.buttonDisabled = true
              this.el_alert('success', '验证码已发送！')
              let time = setInterval(() => {
                if (this.messageLogin.verificationCodeTime !== 0) {
                  this.messageLogin.verificationCodeTime -= 1
                } else {
                  window.clearInterval(time)
                  this.messageLogin.buttonDisabled = false
                  this.messageLogin.butttonMessage = '获取验证码'
                }
              }, 1000)
            } else {
              this.messageLogin.buttonDisabled = false
              this.messageLogin.butttonMessage = '获取验证码'
              this.el_alert('error', '获取验证码失败！')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert = decodeURI(error.response.headers['x-alert'])
            this.el_alert('error', alert)
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loginPost()
          } else {
            this.el_alert('warning', '登录信息有误或不完整，请重新登录')
            return
          }
        })
      },
      messageSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.messageLoginPost()
          } else {
            this.el_alert('warning', '登录信息有误或不完整，请重新登录')
            return
          }
        })
      },
      el_alert(type, message) {
        this.$message({
          showClose: true,
          message: message,
          type: type
        });
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      messageLoginPost() {
        let messageLoginObj = {
          cellphone: this.messageLogin.phoneNumber,
          password: '',
          plateformType: this.toggleart,
          verificationCode: this.messageLogin.verificationCode
        }
        axios.post(this.serviceUrl + '/api/auth/loginByCode', messageLoginObj)
          .then((response) => {
            console.log('短信登录返回数据')
            console.log(response)
            if (response.data.token) {
              sessionStorage.setItem('token', response.data.token)
              sessionStorage.setItem('userName', response.data.user.username)
              this.$store.dispatch({
                type: 'reste',
                headerImgUrl: response.data.user.headPic === undefined ? '' : response.data.user.headPic
              });
              sessionStorage.setItem('headerImage', response.data.user.headPic === undefined ? '' : response.data.user.headPic)
              sessionStorage.setItem('plantFrom', this.toggleart)
              sessionStorage.setItem('percentageServiceFee',response.data.user.company.percentageServiceFee)
              this.el_alert('success', '登录成功！')
              if (this.toggleart === 'HR') {
                this.$router.push({path: '/posList'})
              } else if (this.toggleart === 'HR_MANAGER') {
                this.$router.push({path: '/admin'})
              }
            } else {
              this.el_alert('error', '登录失败！')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert = decodeURI(error.response.headers['x-alert'])
            this.el_alert('error', alert)
          })
      },
      loginPost() {
        let loginObj = {
          cellphone: this.login.phoneNumber,
          password: this.login.password,
          plateformType: this.toggleart,
          verificationCode: this.login.yzcode,
          token: this.yanzToken
        }
        axios.post(this.serviceUrl + '/api/auth/login', loginObj)
          .then((response) => {
            console.log('登录返回数据')
            console.log(response)
            if (response.data.token) {
              sessionStorage.setItem('token', response.data.token)
              sessionStorage.setItem('username', response.data.user.username)
              this.$store.dispatch({
                type: 'reste',
                headerImgUrl: response.data.user.headPic === undefined ? '' : response.data.user.headPic
              });
              sessionStorage.setItem('headerImage', response.data.user.headPic === undefined ? '' : response.data.user.headPic)
              sessionStorage.setItem('plantFrom', this.toggleart)
              sessionStorage.setItem('percentageServiceFee',response.data.user.company.percentageServiceFee)
              this.el_alert('success', '登录成功！')
              if (this.toggleart === 'HR') {
                sessionStorage.setItem('indexPath', '/posList')
                this.$router.push({path: '/posList'})
              } else if (this.toggleart === 'HR_MANAGER') {
                sessionStorage.setItem('indexPath', '/admin')
                this.$router.push({path: '/admin'})
              }
            } else {
              this.el_alert('error', '登录失败！')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert = decodeURI(error.response.headers['x-alert'])
            this.el_alert('error', alert)
          })
      }
    }
  }
</script>
<style>
  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #ffd04b;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item {
     border: 0px solid transparent;
  }
  .login-container .el-tabs--border-card>.el-tabs__header {
    background-color: #323949 !important;
    border-bottom: 1px solid #323949;
    margin: 0;
  }
  .login-container .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
    background-color: rgb(27, 24, 32);
  }
  .login-container .el-tabs--border-card{
    border: 1px solid rgba(0,0,0,.55);
  }
  .login-container .el-tabs__content{
    background-color: rgb(27, 24, 32);
    border: 1px solid rgba(0,0,0,.55);
  }
  .yanz-li .el-form-item__content{
    line-height: 0px !important;
  }
  .restcode .el-button--text{
    color: #67c23a;
  }
  .login-container input{
    border: 1px solid #505f6d !important;
    background-color: #414d59;
    color: #ffffff;
  }
</style>
<style scoped>
  .restcode{
    text-align: center;
  }
  .genhuan-s {
    cursor: pointer;
    color: #67c23a;
  }

  .yazhen-c {
    width: 100%;
    height: 26px;
  }

  .pc-re {
    position: relative;
    display: inline-block;
    line-height: 12px;
    font-size: 12px;
  }

  .choseArt {
    text-align: center;
    margin-bottom: 20px;
  }

  .login-container {
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
    padding: 20px 0px;
    font-size: 14px;
  }

  .message-login-btn {
    width: 100%;
    margin-top: 25px;
  }

  .login-btn {
    width: 100%;
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
