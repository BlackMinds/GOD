<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <!-- <img src="../assets/log.png" alt="login" /> -->
        <span>永无止境管理系统</span>
      </div>
      <div class="tubiao">
        <!-- <div class="im">
          <img :src="a" alt />
        </div> -->
        <div class="yong">你好，{{ user.name }}</div>

        <el-button
          class="tuituxin"
          type="warning"
          icon="el-icon-setting"
          size="small"
          circle
          @click="showEditUser(user.userId)"
        ></el-button>
        <el-button type="info" @click="logout" size="small" class="tuituxin"
          >退出</el-button
        >
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="togglr-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#001529"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.menuId + ''"
            v-for="item in menuList"
            :key="item.menuId"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.menuId]"></i>
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单的模板区域 -->
            <el-menu-item
              :index="'/' + subItem.router"
              v-for="subItem in item.children"
              :key="subItem.menuId"
              @click="saveNavState('/' + subItem.router)"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ subItem.name }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive :include="$store.state.cache">
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
    <el-dialog
      title="基本设置"
      :visible.sync="shezhidialogVisible"
      width="530px"
      :before-close="handleClose"
    >
      <div class="ti">
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="editUserForm"
          ref="addUserRef"
          :rules="addUserRules"
        >
          <el-form-item class="tian" label="用户名:" prop="name">
            <el-input
              placeholder="请输入用户名"
              v-model="editUserForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item class="tian" label="手机号:" prop="mobile">
            <el-input
              placeholder="请输入手机号"
              v-model="editUserForm.mobile"
            ></el-input>
          </el-form-item>
          <el-form-item class="tian" label="旧密码:">
            <el-input
              placeholder="请输入旧密码"
              v-model="editUserForm.oldPassword"
            ></el-input>
          </el-form-item>
          <el-form-item class="tian" label="新密码:" prop="newpassword">
            <el-input
              placeholder="请输入新密码"
              v-model="editUserForm.newpassword"
            ></el-input>
          </el-form-item>
          <el-form-item class="tian" label="确认新密码:" prop="quepassword">
            <el-input
              placeholder="请输入确认新密码"
              v-model="editUserForm.quepassword"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shezhidialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-container>
