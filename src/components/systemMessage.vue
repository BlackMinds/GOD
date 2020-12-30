<template>
  <div class>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新消息通知</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-tabs @tab-click="handleClick">
        <el-tab-pane label="系统消息">
          <el-card class="box-card box-card2">
            <div slot="header" class="clearfix">
              <span style="color: #333">系统消息</span>
              <p style="color: #999;margin: 6px 0;">系统消息将以站内信的形式通知</p>
            </div>
          </el-card>
          <el-table
            @cell-click="cellclick"
            border
            stripe
            :data="departmentList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
            <el-table-column label="消息名称" prop="infoName"></el-table-column>
            <el-table-column label="时间" prop="sendTime"></el-table-column>
            <el-table-column label="消息内容" prop="infoContent"></el-table-column>
            <el-table-column label="状态" prop="isRead">
              <template slot-scope="scope">
                <span v-if="scope.row.isRead == 0">未读</span>
                <span v-if="scope.row.isRead == 1">已读</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="交易消息">
          <el-card class="box-card box-card2">
            <div slot="header" class="clearfix">
              <span style="color: #333">交易消息</span>
              <p style="color: #999;margin: 6px 0;">交易消息将以站内信的形式通知</p>
            </div>
          </el-card>
          <el-table
            @cell-click="cellclick"
            border
            stripe
            :data="departmentList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
            <el-table-column label="消息名称" prop="infoName"></el-table-column>
            <el-table-column label="时间" prop="sendTime"></el-table-column>
            <el-table-column label="消息内容" prop="infoContent"></el-table-column>
            <el-table-column label="状态" prop="isRead">
              <template slot-scope="scope">
                <span v-if="scope.row.isRead == 0">未读</span>
                <span v-if="scope.row.isRead == 1">已读</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total,  prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog
      title="消息查看"
      :visible.sync="addyonghuDialogVisible"
      width="745px"
      >
      <el-form
        :label-position="labelPosition"
        label-width="120px"
        :model="addWarningForm"
        :inline="true">
        <!-- <el-form-item label="消息编号:" prop="infoCode">
          <el-input v-model="addWarningForm.infoCode"></el-input>
        </el-form-item>
        <el-form-item label="模板选择:" prop="templateCode">
          <el-input v-model="addWarningForm.templateCode"></el-input>
        </el-form-item>
        <el-form-item label="消息类型:" prop="infoType">
          <el-select v-model="addWarningForm.infoType" placeholder="请选择" style="width: 201px;">
            <el-option
              v-for="item in messageType1"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="消息名称:" prop="infoName">
          <el-input v-model="addWarningForm.infoName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发送时间:" prop="sendTime">
          <el-date-picker
            style="width: 196px!important"
            v-model="addWarningForm.sendTime"
            type="datetime"
            :disabled="true"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="消息内容" prop="infoContent" style="width: 528px" class="xg">
          <el-input
            :disabled="true"
            type="textarea"
            rows="4"
            stlye="width: 100%"
            v-model="addWarningForm.infoContent"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addyonghuDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog
      :fullscreen="false"
      :modal-append-to-body="false"
      :title="newMessage.infoName"
      :visible.sync="messageName"
      :before-close="handleClose"
      :show-close="false"
      :modal="false"
      width="340px"
      >
      <span>{{ newMessage.infoContent }}</span>
      <p style="text-align: right;">{{ newMessage.sendTime }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editNewMessage">确 定</el-button>
      </span>
    </el-dialog> -->

    
  </div>
</template>
<script>

export default {
  data() {
    return {
      addyonghuDialogVisible: false,
      tabPosition: "left",
      labelPosition: "right",
      addbumenDialogVisible: false,
      editbumenDialogVisible: false,
      delVisible: false,
      currentPage: 0,
      total: 0,
      delarr: "",
      selectedList: [],
      departmentList: [],
      messageType1: [
        {
          id: "3",
          name: "交易消息",
        },
        {
          id: "4",
          name: "系统消息",
        },
      ],
      chaDepartmentForm: {
        infoType: "4",
        userId: this.getCookie("userId"),
        page: 1, 
        limit: 10, 
      },
      addWarningForm: {},
      websock: null,
    };
  },
  created() {
    this.getDepartmentList();
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index == 1) {
        this.chaDepartmentForm = {
          infoType: "3",
          userId: this.getCookie("userId"),
          limit: 10, //当前页
          page: 1, //每页显示的记录数
        };
      } else {
        this.chaDepartmentForm = {
          infoType: "4",
          userId: this.getCookie("userId"),
          limit: 10, //当前页
          page: 1, //每页显示的记录数
        };
      }
      this.getDepartmentList();
    },
    //   row, column, cell, event
    cellclick(row) {
      this.addWarningForm = row;
      this.addyonghuDialogVisible = true;
      if (!row.isRead == 1) {
        row.isRead = 1
        this.$http.put("/erpinfo/edit",row).then(res=> {})
      }
      this.getDepartmentList()
    },
    async getDepartmentList() {
      const { data: res } = await this.$http.get("/erpinfo/listOfSend", {
        params: this.chaDepartmentForm,
      });
      this.total = res.data.total;
      this.departmentList = res.data.rows;
    },
    handleSizeChange(val) {
      this.chaDepartmentForm.limit = val;
      this.getDepartmentList();
    },
    handleCurrentChange(val) {
      this.chaDepartmentForm.page = val;
      this.currentPage = val;
      this.getDepartmentList();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectedList = val;
    },
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    // handleClose() {
    //   this.messageName = true
    // }
  },
  // destroyed() {
  //   this.websock.close() //离开路由长连接关闭
  // }
};
</script>

<style lang="less">
.box-card2 {
  box-shadow: none !important;
  border: 0 !important;
}
.box-card2 .el-card__body {
  display: none !important;
}
.box-card2 .el-card__header {
  padding: 18px 0 !important;
}
.xg .el-form-item__content {
  width: 75%!important
}
</style>
<style lang='less' scoped>

// /deep/.v-modal {
//   background: initial;
//   opacity: 0;
// }
.el-card {
  margin-top: 15px;
}
.el-row {
  align-items: center;
  display: flex;
}
.el-table {
  margin-top: 15px;
}
.chongzhi {
  margin-top: 0px;
}
</style>