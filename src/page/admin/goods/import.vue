<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>商品导入</span>
            <small>
              目前只支持ZIP格式压缩包导入，目前还不支持7z，rar，gz等格式
            </small>
          </div>
          <div class="mb-3">
            <uploader :options="options" class="uploader-example" @file-added="fileAdded"
                      @file-success="fileSuccess">
              <uploader-unsupport></uploader-unsupport>
              <uploader-drop>
                <p class="card-text">上传ZIP格式压缩包，以导入商品到数据库</p>
                <uploader-btn>上传ZIP文件</uploader-btn>
              </uploader-drop>
              <uploader-list></uploader-list>
            </uploader>
          </div>
          <el-table
            :data="pagination.items"
            style="width: 100%">
            <el-table-column
              type="selection"
              label="全选"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="100">
              <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.status === 1">未导入</el-tag>
                <el-tag type="success" v-else>以导入</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="unix"
              label="操作"
              width="150">

              <template slot-scope="scope">
                <el-dropdown size="small" split-button type="primary" @command="setImportCommand"
                             v-on:click="importFile(scope)" v-if="scope.row.status !== 0">
                  <span class="el-dropdown-link">导入</span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{name: '下载', data: scope}">下载</el-dropdown-item>
                    <el-dropdown-item :command="{name: '删除', data: scope}">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown size="small" split-button type="primary" @command="setImportCommand"
                             v-on:click="Download(scope)" v-else>
                                    <span class="el-dropdown-link">
                                        下载
                                    </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{name: '删除', data: scope}">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="mt-3 mb-0 pb-0"
            layout="->, prev, pager, next"
            @current-change="pagination_news"
            :total="pagination.count"
            :page-size="pagination.pageSize">
          </el-pagination>

        </el-card>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import { adminImportGoodsViewSet } from '@/axios/BaseUrl'
  import Vue from 'vue'

  import uploader from 'vue-simple-uploader'

  import {
    Tag,
    Row,
    Col,
    Card,
    Button,
    Table,
    TableColumn,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Loading
  } from 'element-ui'
  import axios from '@/axios/index'

  Vue.use(uploader)
  export default {
    name: 'admin-goods-import',
    data () {
      return {
        loading: false,
        options: {
          target: axios.getUrl() + adminImportGoodsViewSet(),
          testChunks: false,
          singleFile: true,
          headers: {
            'Authorization': 'JWT ' + this.$store.getters.getToken
          },
          type: ['zip']
        },
        pagination: {
          items: [],

          index: 1,
          pageSize: 20,
          count: 1,
          next: null,
          previous: null
        }
      }
    },
    components: {
      'el-tag': Tag,
      'el-row': Row,
      'el-col': Col,
      'el-card': Card,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'el-pagination': Pagination
    },
    created () {
      console.log('options', this.options.headers)
      /* 更改导航菜单 */
      this.$store.commit('setBreadCrumb', {
        text: '商品导入',
        active: true,
        to: {
          name: 'admin:goods:import'
        }
      })
      axios.ImportGoodsSet().then(response => {
        this.pagination.items = response.data.results
        this.pagination.count = response.data.count
        this.pagination.next = response.data.next
        this.pagination.previous = response.data.previous
      })
    },
    mounted: function () {
      // this.$store.state.admin.index.breadcrumbInfo = '商品导入';

    },
    methods: {

      setImportCommand: function (command) {
        if (command.name === '导入') {
          this.importFile(command.data)
        } else if (command.name === '下载') {
          window.open(command.data.row.file, '_blank')
        } else if (command.name === '删除') {
          this.removeFile(command.data)
        }
      },

      Download: function (data) {
        window.open(data.row.file, '_blank')
      },

      /* 同步页码 */
      pagination_news (val) {
        this.pagination.index = val
      },

      /* 分片上传完成
       * 请求POST 组合分片 */
      fileSuccess: function (rootFile, file, message, chunk) {
        let result = JSON.parse(message)
        axios.ImportGoods('PUT', {
          identifier: result.identifier,
          totalChunks: result.totalChunks
        }).then(response => {
          axios.ImportGoodsSet('GET').then(response => {
            this.pagination.items = response.data.results
          })
        })
      },

      /* 文件类型校验 */
      fileAdded: function (file, event) {
        file.ignored = true
        let name = file.file.name
        let suffix = null
        try {
          let flieArr = name.split('.')
          suffix = flieArr[flieArr.length - 1]
        } catch (err) {
          suffix = ''
        }
        if (!suffix) {
          return true
        }
        this.options.type.some(function (item) {
          if (item === suffix) {
            file.ignored = false
          }
        })
      },

      /* 删除文件 */
      removeFile: function (data) {
        const loading = this.$loading({
          lock: true,
          text: '正在删除中，请稍后！',
          spinner: 'el-icon-loading'
        })
        axios.ImportGoodsSet('DELETE', {}, data.row.id).then(response => {
          this.pagination.items.splice(data.$index, 1)
          loading.close()
        }).catch(error => {
          loading.close()
        })
      },

      importFile: function (data) {
        const loading = this.$loading({
          lock: true,
          text: '正在导入中，请稍后！',
          spinner: 'el-icon-loading'
        })

        axios.ImportGoodsSet('PATCH', {
          type: 'import'
        }, data.row.id).then(response => {
          if (response.status === 200) {
            this.pagination.items[data.$index]['status'] = 0
            this.$message({
              showClose: true,
              message: response.data.message,
              type: response.data.status
            })

          } else if (response.status === 415) {
            this.$message({
              showClose: true,
              message: response.data.message,
              type: response.data.status
            })
          }
          loading.close()
        }).catch(error => {
          loading.close()
        })
      }
    },
    computed: {
      /* 商品导入 属性监听 分页 */
      getPagination: function () {
        return this.pagination.index
      }
    },
    watch: {
      /* 商品导入 页面监听 */
      getPagination: function (val, oul) {
        this.loading = true
        axios.ImportGoodsSet('GET', {}, null, this.pagination)
          .then(response => {
            this.pagination.items = response.data.results
            this.pagination.count = response.data.count
            this.pagination.next = response.data.next
            this.pagination.previous = response.data.previous
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>
  >>> .el-checkbox {
    padding-top: 7.5px;
  }

  .uploader-example {
    padding: 0px !important;
    font-size: 12px;
  }

  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .loader-btn {
    display: inline-block;
    position: relative;
    font-size: 100%;
    line-height: 1.4;
    outline: unset;
  }

  >>> .uploader-file {
    border: 1px dashed #ccc;
  }
</style>
