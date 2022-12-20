export const data = [
  {
    id: 0,
    stage: '项目阶段',
    milestone: '里程碑名称',
    description: '内容描述',
    finishDate: '完成日期',
    status: '当前状态',
    evaluation: '正常',
    progress: '80%',
    level: 1
  },
  {
    id: 1,
    stage: '预研立项',
    milestone: '立项完成',
    description: 'xxx',
    finishDate: '2022-09-30',
    status: '未开始',
    evaluation: '正常',
    progress: '80%',
    level: 1
  },
  {
    id: 2,
    stage: '项目方案',
    milestone: '方案评审完成',
    description: 'xxx',
    finishDate: '2022-10-31',
    status: '未开始',
    evaluation: 'XXX',
    progress: '0%',
    level: 1,
    children: [
      {
        id: 21,
        name: '需求调研',
        startTime: '2022-10-01',
        endTime: '2022-10-15',
        principal: '张三',
        initiator: 'XXX',
        status: '进行中',
        workTime: 'xxx',
        file: 'xxx',
        level: 2,
        parent: '11'
      },
      {
        id: 22,
        name: '方案编制',
        startTime: '2022-10-16',
        endTime: '2022-10-28',
        principal: '李四',
        initiator: 'XXX',
        status: '未开始',
        workTime: 'xxx',
        file: 'xxx',
        level: 2,
        children: [
          {
            id: 221,
            taskName: '完成方案初稿',
            startTime: '2022-10-16',
            endTime: '2022-10-20',
            principal: 'xxx',
            initiator: 'XXX',
            status: 'xxx',
            description: 'xxx',
            workTime: 'xx',
            file: '333',
            level: 3
          },
          {
            id: 222,
            taskName: '方案编制完成',
            startTime: '2022-10-21',
            endTime: '2022-10-28',
            principal: 'xxx',
            initiator: 'XXX',
            status: 'xxx',
            description: 'xxx',
            workTime: 'xx',
            file: '333',
            level: 3
          }
        ]
      },
    ]
  }
]