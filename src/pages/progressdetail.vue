<template>
  <div class="positionDtail">
    <navheader>
      <li class="barActive" @click="goPositionProgress('list')">需求大厅</li>
    </navheader>
    <el-row :gutter="20" style="padding:0 5px;margin: 0px">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><el-button icon="fa fa-arrow-left" type="text" @click="returnPositionList">返回</el-button></span>
          </div>
          <div class="houxuan-c">
            <div class="xu-tile f-l"><span style="color:#7aca53">{{currentTitle}}</span>候选人员</div>
            <div class="xu-tile f-r c-fs">候选人总人数：<span style="color:#7aca53">{{totalPreson}}</span>人</div>
          </div>
          <el-carousel :interval="5000" indicator-position="none" :autoplay="isauto" height="140px">
            <el-carousel-item v-for="(item,index) in hxuserData">
              <el-row :gutter="20">
                <el-col :span="3" v-for="(itemSon,indexson) in item">
                  <div class="text-center header-b"
                       @click="checkDetail(itemSon.candidateAvatar,itemSon.candidateName,itemSon.id)">
                    <div class="user-thumb" @click="bageActive(itemSon.id,index,indexson)">
                      <el-badge is-dot class="item" :hidden="!itemSon.hrStateFlag">
                        <img :src="itemSon.candidateAvatar"
                             class="img-responsive bx-shadow rounded-circle img-thumbnail"
                             :class="gryaClass(itemSon.state)"
                             alt="头像">
                      </el-badge>
                    </div>
                    <div class="font-18">{{itemSon.candidateName}}</div>
                  </div>
                </el-col>
              </el-row>
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding:0 5px;margin: 0px auto ;width:90%;">
      <el-col :span="24">
        <el-card class="card-s  header-image">
          <div slot="header" class="text-center header-bg">
            <div class="user-thumb">
              <img :src="currentimageUrl" class="img-responsive bx-shadow rounded-circle img-thumbnail"
                   :class="isgreay?'grearClass':''"
                   alt="头像">
            </div>
            <div class="font-18">{{currentuserName}}</div>
          </div>
          <div>
            <div>
              <p class="f-l f-s">职位进度</p>
              <el-button class="f-r" type="success" icon="el-icon-document" @click="openRresumeWindow">
                查看简历
              </el-button>
              <div class="dialogContaineer">
                <el-dialog
                  title="个人简历"
                  top="5vh"
                  :visible.sync="resumedialogVisible"
                  width="85%"
                  :before-close="handleClose">
                  <resume :currentuserId="candidate_id" v-if="resumedialogVisible"></resume>
                </el-dialog>
              </div>
            </div>
            <div class="c-b">
              <el-steps :space="400" :active="progressActive" finish-status="success">
                <el-step title="推荐"></el-step>
                <el-step title="面试"></el-step>
                <el-step title="入职"></el-step>
                <el-step title="结算"></el-step>
              </el-steps>
            </div>
            <div class="m-t">
              <p class="f-s" v-if="historyData.length===0?false:true">进度历史回看</p>
              <el-collapse v-model="activeName" accordion>
                <el-collapse-item :name="$index" v-for="(item,$index) in historyData">
                  <template slot="title">
                    <i class="el-icon-success" style="color:#67c23a;"></i>{{item.title}}
                  </template>
                  <p class="p-s">状态描述:</p>
                  <div style="font-size: 14px;color: #98a6ad">{{item.description}}</div>
                  <div v-if="(offerTeableDate.length!==0&&item.title==='入职')?true:false">
                    <p class="p-s">offer详情:</p>
                    <el-table
                      :data="offerTeableDate"
                      style="width: 100%">
                      <el-table-column
                        prop="position"
                        label="职位">
                      </el-table-column>
                      <el-table-column
                        prop="department"
                        label="所属部门">
                      </el-table-column>
                      <el-table-column
                        prop="reportDutyTime"
                        label="入职时间">
                      </el-table-column>
                      <el-table-column
                        prop="contractPeriod"
                        label="合同期(年)">
                      </el-table-column>
                      <el-table-column
                        prop="leader"
                        label="直接领导">
                      </el-table-column>
                      <el-table-column
                        prop="probationPeriod"
                        label="试用期">
                      </el-table-column>
                      <el-table-column
                        prop="probationSalary"
                        label="试用薪水">
                      </el-table-column>
                      <el-table-column
                        prop="salary"
                        label="转正薪水">
                      </el-table-column>
                      <el-table-column
                        prop="workplace"
                        label="工作地点">
                      </el-table-column>
                      <el-table-column
                        prop="description"
                        label="备注">
                      </el-table-column>
                    </el-table>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="m-t" v-if="ishavediscirptio">
              <p class="f-s">状态描述</p>
              <p style="font-size: 14px;color: #98a6ad">{{descirptionMessage}}</p>
            </div>
            <el-dialog
              title="评价一下和猎头的沟通吧"
              :visible.sync="dialogVisible"
              width="30%" center>
              <div class="block text-center">
                <el-rate v-model="reateValue"></el-rate>
              </div>
              <span slot="footer" class="dialog-footer">
              <el-button type="success" plain @click="putComments">提交</el-button>
              </span>
            </el-dialog>
            <div class="m-t" v-if="ishavePosition">
              <p class="f-s">流程操作</p>
              <el-button type="success" round v-if="ishaveapply" @click="yazhenModal">支付佣金</el-button>
              <el-dialog
                title="获取支付验证码"
                :visible.sync="payyanzeng"
                width="30%" center>
                <div class="block text-center">
                  <el-form :label-position="labelPosition" :rules="messageyazRules" :model="messageyaz" ref="messageyaz"
                           status-icon clearable>
                    <el-form-item label="" prop="verificationCode">
                      <el-row>
                        <el-col :span="13">
                          <el-input v-model="messageyaz.verificationCode" placeholder="手机验证码"
                                    prefix-icon="el-icon-message"></el-input>
                        </el-col>
                        <el-col :span="10" :offset="1">
                          <el-button type="success" @click="ObtainMessageCode"
                                     :disabled="messageyaz.buttonDisabled"><span
                            v-if="messageyaz.buttonDisabled">{{messageyaz.verificationCodeTime}}后</span>{{messageyaz.butttonMessage}}
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
              <el-button type="success" plain @click="payFromSubmit('messageyaz')">支付</el-button>
              </span>
              </el-dialog>
              <el-button type="danger" round @click="refuseRegular">不予转正</el-button>
              <div class="nopositionDialog">
                <el-dialog
                  :visible.sync="dialogVisible_noPosition"
                  width="32%">
                  <span slot="title" class="title-waring">操作提醒</span>
                  <div class="">
                    <p>1、不予转正将收取{{percentageServiceFee*100+'%'}}的服务费，其他费用将全部退回。</p>
                    <p>2、如需继续招聘，请重新发布招聘信息。</p>
                  </div>
                  <span slot="footer" class="dialog-footer">
                   <el-button type="success"  @click="refuseRegularson">确定</el-button>
                   <el-button type="danger"  @click="dialogVisible_noPosition=false">取消</el-button>
              </span>
                </el-dialog>
              </div>
              <p v-if="ishaveapply">
                <el-alert
                  :title="applyDate"
                  type="warning"
                  show-icon>
                </el-alert>
              </p>
            </div>
            <div class="m-t" v-if="ishaveOfferMessage">
              <p class="f-s">offer详情</p>
              <el-table
                :data="offerReturnMessage"
                style="width: 100%">
                <el-table-column
                  prop="position"
                  label="职位">
                </el-table-column>
                <el-table-column
                  prop="department"
                  label="部门">
                </el-table-column>
                <el-table-column
                  prop="reportDutyTime"
                  label="入职时间">
                </el-table-column>
                <el-table-column
                  prop="contractPeriod"
                  label="合同年限(年)">
                </el-table-column>
                <el-table-column
                  prop="leader"
                  label="直接领导">
                </el-table-column>
                <el-table-column
                  prop="probationPeriod"
                  label="试用期">
                </el-table-column>
                <el-table-column
                  prop="probationSalary"
                  label="试用薪水">
                </el-table-column>
                <el-table-column
                  prop="salary"
                  label="转正薪水">
                </el-table-column>
                <el-table-column
                  prop="workplace"
                  label="工作地点">
                </el-table-column>
                <el-table-column
                  prop="description"
                  label="备注">
                </el-table-column>
              </el-table>
            </div>
            <div class="m-t" v-if="ishavewriteroffer">
              <p class="f-s">填写offer</p>
              <el-row :gutter="20" class="titleList">
                <el-col :span="12" :offset="6">
                  <el-form :label-position="labelPosition" status-icon clearable :rules="rules"
                           :model="offerMessageContainer" ref="offerMessageContainer">
                    <el-form-item label="合同年限(年):" prop="contractPeriod">
                      <el-input v-model="offerMessageContainer.contractPeriod" placeholder="合同年限(年)"></el-input>
                    </el-form-item>
                    <el-form-item label="部门:" prop="department">
                      <el-input v-model="offerMessageContainer.department" placeholder="部门"></el-input>
                    </el-form-item>
                    <el-form-item label="直接领导:" prop="leader">
                      <el-input v-model="offerMessageContainer.leader" placeholder="直接领导"></el-input>
                    </el-form-item>
                    <el-form-item label="职位:" prop="position">
                      <el-input v-model="offerMessageContainer.position" placeholder="职位"></el-input>
                    </el-form-item>
                    <el-form-item label="试用期(月):" prop="Probation">
                      <el-input v-model="offerMessageContainer.Probation" placeholder="试用期(月)"></el-input>
                    </el-form-item>
                    <el-form-item label="试用期薪水(元/月):" prop="ProbationSalary">
                      <el-input v-model="offerMessageContainer.ProbationSalary"
                                placeholder="试用期薪水(元/月)"></el-input>
                    </el-form-item>
                    <el-form-item label="转正薪水(元/月):" prop="regularSalary">
                      <el-input v-model="offerMessageContainer.regularSalary" placeholder="转正薪水(元/月)"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="reportDutyTime">
                      <label class="el-form-item__label">入职时间:</label>
                      <el-date-picker
                        v-model="offerMessageContainer.reportDutyTime"
                        type="date"
                        size="large"
                        :picker-options="{
                         disabledDate: disabledDate
                         }"
                        placeholder="入职时间">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="工作地点:" prop="WorkingPlace">
                      <el-input v-model="offerMessageContainer.WorkingPlace" placeholder="工作地点"></el-input>
                    </el-form-item>
                    <el-form-item label="备注:">
                      <el-input v-model="offerMessageContainer.compents" placeholder="可选填"></el-input>
                    </el-form-item>
                  </el-form>
                  <div class="text-center">
                    <el-button type="success" @click="submitForm('offerMessageContainer')">提交offer</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="m-t" v-if="ishavecheckbox">
              <p class="f-s">状态描述</p>
              <div>
                <el-radio-group v-model="isAllow" :disabled="checkboxDisable">
                  <el-radio-button label="通过"></el-radio-button>
                  <el-radio-button label="不通过"></el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="m-t" v-if="ishavetextarea">
              <p class="f-s">原因陈述</p>
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入通过/不通过原因"
                  v-model="textarea">
                </el-input>
              </div>
            </div>
            <div class="m-p c-f" v-if="ishavedoResigter" >
              <el-button class="f-r" type="danger" @click="onRegister" style="margin-left:10px; ">
                未入职
              </el-button>
              <el-button class="f-r" type="success" @click="doRegister">
                办理入职
              </el-button>
            </div>
            <div class="m-t" v-if="ishaveComments">
              <el-button type="success" round @click="putcomments" size="medium " style="width:150px;">评价</el-button>
            </div>
          </div>
          <el-button type="success" class="f-r mar-b" :disabled="checkboxDisable" v-if="ishaveyesbtn"
                     @click="putcheckMessage">确定
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import navheader from './../components/headernav'
  import resume from './../components/resume'
  import axios from 'axios'

  export default {
    name: "progressdetail",
    components: {
      navheader: navheader,
      resume: resume
    },
    data() {
      let ProbationSalaryRule = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('试用期薪水不能为空'))
        }else{
          setTimeout(() => {
            let reg = /^[0-9]*$/
            if (!reg.test(value)) {
              callback(new Error('试用期薪水只能为数字'))
            } else {
              callback()
            }
          }, 300)
        }

      }
      let regularSalaryRule = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('转正薪水不能为空'))
        }else{
          setTimeout(() => {
            let reg = /^[0-9]*$/
            if (!reg.test(value)) {
              callback(new Error('转正薪水只能为数字'))
            } else {
              callback()
            }
          }, 300)
        }
      }
      let ProbationRule = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('试用期不能为空'))
        }else{
          setTimeout(() => {
            let reg = /^[0-9]*$/
            if (!reg.test(value)) {
              callback(new Error('试用期只能为数字'))
            } else {
              callback()
            }
          }, 300)
        }

      }
      let contractPeriodRule=(rule, value, callback) => {
        if (!value) {
          return callback(new Error('合同年限不能为空'))
        }else{
          setTimeout(() => {
            let reg = /^[0-9]*$/
            if (!reg.test(value)) {
              callback(new Error('合同年限只能为数字'))
            } else {
              callback()
            }
          }, 300)
        }

      }
      return {
        appintTime:'',
        percentageServiceFee:sessionStorage.getItem('percentageServiceFee'),
        messageyazRules: {
          verificationCode: [
            {required: true, message: '验证码不能为空'}
          ]
        },
        messageyaz: {
          verificationCode: '',
          butttonMessage: '获取验证码',
          buttonDisabled: false,
          verificationCodeTime: 60
        },
        payyanzeng: false,
        candidate_id: '',
        dialogVisible_noPosition:false,
        resumedialogVisible: false,
        offerTeableDate: [],
        activeName: '1',
        totalPreson: 0,
        reateValue: 0,
        dialogVisible: false,
        offerReturnMessage: [],
        offerMessageContainer: {
          contractPeriod: '',
          department: '',
          leader: '',
          position: '',
          Probation: '',
          ProbationSalary: '',
          regularSalary: '',
          reportDutyTime: '',
          compents: '',
          WorkingPlace: '',
        },
        contains: 'navheader',
        currentId: sessionStorage.getItem('currentId'),
        currentimageUrl: '',
        currentuserName: '',
        currentTitle: sessionStorage.getItem('currentTitle'),
        currentuserId: '',
        isAllow: '',
        isdisable: false,
        textarea: '',
        isauto: false,
        page: 0,
        labelPosition: 'right',
        size: 8,
        hxuserData: [],
        descirptionMessage: '',
        progressActive: 1,
        checkboxDisable: false,
        ishavecheckbox: false,
        ishavetextarea: false,
        ishaveyesbtn: false,
        ishavediscirptio: false,
        ishavewriteroffer: false,
        ishaveOfferMessage: false,
        ishavedoResigter: false,
        ishaveapply: false,
        ishavePosition: false,
        ishaveComments: false,
        personState: '',
        historyData: [],
        applyDate:'候选人转正后，未对佣金做任何处理的订单，将在0个工作日自动完成支付。',
        isgreay: false,
        rules: {
          Probation: [
            {required: true, message: '试用期不能为空'},
            {validator:ProbationRule, trigger: 'blur'}
          ],
          contractPeriod: [
            {required: true, message: '合同年限不能为空'},
            {validator:contractPeriodRule, trigger: 'blur'},
          ],
          ProbationSalary: [
            {required: true, message: '试用期薪水不能为空'},
            {validator:ProbationSalaryRule, trigger: 'blur'},
          ],
          regularSalary: [
            {required: true, message: '转正薪水不能为空'},
            {validator:regularSalaryRule, trigger: 'blur'},
          ],
          department: [
            {required: true, message: '部门不能为空'}
          ],
          leader: [
            {required: true, message: '直接领导不能为空'}
          ],
          position: [
            {required: true, message: '职位不能为空'}
          ],
          reportDutyTime: [
            {required: true, message: '入职时间不能为空'}
          ],
          WorkingPlace: [
            {required: true, message: '工作地点不能为空'}
          ]
        },
      }
    },
    created() {
      this.tokenvident()
    },
    mounted() {
    },
    methods: {
      replaceDate(date){
        let pp=new Date(date);
          return pp.getFullYear() + "/" + (pp.getMonth() + 1) + "/" + pp.getDate() + "/ " + pp.getHours() + ":" + pp.getMinutes()
      },
      getApplyDate(){
        axios.get(this.serviceUrl + '/api/commissionConfirmConfig/getConfigByUser')
          .then((response) => {
            console.log('获取支付日期返回数据')
            console.log(response)
            if (response.data.confirmDateCount!== '') {
               this.applyDate='候选人转正后，未对佣金做任何处理的订单，将在'+response.data.confirmDateCount+'个工作日自动完成支付。'
            } else {
              this.em_alert('获取支付日期失败','warning')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert = decodeURI(error.response.headers['x-alert'])
            this.em_alert('error', alert)
          })
      },
      onRegister(){
        let personId = {
          id:this.currentuserId
        }
        axios.post(this.serviceUrl + '/api/jobDetailOrder/candidateNoRegister', personId)
          .then((response) => {
            console.log('获取未入职返回数据')
            console.log(response)
            if (response.status === 200) {
              this.em_alert('未入职办理成功','success')
              this.getPositionMan()
            } else {
              this.em_alert('未入职办理失败','warning')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert = decodeURI(error.response.headers['x-alert'])
            this.em_alert('error', alert)
          })
      },
      disabledDate(date){
        if(date<new Date()){
          return true
        }else{
          return false
        }
      },
      payFromSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.applyAreaw()
          } else {
            this.em_alert('验证码不能为空，请重新填写', 'warning')
            return
          }
        })
      },
      ObtainMessageCode() {
        let obtainMessageObj = {
          cellphone: sessionStorage.getItem('username'),
          type: 'Pay_Confirm',
          platformType: 'HR'
        }
        axios.post(this.serviceUrl + '/api/auth/sendCode', obtainMessageObj)
          .then((response) => {
            console.log('获取验证码返回数据')
            console.log(response)
            if (response.status === 200) {
              this.messageyaz.buttonDisabled = true
              this.em_alert('验证码已发送！','success')
              let time = setInterval(() => {
                if (this.messageyaz.verificationCodeTime !== 0) {
                  this.messageyaz.verificationCodeTime -= 1
                } else {
                  window.clearInterval(time)
                  this.messageyaz.buttonDisabled = false
                  this.messageyaz.butttonMessage = '获取验证码'
                }
              }, 1000)
            } else {
              this.messageyaz.buttonDisabled = false
              this.messageyaz.butttonMessage = '获取验证码'
              this.em_alert('获取验证码失败！','error')
            }
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert = decodeURI(error.response.headers['x-alert'])
            this.em_alert('error', alert)
          })
      },
      handleClose(done) {
        this.$confirm('确认关闭简历？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      gryaClass(state) {
        if (state === 'Rejected' || state === 'Interview_Failed' || state === 'No_Register' || state === 'No_Positive' || state === 'Positive') {
          return 'grearClass'
        } else {
          return ''
        }
      },
      putComments() {
        let commentsobj = {
          id: this.currentuserId,
          comment: '',
          evaluateType: "HR",
          score: this.reateValue
        }
        axios.post(this.serviceUrl + '/api/jobDetailOrder/evaluate', commentsobj)
          .then((res) => {
            console.log('提交评价的返回')
            console.log(res)
            if (res.status === 200) {
              this.dialogVisible = false
              this.em_alert('评价成功！', 'success')
              this.getPositionMan()
            } else {
              this.dialogVisible = false
              this.em_alert('评价失败！', 'error')
            }
          })
          .catch((err) => {
            console.log(err.response.headers)
            let alert = decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert, 'error')
          })
      },
      putcomments() {
        this.dialogVisible = true
      },
      yazhenModal() {
        this.payyanzeng = true
      },
      applyAreaw() {
        let applyAweawobj = {
          id: this.currentuserId,
          verificationCode: this.messageyaz.verificationCode
        }
        axios.post(this.serviceUrl + '/api/jobDetailOrder/confirmCommission', applyAweawobj)
          .then((res) => {
            console.log('提交佣金的返回')
            console.log(res)
            if (res.status === 200) {
              this.em_alert('支付佣金成功！', 'success')
              this.getPositionMan()
            } else {
              this.em_alert('支付佣金失败！', 'warning')
            }
          })
          .catch((err) => {
            console.log(err.response.headers)
            let alert = decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert, 'error')
          })
      },
      refuseRegular() {
        this.dialogVisible_noPosition=true
      },
      refuseRegularson(){
        let currentIDobj = {
          id: this.currentuserId
        }
        axios.post(this.serviceUrl + '/api/jobDetailOrder/candidateNoPositive', currentIDobj)
          .then((res) => {
            console.log('提交拒绝转正的返回')
            console.log(res)
            if (res.status === 200) {
              this.em_alert('拒绝转正成功！', 'success')
              this.dialogVisible_noPosition=false
              this.getPositionMan()
            } else {
              this.em_alert('拒绝转正失败！', 'warning')
              this.dialogVisible_noPosition=false
            }
          })
          .catch((err) => {
            console.log(err.response.headers)
            let alert = decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert, 'error')
          })
      },
      doRegister() {
        let currentIDobj = {
          id: this.currentuserId
        }
        axios.post(this.serviceUrl + '/api/jobDetailOrder/candidateRegister', currentIDobj)
          .then((res) => {
            console.log('提交offer信息返回')
            console.log(res)
            if (res.status === 200) {
              this.em_alert('办理成功！', 'success')
              this.getPositionMan()
            } else {
              this.em_alert('办理失败！', 'warning')
            }
          })
          .catch((err) => {
            console.log(err.response.headers)
            let alert = decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert, 'error')
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.offerMessageContainer.ProbationSalary>this.offerMessageContainer.regularSalary){
              this.em_alert('转正薪资应大于实习期薪资，请重新填写', 'warning')
              return
            }else{
              this.putOfferMessage()
            }
          } else {
              this.em_alert('简历信息填写有误或不完整，请重新填写', 'warning')
              return
          }
        })
      },
      putOfferMessage() {
        let offerobj = {
          contractPeriod: this.offerMessageContainer.contractPeriod,
          department: this.offerMessageContainer.department,
          description: this.offerMessageContainer.compents,
          id: this.currentuserId,
          leader: this.offerMessageContainer.leader,
          position: this.offerMessageContainer.position,
          probationPeriod: this.offerMessageContainer.Probation,
          probationSalary: this.offerMessageContainer.ProbationSalary,
          reportDutyTime: this.offerMessageContainer.reportDutyTime,
          salary: this.offerMessageContainer.regularSalary,
          workplace: this.offerMessageContainer.WorkingPlace
        }
        axios.post(this.serviceUrl + '/api/jobDetailOrder/saveOffer', offerobj)
          .then((res) => {
            console.log('提交offer信息返回')
            console.log(res)
            if (res.data.url !== '') {
              this.em_alert('提交offer成功！', 'success')
              this.getPositionMan()
            } else {
              this.em_alert('提交offer失败！', 'waring')
            }
          })
          .catch((err) => {
            console.log(err.response.headers)
            let alert = decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert, 'error')
          })
      },
      putcheckMessage() {
        if (this.personState === 'Recommended') {
          let recomobj = {
            id: this.currentuserId,
            reason: this.textarea,
            result: this.isAllow === '通过' ? 'ACCEPT' : 'REJECT'
          }
          axios.post(this.serviceUrl + '/api/jobDetailOrder/acceptCandidate', recomobj)
            .then((res) => {
              console.log('提交推荐信息返回')
              console.log(res)
              if (res.status === 200) {
                this.em_alert('提交成功！', 'success')
                this.getPositionMan()
              } else {
                this.em_alert('提交失败！', 'warning')
              }
            })
            .catch((err) => {
              console.log(err.response.headers)
              let alert = decodeURI(err.response.headers['x-alert'])
              this.em_alert(alert, 'error')
            })
        } else if (this.personState === 'Wait_Interview') {
          let WaitInterviewobj = {
            id: this.currentuserId,
            reason: this.textarea,
            result: this.isAllow === '通过' ? 'PASS' : 'FAIL'
          }
          axios.post(this.serviceUrl + '/api/jobDetailOrder/saveInterviewResult', WaitInterviewobj)
            .then((res) => {
              console.log('提交等待面试信息返回')
              console.log(res)
              if (res.status === 200) {
                this.em_alert('提交成功！', 'success')
                this.getPositionMan()
              } else {
                this.em_alert('提交失败！', 'warning')
              }
            })
            .catch((err) => {
              console.log(err.response.headers)
              let alert = decodeURI(err.response.headers['x-alert'])
              this.em_alert(alert, 'error')
            })
        }
      },
      bageActive(id, index, indexson) {
        let bargobj = {
          id: id,
          requestType: "HR"
        }
        axios.post(this.serviceUrl + '/api/jobDetailOrder/resetChangeStateFlag', bargobj)
          .then((res) => {
            console.log('置换按钮')
            console.log(res)
            if (res.status === 200) {
              this.hxuserData[index][indexson].hrStateFlag = false;
            }
          })
          .catch((err) => {
            console.log(err.response.headers)
            let alert = decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert, 'error')
          })
      },
      checkDetail(imgUrl, userName, id) {
        this.currentuserId = id
        this.currentimageUrl = imgUrl
        this.currentuserName = userName
        axios.get(this.serviceUrl + '/api/jobDetailOrder/getJobTaskOrderItem/' + id)
          .then((res) => {
            console.log('候选人进度详情')
            console.log(res)
            if (res.data.state !== '') {
              this.candidate_id = res.data.candidate.id
              this.personState = res.data.state
              //推荐完成环节
              if (res.data.state === 'Recommended') {
                this.offerTeableDate = []
                this.historyData = []
                this.ishaveComments = false
                this.progressActive = 1
                this.ishavePosition = false
                this.ishaveOfferMessage = false
                this.ishavewriteroffer = false
                this.checkboxDisable = false
                this.ishavediscirptio = false
                this.ishavecheckbox = true
                this.ishavetextarea = true
                this.ishaveyesbtn = true
              } else if (res.data.state === 'Rejected') {
                this.offerTeableDate = []
                this.historyData = []
                if (res.data.hrEvaluateFlag) {
                  this.ishaveComments = false
                } else {
                  this.ishaveComments = true
                }
                this.ishavecheckbox = false
                this.ishavePosition = false
                this.ishavewriteroffer = false
                this.ishaveOfferMessage = false
                this.ishavetextarea = false
                this.ishaveyesbtn = false
                this.progressActive = 1
                this.checkboxDisable = true
                this.ishavediscirptio = true
                this.descirptionMessage = '状态：已拒绝，原因：' + res.data.rejectReason
                this.historyData = [
                  {
                    title: '推荐',
                    description: this.descirptionMessage
                  }
                ]
                //面试完成环节
              } else if (res.data.state === 'Accepted') {
                this.offerTeableDate = []
                this.offerTeableDate = []
                this.ishaveComments = false
                this.ishavePosition = false
                this.progressActive = 2
                this.ishaveOfferMessage = false
                this.ishavewriteroffer = false
                this.ishavecheckbox = false
                this.ishavetextarea = false
                this.ishaveyesbtn = false
                this.ishavediscirptio = true
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  }
                ]
                this.descirptionMessage = '等待猎头发布约面时间。'
              } else if (res.data.state === 'Wait_Appointment') {
                this.appintTime=this.replaceDate(res.data.appointmentTime)
                this.offerTeableDate = []
                this.ishaveComments = false
                this.ishavePosition = false
                this.ishavecheckbox = false
                this.ishaveOfferMessage = false
                this.ishavewriteroffer = false
                this.ishavetextarea = false
                this.ishaveyesbtn = false
                this.ishavediscirptio = true
                this.descirptionMessage = '约面时间:' + this.appintTime
                this.progressActive = 2
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  }
                ]
              } else if (res.data.state === 'Wait_Interview') {
                this.offerTeableDate = []
                this.ishaveComments = false
                this.ishavePosition = false
                this.progressActive = 2
                this.ishaveOfferMessage = false
                this.ishavewriteroffer = false
                this.checkboxDisable = false
                this.ishavecheckbox = true
                this.ishavetextarea = true
                this.ishavediscirptio = false
                this.ishaveyesbtn = true
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  }
                ]
              } else if (res.data.state === 'Interview_Failed') {
                this.historyData = []
                this.offerTeableDate = []
                if (res.data.hrEvaluateFlag) {
                  this.ishaveComments = false
                } else {
                  this.ishaveComments = true
                }
                this.ishavePosition = false
                this.ishavedoResigter = false
                this.ishavewriteroffer = false
                this.checkboxDisable = false
                this.ishavecheckbox = false
                this.ishavetextarea = false
                this.ishavediscirptio = true
                this.ishaveyesbtn = false
                this.descirptionMessage = '状态：面试失败，原因：' + res.data.interviewResultDesc
                this.ishaveOfferMessage = false
                this.progressActive = 2
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  },
                  {
                    title: '面试',
                    description: this.descirptionMessage
                  }
                ]
                //入职完完成环节
              } else if (res.data.state === 'Waint_Offer') {
                this.offerTeableDate = []
                this.historyData = []
                this.ishaveComments = false
                this.ishavePosition = false
                this.ishavewriteroffer = true
                this.ishaveOfferMessage = false
                this.checkboxDisable = false
                this.ishavecheckbox = false
                this.ishavetextarea = false
                this.ishavediscirptio = false
                this.ishaveyesbtn = false
                this.progressActive = 3
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  },
                  {
                    title: '面试',
                    description: res.data.interviewResultDesc
                  }
                ]
              } else if (res.data.state === 'No_Register') {
                this.offerTeableDate = []
                if (res.data.hrEvaluateFlag) {
                  this.ishaveComments = false
                } else {
                  this.ishaveComments = true
                }
                this.ishavePosition = false
                this.ishavediscirptio = true
                this.ishavecheckbox = false
                this.ishavetextarea = false
                this.offerReturnMessage = []
                res.data.offer.reportDutyTime = new Date(res.data.offer.reportDutyTime).toLocaleDateString()
                this.offerReturnMessage.push(res.data.offer)
                this.ishaveOfferMessage = true
                this.descirptionMessage = '状态：offer已发送,未入职'
                this.progressActive = 3
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  },
                  {
                    title: '面试',
                    description: res.data.interviewResultDesc
                  },
                  {
                    title: '入职',
                    description: this.descirptionMessage
                  }
                ]
              } else if (res.data.state === 'Wait_Register') {
                this.offerTeableDate = []
                this.ishaveComments = false
                this.ishavePosition = false
                this.ishavedoResigter = true
                this.ishavewriteroffer = false
                this.checkboxDisable = false
                this.ishavecheckbox = false
                this.ishavetextarea = false
                this.ishavediscirptio = true
                this.ishaveyesbtn = false
                this.descirptionMessage = '状态：offer已发送，待入职'
                this.offerReturnMessage = []
                res.data.offer.reportDutyTime = new Date(res.data.offer.reportDutyTime).toLocaleDateString()
                this.offerReturnMessage.push(res.data.offer)
                this.ishaveOfferMessage = true
                this.progressActive = 3
              } else if (res.data.state === 'Wait_Positive') {
                this.offerTeableDate = []
                res.data.offer.reportDutyTime = new Date(res.data.offer.reportDutyTime).toLocaleDateString()
                this.offerTeableDate.push(res.data.offer)
                this.historyData = []
                let date = new Date(res.data.offer.reportDutyTime)
                date.setMonth(date.getMonth() + 3);
                if (res.data.applyCommission) {//是否支付佣金
                  this.ishaveapply = true
                } else {
                  this.ishaveapply = false
                }
                this.ishaveComments = false
                this.ishavePosition = true
                this.ishavedoResigter = false
                this.ishavewriteroffer = false
                this.checkboxDisable = false
                this.ishavecheckbox = false
                this.ishavetextarea = false
                this.ishavediscirptio = true
                this.ishaveyesbtn = false
                this.descirptionMessage = '已入职，待转为正式员工。' + '入职时间：'
                  + new Date(res.data.offer.reportDutyTime).toLocaleDateString() + ' ;' +
                  '转正时间：' + date.toLocaleDateString()
                this.ishaveOfferMessage = false
                this.progressActive = 3
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  },
                  {
                    title: '面试',
                    description: res.data.interviewResultDesc
                  },
                  {
                    title: '入职',
                    description: this.descirptionMessage
                  }
                ]
                //结算完成环节
              } else if (res.data.state === 'No_Positive') {
                this.historyData = []
                if (res.data.hrEvaluateFlag) {
                  this.ishaveComments = false
                } else {
                  this.ishaveComments = true
                }
                this.ishaveOfferMessage = false
                this.ishavePosition = false
                this.ishavedoResigter = false
                this.ishavewriteroffer = false
                this.checkboxDisable = false
                this.ishavecheckbox = false
                this.ishavetextarea = false
                this.ishavediscirptio = true
                this.ishaveyesbtn = false
                this.descirptionMessage = '状态：已入职，未转正'
                this.progressActive = 4
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  },
                  {
                    title: '面试',
                    description: res.data.interviewResultDesc
                  },
                  {
                    title: '入职',
                    description: this.descirptionMessage
                  },
                  {
                    title: '结算',
                    description: '已结算，' + (res.data.hrEvaluateFlag === true ? '已评价' : '未评价')
                  }
                ]
              } else if (res.data.state === 'Positive') {
                this.offerTeableDate = []
                res.data.offer.reportDutyTime = new Date(res.data.offer.reportDutyTime).toLocaleDateString()
                this.offerTeableDate.push(res.data.offer)
                this.historyData = []
                let date = new Date(res.data.offer.reportDutyTime)
                date.setMonth(date.getMonth() + 3);
                if (res.data.hrEvaluateFlag) {
                  this.ishaveComments = false
                } else {
                  this.ishaveComments = true
                }
                this.ishavePosition = false
                this.ishavedoResigter = false
                this.ishavewriteroffer = false
                this.checkboxDisable = false
                this.ishavecheckbox = false
                this.ishavetextarea = false
                this.ishavediscirptio = true
                this.ishaveyesbtn = false
                this.descirptionMessage = '入职时间：' + new Date(res.data.offer.reportDutyTime).toLocaleDateString() + ' ;' +
                  '转正时间：' + date.toLocaleDateString()
                this.ishaveOfferMessage = false
                this.progressActive = 4
                this.ishaveOfferMessage = false
                this.historyData = [
                  {
                    title: '推荐',
                    description: res.data.rejectReason
                  },
                  {
                    title: '面试',
                    description: res.data.interviewResultDesc
                  },
                  {
                    title: '入职',
                    description: this.descirptionMessage
                  },
                  {
                    title: '结算',
                    description: '已结算，' + (res.data.hrEvaluateFlag === true ? '已评价' : '未评价')
                  }
                ]
              }
            } else {
              this.em_alert('候选人查询失败', 'warning')
            }
          })
          .catch((err) => {
            console.log(err.response.headers)
            let alert = decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert, 'error')
          })
      },
      em_alert(massage, type) {
        this.$message({
          showClose: true,
          message: massage,
          type: type
        })
      },
      addArray(array, total) {
        console.log('array')
        console.log(array.length)
        let personTotal = array.length
        this.currentimageUrl = array[0].candidateAvatar
        this.currentuserName = array[0].candidateName
        this.currentuserId = array[0].id
        this.checkDetail(array[0].candidateAvatar, array[0].candidateName, array[0].id)
        this.hxuserData.push(array)
        if (total > 1) {
          for (let i = 0; i < total - 1; i++) {
            this.page++
            axios.get(this.serviceUrl + '/api/jobDetailOrder/candidates?' +
              'jobDetailId=' + this.currentId + '&page=' + this.page + '&size=' + this.size)
              .then((res) => {
                console.log('职位候选人')
                console.log(res)
                if (res.data.content.length !== 0) {
                  personTotal += res.data.content.length
                  console.log('res.data.content.length')
                  console.log(res.data.content.length)
                  this.totalPreson = personTotal
                  this.hxuserData.push(res.data.content)
                } else {
                  this.em_alert('暂无数据', '')
                }
              })
              .catch((err) => {
                console.log(err.response.headers)
                let alert = decodeURI(err.response.headers['x-alert'])
                this.em_alert(alert, 'error')
              })
          }
        } else {
          this.totalPreson = personTotal
        }
      },
      getPositionMan() {
        axios.get(this.serviceUrl + '/api/jobDetailOrder/candidates?' +
          'jobDetailId=' + this.currentId + '&page=' + this.page + '&size=' + this.size)
          .then((res) => {
            console.log('职位候选人')
            console.log(res)
            if (res.data.content.length !== 0) {
              this.addArray(res.data.content, res.data.totalPages)
            } else {
              this.em_alert('此职位，暂无候选人', 'warning')
              this.$router.push({path: '/posList'})
            }
          })
          .catch((err) => {
            console.log(err.response.headers)
            let alert = decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert, 'error')
          })
      },
      returnPositionList() {
        this.$router.push({path: '/posList'})
      },
      openRresumeWindow() {
        this.resumedialogVisible = true
      },
      goPositionProgress(url) {
        if (url === 'list') {
          this.$router.push({path: '/posList'})
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
          this.getApplyDate()
          this.openFullScreen()
          this.getPositionMan()
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
      }
    }
  }
