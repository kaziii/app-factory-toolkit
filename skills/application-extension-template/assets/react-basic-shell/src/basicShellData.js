export const basicShellResources = {
  brandLockup: '/basic-shell/brand-lockup.svg',
  userAvatar: '/basic-shell/user-avatar.png',
  humanResources: '/basic-shell/hr-application-logo.png',
  finance: '/basic-shell/application-finance-management.png',
  asset: '/basic-shell/application-asset-management.png',
  contract: '/basic-shell/application-contract-special.png',
  majorDecision: '/basic-shell/application-major-decision.png'
};

const standardPanelItems = [
  { title: '业务事项-01', meta: '流程消息', priority: '优先' },
  { title: '业务事项-02', meta: '系统消息', priority: 'P2' },
  { title: '业务事项-03', meta: '流程消息', priority: 'P3' },
  { title: '业务事项-04', meta: '系统消息', priority: 'P4' }
];

const standardDistribution = [
  { label: '流程类', value: 31 },
  { label: '数据类', value: 19 },
  { label: '系统类', value: 30 }
];

// Replace this object from the user's functional structure document. Keep the
// keys and shell structure; replace only business names, fields, actions, and data.
export const defaultApplicationDefinition = {
  brand: {
    name: '优联信科',
    logoSrc: basicShellResources.brandLockup
  },
  currentUser: {
    name: '林志远',
    role: '集团决策层',
    phone: '19833337777',
    avatarSrc: basicShellResources.userAvatar
  },
  applications: [
    { id: 'finance', name: '业财管理', logoSrc: basicShellResources.finance, summary: '预算、资金、核算和分析' },
    { id: 'asset', name: '资产管理平台', logoSrc: basicShellResources.asset, summary: '资产台账与经营监测' },
    { id: 'contract', name: '合同管控专项', logoSrc: basicShellResources.contract, summary: '合同总览和风险预警' },
    { id: 'hr', name: '人力资源管理', logoSrc: basicShellResources.humanResources, summary: '组织、人事与员工服务' },
    { id: 'mdg', name: '重大决策运行管理', logoSrc: basicShellResources.majorDecision, summary: '议题流转与任务闭环' }
  ],
  application: {
    id: 'hr',
    name: '人力资源管理',
    logoSrc: basicShellResources.humanResources,
    tierLabel: '基础',
    summary: '组织管理、人事管理、招聘管理、薪酬管理、绩效管理、人才发展与干部管理、员工服务',
    settingsTabs: ['基础参数', '合同设置', '账号设置', '工单设置', '整改设置']
  },
  modules: [
    {
      id: 'people',
      label: '人事管理',
      kicker: '组织管理',
      icon: 'building',
      tabs: [
        { id: 'roster', label: '员工档案' },
        { id: 'contract', label: '合同管理' },
        { id: 'onboarding', label: '入职管理' },
        { id: 'transfer', label: '转正管理' },
        { id: 'transfer-2', label: '异动管理' }
      ]
    },
    {
      id: 'recruiting',
      label: '招聘管理',
      kicker: '人才引进',
      icon: 'users',
      tabs: [
        { id: 'openings', label: '招聘岗位' },
        { id: 'candidates', label: '候选人' },
        { id: 'interviews', label: '面试安排' }
      ]
    },
    {
      id: 'payroll',
      label: '薪酬管理',
      kicker: '薪资核算',
      icon: 'wallet',
      tabs: [
        { id: 'payroll-list', label: '薪资档案' },
        { id: 'benefits', label: '福利管理' }
      ]
    }
  ],
  globalPanels: {
    messages: {
      eyebrow: '消息中心',
      title: '消息',
      description: '统一承载业务通知、流程催办、系统提醒与跨应用协同消息',
      status: '持续送达',
      metrics: [
        ['未读消息', '31条', '较昨日 +2'],
        ['流程催办', '14条', '待跟进 2'],
        ['系统通知', '13条', '较昨日 +4'],
        ['送达率', '100%', '待跟进 4']
      ],
      items: standardPanelItems,
      distribution: standardDistribution
    },
    todo: {
      eyebrow: '待办中心',
      title: '待办',
      description: '汇总本人需要处理、抄送、升级和即将到期的事项',
      status: '14项待处理',
      metrics: [
        ['待我处理', '14项', '紧急 2'],
        ['本周到期', '6项', '较昨日 -1'],
        ['已逾期', '1项', '需要跟进'],
        ['完成率', '91%', '较昨日 +3%']
      ],
      items: standardPanelItems,
      distribution: standardDistribution
    },
    dashboard: {
      eyebrow: '运行总览',
      title: '应用运行总览',
      description: '查看业务事项、风险和执行情况的实时汇总',
      status: '运行正常',
      metrics: [
        ['本月事项', '416', '较上期 +9.8%'],
        ['已完成', '362', '完成率 87.0%'],
        ['处理中', '39', '其中紧急 8项'],
        ['异常事项', '15', '风险率 3.6%']
      ],
      items: standardPanelItems,
      distribution: standardDistribution
    },
    risk: {
      eyebrow: '风险预警',
      title: '风险关注',
      description: '展示即将超期、高风险和需要升级处理的业务事项',
      status: '8项风险',
      tone: 'danger',
      metrics: [
        ['紧急', '3项', '今天处理'],
        ['高风险', '5项', '需要升级'],
        ['已逾期', '1项', '已催办'],
        ['已关闭', '27项', '本月累计']
      ],
      items: standardPanelItems,
      distribution: standardDistribution
    }
  },
  page: {
    title: '员工合同',
    updatedAt: '09:32:13',
    createLabel: '新增合同',
    searchPlaceholder: '搜索员工、合同类型、签订方或状态',
    sortOptions: [
      { id: 'default', label: '排序方式' },
      { id: 'name-asc', label: '员工名称 A-Z', key: 'primary', direction: 'asc' },
      { id: 'start-desc', label: '开始日期从新到旧', key: 'start', direction: 'desc' },
      { id: 'end-asc', label: '结束日期从早到晚', key: 'end', direction: 'asc' }
    ],
    metrics: [
      { label: '合同总数', value: '3,126', helper: '当前系统内劳动合同、试用期协议、无固定期限合同总量' },
      { label: '有效合同', value: '2,684', helper: '状态为有效且未到期的合同记录' },
      { label: '即将到期', value: '86', helper: '90天内到期且仍需办理续签或终止的合同' },
      { label: '已到期', value: '31', helper: '到期后未完成续签、终止或归档的合同' },
      { label: '未签署', value: '64', helper: '合同文件已生成但员工或签订方未完成签署' },
      { label: '本月新增', value: '42', helper: '本月新建、导入或由入职流程生成的合同记录' }
    ],
    filters: [
      { key: 'contract-status', label: '合同状态', rowKey: 'status', options: ['有效', '已到期', '已终止', '待续签'] },
      { key: 'sign-status', label: '签署状态', rowKey: 'signStatus', options: ['未签署', '已签署'] },
      { key: 'contract-type', label: '合同类型', rowKey: 'type', options: ['固定期限', '无固定期限', '试用期'] },
      { key: 'signer', label: '签订方', rowKey: 'signer', options: ['华远集团股份有限公司', '华远科技有限公司', '华远建设有限公司'] }
    ],
    columns: [
      { key: 'primary', label: '员工', kind: 'primary' },
      { key: 'type', label: '合同类型', kind: 'status-dot' },
      { key: 'start', label: '开始日期' },
      { key: 'end', label: '结束日期' },
      { key: 'days', label: '剩余天数' },
      { key: 'status', label: '状态', kind: 'status-dot', toneKey: 'statusTone' },
      { key: 'signer', label: '签订方' },
      { key: 'signStatus', label: '签署状态', kind: 'status-dot' }
    ],
    rows: [
      { id: 'HR-001', primary: '李慧敏', secondary: '华远集团股份有限公司', type: '固定期限', start: '2023-07-01', end: '2026-06-30', days: '—', status: '已到期', statusTone: 'green', signer: '华远集团股份有限公司', signStatus: '未签署' },
      { id: 'HR-002', primary: '张国栋', secondary: '华远集团股份有限公司', type: '无固定期限', start: '2015-03-01', end: '无固定期限', days: '—', status: '有效', statusTone: 'green', signer: '华远集团股份有限公司', signStatus: '未签署' },
      { id: 'HR-003', primary: '胡刚', secondary: '华远科技有限公司', type: '固定期限', start: '2024-06-01', end: '2025-05-31', days: '—', status: '已到期', statusTone: 'green', signer: '华远科技有限公司', signStatus: '未签署' },
      { id: 'HR-004', primary: '宋涛', secondary: '华远建设有限公司', type: '固定期限', start: '2021-03-01', end: '2024-11-30', days: '—', status: '已终止', statusTone: 'green', signer: '华远建设有限公司', signStatus: '未签署' },
      { id: 'HR-005', primary: '杨超', secondary: '华远科技有限公司', type: '试用期', start: '2026-04-01', end: '2026-09-30', days: '91天', status: '有效', statusTone: 'green', signer: '华远科技有限公司', signStatus: '未签署' },
      { id: 'HR-006', primary: '刘志远', secondary: '华远科技有限公司', type: '固定期限', start: '2023-09-01', end: '2026-08-31', days: '61天', status: '有效', statusTone: 'green', signer: '华远科技有限公司', signStatus: '未签署' }
    ],
    groups: [
      { id: 'group-1', name: '华远集团股份有限公司', count: '3条', description: '固定期限、无固定期限 · 3条' },
      { id: 'group-2', name: '华远科技有限公司', count: '5条', description: '固定期限、试用期 · 5条' },
      { id: 'group-3', name: '华远建设有限公司', count: '3条', description: '固定期限 · 3条' },
      { id: 'group-4', name: '华远能源有限公司', count: '1条', description: '试用期 · 1条' }
    ],
    boardColumns: [
      { id: 'all', label: '全部记录', color: 'blue', statuses: [] },
      { id: 'expired', label: '已到期', color: 'green', statuses: ['已到期'] },
      { id: 'active', label: '有效', color: 'cyan', statuses: ['有效'] },
      { id: 'terminated', label: '已终止', color: 'amber', statuses: ['已终止'] },
      { id: 'pending', label: '待续签', color: 'red', statuses: ['待续签'] }
    ],
    formFields: [
      { id: 'employeeName', label: '员工姓名', type: 'text' },
      { id: 'position', label: '入职岗位', type: 'text' },
      { id: 'company', label: '入职单位', type: 'text' },
      { id: 'department', label: '入职部门', type: 'text' },
      { id: 'note', label: '办理说明', type: 'textarea', placeholder: '记录本次模拟操作的办理意见', full: true }
    ],
    detail: {
      tabs: [
        { id: 'basic', label: '基本信息' },
        { id: 'business', label: '业务详情' },
        { id: 'materials', label: '材料清单' },
        { id: 'process', label: '办理记录' },
        { id: 'logs', label: '操作日志' }
      ],
      facts: [
        { label: '当前状态', rowKey: 'status', helper: '合同管理' },
        { label: '所属单位', rowKey: 'secondary', helper: '人力资源部' },
        { label: '最近更新', value: '2026-07-03', helper: '源业务台账' },
        { label: '材料状态', value: '80%', helper: '过程留痕' }
      ],
      infoFields: [
        { label: '员工姓名', rowKey: 'primary' }, { label: '入职岗位', value: '人力专员' }, { label: '入职单位', rowKey: 'secondary' },
        { label: '入职部门', value: '人力资源部' }, { label: '预计入职日', value: '2026-07-03' }, { label: '事项完成', value: '80%' },
        { label: '合同签订', rowKey: 'signStatus' }, { label: '账号开通', value: '未开通' }, { label: '当前节点', value: '合同签订' }
      ],
      sections: [
        {
          title: '入职管理详情',
          panels: [
            { title: '入职办理', items: [{ label: '入职批次', value: '2026年6月第4批', progress: 100 }, { label: '拟入职日期', value: '2026-07-03', progress: 72 }, { label: '岗位部门', value: '人力资源部 / 人力专员', progress: 55 }] },
            { title: '后续安排', items: [{ label: '试用期起算', value: '入职生效后自动生成试用期记录' }, { label: '培训安排', value: '系统自动加入新员工入职培训' }, { label: '档案归档', value: '资料齐全后写入员工主档案' }] }
          ]
        }
      ],
      tabContent: {
        materials: { sections: [{ title: '材料清单', panels: [{ title: '合同材料', items: [{ label: '劳动合同', value: '已上传' }, { label: '签署回执', value: '待补充' }] }, { title: '员工材料', items: [{ label: '身份证明', value: '已核验' }, { label: '入职登记', value: '已归档' }] }] }] },
        process: { sections: [{ title: '办理记录', panels: [{ title: '当前流程', items: [{ label: '合同生成', value: '2026-07-03 已完成', progress: 100 }, { label: '员工签署', value: '等待签署', progress: 62 }] }, { title: '后续节点', items: [{ label: '公司盖章', value: '员工签署后触发' }, { label: '合同归档', value: '双方签署后自动归档' }] }] }] },
        logs: { sections: [{ title: '操作日志', panels: [{ title: '最近操作', items: [{ label: '创建记录', value: '林志远 · 2026-07-03 09:12' }, { label: '更新材料', value: '系统 · 2026-07-03 10:24' }] }] }] }
      }
    }
  },
  // Add one complete or partial page object for every business tab. Values here
  // overlay `page`, so a short functional document only needs to state what differs.
  pagesByTab: {
    roster: { title: '员工档案', createLabel: '新增员工' },
    contract: { title: '员工合同', createLabel: '新增合同' },
    onboarding: { title: '入职管理', createLabel: '发起入职' }
  }
};
