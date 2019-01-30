<template>
  <d2-container better-scroll class="page">
    <!-- header 查询条件 -->
    <template slot="header">UPMS 权限配置流程图</template>
    <el-card body-style="{padding: '5px'}">
      <div slot="header" class="card-title">
        <span><i class="el-icon-setting"></i> 权限配置流程一</span>
      </div>
      <div class="card-content d2-text-center">
        <!-- <el-steps simple>
          <el-step title="用户">
            <i class="fa fa-user" slot="icon"></i>
          </el-step>
          <el-step title="用户分组" >
            <i class="fa fa-group" slot="icon"></i>
          </el-step>
          <el-step title="系统角色" >
            <i class="fa fa-users-cog" slot="icon"></i>
          </el-step>
          <el-step title="功能权限" >
            <i class="fa fa-key" slot="icon"></i>
          </el-step>
        </el-steps> -->
        <div class="item d2-m">
          <span><d2-icon name="user"/> 用户</span>
        </div>
        <div>
          <i class="el-icon-d-arrow-right "></i>
        </div>
        <div class="item d2-m">
          <span><d2-icon name="group"/> 用户分组</span>
        </div>
        <div>
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <div class="item d2-m">
          <span><d2-icon name="users-cog"/> 系统角色</span>
        </div>
        <div>
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <div class="item d2-ml">
          <span><d2-icon name="key"/> 功能权限</span>
        </div>
      </div>
    </el-card>
    <el-card class="d2-mt" body-style="{padding: '5px'}">
      <div slot="header" class="card-title">
        <span><i class="el-icon-setting"></i> 权限配置流程二</span>
      </div>
      <div class="card-content d2-text-center">
        <div class="item d2-m">
          <span><d2-icon name="user"/> 用户</span>
        </div>
        <div>
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <div class="item d2-m">
          <span><d2-icon name="id-badge"/> 岗位</span>
        </div>
        <div>
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <div class="item d2-ml">
          <span><d2-icon name="key"/> 功能权限</span>
        </div>
      </div>
    </el-card>
    <!-- footer 分页条 -->
    <template slot="footer">Copyright @2018</template>
  </d2-container>
</template>

<style lang="scss" scoped>
  @import '~@/assets/style/public.scss';
  .page {
    .card-title {
      i {
        color: $color-primary;
      }
    }
    .card-content {
      @extend %flex-center-row;
      justify-content: flex-start;
      height: 100px;
      .item {
        height: 60px;
        width: 120px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: $color-bg;
      }
    }
  }
</style>
