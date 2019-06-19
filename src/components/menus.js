const menus = [
  {id: '0', label: '控制面板', path: '/', icon: 'fa fa-dashboard'},
  {id: 'user', label: '用户管理', path: '/users', icon: 'fa fa-users'},
  {id: 'role', label: '角色管理', path: '/roles', icon: 'fa fa-square'},
  {id: 'menu', label: '菜单管理', path: '/menus', icon: 'fa fa-bars'},
  {
    id: 'reportmg',
    icon: 'fa fa-circle-o',
    label: '报表管理',
    submenu: [
      {id: 'tplmg', name: 'tplmg', label: '模板管理', icon: 'fa fa-info'},
      {id: 'tplcheck', name: 'tplcheck', label: '报表查看', icon: 'fa fa-info'},
      {id: 'tplsum', name: 'tplsum', label: '报表汇总', icon: 'fa fa-info'}
    ]
  },
  {
    id: 'components',
    icon: 'fa fa-microchip',
    label: '组件',
    submenu: [
      {
        id: 'test',
        label: '二级测试',
        icon: 'fa fa-hand-o-up',
        submenu: [
          {
            id: 'test',
            label: '二级测试',
            icon: 'fa fa-hand-o-up'
          }
        ]
      }
    ]
  }
]
export default menus
