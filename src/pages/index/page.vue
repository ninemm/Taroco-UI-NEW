<template>
  <d2-container class="dashboard">
    <el-row style="margin-left:-7.5px; margin-right: -7.5px;">
      <div class="el-col-16" style="padding-left:7.5px; padding-right: 7.5px;">
        <div class="index-section">
          <div class="el-row" style="margin-left:-7.5px; margin-right: -7.5px;">
            <div class="el-col-10" style="padding-left:7.5px;">
              <div class="d2-panel index-security-warning">
                <div class="d2-mb-15">安全预警</div>
                <div class="el-row" style="margin-left: -5px; margin-right: -5px;">
                  <div class="d2-panel__bd">
                    <div class="el-col-8">
                      <div class="index-block">
                        <div class="index-block__bd">
                          <em class="index-block__value">0</em>
                        </div>
                        <div class="index-block__hd">紧急事件</div>
                      </div>
                    </div>
                    <div class="el-col-8">
                      <div class="index-block">
                        <div class="index-block__bd">
                          <em class="index-block__value">0</em>
                        </div>
                        <div class="index-block__hd">漏洞</div>
                      </div>
                    </div>
                    <div class="el-col-8">
                      <div class="index-block">
                        <div class="index-block__bd">
                          <em class="index-block__value">0</em>
                        </div>
                        <div class="index-block__hd">攻击</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="el-col-7" style="padding-right: 7.5px;">
              <div class="d2-panel index-security-protect">
                <div class="d2-panel__hd">安全防护</div>
                <div class="d2-panel__bd">
                  <div class="index-block d2-mb-10">
                    <div class="index-block__hd">主机安全</div>
                    <div class="index-block__bd">
                      <em class="index-block__value">0</em> 件
                    </div>
                  </div>
                  <div class="index-block">
                    <div class="index-block__hd">WEB 攻击</div>
                    <div class="index-block__bd">
                      <a href="#">购买网络安全</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="el-col-7" style="padding-left:7.5px; padding-right:7.5px;">
              <div class="d2-panel index-undo">
                <div class="d2-mb-15">待办事项</div>
                <div class="d2-panel__bd">
                  <div class="index-block">
                    <div class="index-block__hd">工单</div>
                    <div class="index-block__bd">
                      <em class="index-block__value">0</em>
                    </div>
                  </div>
                  <div class="index-block d2-mt-5">
                    <div class="index-block__hd">续费</div>
                    <div class="index-block__bd">
                      <em class="index-block__value">0</em>
                    </div>
                  </div>
                  <div class="index-block d2-mt-5">
                    <div class="index-block__hd">未支付订单</div>
                    <div class="index-block__bd">
                      <em class="index-block__value">0</em>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d2-mt-20">
          <div class="d2-panel index-recent">
            <div class="d2-panel__hd">
              <div class="d2-mb-15 d2-clearfix">
                <span>安全预警</span>
                <a href="#" class="d2-fr">操作日志 <i class="el-icon-time"></i></a>
              </div>
            </div>
            <div class="d2-panel__bd">
              <div class="el-row" style="margin-left:-10px; margin-right: -10px;">
                <div class="el-col-8 d2-plr-10">
                  <div class="index-block">
                    <div class="index-block__bd">Web 应用防火墙</div>
                  </div>
                </div>
                <div class="el-col-8 d2-plr-10">
                  <div class="index-block">
                    <div class="index-block__bd">负载均衡</div>
                  </div>
                </div>
                <div class="el-col-8 d2-plr-10">
                  <div class="index-block">
                    <div class="index-block__bd">云服务器 ECS</div>
                  </div>
                </div>
                <div class="el-col-8 d2-plr-10">
                  <div class="index-block">
                    <div class="index-block__bd">对象存储 OSS</div>
                  </div>
                </div>
                <div class="el-col-8 d2-plr-10">
                  <div class="index-block">
                    <div class="index-block__bd">云监控</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d2-mt-20">
          <div class="d2-panel index-personal">
            <div class="d2-panel__bd">
              <el-tabs>
                <el-tab-pane label="我的资源">用户管理</el-tab-pane>
                <el-tab-pane label="我的消费">用户管理</el-tab-pane>
                <el-tab-pane label="推荐返利">用户管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <div class="el-col-8" style="padding-left:7.5px; padding-right: 7.5px;">
        <div class="d2-panel index-notice">
          <div class="d2-panel__bd">
            <el-tabs>
              <el-tab-pane label="全部公告">
                <ul class="index-notice__list">
                  <li>【升级】ncloud-ui 1.0 发布：功能增强</li>
                  <li>【升级】ncloud-ui 1.0 专业版发布：全新架构升级</li>
                  <li>【升级】ncloud-ui 1.0 企业版发布：授权协议</li>
                </ul>
                <p><a href="#">更多</a></p>
              </el-tab-pane>
              <el-tab-pane label="升级">用户管理</el-tab-pane>
              <el-tab-pane label="安全">用户管理</el-tab-pane>
              <el-tab-pane label="备案">定时任务补偿</el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="d2-mt-20">
          <div class="d2-panel index-assistant">
            <div class="d2-panel__hd">
              <div class="d2-mb-15 d2-clearfix">
                <span>管理助手</span>
                <a href="#" class="d2-fr">更多 <i class="el-icon-more"></i></a>
              </div>
            </div>
            <div class="d2-panel__bd">
              <div class="index-assistant__item">
                <div class="index-assistant__item-hd">
                  <i class="el-icon-news"></i>
                </div>
                <div class="index-assistant__item_bd">
                  <h4>双11巅峰钜惠</h4>
                  <p>云产品拼购1折起，拉新赢300万现金红包</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-row>
  </d2-container>
