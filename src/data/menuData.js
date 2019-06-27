const menus = [
    { id: '0', label: '首页', path: 'home', icon: 'fa fa-dashboard' },
    { id: '1', label: '用户管理', path: 'users', icon: 'fa fa-users' },
    { id: '2', label: '权限管理', path: 'roles', icon: 'fa fa-square' },
    { id: '3', label: '资源管理', path: 'menus', icon: 'fa fa-bars' },
    {
        id: '4',
        icon: 'fa fa-circle-o',
        label: '报表管理',
        submenu: [
            { id: 'tplmg', name: 'tplmg', label: '模板管理', icon: 'fa fa-info' },
            { id: 'tplcheck', name: 'tplcheck', label: '报表查看', icon: 'fa fa-info' },
            { id: 'tplsum', name: 'tplsum', label: '报表汇总', icon: 'fa fa-info' }
        ]
    },
    { id: '5', label: '模块管理', path: 'modules', icon: 'fa fa-bars' },
    { id: 'dept', label: '部门管理', path: 'dept', icon: 'fa fa-bars' },
    { id: 'setting', label: '设置', path: 'setting', icon: 'fa fa-bars' },
    { id: 'port', label: '端口扫描', path: 'port', icon: 'fa fa-bars' },
]
export {
    menus
}