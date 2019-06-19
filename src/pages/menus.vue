<template>
  <div>
    <el-row style="padding: 20px">
      <el-input size="small" style="width: 30%" placeholder="搜索" clearable prefix-icon="el-icon-search" v-model.trim="filterText"></el-input>
    </el-row>
    <el-tree style="padding-left: 20px" :default-expanded-keys="['1']" :indent="30" :props="defaultProps" ref="menu" :filter-node-method="filterNode"
             :expand-on-click-node="false" :data="menu" node-key="id" @node-drag-start="handleDragStart"
             @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver"
             @node-drag-end="handleDragEnd" @node-drop="handleDrop" draggable :allow-drop="allowDrop"
             :allow-drag="allowDrag">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="tree-icon"><i :class="data.icon"></i>{{ data.menuName }}</span>
        <span class="tree-buttons" v-if="node.data.parentId!=='-1'">
          <el-button type="text" size="mini" @click="showEdit('edit',data)">
            修改
          </el-button>
          <el-button type="text" size="mini" @click="showEdit('add',data)">
            新增
          </el-button>
          <el-button type="text" :disabled="data.isRouted === '1'" size="mini" @click="showDelete(node,data)">
            删除
          </el-button>
        </span>
        <span class="tree-buttons" v-else>
          <el-button type="text" size="mini" disabled>
            修改
          </el-button>
          <el-button type="text" size="mini" @click="showEdit('add',data)">
            新增
          </el-button>
          <el-button type="text" size="mini" disabled>
            删除
          </el-button>
          </span>
        </span>
    </el-tree>
    <!--修改新增弹窗-->
    <el-dialog :visible.sync="editModal" width="480px" @close="closeEdit" :close-on-click-modal="false">
      <div style="font-size: 18px;color: #333333;font-weight: bold;padding: 0 15px">{{editItem.id?'修改':'新增'}}</div>
      <el-form ref="menuForm" :model="editItem" :rules="rules" label-width="100px" style="padding: 10px 20px 10px 0">
        <el-form-item label="路径" prop="url">
          <el-input size="small" maxlength="30" :disabled="editItem.isRouted&&editItem.isRouted==='1'" v-model.trim="editItem.url" placeholder="请输入路径"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="menuName">
          <el-input size="small" maxlength="16" v-model.trim="editItem.menuName" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-radio-group v-model="editItem.icon" style="padding-left: 10px">
            <el-radio label="el-icon-edit-outline"><i class="el-icon-edit-outline"></i></el-radio>
            <el-radio label="el-icon-message"><i class="el-icon-message"></i></el-radio>
            <el-radio label="el-icon-tickets"><i class="el-icon-tickets"></i></el-radio>
            <el-radio label="el-icon-setting"><i class="el-icon-setting"></i></el-radio>
            <!--<div style="margin: 5px"></div>-->
            <!--<el-radio v-model="iconElse">其他</el-radio>-->
            <!--<el-input v-model="iconElse" style="padding:0 10px;width: 200px"-->
            <!--size="mini" placeholder="请输入icon类名，例：el-icon-tp-edit"/>-->
            <!--<el-button size="mini">
            <a target="_blank" href="../assets/icon/demo_fontclass.html">更多...</a>
            </el-button>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否展开" prop="expanded">
          <el-radio-group  v-model="editItem.expanded" style="padding-left: 10px">
            <el-radio label="1" size="medium">是</el-radio>
            <el-radio label="0" size="medium">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="isHidden">
          <el-radio-group v-model="editItem.isHidden" style="padding-left: 10px">
            <el-radio label="1" size="medium">是</el-radio>
            <el-radio label="0" size="medium">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否是路由" prop="isRouted">
          <el-radio-group v-model="editItem.isRouted" style="padding-left: 10px">
            <el-radio label="1" size="medium">是</el-radio>
            <el-radio label="0" size="medium">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="text-align: center">
          <el-button @click="closeEdit">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </div>
      </el-form>

    </el-dialog>
    <!--确认弹出框-->
    <el-dialog :visible.sync="deleteModal" @closed="closeDelete" center top="150px" width="400px">
      <h1 style="text-align: center;margin-bottom:20px;font-size: 18px">
        确认删除:{{deleteItem?deleteItem.item.menuName:''}}？</h1>
      <el-row style="text-align: center;" class="removeBtn">
        <el-button @click="closeDelete">取消</el-button>
        <el-button @click="confirmDelete" type="danger">删除</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  //import {arrDeepCopy} from "../common/js/utils";

  export default {
    name: "Resources",
    data() {
      return {
        filterText:'',
        menu: [],
        defaultProps: {
          children: 'children',
          label: 'menuName'
        },
        icon: '',
        iconElse: '',
        isExpended: 1,
        editModal: false,
        deleteModal: false,
        deleteItem: '',
        editItem: {},
        editWay: '',
        rules: {
          url: [
            {required: true, message: '请输入路径', trigger: 'blur'},
            {pattern: /^[\/a-zA-Z]+[a-zA-Z]+$/, message: '路径格式错误', trigger: 'blur'},
          ],
          menuName: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {pattern:/^\S+$/, message: '标题必须为非空字符串', trigger: 'blur'},
          ],
          icon: [
            {required: true,message:'请选择图标',trigger:'blur'}
          ],
          expanded: [
            {required: true}
          ],
          isHidden: [
            {required: true}
          ],
          isRouted: [
            {required: true}
          ]
        },
      };
    },
    watch:{
      filterText(val) {
        this.$refs.menu.filter(val);
      }
    },
    mounted() {
      //this.getMenuList();
    },
    methods: {
      //调出编辑框
      showEdit(way, item) {
        this.editModal = true;
        if (way === 'edit') {
          this.editItem = arrDeepCopy(item);
        } else {
          this.editItem = {
            icon: '',
            id: '',
            menuName: '',
            url: '',
            parentId: item.id,
            expanded: '1',
            isHidden: '0',
            isRouted:'0'
          }
        }
        this.editWay = way;
        console.log(this.editItem)
      },
      showDelete(node, item) {
        console.log(node, item);
        this.deleteModal = true;
        this.deleteItem = {node, item};
      },
      closeEdit() {
        this.editModal = false;
        this.$refs.menuForm.clearValidate();
      },
      closeDelete() {
        this.deleteModal = false;
      },
      saveEdit() {
        this.$refs.menuForm.validate((valid) => {
          if(valid){
            console.log(this.editItem);
            let data = this.editItem;
            console.log('data', data);
            // let param = {
            //   icon: data.icon, id: data.id, expanded: data.expanded, menuName: data.menuName, url: data.url,
            //   parentId: data.parentId, isHidden: data.isHidden
            // };
            if (this.editWay === 'add') {
              this.$api.post('/sysmenu/save', data, success => {
                this.$message.success(success);
                console.log(success);
                this.getMenuList();
                this.initData();
              }, fal => {
                this.$message.error(fal)
              });
            } else {
              this.$api.post('/sysmenu/update', data, success => {
                this.$message.success(success);
                console.log(success);
                this.getMenuList();
                this.initData();
              }, fal => {
                this.$message.error(fal)
              });
            }
            this.closeEdit();
          }else {
            return false;
          }
        })
      },
      confirmDelete() {
        let param = this.deleteItem;
        console.log('param', param);
        this.$api.get('/sysmenu/del', {menuId: param.item.id}, success => {
          this.$message.success(success);
          console.log(success);
          this.initData();
          this.getMenuList()
        }, fal => {
          this.$message.error(fal)
        });
        this.closeDelete();
      },
      getMenuList() {
        this.$api.get('/sysmenu/all', {isNeedRoot:true}, success => {
          console.log('menu', success);
          this.menu = success;
        }, fal => {
          this.$message.error(fal)
        })
      },
      initData() {
        this.editItem = {};
        this.deleteItem = '';
      },
      verifyPath(){
        if(this.editItem.url&&new RegExp(/[^a-z]/g).test(this.editItem.url)){
          this.$message.error('请输入英文字母');
          this.editItem.url=this.editItem.url.replace(/[^a-z]/gi,'')
        }
      },
      //树状图拖拽事件
      handleDragStart(node, ev) {
        console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        // console.log('tree drag enter: ', dropNode);
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        // console.log('tree drag leave: ', dropNode);
      },
      handleDragOver(draggingNode, dropNode, ev) {
        // console.log('tree drag over: ', dropNode);
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        // console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        // console.log(this.menu);
        // console.log('tree drop: ', draggingNode.data.title, dropNode.data.title, dropType);
        // console.log('tree drop: ', draggingNode, dropNode);
        // console.log(dropNode.parent.childNodes);
        let nodesData = dropNode.parent.childNodes;
        let param = [];
        nodesData.forEach((item, index) => {
          console.log();
          param.push({id: item.data.id,menuName: item.data.menuName,sort: index})
        });
        this.$api.post('sysmenu/updateSort', param, success => {
          this.$message.success(success);
          this.getMenuList();
        }, fal => {
          this.$message.error(fal);
          this.getMenuList();
        })
      },
      allowDrop(draggingNode, dropNode, type) {
        // console.log('allowDrop: ', dropNode, type);
        if (dropNode.key === 'menu' || dropNode.key === 'index' || draggingNode.level !== dropNode.level) {
          return false;
        } else if (type === 'inner') {
          return false
        } else {
          return true
        }
      },
      allowDrag(draggingNode) {
        if (draggingNode.key === 'menu' || draggingNode.key === 'index') {
          return false
        } else {
          return true
        }
      },
      filterNode(value, data, node) {
        // console.log('filter', value, data, node)
        // console.log('filter', value, data.menuName, node.parent.data.menuName)
        if (!value) return true;
        return data.menuName.indexOf(value) !== -1 || (data.parentId !== '-1' && node.parent.data.menuName.indexOf(value) !== -1);
      }
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tree-icon i {
    display: inline-block;
    margin-right: 10px;
  }

  .tree-buttons {
    margin-right: 30vw;
  }

  .input-row {
    display: flex;
    white-space: nowrap;
    align-items: center;
    margin: 20px 0;
    align-content: center;
  }

  .icon-padding {
    vertical-align: middle;
    padding: 0 5px;
    color: red;
  }
</style>
