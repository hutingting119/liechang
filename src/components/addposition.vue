<template>
    <div class="addliags">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>职位添加</span>
        </div>
        <el-row :gutter="20" class="titleList">
          <el-col :span="inputSpan" :offset="inputOffset">
            <el-form status-icon clearable :label-position="labelPosition" :rules="rules" :model="matchPositionobj" ref="matchPositionobj">
              <el-form-item label="" prop="title">
                <el-input v-model="matchPositionobj.title" placeholder="请输入职位名称">
                  <template slot="prepend">标题</template>
                </el-input>
              </el-form-item>
              <el-form-item label=""  prop="personNumber">
                <el-input v-model.number="matchPositionobj.personNumber" placeholder="请输入招聘人数">
                  <template slot="prepend">人数</template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="reward">
                <el-input v-model.number="matchPositionobj.reward" placeholder="请输入赏金">
                  <template slot="prepend">赏金</template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="salary">
                <el-input v-model.number="matchPositionobj.salary" placeholder="请输入薪资">
                  <template slot="prepend">薪资</template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="address">
                <el-input v-model="matchPositionobj.address" placeholder="请输入工作地点">
                  <template slot="prepend">地点</template>
                </el-input>
              </el-form-item>
              <el-form-item label="" >
                <div class="el-input el-input-group el-input-group--prepend el-input--prefix">
                  <div class="el-input-group__prepend">行业</div>
                  <el-select v-model="matchPositionobj.profession" placeholder="请选择行业"  >
                    <el-option
                      v-for="item in profession"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="" >
                <div class="el-input el-input-group el-input-group--prepend el-input--prefix">
                  <div class="el-input-group__prepend">学历</div>
                  <el-select v-model="matchPositionobj.eduction" placeholder="请选择学历">
                    <el-option
                      v-for="item in eduction"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="" >
                <div class="el-input el-input-group el-input-group--prepend el-input--prefix">
                  <div class="el-input-group__prepend">职位</div>
                  <el-select v-model="matchPositionobj.position" placeholder="请选择职位" prefix-icon="fa fa-building-o">
                    <el-option
                      v-for="item in position"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="" >
                <div class="el-input el-input-group el-input-group--prepend el-input--prefix">
                  <div class="el-input-group__prepend">经验</div>
                  <el-select v-model="matchPositionobj.workTime" placeholder="请选择工作经验" prefix-icon="fa fa-building-o">
                    <el-option
                      v-for="item in workTime"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="" >
                <div class="el-input el-input-group el-input-group--prepend el-input--prefix">
                  <div class="el-input-group__prepend">级别</div>
                  <el-select v-model="matchPositionobj.level" placeholder="请选择级别" prefix-icon="fa fa-building-o">
                    <el-option
                      v-for="item in level"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="" >
                <div class="el-input el-input-group el-input-group--prepend el-input--prefix">
                  <div class="el-input-group__prepend">全/兼职</div>
                  <el-select v-model="matchPositionobj.workProperty" placeholder="请选择工作性质" prefix-icon="fa fa-building-o">
                    <el-option
                      v-for="item in workProperty"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-form>
            <div class="postMatch">
              <el-button type="success" icon="el-icon-search" @click="submitForm('matchPositionobj')">职位匹配</el-button>
            </div>
          </el-col>
          <el-col :span="matchSpan">
            <transition name="el-zoom-in-center">
              <el-row v-if="dialogFormVisible">
                <!--岗位要求子弹框-->
                <el-dialog
                  width="50%"
                  title="新增岗位要求"
                  :visible.sync="innerVisible"
                  :close-on-click-modal="isClickColseModal"
                  append-to-body class="inputTear">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入岗位要求"
                    v-model="textarea3">
                  </el-input>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="success" @click="putRequirement">添加要求</el-button>
                    <el-button type="danger" @click="closerequireModal">取消</el-button>
                  </div>
                </el-dialog>
                <!--职位描述要求子弹框-->
                <el-dialog
                  width="50%"
                  title="新增职位描述"
                  :close-on-click-modal="isClickColseModal"
                  :visible.sync="innerVisible2"
                  append-to-body class="inputTear">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入职位描述"
                    v-model="textarea4">
                  </el-input>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="success" @click="putDesciption">添加描述</el-button>
                    <el-button type="danger" @click="closeDescriptionModal">取消</el-button>
                  </div>
                </el-dialog>
                <!--支付弹框-->
                <el-dialog
                  width="50%"
                  title="选择支付"
                  :before-close="handleClosePay"
                  :visible.sync="innerVisible3"
                  :close-on-click-modal="isClickColseModal"
                  append-to-body class="inputTear inputTearpay input-container">
                  <p>应支付金额：{{moneyTool}}元</p>
                  <el-radio-group v-model="radio">
                    <el-radio label="AliPay" ><span class="payimg-c alipay"></span></el-radio>
                    <el-radio label="WechatPay" ><span class="payimg-c wxpay"></span></el-radio>
                    <el-radio label="Bank" ><span class="payimg-c yinlianpay"></span></el-radio>
                    <el-radio label="CompanyPay"><span class="payimg-c qiye"></span></el-radio>
                  </el-radio-group>
                  <div id="payMassage">
                  </div>
                  <div v-show="radio==='CompanyPay'?true:false" class="qulickcode-input" >
                    <el-form :inline="true" :model="companyPayValue" class="demo-form-inline">
                      <el-form-item label="备注:">
                        <el-input   v-model="companyPayValue.conpents" placeholder="请填入备注"></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button class="success-btn-other" @click="payPosition">支付</el-button>
                  </div>
                </el-dialog>
                <!--支付是否成功弹框-->
                <el-dialog
                  width="30%"
                  :title="payStateTitle"
                  :show-close="isShowClose"
                  :visible.sync="innerVisible4"
                  :close-on-click-modal="isClickColseModal"
                  append-to-body>
                  <div style="text-align: center;font-size: 35px"><i class="btn-success"   :class="satateClass"></i></div>
                  <div slot="footer" class="dialog-footer t-c">
                    <el-button type="success" @click="paygotoPosList" v-if="satateClass==='el-icon-loading'?false:true">关闭</el-button>
                  </div>
                </el-dialog>
                <el-card class="box-card-match">
                  <div slot="header" class="clearfix">
                    <span>匹配详情</span>
                  </div>
                  <el-col :span="24">
                    <div class="btn-mar">
                      <el-button type="success" size="medium" icon="el-icon-edit" @click="innerVisible = true">添加岗位要求</el-button>
                    </div>
                    <el-table
                      :data="requirementData"
                      border
                      style="width: 100%;margin-bottom: 20px">
                      <el-table-column
                        prop="number"
                        label="编号" width="100" align="center">
                      </el-table-column>
                      <el-table-column
                        prop="description"
                        label="岗位要求" align="left" header-align="center">
                      </el-table-column>
                      <el-table-column
                        label="删除"
                        width="180" align="center">
                        <template slot-scope="scope">
                          <i class="el-icon-delete decs-b" @click="deleteRow(scope.$index,requirementData)"></i>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="btn-mar" >
                      <el-button type="success" size="medium" icon="el-icon-edit" @click="innerVisible2 = true">添加职位描述</el-button>
                    </div>
                    <el-table
                      :data="responsibilitiesData"
                      border
                      style="width: 100%">
                      <el-table-column
                        prop="number"
                        label="编号" width="100" align="center">
                      </el-table-column>
                      <el-table-column
                        prop="description"
                        label="职位描述" header-align="center" align="left">
                      </el-table-column>
                      <el-table-column
                        label="删除"
                        width="180" align="center">
                        <template slot-scope="scope" >
                          <i class="el-icon-delete decs-b" @click="deleteRow(scope.$index,responsibilitiesData)"></i>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div>
                      <h3>备注说明</h3>
                    </div>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入补充说明"
                      v-model="additionalInfo">
                    </el-input>
                    <div class="postMatch" >
                      <el-button type="success" :icon="btn_icon"   @click="putMatchMessage">{{matchOrUpdata}}</el-button>
                    </div>
                  </el-col>
                </el-card>
              </el-row>
            </transition>
          </el-col>
        </el-row>
      </el-card>
    </div>

