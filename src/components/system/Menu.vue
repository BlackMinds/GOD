<template>
    <div class="min1500">
        <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
         <el-button type="success" @click="addbumenDialogVisible = true">新增一级菜单</el-button>
         <el-button type="success" @click="addbumenDialogVisible1 = true">新增二级菜单</el-button>
          <el-table border stripe :data="menuList"  style="width: 100% padding:0px" @selection-change="handleSelectionChange">   
            <el-table-column type="index" label="序号" align="center" width="55"></el-table-column>
            <el-table-column prop="name" label="菜单名称"></el-table-column>
            <el-table-column prop="router" label="菜单访问路径"></el-table-column>
            <el-table-column label="状态" width="65px">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-switch
                  v-model="scope.row.isShow"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  @change="userStateChanged(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column  label="操作" width="95px">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditMenu(scope.row.menuId)">编辑</el-button>
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
        title="新增一级菜单"
        :visible.sync="addbumenDialogVisible"
        width="30%"
        :before-close="handleClose"
        @closed="dialogClosed">
        <el-form :label-position="labelPosition" label-width="140px"
        :model="addMenuForm"
        ref="addMenuRef"
        :rules="addMenuRules">
          <el-form-item label="一级菜单名称：" prop="name"><el-input placeholder="请输入一级菜单名称" v-model="addMenuForm.name"></el-input></el-form-item>
          <el-input type="hidden"  placeholder="请输入一级菜单名称" v-model="addMenuForm.parentId" value="0"></el-input>
        
        
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addbumenDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMenu(0)">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="新增二级菜单"
        :visible.sync="addbumenDialogVisible1"
        width="30%"
        :before-close="handleClose"
        @closed="dialogClosed">
        <el-form :label-position="labelPosition" label-width="140px"
        :model="addMenuForm"
        ref="addMenuRef"
        :rules="addMenuRules">
          <el-form-item label="一级菜单名称：" prop="parentId">
            <el-select placeholder="请选择" v-model="addMenuForm.parentId">
              <el-option
                v-for="item in menuList1"
                :key="item.menuId"
                :label="item.name"
                :value="item.menuId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级菜单名称：" prop="name"><el-input placeholder="请输入二级菜单名称" v-model="addMenuForm.name"></el-input></el-form-item>
          <el-form-item label="菜单访问路径：" prop="router"><el-input placeholder="请输入菜单访问路径" v-model="addMenuForm.router"></el-input></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addbumenDialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="addMenu">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="编辑菜单"
        :visible.sync="editbumenDialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form :label-position="labelPosition" label-width="120px"
        :model="editMenuForm"
        ref="addMenuRef"
        :rules="addMenuRules">
          <el-form-item label="菜单名称：" prop="name"><el-input placeholder="请输入菜单名称" v-model="editMenuForm.name"></el-input></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editbumenDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editMenu">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      labelPosition: 'right',
      addbumenDialogVisible: false,
      addbumenDialogVisible1: false,
      editbumenDialogVisible:false,
      currentPage: 0,
      total:0,
      menuList:[],
      menuList1:[],
      selectedList: [],
      addMenuForm:{
        name:'',
        router:'',
        parentId:'',
        type:'',
      },
      editMenuForm:{
        name:'',
      },
      addMenuForm1:{
      
        parentId:0,
      },
      chaMenuForm:{
         pageCode: 1, //当前页
         pageSize: 10,//每页显示的记录数
      },

      addMenuRules: {
        name:[
        { required: true, message: '请输入内容', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],},
    }
  },
  created () {
    this.getMenuList();
    this.getMenuList1();
  },
  methods:{
    async getMenuList() {
      const { data: res } = await this.$http.post("sys/menu/listNew",{params:this.chaMenuForm});
      this.total=res.body.total;
      this.menuList = res.body.rows;
    },
    async getMenuList1() {
      const { data: res } = await this.$http.post("sys/menu/listNewOne",{params:this.addMenuForm1});
    
      console.log(res.body.rows);
      this.menuList1=res.body.rows;
      
    },
    addMenu(ismenu) {
      this.$refs.addMenuRef.validate(async valid => {
        if (!valid) return;    
        console.log(ismenu);
        if (ismenu==0) {
          this.addMenuForm.parentId=ismenu;
          this.addMenuForm.type=0;
        }
         this.addMenuForm.type=1;
        const { data: res } = await this.$http.post("sys/menu/save",this.addMenuForm);
        this.addMenuForm.parentId='';
        console.log(this.addMenuForm);
        this.getMenuList();
        this.getMenuList1();
        this.addbumenDialogVisible = false;
        this.addbumenDialogVisible1 = false;
        if (res.body.respCode==500) {
          this.$message({
            type: "info",
            message: res.body.msg
          }); 
        }else{
          this.$message({
            type: "success",
            message: res.body.msg
          });
        }
      });
    },
    async showEditMenu(menuId){
      let param = new URLSearchParams();
      param.append("id", menuId);
      const {data:res} = await this.$http.post('sys/menu/getMenu',param);
      this.editMenuForm=res.body.menu;
      console.log(res);
      
      this.editbumenDialogVisible=true;
    },
    async editMenu(){
       const {data:res} = await this.$http.post('sys/menu/update',this.editMenuForm);
       this.getMenuList();
       this.editbumenDialogVisible=false;
       if (res.body.respCode==500) {
          this.$message({
            type: "info",
            message: res.body.msg
          }); 
        }else{
          this.$message({
            type: "success",
            message: res.body.msg
          });
        }
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.post("sys/menu/update",userInfo);
       this.getMenuList();
       if (res.body.respCode==500) {
          this.$message({
            type: "info",
            message: res.body.msg
          }); 
        }else{
          this.$message({
            type: "success",
            message: res.body.msg
          });
        }
    },
    dialogClosed(){
        this.$refs.addMenuRef.resetFields();
      },
    handleSizeChange(val) {
      this.chaMenuForm.pageSize=val;
      console.log(`每页 ${val} 条`);
      this.getMenuList();
    },
    handleCurrentChange(val) {
      this.chaMenuForm.pageCode=val;
      console.log(`当前页: ${val}`);
      this.currentPage=val;
      this.getMenuList();
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    deletebumen(){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (res.body.respCode==500) {
          this.$message({
            type: "info",
            message: res.body.msg
          }); 
        }else{
          this.$message({
            type: "success",
            message: res.body.msg
          });
        }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectedList = val;
    }
  }
}
</script>
<style lang='less' scoped>
    .el-card{
        margin-top: 15px;
    }
    .el-row{
        align-items: center;
        display: flex;
    }
    .el-table{
        margin-top: 15px;
    }
    .chongzhi{
      margin-top: 0px;
    }
    .el-form-item .el-input,.el-select{
      width: 350px;
    }
</style>