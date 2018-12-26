<template>
  <d2-container class="page">
    <el-row :gutter="10">
      <el-col :span="18">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card header="安全预警" class="index-security-warning">
              <el-row :gutter="10" class="d2-text-center">
                <el-col :span="8" class="index-block">
                  <div class="index-block__bd">
                    <em class="index-block__value">0</em>
                  </div>
                  <div class="index-block__hd">紧急事件</div>
                </el-col>
                <el-col :span="8" class="index-block d2-text-center">
                  <div class="index-block__bd">
                    <em class="index-block__value">0</em>
                  </div>
                  <div class="index-block__hd">紧急事件</div>
                </el-col>
                <el-col :span="8" class="index-block d2-text-center">
                  <div class="index-block__bd">
                    <em class="index-block__value">0</em>
                  </div>
                  <div class="index-block__hd">紧急事件</div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6">
            ddd
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            eee
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            eee
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        bb
      </el-col>
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
.page {
  .index-security-warning {
    height: 180px;
    .index-block {
      display: flex;
      flex-flow: column wrap;
      color: $color-text-main;
      background-color: $color-bg;
      min-height: 100%;
      font-size: 12px;
      .index-block__bd {
        line-height: 60px;
        flex: 1;
        .index-block__value {
          font-size: 32px;
          color: $color-text-sub;
          font-style: normal;
        }
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
