<template>
  <div class="min1500">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>职务设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="min1300">
      <el-row :gutter="20" class="row">
        <el-col :span="24">
          <el-row :gutter="20">
            <el-form
              :inline="true"
              class="demo-form-inline"
              :model="chaDutyForm"
              ref="chaDutyRef"
            >
              <el-form-item label="职务名称：" prop="roleName">
                <el-input
                  placeholder="请输入职务名称"
                  v-model="chaDutyForm.roleName"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="getDutyList">查询</el-button>
                <el-button type="primary" @click="chaDutyResetForm"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
          <el-button type="success" @click="addbumenDialogVisible = true"
            >新增</el-button
          >
          <el-button
            type="danger"
            @click="selected"
            :disabled="selectedList.length == 0"
            >批量删除</el-button
          >
          <!-- <el-button type="info"  @click="rightDialogVisible= true" :disabled="selectedList.length == 0">权限批量设置</el-button> -->
          <el-table
            border
            stripe
            :data="DutyList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column
              type="index"
              width="55"
              align="center"
              label="序号"
            ></el-table-column>
            <el-table-column
              label="职务名称"
              prop="roleName"
              property="address"
            ></el-table-column>
            <el-table-column label="所属部门" prop="deptId" property="address">
              <template slot-scope="scope">
                <span>{{ deptIdName(scope.row.deptId) }}</span>
              </template></el-table-column
            >
            <el-table-column
              label="职务范围"
              prop="roleRange"
              property="address"
            ></el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              property="beizhu"
            ></el-table-column>
            <el-table-column label="状态" width="65px">
              <template slot-scope="scope">
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
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                  :enterable="false"
                >
                  <!-- <el-button size="mini" type="primary" icon="el-icon-edit"></el-button> -->
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDuty(scope.row.roleId)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="deletebumen(scope.row.roleId)"
                    size="mini"
                  ></el-button>
                  <!-- <el-button size="mini" type="danger" icon="el-icon-delete"></el-button> -->
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="权限分配"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    size="mini"
                    type="warning"
                    icon="el-icon-setting"
                    @click="showquanxian(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total,  prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="新增职务"
      :visible.sync="addbumenDialogVisible"
      width="500px"
      :before-close="handleClose"
      @closed="dialogClosed"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="addDutyForm"
        ref="addDutyRef"
        :rules="addDutyRules"
      >
        <el-form-item label="职务名称：" prop="roleName"
          ><el-input
            placeholder="请输入职务名称"
            v-model="addDutyForm.roleName"
          ></el-input
        ></el-form-item>
        <el-form-item label="备注内容：" prop="remark"
          ><el-input
            placeholder="请输入备注内容"
            v-model="addDutyForm.remark"
          ></el-input
        ></el-form-item>
        <el-form-item label="所属部门：" prop="deptId">
          <el-select
            v-model="addDutyForm.deptId"
            placeholder="请选择"
            style="width: 360px"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.deptId"
              :label="item.name"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务范围：" prop="roleRange"
          ><el-input
            placeholder="请输入职务范围"
            v-model="addDutyForm.roleRange"
          ></el-input
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addbumenDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDuty">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑职务"
      :visible.sync="editbumenDialogVisible"
      width="500px"
      :before-close="handleClose"
      @closed="dialogClosed"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="editDutyForm"
        ref="addDutyRef"
        :rules="addDutyRules"
      >
        <el-form-item label="职务名称：" prop="roleName"
          ><el-input
            placeholder="请输入职务名称"
            v-model="editDutyForm.roleName"
          ></el-input
        ></el-form-item>
        <el-form-item label="备注内容：" prop="remark"
          ><el-input
            placeholder="请输入备注内容"
            v-model="editDutyForm.remark"
          ></el-input
        ></el-form-item>
        <el-form-item label="所属部门：" prop="deptId">
          <el-select
            v-model="editDutyForm.deptId"
            placeholder="请选择"
            style="width: 360px"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.deptId"
              :label="item.name"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务范围：" prop="roleRange"
          ><el-input
            placeholder="请输入职务范围"
            v-model="editDutyForm.roleRange"
          ></el-input
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editbumenDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDuty">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%">
      <!-- <hr>
        <el-row class="lei">
          <el-col :span="8">权限类别</el-col>
          <el-col :span="8">权限名称</el-col>
          <el-col :span="8">权限描述</el-col>
        </el-row>
        <el-row  v-for="(item1) in rightList" :key="item1.id" class="yi">
          <el-col :span="8">
            <el-checkbox>{{item1.authName}}</el-checkbox>
          </el-col>
          <el-col :span="16">
            <el-row v-for="(item2) in item1.children" :key="item2.id" class="er">
              <el-col :span="12">
                <el-checkbox>{{item2.authName}}</el-checkbox>
              </el-col>
              <el-col :span="12">
                备注
              </el-col>
            </el-row>
          </el-col>
        </el-row> -->
      <el-tree
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="menuId"
        :default-checked-keys="defKeys"
        ref="mytree"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloRight">确 定</el-button>
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
    return {
      rightList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      defKeys: [],
      labelPosition: "right",
      rightDialogVisible: false,
      addbumenDialogVisible: false,
      editbumenDialogVisible: false,
      delVisible: false,
      delarr: "",
      currentPage: 0,
      total: 0,
      chaDutyForm: {
        roleName: "",
        pageCode: 1, //当前页
        pageSize: 10, //每页显示的记录数
      },
      DutyList: [],
      selectedList: [],
      addDutyForm: {
        roleName: "",
        remark: "",
      },
      ids: [],
      parentIds: [],
      editDutyForm: {
        roleId: "",
        roleName: "",
        remark: "",
        muneIds: "",
      },
      departmentList: [],
      chaMenuForm: {
        a: 0, //当前页页显示的记录数
      },
      chaDepartmentForm: {
        a: "",
      },
      addDutyRules: {
        roleName: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getDutyList();
    this.getDepartmentList();
  },
  methods: {
    deptIdName(deptId) {
      for (let i = 0; i < this.departmentList.length; i++) {
        if (deptId == this.departmentList[i].deptId) {
          return this.departmentList[i].name;
        }
      }
    },
    async getDepartmentList() {
      const { data: res } = await this.$http.post("sys/dept/list", {
        params: this.chaDepartmentForm,
      });

      this.departmentList = res.body.rows;
    },
    async getDutyList() {
      const { data: res } = await this.$http.post("sys/role/list", {
        params: this.chaDutyForm,
      });
      this.total = res.body.total;
      this.DutyList = res.body.rows;
    },
    addDuty() {
      this.$refs.addDutyRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("sys/role/save", {
          params: this.addDutyForm,
        });
        this.getDutyList();
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
    async showEditDuty(id) {
      let param = new URLSearchParams();
      param.append("id", id);
      const { data: res } = await this.$http.post("sys/role/getInfo", param);
      this.editDutyForm = res.body.role;
      console.log(res);

      this.editbumenDialogVisible = true;
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.post("sys/role/update", userInfo);
      this.getDutyList();
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
    async editDuty() {
      const { data: res } = await this.$http.post(
        "sys/role/update",
        this.editDutyForm
      );
      this.getDutyList();
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
    },
    dialogClosed() {
      this.$refs.addDutyRef.resetFields();
    },
    selected() {
      this.delarr = [];
      this.delVisible = true;
      for (let i = 0; i < this.selectedList.length; i++) {
        this.delarr += this.selectedList[i].roleId + ",";
      }
      console.log(this.delarr);
    },
    async showquanxian(duty) {
      this.editDutyForm.roleId = duty.roleId;
      this.editDutyForm.roleName = duty.roleName;
      this.editDutyForm.remark = duty.remark;
      let param = new URLSearchParams();
      param.append("roleId", duty.roleId);
      const { data: res } = await this.$http.post(
        "sys/menu/getRoleMenuIds",
        param
      );
      const { data: res1 } = await this.$http.post(
        "sys/menu/simpleTree",
        this.editDutyForm
      );
      this.defKeys = res.body.menuIds;
      for (let index = 0; index < res1.body.length; index++) {
        if (res1.body[index].parentId == 0) {
          this.parentIds.push(res1.body[index].menuId);
        }
      }
      for (let index = 0; index < this.defKeys.length; index++) {
        for (let i = 0; i < this.parentIds.length; i++) {
          if (this.defKeys[index] == this.parentIds[i]) {
            this.defKeys.splice(index, 1);
          }
        }
      }
      this.rightList = res1.body;
      this.rightDialogVisible = true;
    },
    async alloRight() {
      var ids = [
        ...this.$refs.mytree.getCheckedKeys(),
        ...this.$refs.mytree.getHalfCheckedKeys(),
      ];
      ids = ids.join(",");
      console.log(ids);
      this.editDutyForm.muneIds = ids;
      const { data: res } = await this.$http.post(
        "sys/role/update",
        this.editDutyForm
      );
      this.rightDialogVisible = false;
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
    chaDutyResetForm(formName) {
      this.$refs.chaDutyRef.resetFields();
      this.getDutyList();
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    async deleteRow() {
      let param = new URLSearchParams();
      param.append("roleIds", this.delarr);
      const { data: res } = await this.$http.post("sys/role/remove", param);
      this.delVisible = false;
      this.getDutyList();
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
    handleSizeChange(val) {
      this.chaDutyForm.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getDutyList();
    },
    handleCurrentChange(val) {
      this.chaDutyForm.pageCode = val;
      this.currentPage = val;
      console.log(`当前页: ${val}`);
      this.getDutyList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    deletebumen(roleIds) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let param = new URLSearchParams();
          param.append("roleIds", roleIds);
          const { data: res } = await this.$http.post("sys/role/remove", param);
          this.getDutyList();
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
    handleNodeClick(data) {
      console.log(data);
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectedList = val;
    },
  },
};
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.el-row {
  align-items: center;
  display: flex;
}
.el-table {
  margin-top: 15px;
}

.quan {
  float: left;
  margin-right: 20px;
  // width: 220px !important;
  // min-width: 220px;
}
.togglr-button {
  width: 180px;
  height: 30px;
  background: #eee;
  text-align: center;
  line-height: 30px;
}
.el-pagination {
  margin-top: 30px;
}
.yi {
  border-bottom: 1px solid #999;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.er {
  margin-top: 20px;
  margin-bottom: 20px;
}
.lei {
  text-align: center;
  background: #999;
  padding: 5px;
}
.chongzhi {
  margin-top: 0px;
}
</style>