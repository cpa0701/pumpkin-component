/**
* Create by Pengan Chen on 2020/6/10
*/
<template>
  <div class="pk-foot">
    <div class="pk-container">
      <div class="top-box">
        <!--菜单列表-->
        <div class="menu-nav-box left-box">
          <!--list-->
          <div class="menu-list left-box">
            <div class="menu-title">产品</div>
            <div class="menu-two-list-box">
              <div class="menu-column">
                <div class="menu-link">
                  <a href="/cloud/#/cloudControl/compute/host">云主机</a>
                </div>
                <div class="menu-link">
                  <a href="/cloud/#/cloudControl/network/mySql">云数据库</a>
                </div>
                <div class="menu-link">
                  <a href="/cloud/#/cloudControl/network/redis">云缓存</a>
                </div>
              </div>
              <div class="menu-column">
                <div class="menu-link">
                  <a href="/cloud/#/cloudControl/network/storage">云硬盘</a>
                </div>
              </div>
            </div>

            <!-- <div class="menu-link">
              <a :href="'/cloudControl/cache/redis'">云缓存</a>
            </div> -->
          </div>
          <!--list-->
          <div class="menu-list left-box">
            <div class="menu-title">解决方案</div>
            <div class="menu-link">
              <a :href="baseUrl+'/government'">政府解决方案</a>
            </div>
            <div class="menu-link">
              <a :href="baseUrl+'/financial'">金融解决方案</a>
            </div>
            <div class="menu-link">
              <a :href="baseUrl+'/medical'">医疗解决方案</a>
            </div>
          </div>
          <!--list-->
          <div class="menu-list left-box">
            <div class="menu-title">PKS学院</div>
            <div class="menu-two-list-box">
              <div class="menu-column">
                <div class="menu-link">
                  <a :href="'/school/ask'">问答</a>
                </div>
                <div class="menu-link">
                  <a :href="'/school/course'">课程</a>
                </div>
                <div class="menu-link">
                  <a :href="'/school/book'">小册</a>
                </div>
              </div>
              <div class="menu-column">
                <div class="menu-link">
                  <a :href="'/school/circle'">圈子</a>
                </div>
                <div class="menu-link">
                  <a :href="'/school/colleges'">高校</a>
                </div>
                <div class="menu-link">
                  <a :href="'/school/job'">招聘</a>
                </div>
              </div>
              <div class="menu-column">
                <div class="menu-link">
                  <a :href="baseUrl+'/publicClass'">公开课</a>
                </div>
              </div>
            </div>
          </div>
          <!--list-->
          <div class="menu-list left-box">
            <div class="menu-title">企业</div>
            <div class="menu-link">
              <a :href="baseUrl+'/partner'">企业联盟</a>
            </div>
            <div class="menu-link">
              <a :href="'/compatibility'">兼容中心</a>
            </div>
          </div>
          <!--list-->
          <div class="menu-list left-box">
            <div class="menu-title">关于PKS信创产业生态平台</div>
            <div class="menu-link">
              <a :href="baseUrl+'/introduce/system'">了解PKS信创产业生态平台</a>
            </div>
            <div class="menu-link">
              <a :href="baseUrl+'/introduce/about'">关于我们</a>
            </div>
            <div class="menu-link">
              <a :href="baseUrl+'/introduce/about?pageIndex=5'">联系我们</a>
            </div>
          </div>
        </div>
        <!--二维码-->
        <div class="code-box right-box" style="margin-right: 10px;">
          <div class="code-title">官方公众号</div>
          <div class="code">
            <img src="../images/qrcode.jpg" alt="" width="96" height="96">
            <!--<icon-svg icon-class="qrcode" width="96" height="96" />-->
          </div>
          <p class="serve-text">勿忘初心 砥砺前行</p>
        </div>
        <!--二维码-->
        <div class="code-box right-box">
          <div class="code-title">手机版</div>
          <div class="code">
            <img src="../images/mobile-qrcode.png" alt="" width="96" height="96">
            <!--<icon-svg icon-class="mobile-qrcode" width="96" height="96" />-->
          </div>
          <p class="serve-text">创新生态 共赢未来</p>
        </div>
      </div>
      <!--分割线-->
      <div class="footer-hr"></div>
      <!--底部-->
      <div class="bottom-box">
        <div class="support-box">
          <div>本平台建设在</div>
          <div class="support-img-box" style="margin-right: 0;">
            <a href="http://www.phytium.com.cn/" target="_blank">
              <!--<icon-svg :class-name="'foot-icon'" icon-class="footer2" width="90" height="38" />-->
              <img src="../images/footer2.png" alt="" width="90" height="38">
            </a>
          </div>
          <div class="support-img-box">
            <a href="http://www.kylinos.cn/" target="_blank">
              <img src="../images/footer1.png" alt="" width="90" height="38">
              <!--<icon-svg :class-name="'foot-icon'" icon-class="footer1" width="90" height="38" />-->
            </a>
          </div>
          <div>体系上，由</div>
          <div class="support-img-box">
            <a href="http://www.greatwall.cn/" target="_blank">
              <img src="../images/footer3.png" alt="" width="115" height="38">
              <!--<icon-svg :class-name="'foot-icon'" icon-class="footer3" width="115" height="38" />-->
            </a>
          </div>
          <div>提供技术支持</div>
        </div>
        <div class="copyright-txt">Copyright © 2019-2020 CCYUNCHINA 湖南长城科技信息有限公司 版权所有
          <span v-if="markObj.profile&&markObj.profile==='prod'" style="margin-left: 10px;">版本：V{{ markObj.projectVersion }}.{{ markObj.buildDate }}.{{ markObj.svnReversion }}</span>
        </div>
        <div class="copyright-txt">
          <a href="http://www.beian.miit.gov.cn/" target="_blank">湘ICP备19020708号 增值电信业务经营许可证：湘B1-20200002</a>
        </div>
        <div class="copyright-txt">
          <a
            target="_blank"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=43019002001043"
            style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"
          >
            <img
              :src="require('../images/public-security.png')"
              style="margin-right: 10px;vertical-align: bottom;"
            />湘公网安备 43019002001043号</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PkFooter',
  props: {
    markObj: {
      type: Object,
      default() {
        return {}
      }
    },
    baseUrl: {
      type: String,
      default: ''
    }
  },
}
</script>

<style scoped>
  @import "../lib/index.css";
</style>
