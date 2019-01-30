<template>
  <d2-container better-scroll>
    <el-tabs v-model="activeName" v-loading="loading">
      <el-tab-pane label="常规设置" name="first">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <div class="d2-help-box d2-mb">
              <div class="d2-pl-10"><b>注意：</b>以下配置用于系统正常运行</div>
              <div class="d2-pl-10">1. 调整图片服务器之前，请先跟研发人员确认，功能是否调整完成(请慎重)。</div>
            </div>
            <el-form :label-position="labelPosition" label-width="180px" :model="form" ref="form" size="small">
              <h4>常规选项</h4>
              <el-form-item label="系统名称" prop="web_title">
                <el-input v-model="form.web_title" placeholder="请输入系统名称"></el-input>
              </el-form-item>
              <el-form-item label="ES服务地址" prop="es_url">
                <el-input v-model="form.es_url" placeholder="请输入ElasticSearch服务地址"></el-input>
              </el-form-item>
              <el-form-item label="百度地图Key" prop="baidu_map_key">
                <el-input v-model="form.baidu_map_key" placeholder="请输入百度地图Key"></el-input>
              </el-form-item>
              <el-form-item label="高德地图Key" prop="gaode_map_key">
                <el-input v-model="form.gaode_map_key" placeholder="请输入高德地图Key"></el-input>
              </el-form-item>
              <h4>图片存储服务配置选项</h4>
              <el-form-item label="图片存储" prop="image_server_type">
                <el-radio-group v-model="form.image_server_type">
                  <el-radio label="qiniu">七牛云</el-radio>
                  <el-radio label="alioss">AliOSS</el-radio>
                  <el-radio label="fastDFS">FastDFS</el-radio>
                  <el-radio label="local">本地服务器</el-radio>
                </el-radio-group>
                <p class="d2-help-text">选择七牛云，AliOSS，FastDFS时，请填写对应的服务器地址</p>
              </el-form-item>
              <el-form-item label="七牛云" prop="qiniu_url">
                <el-input v-model="form.qiniu_url" placeholder="请输入七牛云服务器地址"></el-input>
              </el-form-item>
              <el-form-item label="OSS(阿里云)" prop="alioss_url">
                <el-input v-model="form.alioss_url" placeholder="请输入OSS(阿里云)服务器地址"></el-input>
              </el-form-item>
              <el-form-item label="FastDFS服务器" prop="fastdfs_url">
                <el-input v-model="form.fastdfs_url" placeholder="请输入FastDFS服务器地址"></el-input>
              </el-form-item>
              <h4>可选</h4>
              <el-form-item label="版权信息" prop="web_copyright">
                <el-input type="textarea" v-model="form.web_copyright" placeholder="请输入版权信息"></el-input>
              </el-form-item>
              <el-form-item label="ICP备案号" prop="web_icp_number">
                <el-input v-model="form.web_icp_number" placeholder="请输入ICP备案号"></el-input>
              </el-form-item>
              <el-form-item label="系统版本号" prop="web_version">
                <el-input v-model="form.web_version" placeholder="请输入系统版本号"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="微信设置" name="second">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <div class="d2-help-box d2-mb">
              <div class="d2-pl-5"><i class="el-icon-bell"></i> 通过设置微信、企业微信的配置选项，打通系统与微信公众号、企业微信功能互动！</div>
            </div>
            <el-form :label-position="labelPosition" label-width="180px" :model="form" ref="form" size="small">
              <h4>微信配置</h4>
              <el-form-item label="微信AppID" prop="wechat_appid">
                <el-input v-model="form.wechat_appid" placeholder="请输入AppID"></el-input>
              </el-form-item>
              <el-form-item label="微信Secret" prop="wechat_appsecret">
                <el-input v-model="form.wechat_appsecret" placeholder="请输入Secret"></el-input>
              </el-form-item>
              <el-form-item label="微信Token" prop="wechat_token">
                <el-input v-model="form.wechat_token" placeholder="请输入token"></el-input>
              </el-form-item>
              <h4>企业微信配置</h4>
              <el-form-item label="企业微信CorpID" prop="qywechat_corpid">
                <el-input v-model="form.qywechat_corpid" placeholder="请输入企业微信CorpID"></el-input>
              </el-form-item>
              <el-form-item label="企业微信Secret" prop="qywechat_secret">
                <el-input v-model="form.qywechat_secret" placeholder="请输入企业微信Secret"></el-input>
              </el-form-item>
              <el-form-item label="企业微信通讯录Secret" prop="qywechat_secret_1">
                <el-input v-model="form.qywechat_secret_1" placeholder="请输入企业微信通讯录Secret"></el-input>
              </el-form-item>
              <el-form-item label="企业微信AgentID" prop="qywechat_agentid">
                <el-input v-model="form.qywechat_agentid" placeholder="请输入企业微信AgentID"></el-input>
              </el-form-item>
              <el-form-item label="encodingAesKey" prop="qywechat_encoding_aes_key">
                <el-input v-model="form.qywechat_encoding_aes_key" placeholder="请输入encodingAesKey"></el-input>
              </el-form-item>
              <el-form-item label="企业微信DeptID" prop="qywechat_deptid">
                <el-input v-model="form.qywechat_deptid" placeholder="请输入企业微信DeptID"></el-input>
                <p class="d2-help-text">deptId用于同步企业微信用户与部门</p>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="通知设置" name="third">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <div class="d2-help-box d2-mb">
              <div class="d2-pl-5"><i class="el-icon-bell"></i> 以下配置选项用于系统变更通知，用户注册验证码等场景下的通知！</div>
            </div>
            <el-form :label-position="labelPosition" label-width="180px" :model="form" ref="form" size="small">
              <h4>邮件服务器</h4>
              <el-form-item label="SMTP服务器" prop="email_host">
                <el-input v-model="form.email_host" placeholder="请输入SMTP服务器地址，如smtp.qq.com, smtp.126.com"></el-input>
              </el-form-item>
              <el-form-item label="邮箱账号" prop="email_username">
                <el-input v-model="form.email_username" placeholder="请输入邮箱账号"></el-input>
              </el-form-item>
              <el-form-item label="邮箱密码" prop="email_password">
                <el-input v-model="form.email_password" placeholder="请输入邮箱密码"></el-input>
                <p class="d2-help-text">有些邮箱需要开启密码</p>
              </el-form-item>
              <el-form-item label="是否SSL" prop="email_isssl">
                <el-switch v-model="form.email_isssl" active-color="#409EFF" active-value="1" inactive-value="0" inactive-color="#909399"></el-switch>
                <p class="d2-help-text">QQ邮箱，Gmail邮箱，163邮箱等请开启</p>
              </el-form-item>
              <h4>短信服务器</h4>
              <el-form-item label="短信服务器" prop="sms_app_provider">
                <el-select v-model="form.sms_app_provider" placeholder="请选择" clearable>
                  <el-option value="alidayu" label="阿里大于"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="短信AppKey" prop="sms_app_key">
                <el-input v-model="form.sms_app_key" placeholder="请输入短信AppKey"></el-input>
              </el-form-item>
              <el-form-item label="短信AppSecret" prop="sms_app_secret">
                <el-input v-model="form.sms_app_secret" placeholder="请输入短信AppSecret"></el-input>
              </el-form-item>
              <h4>开启通知</h4>
              <el-form-item label="开启邮箱通知" prop="email_notify_enable">
                <el-switch v-model="form.email_notify_enable" active-color="#409EFF" active-value="1" inactive-value="0" inactive-color="#909399"></el-switch>
              </el-form-item>
              <el-form-item label="开启短信通知" prop="sms_notify_enable">
                <el-switch v-model="form.sms_notify_enable" active-color="#409EFF" active-value="1" inactive-value="0" inactive-color="#909399"></el-switch>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="CDN配置" name="fourth">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <div class="d2-help-box d2-mb">
              <div class="d2-pl-5"><i class="el-icon-bell"></i> 通过CDN网站加速设置，让网站图片、css、js等资源存储到CDN服务器，加速网站访问速度。</div>
            </div>
            <el-form :label-position="labelPosition" label-width="180px" :model="form" ref="form" size="small">
              <h4>常规选项</h4>
              <el-form-item label="开启CDN" prop="cdn_enable">
                <el-switch v-model="form.cdn_enable" active-color="#409EFF" active-value="1" inactive-value="0" inactive-color="#909399"></el-switch>
                <p class="d2-help-text">开启CDN之后，请填入对应的CDN域名与Bucket</p>
              </el-form-item>
              <el-form-item label="CDN域名" prop="cdn_domain">
                <el-input v-model="form.cdn_domain" placeholder="请输入CDN域名"></el-input>
              </el-form-item>
              <el-form-item label="CDN Bucket" prop="cdn_bucket">
                <el-input v-model="form.cdn_bucket" placeholder="请输入CDN Bucket"></el-input>
              </el-form-item>
              <el-form-item label="排除文件列表" prop="cdn_exclude_files">
                <el-input type="textarea" v-model="form.cdn_exclude_files" placeholder="请填入排除文件" rows="3"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!-- footer -->
    <template slot="footer">
      <div style="margin:-5px; text-align:center">
        <el-button type="primary" @click="update" size="small" icon="el-icon-check">保存更改</el-button>
      </div>
    </template>
  </d2-container>
</template>

<script>
import { getObj, putObj } from '@/api/option'
import { mapGetters } from 'vuex'
export default {
  name: 'upms-option',
  data () {
    return {
      activeName: 'first',
      loading: false,
      labelPosition: 'right',
      form: {}
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    init () {
      // 初始化选项配置时，可以先取缓存，再取数据库
      getObj().then(response => {
        this.form = response.data
      })
    },
    update () {
      this.loading = true
      putObj(this.form).then(() => {
        this.loading = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
