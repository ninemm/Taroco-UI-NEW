<template>
  <div class="login-page">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <!-- logo部分 -->
      <div class="logo-group">
        <h3>登录到NCloud</h3>
      </div>
      <!-- 表单部分 -->
      <div class="form-group">
        <el-card>
          <el-form ref="loginForm" :rules="rules" :model="formLogin">
            <el-form-item prop="username">
              <el-input type="text" v-model="formLogin.mobile" @blur="showAccount" placeholder="用户名">
                <d2-icon slot="prepend" name="user-circle-o"></d2-icon>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="formLogin.password" placeholder="密码">
                <d2-icon slot="prepend" name="keyboard-o"></d2-icon>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input type="text" v-model="formLogin.code" placeholder="- - - -">
                <template slot="prepend">验证码</template>
                <template slot="append">
                  <img class="login-code" :src="code.src" @click="refreshCode">
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="deptId" v-if="isShow" label="账套" label-width="45px">
              <el-select v-model="formLogin.deptId" clearable placeholder="请选择账套" style="width: 200px;">
                <el-option v-for="item in accountOptions"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button @click="submit" type="primary" class="button-login">登录</el-button>
          </el-form>
        </el-card>
      </div>
      <!-- <p class="options">
        <span>自动登录</span>
        <span>忘记密码</span>
      </p> -->
      <div class="footer">
          <p class="footer-options">
            <a href="#">帮助</a>
            <a href="#">隐私</a>
            <a href="#">条款</a>
          </p>
          <p class="footer-copyright">
            Copyright <d2-icon name="copyright"/> 2018  NCloud UI <a href="#">@Ninemm</a>
          </p>
        </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
require('particles.js')
import util from '@/libs/util'
import { mapActions } from 'vuex'
import config from './config/default'
import { fetchAccountOptions } from '@/api/user'
export default {
  data () {
    return {
      isShow: true,
      accountOptions: [],
      // 表单
      formLogin: {
        mobile: '18627771043',
        password: '123456',
        randomStr: '',
        code: ''
      },
      // 校验
      rules: {
        mobile: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      code: {
        len: 4,
        src: ''
      }
    }
  },
  mounted () {
    // 初始化例子插件
    particlesJS('login', config)
    this.refreshCode()
    this.showAccount()
  },
  beforeDestroy () {
    // 销毁 particlesJS
    // thanks https://github.com/d2-projects/d2-admin/issues/65
    // ref https://github.com/VincentGarreau/particles.js/issues/63
    if (pJSDom && pJSDom.length > 0) {
      pJSDom[0].pJS.fn.vendors.destroypJS()
      pJSDom = []
    }
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    /**
     * 刷新验证码
     */
    refreshCode () {
      this.formLogin.code = "";
      this.formLogin.randomStr = util.randomLenNum(this.code.len, true);
      this.code.src = `${process.env.VUE_APP_BASE_URL}/code/${this.formLogin.randomStr}`;
    },
    showAccount () {
      if (this.formLogin.mobile) {
        fetchAccountOptions({ mobile: this.formLogin.mobile }).then((res) => {
          if (res.data && res.data.length > 1) {
            this.accountOptions = res.data
            this.isShow = true
          } else {
            this.formLogin.deptId = res.data[0].deptId
          }
        })
      } else {
        this.isShow = false
      }
    },
    /**
     * @description 提交表单
     */
    // 提交登陆信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 登陆
          this.login(Object.assign({vm: this}, this.formLogin));
        } else {
          // 登陆表单校验失败
          this.$message.error('表单校验失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './style.scss';
</style>
