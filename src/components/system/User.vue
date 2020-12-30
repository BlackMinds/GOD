<template>
  <div class="min1500">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-card class="quan">
        <div class="shu">
          <div class="togglr-button">全部部门</div>  
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
    </el-card>-->
    <el-card>
      <el-row :gutter="20" class="row">
        <el-col :span="24">
          <el-row :gutter="20">
            <el-form
              :inline="true"
              class="demo-form-inline"
              :model="chaUserForm"
              ref="chaUserRef"
            >
              <el-form-item label="姓名：" prop="name">
                <el-input
                  placeholder="请输入姓名"
                  v-model="chaUserForm.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="工号：" prop="employeeId">
                <el-input
                  placeholder="工号"
                  v-model="chaUserForm.employeeId"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="getUserList1">查询</el-button>
                <el-button type="primary" @click="chaUserResetForm"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
          <el-button
            type="warning"
            @click="resetPasswordVisible = true"
            :disabled="selectedList.length == 0"
            >密码重置</el-button
          >
          <el-table
            border
            stripe
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column
              type="index"
              width="55"
              align="center"
              label="序号"
            ></el-table-column>
            <!-- <el-table-column prop="roleName" label="头像"></el-table-column> -->
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="username" label="登录账号"></el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号码"
              width="125px"
            ></el-table-column>
            <el-table-column prop="deptName" label="所属部门"></el-table-column>
            <el-table-column prop="roleName" label="职务名称"></el-table-column>
            <el-table-column
              prop="sex"
              label="性别"
              width="50px"
              align="center"
            >
              <template slot-scope="scope">{{
                scope.row.sex == 1 ? "男" : "女"
              }}</template>
            </el-table-column>
            <el-table-column prop="employeeId" label="工号"></el-table-column>
            <el-table-column prop="district" label="地区" width="180px">
              <template slot-scope="scope">{{
                scope.row.province + scope.row.city + scope.row.district
              }}</template>
            </el-table-column>
            <!-- <el-table-column prop="note" label="备注"></el-table-column> -->
            <el-table-column label="状态" width="65px">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  @change="userStateChanged(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="total,  prev, pager, next"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="密码重置"
      :visible.sync="resetPassdialogVisible"
      width="35%"
      :before-close="handleClose"
    >
      <el-form :label-position="labelPosition" label-width="100px">
        <el-form-item label="登录账号：">
          <el-input placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="旧密码：">
          <el-input placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：">
          <el-input placeholder="请输入确认新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPassdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassdialogVisible = false"
          >保 存</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="resetPasswordVisible" width="330px">
      <div class="del-dialog-cnt">此操作将使密码重置为初始密码, 是否继续？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      province: "",
      shi1: [],
      qu1: [],
      city: "",
      block: "",
      selectedList: [],
      labelPosition: "right",
      resetPassdialogVisible: false,
      delarr: "",
      currentPage: 0,
      total: 0,
      userList: [],
      chaUserForm: {
        name: "",
        employeeId: "",
        deptId: "",
        pageCode: 1, //当前页
        pageSize: 10, //每页显示的记录数
      },
      chaDepartmentForm: {
        a: "",
      },
      chaDutyForm: {
        a: "",
      },
      addUserRules: {
        name: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "长度在 3 到 11 个字符",
            trigger: "blur",
          },
        ],
      },

      resetPasswordVisible: false, //密码重置提示dialog显示标识
    };
  },
  created() {
    this.getUserList();
    this.getCityData();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.post("sys/user/list", {
        params: this.chaUserForm,
      });
      console.log(res);
      this.total = res.body.total;
      this.userList = res.body.rows;
    },

    getUserList1() {
      this.currentPage = 1;
      this.chaUserForm.pageCode = 1;
      this.getUserList();
    },

    addUser() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        console.log(this.addUserForm);
        const { data: res } = await this.$http.post(
          "sys/user/save",
          this.addUserForm
        );
        this.getUserList();
        this.addyonghuDialogVisible = false;
      });
    },

    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.post("sys/user/update", userInfo);
      this.getUserList();
    },

    chaUserResetForm() {
      this.$refs.chaUserRef.resetFields();
      this.getUserList();
    },
    ResetForm(formName) {
      this.$refs[formName].resetFields();
    },
    dialogClosed() {
      this.$refs.addUserRef.resetFields();
    },
    handleSizeChange(val) {
      this.chaUserForm.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.chaUserForm.pageCode = val;
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getUserList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    deletebumen(userId) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let param = new URLSearchParams();
          param.append("userIds", userId);
          const { data: res } = await this.$http.post(
            "sys/user/batchRemove",
            param
          );
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectedList = val;
    },
    // 加载china地点数据，三级
    getCityData: function () {
      var that = this;
      var ip = this.ips;

      axios
        .get("/" + "map.json")
        .then(function (response) {
          console.log("1", response);
          if (response.status == 200) {
            var data = response.data;
            that.province = [];
            that.city = [];
            that.block = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                //省
                that.province.push({
                  id: item,
                  value: data[item],
                  children: [],
                });
              } else if (item.match(/00$/)) {
                //市
                that.city.push({ id: item, value: data[item], children: [] });
              } else {
                //区
                that.block.push({ id: item, value: data[item] });
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (
                  that.province[index].id.slice(0, 2) ===
                  that.city[index1].id.slice(0, 2)
                ) {
                  that.province[index].children.push(that.city[index1]);
                }
              }
            }
            // 分类区级
            for (var item1 in that.city) {
              for (var item2 in that.block) {
                if (
                  that.block[item2].id.slice(0, 4) ===
                  that.city[item1].id.slice(0, 4)
                ) {
                  that.city[item1].children.push(that.block[item2]);
                }
              }
            }
          } else {
            console.log(response.status);
          }
        })
        .catch(function (error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince: function (e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].value) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
        }
      }
    },
    // 选市
    choseCity: function (e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].value) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          // console.log(this.E)
        }
      }
    },
    // 选区
    choseBlock: function (e) {
      this.E = e;
      // console.log(this.E)
    },
    // 密码重置
    async resetPassword() {
      const { data: res } = await this.$http.post(
        "/sys/user/updatemiss",
        this.selectedList
      );
      this.$message({
        type: "success",
        message: "密码重置成功!",
      });

      this.resetPasswordVisible = false;
    },
  },
};
</script>
<style lang='less' scoped>
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
.togglr-button {
  width: 180px;
  height: 30px;
  background: #eee;
  padding-right: -10px;
  text-align: center;
  line-height: 30px;
}
.demo-form-inline .el-input {
  width: 240px;
}
.el-select {
  width: 225px;
}
.quan {
  float: left;
  margin-right: 20px;
}
// .el-card {
//   height: 650px;
// }
.xiang {
  width: 400px;
}
.hu {
  width: 133px;
}
.el-icon-close:before {
  position: absolute;
  top: 0px;
  right: 1px;
}
</style>