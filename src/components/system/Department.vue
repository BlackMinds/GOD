<template>
  <div class="min1500">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-form
          :inline="true"
          class="demo-form-inline"
          :model="chaDepartmentForm"
          ref="chaDepartmentRef"
        >
          <el-form-item label="部门名称：" prop="name">
            <el-input
              placeholder="请输入部门名称"
              v-model="chaDepartmentForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDepartmentList">查询</el-button>
            <el-button type="primary" @click="chaDepartmentResetForm">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-button type="success" @click="addbumenDialogVisible = true">
        新增
      </el-button>
      <el-button
        type="danger"
        @click="selected"
        :disabled="selectedList.length == 0"
      >
        批量删除
      </el-button>
      <el-table
        border
        stripe
        :data="departmentList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column
          type="index"
          width="55"
          align="center"
          label="序号"
        ></el-table-column>
        <el-table-column label="部门名称" prop="name"></el-table-column>
        <el-table-column label="代号" prop="deptCode"></el-table-column>
        <el-table-column label="备注" prop="orderNum"></el-table-column>
        <el-table-column label="状态" width="65px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.delFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDepartment(scope.row.deptId)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deletebumen(scope.row.deptId)"
              size="mini"
            >
              删除
            </el-button>
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
    </el-card>
    <el-dialog
      title="新增部门"
      :visible.sync="addbumenDialogVisible"
      width="30%"
      :before-close="handleClose"
      @closed="dialogClosed"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="addDepartmentForm"
        ref="addDepartmentRef"
        :rules="addDepartmentRules"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input
            placeholder="请输入部门名称"
            v-model="addDepartmentForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="代号" prop="deptCode">
          <el-input
            placeholder="请输入部门名称"
            v-model.trim="addDepartmentForm.deptCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注内容：" prop="orderNum">
          <el-input
            placeholder="请输入备注内容"
            v-model="addDepartmentForm.orderNum"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addbumenDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDepartment">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑部门"
      :visible.sync="editbumenDialogVisible"
      width="30%"
      :before-close="handleClose"
      @closed="dialogClosed"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="editDepartmentForm"
        ref="addDepartmentRef"
        :rules="addDepartmentRules"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input
            placeholder="请输入部门名称"
            v-model="editDepartmentForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="代号" prop="deptCode">
          <el-input
            placeholder="请输入部门名称"
            v-model.trim="editDepartmentForm.deptCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注内容：" prop="orderNum">
          <el-input
            placeholder="请输入备注内容"
            v-model="editDepartmentForm.orderNum"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editbumenDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDepartment">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delVisible" width="300px">
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var validateCode = (rule, value, callback) => {
      const reg = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      if (!value) {
        return callback(new Error("代号不能为空"));
      } else {
        if (reg.test(value)) {
          return callback(new Error("请不要输入特殊字符"));
        } else {
          callback();
        }
      }
    };
    return {
      labelPosition: "right",
      addbumenDialogVisible: false,
      editbumenDialogVisible: false,
      delVisible: false,
      currentPage: 0,
      total: 0,
      delarr: "",
      selectedList: [],
      departmentList: [],
      chaDepartmentForm: {
        name: "",
        pageCode: 1, //当前页
        pageSize: 10, //每页显示的记录数
      },
      addDepartmentForm: {
        name: "",
        orderNum: "",
        deptCode: "",
      },
      editDepartmentForm: {
        name: "",
        orderNum: "",
        deptCode: "",
      },
      addDepartmentRules: {
        name: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        deptCode: [{ validator: validateCode, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getDepartmentList();
  },
  methods: {
    async getDepartmentList() {
      const { data: res } = await this.$http.post("sys/dept/list", {
        params: this.chaDepartmentForm,
      });
      this.total = res.body.total;
      this.departmentList = res.body.rows;
    },
    handleSizeChange(val) {
      this.chaDepartmentForm.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getDepartmentList();
    },
    handleCurrentChange(val) {
      this.chaDepartmentForm.pageCode = val;
      this.currentPage = val;
      this.getDepartmentList();
    },
    addDepartment() {
      this.$refs.addDepartmentRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "sys/dept/save",
          this.addDepartmentForm
        );
        this.getDepartmentList();
        this.addbumenDialogVisible = false;
        if (res.body.respCode == 500) {
          this.$message({
            type: "info",
            message: res.body.msg,
          });
        } else {
          this.$message({
            type: "success",
            message: res.body.msg,
          });
        }
      });
    },
    chaDepartmentResetForm(formName) {
      this.$refs.chaDepartmentRef.resetFields();
      this.getDepartmentList();
    },
    dialogClosed() {
      this.$refs.addDepartmentRef.resetFields();
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.post("sys/dept/update", userInfo);
      this.getDepartmentList();
      if (res.body.respCode == 500) {
        this.$message({
          type: "info",
          message: res.body.msg,
        });
      } else {
        this.$message({
          type: "success",
          message: res.body.msg,
        });
      }
    },
    async showEditDepartment(id) {
      let param = new URLSearchParams();
      param.append("id", id);
      const { data: res } = await this.$http.post("sys/dept/getDept", param);
      this.editDepartmentForm = res.body.dept;
      this.editbumenDialogVisible = true;
    },
    async editDepartment() {
      this.$refs.addDepartmentRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "sys/dept/update",
          this.editDepartmentForm
        );
        this.getDepartmentList();
        this.editbumenDialogVisible = false;
        if (res.body.respCode == 500) {
          this.$message({
            type: "info",
            message: res.body.msg,
          });
        } else {
          this.$message({
            type: "success",
            message: res.body.msg,
          });
        }
      });
    },

    selected() {
      this.delarr = [];
      this.delVisible = true;
      for (let i = 0; i < this.selectedList.length; i++) {
        this.delarr += this.selectedList[i].deptId + ",";
      }
    },
    async deleteRow() {
      let param = new URLSearchParams();
      param.append("deptIds", this.delarr);
      const { data: res } = await this.$http.post(
        "sys/dept/batchRemove",
        param
      );
      this.delVisible = false;
      this.getDepartmentList();
      if (res.body.respCode == 500) {
        this.$message({
          type: "info",
          message: res.body.msg,
        });
      } else {
        this.$message({
          type: "success",
          message: res.body.msg,
        });
      }
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    deletebumen(deptId) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let param = new URLSearchParams();
          param.append("deptId", deptId);
          const { data: res } = await this.$http.post("sys/dept/remove", param);
          this.getDepartmentList();
          if (res.body.respCode == 500) {
            this.$message({
              type: "info",
              message: res.body.msg,
            });
          } else {
            this.$message({
              type: "success",
              message: res.body.msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      this.selectedList = val;
    },
  },
};
</script>
<style lang="less" scoped>
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