</template>
<script>
  import axios from 'axios'
  export default {
    name: "addposition",
    props:{
      restPositionId:{
        type:String,
        default:''
      }
    },
    data() {
        return {
        rules:{
          personNumber:[
            { required: true, message: '人数不能为空'},
            { type: 'number', message: '人数必须为数字值'}
          ],
          title:[
            { required: true, message: '标题不能为空'}
          ],
          reward:[
            { required: true, message: '赏金不能为空'},
            { type: 'number', message: '赏金必须为数字值'}
          ],
          salary:[
            { required: true, message: '薪资不能为空'},
            { type: 'number', message: '薪资必须为数字值'}
          ],
          address:[
            { required: true, message: '地址不能为空'}
          ]
        },
        additionalInfo:'',
        isClickColseModal:false,
        companyPayValue:{
          conpents:''
        },
        creatorId:0,
        inputSpan:12,
        inputOffset:6,
        matchSpan:0,
        matchOrUpdata:'创建职位',
        btn_icon:'el-icon-plus',
        requirementData: [],
        responsibilitiesData:[],
        formLabelWidth: '120px',
        labelPosition: 'right',
        innerVisible: false,
        innerVisible2:false,
        innerVisible3:false,
        innerVisible4:false,
        isShowClose:false,
        payStateTitle:'支付中...',
        satateClass:'el-icon-loading',
        textarea3:'',
        textarea4:'',
        radio:'AliPay',
        moneyTool:'',
        payNamber:'',
        matchPositionobj: {
          title: '',
          profession: '',
          eduction: '',
          personNumber: '',
          reward: '',
          position: '',
          workProperty: '',
          workTime:'',
          level:'',
          salary:'',
          address:''
        },
        profession: [{
          value: '计算机',
          label: '计算机'
        }],
        eduction: [{
          value: '专科',
          label: '专科'
        }, {
          value: '本科',
          label: '本科'
        }, {
          value: '硕士',
          label: '硕士'
        }],
        position: [],
        workTime: [{
          value: '1至3年',
          label: '1至3年'
        }, {
          value: '3至5年',
          label: '3至5年'
        }, {
          value: '5至7年',
          label: '5至7年'
        }],
        level: [{
          value: '初级',
          label: '初级'
        }, {
          value: '中级',
          label: '中级'
        }, {
          value: '高级',
          label: '高级'
        }],
        workProperty: [{
          value: '兼职',
          label: '兼职'
        }, {
          value: '全职',
          label: '全职'
        }],
        value: '',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        dialogFormVisible: false
      }
    },
    created(){
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
        this.obtainPostionList()
        this.isUpdateOrCreatJob()
      }
    },
    methods:{
      obtainPostionList(){
        axios.get(this.serviceUrl+'/api/jobDetailConfig/positions')
          .then((res)=>{
             console.log('职位列表信息')
             console.log(res.data)
            if(res.data!==''){
               let positionArra=[]
               for(let i=0;i<res.data.length;i++){
                 positionArra.push({
                   label:res.data[i].name,
                   value:res.data[i].code
                 })
               }
               this.position=positionArra;
            }else{
              this.em_alert('获取职位列表失败','error')
            }
          })
          .catch((err)=>{
            console.log(err.response.headers)
            let alert=decodeURI(err.response.headers['x-alert'])
            this.em_alert(alert,'error')
          })
      },
      isUpdateOrCreatJob(){
        if(this.restPositionId!==''){
          axios.get(this.serviceUrl+'/api/jobDetail/'+this.restPositionId)
            .then((res)=>{
              console.log("要修改的职位详情")
              console.log(res)
              this.matchPositionobj.title=res.data.title
              this.matchPositionobj.profession=res.data.profession
              this.matchPositionobj.eduction=res.data.education
              this.matchPositionobj.personNumber=res.data.recruitingNumber
              this.matchPositionobj.reward=parseFloat(res.data.price)/100
              this.matchPositionobj.position=res.data.position
              this.matchPositionobj.workProperty=res.data.jobNature
              this.matchPositionobj.workTime=res.data.workExperience
              this.matchPositionobj.level=res.data.level
              this.matchPositionobj.salary=parseFloat(res.data.salaryRange)
              this.matchPositionobj.address=res.data.workArea
              this.matchOrUpdata='更新职位'
              this.btn_icon='el-icon-refresh'
            })
            .catch((error)=>{
              console.log(error.response.headers)
              let alert=decodeURI(error.response.headers['x-alert'])
              this.em_alert(alert,'error')
            })
        }else{
          return
        }
      },
      paygotoPosList(){
        this.innerVisible4=false
        clearInterval(this.payState)
        this.$emit('resetPositionList')
      },
      getAliPayState(){
        this.payState=setInterval(()=>{
          console.log(this.restPositionId)
          axios.get(this.serviceUrl+'/api/jobDetail/'+this.creatorId)
            .then((res)=>{
             if(res.data.state==='PUBLISH'){
               this.satateClass='el-icon-success'
               this.payStateTitle='支付成功！'
               clearInterval(this.payState)
             }else{
               return
             }
            })
            .catch((err)=>{
              clearInterval(this.payState)
            })
        },1000)
      },
      handleClosePay(done) {
        this.$confirm('确定关闭支付页面吗？')
          .then(_ => {
            done();
            this.dialogFormVisible=false
            this.additionalInfo=''
            this.$emit('resetPositionList')
          })
          .catch(_ => {
          });
      },
      submitForm(formName) {
        let seleectBoolean=(this.matchPositionobj.profession!=='')&&
          (this.matchPositionobj.eduction!=='')&&
          (this.matchPositionobj.position!=='')&&
          (this.matchPositionobj.workTime!=='')&&
          (this.matchPositionobj.level!=='')&&
          (this.matchPositionobj.workProperty!=='')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(seleectBoolean){
              this.matchposition()
            }else{
              this.em_alert('职位匹配选项不能为空，请重新选择','warning')
              return
            }
          } else {
            this.em_alert('职位匹配信息有误或不完整，请重新填写','warning')
            return
          }
        })
      },
      alipay(){
        let alipayobj={
          amount: this.moneyTool*100,
          body: this.matchPositionobj.title,
          outTradeNo: this.payNamber,
          platformType: "HR",
          subject: this.matchPositionobj.title+'应支付:'+this.moneyTool,
          returnUrl:window.location.href
        }
       axios.post(this.serviceUrl+'/api/aliPay/unifiedOrderForWeb',alipayobj)
         .then((res)=>{
           console.log('支付宝方式数据的返回')
           console.log(res.data)
           let insertHtmlContainer=document.getElementById('payMassage')
           insertHtmlContainer.innerHTML=res.data
           insertHtmlContainer.children[0].setAttribute('target','_blank')
           this.innerVisible3=false
           this.innerVisible4=true
           this.getAliPayState();
           insertHtmlContainer.children[0].submit()
         })
         .catch((err)=>{

         })
      },
      payPosition(){
        let payObj={
          comment:this.companyPayValue.conpents,
          id: this.creatorId,
          payType:this.radio
        }
        if(this.radio==='CompanyPay'){
          axios.post(this.serviceUrl+'/api/jobDetail/publish',payObj)
            .then((response) => {
              console.log('提交支付方式数据的返回')
              console.log(response)
              if(response.data){
                this.em_alert('支付成功','success')
                this.innerVisible3 = false
                this.dialogFormVisible = false
              }else{
                this.em_alert('支付失败','warning')
                this.innerVisible3 = false
              }
              this.$emit('resetPositionList')
            })
            .catch((error) => {
              console.log(error.response.headers)
              let alert=decodeURI(error.response.headers['x-alert'])
              this.em_alert(alert,'error')
            })
        }else if(this.radio==='AliPay'){
          this.alipay()
        }
      },
      putMatchMessage(){
        let  require=[]
        let respon=[]
        let currentId=''
        let currentUrl=''
        for(let i=0;i<this.requirementData.length;i++){
          require.push(this.requirementData[i].description)
        }
        for(let j=0;j<this.responsibilitiesData.length;j++){
          respon.push(this.responsibilitiesData[j].description)
        }
        if(this.restPositionId!==''){
          currentId=this.restPositionId
          currentUrl=this.serviceUrl+'/api/jobDetail/modify'
        }else{
          currentId=''
          currentUrl=this.serviceUrl+'/api/jobDetail/create'
        }
        let putMatchobj={
          additionalInfo:this.additionalInfo,
          education: this.matchPositionobj.eduction,
          id: currentId,
          jobNature: this.matchPositionobj.workProperty,
          level: this.matchPositionobj.level,
          position: this.matchPositionobj.position,
          price: parseFloat(this.matchPositionobj.reward)*100,
          profession: this.matchPositionobj.profession,
          recruitingNumber: this.matchPositionobj.personNumber,
          requirementList: require,
          responsibilityList:respon ,
          salaryRange: this.matchPositionobj.salary,
          title: this.matchPositionobj.title,
          workArea: this.matchPositionobj.address,
          workExperience: this.matchPositionobj.workTime
        }
        axios.post(currentUrl,putMatchobj)
          .then((response) => {
            console.log('提交职位数据的返回')
            console.log(response)
            if(response.data.id){
              console.log('赋值id')
              console.log(response.data.id)
              this.payNamber=response.data.serialNumber
              this.moneyTool=parseFloat(this.matchPositionobj.reward)*parseInt(this.matchPositionobj.personNumber)
              this.creatorId=response.data.id
              this.innerVisible3 = true
            }else{
              this.em_alert('提交失败','warning')
              this.innerVisible3 = false
            }
            this.$emit('removePositionId')
          })
          .catch((error) => {
            console.log(error.response.headers)
            let alert=decodeURI(error.response.headers['x-alert'])
            this.em_alert(alert,'error')
          })
      },
      putDesciption(){
        if(this.textarea4==''){
          this.em_alert('不能添加空的职位描述','warning')
          return
        }else{
          let reqobj={
            description:this.textarea4,
            number:this.responsibilitiesData.length+1,
            index:this.responsibilitiesData.length
          }
          this.responsibilitiesData.push(reqobj)
          this.textarea4=''
          this.innerVisible2 = false
        }
      },
      closeDescriptionModal(){
        this.textarea4=''
        this.innerVisible2 = false
      },
      closerequireModal(){
        this.textarea3=''
        this.innerVisible = false
      },
      putRequirement(){
        if(this.textarea3==''){
          this.em_alert('不能添加空的岗位要求','warning')
          return
        }else{
          let reqobj={
            description:this.textarea3,
            number:this.requirementData.length+1,
            index:this.requirementData.length
          }
          this.requirementData.push(reqobj)
          console.log(this.requirementData)
          this.textarea3=''
          this.innerVisible = false
        }
      },
      deleteRow(index, rows) {
        rows.splice(index, 1)
        for(let i=0;i<rows.length;i++){
          rows[i].number=i+1
          rows[i].index=i
        }
      },
      em_alert(massage,type) {
        this.$message({
          showClose: true,
          message: massage,
          type: type
        });
      },
      matchposition(){
        let matchString ='tags='+this.matchPositionobj.title+','+
          this.matchPositionobj.profession+','+
          this.matchPositionobj.eduction+','+
          this.matchPositionobj.personNumber+','+
          this.matchPositionobj.reward+','+
          this.matchPositionobj.position+','+
          this.matchPositionobj.workProperty+','+
          this.matchPositionobj.workTime+','+
          this.matchPositionobj.level+','+
          this.matchPositionobj.salary
        axios.get(this.serviceUrl+'/api/jobDetailConfig/getJobDetailConfigs?'+matchString)
          .then((response) => {
            console.log('返回提交匹配数据')
            console.log(response)
            if(response.data){
              let requirement=[];
              let respons=[];
              for(let i=0;i<response.data.requirements.length;i++){
                requirement.push({description:response.data.requirements[i].description,number:i+1,index:i})
              }
              this.requirementData =requirement
              for(let j=0;j<response.data.responsibilities.length;j++){
                respons.push({description:response.data.responsibilities[j].description,number:j+1,index:j})
              }
              this.responsibilitiesData=respons
              this.inputSpan=8
              this.matchSpan=16
              this.inputOffset=0
              this.dialogFormVisible = true
            }else{
              this.em_alert('提交失败','warning')
              this.dialogFormVisible = false
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
  .addliags .el-table{
    color:#c3c6c9
  }
  .addliags .el-table--border::after, .el-table--group::after, .el-table::before {
     background-color: #414d59;
  }
  .addliags .el-table--border td{
    border: 1px solid #414d59;
  }
  .addliags .el-table--border th{
    border: 1px solid #414d59;
  }
  .addliags .el-table--border{
    border: 1px solid #414d59;
  }
  .addliags .el-table tr {
    background-color: #36404a;
  }
  .addliags .el-table th {
    background-color: #36404a;
  }
  .input-container .el-radio__input{
    position: relative;
    bottom: 27px;
  }
  .addliags input{
    border: 1px solid #505f6d !important;
    background-color: #414d59;
    color: #ffffff;
  }
  .addliags textarea{
    border: 1px solid #505f6d !important;
    background-color: #414d59;
    color: #ffffff;
  }
</style>
<style>
  .box-card-match{
    color:#98a6ad !important;
    background-color: #566676 !important;
    border:0 !important;
  }
  .inputTear .el-dialog__header,.addliags .el-dialog__header{
    border-bottom: 1px solid #ebeef5;
  }
  .inputTearpay .el-dialog__body{
    padding:0px 20px 30px 20px;
  }
  .el-radio__inner {
    width: 20px;
    height: 20px;
  }
  .el-radio__original {
    opacity: 0;
    outline: 0;
    position: absolute;
    z-index: -1;
    top: 3px;
    left: 3px;
    right: 0;
    bottom: 0;
    margin: 0;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #40af36;
    background: #40af36;
  }
</style>
<style scoped>
  .btn-mar{
    margin-bottom: 5px;
  }
  .t-c{
    text-align: center;
  }
  .qulickcode-p{
   margin-top: 10px;
   text-align: center;
   width: 100%;
   height:100%;
  }
  .qulickcode-input{
    margin-top: 10px;
    width: 50%;
    padding:0px 25%;
  }
  .qulickcode-c{
    width:200px;
    height:200px;
  }
  .qiye{
    background-image: url("./../images/spirt.png");
    background-repeat:no-repeat;
    background-position: -221px -4px;
  }
  .yinlianpay{
    background-image: url("./../images/spirt.png");
    background-repeat:no-repeat;
    background-position: -430px -132px;
  }
  .alipay{
    background-image: url("./../images/spirt.png");
    background-repeat:no-repeat;
    background-position: -6px -4px;
  }
  .payimg-c{
    display: inline-block;
    width: 70px;
    height: 70px;
    border-radius: 5px;
  }
  .wxpay{
   background-image: url("./../images/spirt.png");
   background-repeat:no-repeat;
    background-position: -116px -5px;
  }
  .decs-b{
    font-size: 20px;
    cursor: pointer;
    color: #98a6ad;
  }
  .btn-success{
    color: #67c23a;
  }
  .decs-b:hover{
    color: #67c23a;
  }
  .el-dialog__header {
    border:1px solid #ebeef5;
  }
  .el-select{
    width:100%;
  }
  .box-card {
    width:83%;
    margin-left: 16%;
    min-height:768px;
    border:0;
    margin-top: 70px;
  }
  .postMatch{
    margin: 15px 0px;
    text-align: center;
  }
</style>