</template>

<script>
import D2HelpBtn from './components/d2-help-btn'
export default {
  components: {
    D2HelpBtn
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/style/public.scss';
.dashboard {
  .d2-panel {
    height: 148px;
    overflow: hidden;
    .index-block {
      padding: 15px 10px;
      color: $color-text-main;
      background-color: $color-bg;
      .index-block__bd {
        flex: 1;
      }
    }
    a {
      color: #ef853a;
      text-decoration: none;
    }
  }
  .index-undo {
    .index-block {
      @extend %flex-center-row;
      padding: 7px 10px;
      .index-block__hd {
        min-width: 80px;
        text-align: left;
      }
      .index-block__bd {
        text-align: center;
        .index-block__value {
          font-size: 18px;
          color: $color-text-sub;
          font-style: normal;
        }
      }
    }
  }
  .index-security-protect {
    border-left: 0;
    border-radius: 0 4px 4px 0;
    .index-block {
      @extend %flex-center-row;
      line-height: 22px;
      .index-block__hd {
        min-width: 80px;
        text-align: left;
      }
      .index-block__bd {
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        line-height: 22px;
        .index-block__value {
          font-size: 18px;
          font-style: normal;
          color: $color-text-sub;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  .index-security-warning {
    border-right: 0;
    border-radius: 4px 0 0 4px;
    .el-col-8 {
      padding: 0 5px;
    }
    .index-block {
      @extend %flex-center-col;
      .index-block__hd {
        line-height: 26px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .index-block__bd {
        line-height: 60px;
        .index-block__value {
          font-size: 32px;
          font-style: normal;
          color: $color-text-sub;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  .index-recent {
    .d2-panel__bd {
      margin-top: -15px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .index-block {
      margin-top: 15px;
    }
  }
  .index-notice {
    .index-notice__list {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .index-notice__list>li {
      line-height: 24px;
      color: $color-text-main;
    }
  }
  .index-assistant {
    .index-assistant__item {
      @extend %flex-center-row;
      flex-flow: row nowrap;
      border: 1px solid #dddee1;
      .index-assistant__item-hd {
        width: 60px;
        position: relative;
        background-color: $color-bg;
      }
      .index-assistant__item-bd {
        flex: 1;
        padding: 10px 15px;
      }
    }
  }
  .page__btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    span {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
    }
  }
}
</style>
