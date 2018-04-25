<template>
  <div id="app">
    <router-view>

    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family:Microsoft Yahei,sans-serif;
    -webkit-font-smoothing: antialiased;
    color: #2c3e50;
  }
  body{
    background: #303841;
    margin: 0;
    padding: 0;
  }
  ul{
    list-style: none;
    padding:0;
    margin:0;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #414d59 !important;
  }
  .el-switch__label {
    color: #fff;
  }
  .el-switch__label.is-active {
    color: #81c868 ;
  }
  .el-switch.is-checked .el-switch__core {
    border-color: #81c868;
    background-color: #81c868;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #6c757d;
  }
  .el-pagination.is-background .el-pager li.active {
    background-color: #ffd04b;
    color: #303133;
  }
  .box-card .el-card__header {
    border-bottom: 1px solid #6c757d;
  }
  .el-dialog__header{
    background-color: #5fbeaa;
  }
  .el-dialog__title{
    color: #cfece6;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #cfece6;
  }
  .box-card,box-card-match{
    color:#98a6ad ;
    background-color: #36404a;
  }
  .success-btn-other{
    background: #5fbeaa !important;
    border-color: #5fbeaa !important;
    color: #ddd !important;
  }
  .el-button--success {
    background: #5fbeaa !important;
    border-color: #5fbeaa !important;
    color: #ddd !important;
  }
  .el-button:hover{
    transform: scale(1.05, 1.05)!important;
  }
  .el-button--success:focus, .el-button--success:hover {
    background: #5fbeaa !important;
    border-color: #5fbeaa !important;
    color: #ddd !important;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #ffd04b !important;
    background-color: #323949 !important;
    border-color: #323949 !important;
    -webkit-box-shadow: -1px 0 0 0 #323949 !important;
  }
</style>
