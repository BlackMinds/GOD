<template>
  <div class="lonin_container">
    <!-- <img src="../assets/img/logo.jpg" alt=""> -->
    <div class="lonin_box">
      <!-- 头像区域 -->
      <div class="avatar_box">永无止境管理系统</div>
      <el-form
        ref="loginFormRef"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            placeholder="账号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
            @keyup.enter.native="login"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <div class="box clearfix">
          <div class="rt">
            <el-checkbox v-model="checked" style="color: #a0a0a0"
              >记住密码</el-checkbox
            >
          </div>
        </div>
        <el-form-item class="btns">
          <el-button type="info" @click="login">登 录</el-button><br />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      checked: false,
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getCookie();
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        let param = new URLSearchParams();
        param.append("username", this.loginForm.username);
        param.append("password", this.loginForm.password);
        const { data: res } = await this.$http.post("login", param);
        if (res.body.user == null) return this.$message.error("登陆失败");
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token", res.body.user.token);
        const self = this;
        var storage = window.localStorage;
        storage.setItem("username", self.loginForm.username);

        //判断复选框是否被勾选 勾选则调用配置cookie方法
        if (self.checked == true) {
          //传入账号名，密码，和保存天数3个参数
          self.setCookie(self.loginForm.username, self.loginForm.password, 7);
        } else {
          console.log("清空Cookie");
          // 清空Cookie
          self.clearCookie();
        }
        this.$router.push("/home");
      });
    },
    //设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie: function () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "userName") {
            //  console.log(arr2[1])
            this.loginForm.username = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == "password") {
            // console.log(arr2[1])
            this.loginForm.password = arr2[1];
          }
        }
        this.checked = true;
      }
    },
    //清除cookie
    clearCookie: function () {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    },
  },
};
</script>
<style lang='less' scoped>
.lonin_container {
  overflow: hidden;
  height: 100vh;
  background-image: url(https://s3.ax1x.com/2020/12/10/rFnfDU.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  .lonin_box {
    width: 450px;
    height: 300px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;
    .avatar_box {
      color: rgba(94, 255, 0, 0.836);
      font-style: normal;
      font-size: 26px;
      text-align: center;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
  .btns {
    margin-top: 20px;
    .el-button {
      width: 368px;
      background-color: rgba(95, 95, 95, 0.836);
      font-size: 20px;
    }
    .el-button:hover {
      transition: all 0.2s;
      background-color: rgba(94, 255, 0, 0.836);
    }
  }
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 45.24vh;
  background-size: 1278px 559px;
  //   background-image: url(../assets/footer.jpg);
  background-repeat: no-repeat;
  background-position: center bottom;
}
</style>