</script>
<style>
  .positionDtail .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #ddd !important;
  }
  .nopositionDialog .el-dialog__body{
    padding:10px 20px;
  }
  .dialogContaineer .el-dialog__body {
    padding: 0px !important;
  }
</style>
<style scoped>
  .title-waring{
     color: #fff;
   }
  .c-f:after{
    content: '';
    clear: both;
    display: block;
    height: 0;
    visibility: hidden;
  }
  .grearClass {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
  }

  .c-fs {
    font-size: 14px;
    color: #98a6ad;
  }

  .houxuan-c {
    height: 20px;
    padding-bottom: 10px;
  }

  .xu-tile {
  }

  .el-carousel__item {
    background-color: #F4F4F4;
  }

  .f-s {
    font-size: 15px;
    font-weight: 700;
  }

  .p-s {
    font-size: 12px;
    font-weight: 700;
  }

  .mar-b {
    margin-bottom: 10px;
  }

  .m-t {
    margin: 10px 0;
    width: 100%;
  }
  .m-p{
    margin: 20px 0 10px 0;
    width: 100%;
  }
  .c-b {
    clear: both;
  }

  .f-l {
    float: left;
  }

  .header-b {
    padding: 10px;
  }

  .f-r {
    float: right;
  }

  .text-muted {
    color: #98a6ad !important;
  }

  .card-s {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .font-18 {
    font-size: 16px !important;
    color: #98a6ad !important;
  }

  img {
    vertical-align: middle;
    border-style: none;
  }

  .box-card {
    margin-top: 70px;
    border:0;
  }

  .img-thumbnail {
    padding: .25rem;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: .25rem;
    transition: all .2s ease-in-out;
    max-width: 100%;
    height: auto;
  }

  .bx-shadow {
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  }

  .rounded-circle {
    border-radius: 50%;
  }

  .user-thumb img {
    height: 88px;
    margin: 0 auto;
    width: 88px;
  }

  .user-thumb {
    position: relative;
    z-index: 999;
    cursor: pointer;
  }

  .text-center {
    text-align: center !important;
  }
</style>