</template>
<script>
function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}
export default {
  data() {
    return {
      cache: this.$store.state.cache,
      // cache: [],
      websock: null,
      imageUrl: "",
      labelPosition: "right",
      shezhidialogVisible: false,
      editUserForm: {
        name: "",
        password: "",
        mobile: "",
        newpassword: "",
        quepassword: "",
        picUrl: "",
        imageUrl: "",
        oldPassword: "",
      },
      ip: "",
      ip1: "",
      // ips: "",
      a: "",
      addUserRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        newpassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        quepassword: [
          { required: true, message: "请输入确认新密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      menuList: [],
      user: {},
      iconsObj: {
        // 87: "iconfont icon-danju",
        // 14: "iconfont icon-user",
        // 12: "iconfont icon-tijikongjian",
        // 41: "iconfont icon-shangpin",
        // 57: "iconfont icon-shangpin",
        // 48: "iconfont icon-danju",
        // 34: "iconfont icon-baobiao",
        // 28: "iconfont icon-baobiao",
        // 80: "iconfont icon-baobiao",
        // 102: "iconfont icon-baobiao",
        // 104: "iconfont icon-baobiao",
      },
      //是否折叠
      isCollapse: false,
      //被激活的链接地址
      activePath: "",
      username: "",
      gImgFilesList: [],
      dialogVisible: false,
      dialogImageUrl: "",
      time: null,
      unread: {},
    };
  },
  created() {
    this.getMenuList(),
      (this.activePath = window.sessionStorage.getItem("activePath"));
    this.getUser();
    this.$http
      .get("/erpinfo/listOfNotRead", {
        params: {
          userId: getCookie("userId"),
        },
      })
      .then((res) => {
        this.unread = res.data.data;
      });
  },
  methods: {
    handleCloseName() {
      this.messageName = true;
    },
    handleClosesUnread() {
      this.unreadMessage = true;
    },
    //文件上传成功的钩子函数v
    handleSuccess(res, file) {
      this.$message({
        type: "info",
        message: "图片上传成功",
        duration: 6000,
      });
      if (file.response.success) {
        // this.editUserForm.picUrl=file.response.message;
        this.gImgFilesList.push({ url: this.ips + file.response.message });
        let arr = this.deleteRepeat(this.gImgFilesList, this.ips);

        this.editUserForm.picUrl = JSON.stringify(arr);
      }
    },
    //删除文件之前的钩子函数
    handleRemove(file, fileList) {
      this.$message({
        type: "info",
        message: "已删除原有图片",
        duration: 6000,
      });
      this.gImgFilesList = fileList;
      // 获取去除ips后的数组
      // console.log(this.ips)
      let arr = this.deleteRepeat(this.gImgFilesList, this.ips);
      this.editUserForm.picUrl = JSON.stringify(arr);
    },
    //点击列表中已上传的文件事的钩子函数
    handlePreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传的文件个数超出设定时触发的函数
    onExceed(files, fileList) {
      this.$message({
        type: "info",
        message: "最多只能上传一个图片",
        duration: 6000,
      });
    },
    //文件上传前的前的钩子函数
    //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    },
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "userId" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    async getUser() {
      const { data: res } = await this.$http.post("sys/user/getCurrentUser");

      this.setCookie("userId", res.body.user.userId, 7);
      if (res.body.user.picUrl != null) {
        this.a = this.ips + JSON.parse(res.body.user.picUrl)[0].url;
      }
      this.user = res.body.user;
    },
    async showEditUser(id) {
      let param = new URLSearchParams();
      param.append("id", id);
      const { data: res } = await this.$http.post("sys/user/getInfo", param);

      //   res.body.user.picUrl=this.ips+res.body.user.picUrl;
      //   console.log(res.picUrl);

      this.editUserForm = res.body.user;

      // 对图片路径进行解析
      if (this.editUserForm.picUrl != null && this.editUserForm.picUrl != "") {
        let arr = JSON.parse(this.editUserForm.picUrl);
        arr.forEach((e) => {
          e.url = this.ips + e.url;
        });
        this.gImgFilesList = arr;
      }

      this.shezhidialogVisible = true;
    },
    showmessage() {
      this.$router.push({
        name: "systemMessage",
        params: {},
      });
    },
    async editUser() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        if (
          this.editUserForm.oldPassword == "" ||
          this.editUserForm.oldPassword == undefined
        ) {
          // this.shezhidialogVisible = false;
        } else {
          if (getCookie("password") != this.editUserForm.oldPassword) {
            this.$message({
              type: "info",
              message: "旧密码输入错误",
            });
            return;
          }
          if (this.editUserForm.newpassword != this.editUserForm.quepassword) {
            this.$message({
              type: "info",
              message: "输入密码不一致",
            });
            return;
          }
          if (getCookie("password") == this.editUserForm.quepassword) {
            this.$message({
              type: "info",
              message: "旧密码和新密码不能一致",
            });
            return;
          }
        }
        this.editUserForm.password = this.editUserForm.quepassword;
        const { data: res } = await this.$http.post(
          "sys/user/update",
          this.editUserForm
        );
        this.shezhidialogVisible = false;
        this.getUser();
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    logout() {
      this.$http.post("/logout");
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.websock.close();
      clearInterval(this.time);
    },
    async getMenuList() {
      const { data: res } = await this.$http.post("getPermissMenu");
      this.ip = this.ips + "upload";
      this.ip1 = this.ips;
      if (res.msg) {
        this.$message.error("登陆过期,请重新登陆");
        window.sessionStorage.clear();
        this.$router.push("/login");
        this.websock.close();
        clearInterval(this.time);
      }
      this.menuList = res.body.menu;
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 为数组中的对象元素url 去除指定字符串
    deleteRepeat(arr, delstr) {
      let newArr = [];

      arr.forEach((e) => {
        let obj = e.url.replace(delstr, "");
        newArr.push({ url: obj });
      });

      return newArr;
    },
  },
};
</script>
<style lang='less' scoped>
.unreadList {
  list-style: none;
}
.unreadList li {
  margin: 4px 0;
}
.unread .el-dialog__body {
  padding: 15px 15px;
}
/deep/.el-dialog__wrapper:first-child {
  top: initial;
  left: initial;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #001529;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  overflow: initial;
  background-color: #001529;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.togglr-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-header img {
  width: 61px;
  height: 56px;
}
.tubiao {
  // margin-top: 15px;
  .im {
    // width: 45px;
    height: 45px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-top: 8px;
    }
  }
  .yong {
    // width: 120px;
    height: 35px;
    padding-top: 10px;
    font-size: 18px;
    padding-left: 15px;
  }
  .el-button {
    margin-left: 15px;
  }
}
.ti {
  width: 430px;
  .tian {
    margin-left: 20px;
    .el-input {
      width: 320px;
    }
  }
  .el-button {
    margin-left: 140px;
    margin-top: 10px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 143px;
  height: 143px;
  display: block;
}
</style>