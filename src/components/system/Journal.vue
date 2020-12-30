<template>
    <div class="min1500">
        <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统日志</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!-- <el-button type="primary">导出日志</el-button> -->
        <el-table border stripe :data="journalList">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
          <el-table-column prop="dateTime" label="时间"></el-table-column>
          <el-table-column prop="userName" label="用户"></el-table-column>
          <el-table-column prop="name" label="所属部门"></el-table-column>
          <el-table-column prop="roleName" label="所属职位"></el-table-column>
          <el-table-column prop="userIp" label="IP地址"></el-table-column>
          <el-table-column prop="logDesc" label="操作记录"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          
          :page-size="10"
          layout="total,  prev, pager, next"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template> 
<script>
export default {
  data () {
    return {
        currentPage: 0,
        journalList:[],
        total:0,
        chaJournalForm:{
        pageCode: 1, //当前页
        pageSize: 10,//每页显示的记录数
        },
    }
  },
  created () {
    this.getJournalList();
  },
  methods:{
     async getJournalList() {
      const { data: res } = await this.$http.post("/system/logdata/doGetLogDataList",{params:this.chaJournalForm});
      console.log(res);
      this.total=res.body.total;
      this.journalList = res.body.rows;
    },
     handleSizeChange(val) {
      this.chaJournalForm.pageSize=val;
      console.log(`每页 ${val} 条`);
       this.getJournalList();
    },
    handleCurrentChange(val) {
      this.chaJournalForm.pageCode=val;
      console.log(`当前页: ${val}`);
      this.currentPage=val;
       this.getJournalList();
    },
  }
}
</script>
<style lang='less' scoped>
    .el-card{
      margin-top: 15px;
    }
 
    .el-button{
      float: right;
      margin-bottom: 15px;
    }
    .el-pagination{
      margin-top: 30px;
    }
</style>