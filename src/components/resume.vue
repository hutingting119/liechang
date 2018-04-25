<template>
  <div class="resume">
    <div class="resume-container">
      <el-card class="box-card">
        <!--基本信息-->
        <el-row :gutter="20">
          <el-col :span="20">
            <div><h3>{{resumeContainer.name}}<span class="greCon"><i :class="resumeContainer.gender=='男'?'fa fa-mars':'fa fa-venus'" aria-hidden="true"></i></span></h3></div>
            <div class="auto-ms">
              <p>
                <span class="icon-c"><i class="fa fa-briefcase" aria-hidden="true"></i></span>
                <span>{{resumeContainer.workYears}}年工作经验</span><span class="ge-x">|</span>
                <span class="icon-c"><i class="fa fa-graduation-cap" aria-hidden="true"></i></span><span>{{resumeContainer.education}}</span>
                <span class="ge-x">|</span>
                <span class="icon-c"><i class="fa fa-user-circle" aria-hidden="true"></i></span><span>{{resumeContainer.jobStatus}}</span>
              </p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="user-thumb">
              <img :src="resumeContainer.avatar" class="img-responsive bx-shadow rounded-circle img-thumbnail"
                   alt="头像">
            </div>
          </el-col>
        </el-row>
        <!--我的技能-->
        <el-row :gutter="20">
          <el-col :span="24">
            <div><h3>我的技能</h3></div>
            <p v-for="(item,index) in resumeContainer.workSkills">{{index+1}}.{{item}}</p>
          </el-col>
        </el-row>
        <!--求职意向-->
        <el-row :gutter="20">
          <el-col :span="24">
            <div><h3>求职意向</h3></div>
            <div class="auto-ms">
              <p>
                <span class="icon-c"><i class="fa fa-black-tie" aria-hidden="true"></i></span>
                <span>{{resumeContainer.position}}</span><span class="ge-x">|</span>
                <span class="icon-c"><i class="fa fa-jpy" aria-hidden="true"></i></span><span>{{resumeContainer.expectedSalary}}</span>
                <span class="ge-x">|</span>
                <span class="icon-c"><i class="fa fa-map-marker" aria-hidden="true"></i></span>
                <span>{{resumeContainer.targetWorkPlace}}</span>
                <span class="ge-x">|</span>
                <span class="icon-c"><i class="fa fa-line-chart" aria-hidden="true"></i></span>
                <span>互联网/IT 行业</span>
              </p>
            </div>
          </el-col>
        </el-row>
        <!--项目经历-->
        <el-row :gutter="20">
          <el-col :span="24">
            <div><h3>项目经历</h3></div>
            <p v-for="item in resumeContainer.projectExperience">{{item}}</p>
          </el-col>
        </el-row>
        <!--教育经历-->
        <el-row :gutter="20">
          <el-col :span="24">
            <div><h3>教育经历</h3></div>
            <p v-for="item in resumeContainer.educationExperience">{{item}}</p>
          </el-col>
        </el-row>
        <!--工作经历-->
        <el-row :gutter="20">
          <el-col :span="24">
            <div><h3>工作经历</h3></div>
            <p v-for="item in resumeContainer.workExperience">{{item}}</p>
          </el-col>
        </el-row>
        <!--自我评价-->
        <el-row :gutter="20">
          <el-col :span="24">
            <div><h3>自我评价</h3></div>
            <p>{{resumeContainer.selfEvaluation}}</p>
          </el-col>
        </el-row>
        <!--其他-->

      </el-card>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  axios.defaults.headers = {
    'X-UserToken': sessionStorage.getItem('token')
  }
  export default {
    name: "resume",
    props: {
      currentuserId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        resumeContainer: {
          address: "",
          avatar: "",
          birthday: 624297600000,
          cellphone: "",
          city: "",
          company: "",
          createTime: 1513218351000,
          dutyTime: "",
          education: "",
          educationExperience: "",
          email: "",
          expectedSalary: "",
          gender: "",
          graduateSchool: "",
          id: "",
          jobNature: "",
          jobStatus: "",
          languageAbility: "",
          major: "",
          maritalStatus: "",
          name: "",
          position: "",
          price: "",
          profession: "",
          projectExperience: "",
          selfEvaluation: "",
          state: "",
          targetWorkPlace: "",
          trainingExperience: "",
          type: "",
          workExperience: "",
          workSkills: "",
          workStartTime: 1338998400000,
          workYears: ""
        }
      }
    },
    created() {
      this.getPresonResume()
    },
    methods: {
      lineWarp(str){
        let resumeArray=str.split("\n")
        return resumeArray
      },
      getPresonResume() {
        axios.get(this.serviceUrl + '/api/human/resume/' + this.currentuserId)
          .then((res) => {
            console.log('简历详情')
            console.log(res)
            res.data.workSkills=this.lineWarp(res.data.workSkills)
            res.data.projectExperience=this.lineWarp(res.data.projectExperience)
            res.data.educationExperience=this.lineWarp(res.data.educationExperience)
            res.data.workExperience=this.lineWarp(res.data.workExperience)
            this.resumeContainer=res.data
          })
          .catch((error) => {

          })
      }
    }
  }
</script>
<style>
  .resume .el-card {
    border: 0;
  }
</style>
<style scoped>
  .resume-container {
    padding: 30px 0px;
  }

  .school {
    margin-left: 30px;
  }

  .ds-in {
    display: inline-block;
  }

  .resume {
    font-size: 14px;
    background-color: #303841;
  }

  .box-card {
    width: 75%;
    margin: 0 auto;
  }

  .ge-x {
    margin: 0 24px;
    color: #c0c4cc
  }

  .auto-ms p span {
    display: inline-block;
  }

  .icon-c {
    color: #c0c4cc
  }

  .greCon {
    color: aqua;
    margin-left: 5px;
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
    top: 28px;
    right: 30px;
  }
</style>
