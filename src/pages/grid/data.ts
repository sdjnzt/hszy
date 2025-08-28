// JSDoc
/**
 * 提供网格管理相关的模拟数据获取方法
 */
export interface GridUnit {
  id: string;
  name: string;
  code: string;
  area: number;
  population: number;
  households: number;
  buildings: number;
  manager: string;
  managerPhone: string;
  status: 'active' | 'inactive' | 'maintenance';
  description: string;
  coordinates: [number, number];
  createdAt: string;
}

export interface GridPerson {
  id: string;
  name: string;
  gridId: string;
  gridName: string;
  type: 'resident' | 'worker' | 'visitor' | 'manager';
  phone: string;
  address: string;
  status: 'normal' | 'warning' | 'alert';
  lastUpdate: string;
}

export interface GridEvent {
  id: string;
  title: string;
  gridId: string;
  gridName: string;
  type: 'safety' | 'environment' | 'facility' | 'service' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  reporter: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface GridOrganization {
  id: string;
  name: string;
  gridId: string;
  gridName: string;
  type: 'property' | 'security' | 'medical' | 'education' | 'commercial';
  contact: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  description: string;
}

export const getGridUnits = (): GridUnit[] => [
  { id: 'grid1', name: 'A区网格', code: 'GRID-A-001', area: 25000, population: 856, households: 268, buildings: 12, manager: '张网格员', managerPhone: '13800138001', status: 'active', description: 'A区住宅网格，包含12栋高层住宅', coordinates: [116.586, 35.415], createdAt: '2025-08-01' },
  { id: 'grid2', name: 'B区网格', code: 'GRID-B-001', area: 22000, population: 742, households: 234, buildings: 10, manager: '李网格员', managerPhone: '13800138002', status: 'active', description: 'B区花园洋房网格，绿化率高', coordinates: [116.588, 35.417], createdAt: '2025-08-01' },
  { id: 'grid3', name: '商业区网格', code: 'GRID-C-001', area: 15000, population: 0, households: 0, buildings: 8, manager: '王网格员', managerPhone: '13800138003', status: 'active', description: '商业配套网格，包含超市、餐饮等', coordinates: [116.586, 35.418], createdAt: '2025-08-01' },
  { id: 'grid4', name: '公共设施网格', code: 'GRID-D-001', area: 18000, population: 0, households: 0, buildings: 3, manager: '赵网格员', managerPhone: '13800138004', status: 'active', description: '公共设施网格，包含健身中心、医院等', coordinates: [116.585, 35.417], createdAt: '2025-08-01' },
  { id: 'grid5', name: 'C区网格', code: 'GRID-C-002', area: 20000, population: 693, households: 210, buildings: 9, manager: '钱网格员', managerPhone: '13800138005', status: 'active', description: 'C区改善型住宅为主，配套完善', coordinates: [116.589, 35.416], createdAt: '2025-08-05' },
  { id: 'grid6', name: 'D区网格', code: 'GRID-D-002', area: 17500, population: 512, households: 162, buildings: 7, manager: '孙网格员', managerPhone: '13800138006', status: 'active', description: 'D区刚需住宅，社区活力较强', coordinates: [116.584, 35.416], createdAt: '2025-08-06' },
  { id: 'grid7', name: '学校配套网格', code: 'GRID-E-001', area: 9000, population: 0, households: 0, buildings: 5, manager: '周网格员', managerPhone: '13800138007', status: 'active', description: '覆盖学校及周边配套，重点关照上放学高峰', coordinates: [116.587, 35.419], createdAt: '2025-08-08' },
  { id: 'grid8', name: '景观绿地网格', code: 'GRID-F-001', area: 12000, population: 0, households: 0, buildings: 2, manager: '吴网格员', managerPhone: '13800138008', status: 'active', description: '覆盖中心景观绿地与慢行系统', coordinates: [116.585, 35.414], createdAt: '2025-08-10' }
];

export const getGridPersons = (): GridPerson[] => [
  { id: 'p1', name: '张三', gridId: 'grid1', gridName: 'A区网格', type: 'resident', phone: '13900139001', address: 'A区1号楼101室', status: 'normal', lastUpdate: '2025-08-15' },
  { id: 'p2', name: '李明', gridId: 'grid1', gridName: 'A区网格', type: 'resident', phone: '13900139002', address: 'A区2号楼202室', status: 'normal', lastUpdate: '2025-08-15' },
  { id: 'p3', name: '王五', gridId: 'grid2', gridName: 'B区网格', type: 'resident', phone: '13900139003', address: 'B区1号楼101室', status: 'warning', lastUpdate: '2025-08-15' },
  { id: 'p4', name: '赵六', gridId: 'grid2', gridName: 'B区网格', type: 'resident', phone: '13900139004', address: 'B区2号楼302室', status: 'normal', lastUpdate: '2025-08-15' },
  { id: 'p5', name: '刘备', gridId: 'grid3', gridName: '商业区网格', type: 'worker', phone: '13900139005', address: '商业街A段-物业管理处', status: 'normal', lastUpdate: '2025-08-15' },
  { id: 'p6', name: '关羽', gridId: 'grid3', gridName: '商业区网格', type: 'worker', phone: '13900139006', address: '商业街B段-安保岗亭', status: 'normal', lastUpdate: '2025-08-15' },
  { id: 'p7', name: '张飞', gridId: 'grid4', gridName: '公共设施网格', type: 'worker', phone: '13900139007', address: '社区医院后勤', status: 'normal', lastUpdate: '2025-08-15' },
  { id: 'p8', name: '小明', gridId: 'grid5', gridName: 'C区网格', type: 'resident', phone: '13900139008', address: 'C区3号楼1101室', status: 'normal', lastUpdate: '2025-08-15' },
  { id: 'p9', name: '小红', gridId: 'grid6', gridName: 'D区网格', type: 'resident', phone: '13900139009', address: 'D区2号楼902室', status: 'warning', lastUpdate: '2025-08-15' },
  { id: 'p10', name: '巡逻员-甲', gridId: 'grid7', gridName: '学校配套网格', type: 'worker', phone: '13900139010', address: '学校东门巡逻点', status: 'normal', lastUpdate: '2025-08-15' }
];

export const getGridEvents = (): GridEvent[] => [
  { id: 'e1', title: '电梯故障', gridId: 'grid1', gridName: 'A区网格', type: 'facility', priority: 'high', status: 'processing', reporter: '张三', assignee: '维修部', createdAt: '2025-08-15 10:00', updatedAt: '2025-08-15 14:00', description: 'A区1号楼电梯故障，需要维修' },
  { id: 'e2', title: '垃圾箱满溢', gridId: 'grid2', gridName: 'B区网格', type: 'environment', priority: 'medium', status: 'completed', reporter: '李明', assignee: '保洁部', createdAt: '2025-08-15 08:00', updatedAt: '2025-08-15 09:00', description: 'B区垃圾箱满溢，已清理' },
  { id: 'e3', title: '路灯故障', gridId: 'grid6', gridName: 'D区网格', type: 'facility', priority: 'low', status: 'pending', reporter: '居民-赵', assignee: '工程部', createdAt: '2025-08-15 07:30', updatedAt: '2025-08-15 07:30', description: 'D区主路一盏路灯不亮' },
  { id: 'e4', title: '商铺噪音扰民', gridId: 'grid3', gridName: '商业区网格', type: 'service', priority: 'medium', status: 'processing', reporter: '居民-钱', assignee: '综治办', createdAt: '2025-08-15 22:10', updatedAt: '2025-08-15 22:40', description: '夜间商铺外摆播放音乐过大' },
  { id: 'e5', title: '地库渗水', gridId: 'grid5', gridName: 'C区网格', type: 'facility', priority: 'high', status: 'processing', reporter: '保安-孙', assignee: '工程部', createdAt: '2025-08-15 06:10', updatedAt: '2025-08-15 06:40', description: 'C区地库局部渗水需排查' },
  { id: 'e6', title: '绿地垃圾', gridId: 'grid8', gridName: '景观绿地网格', type: 'environment', priority: 'low', status: 'completed', reporter: '管理员', assignee: '保洁部', createdAt: '2025-08-14 18:30', updatedAt: '2025-08-14 19:00', description: '绿地角落有少量垃圾，已清理' }
];

export const getGridOrganizations = (): GridOrganization[] => [
  { id: 'org1', name: '物业服务中心', gridId: 'grid1', gridName: 'A区网格', type: 'property', contact: '物业经理', phone: '0537-8888888', address: 'A区物业办公室', status: 'active', description: 'A区物业服务管理' },
  { id: 'org2', name: '社区医院', gridId: 'grid4', gridName: '公共设施网格', type: 'medical', contact: '医院主任', phone: '0537-9999999', address: '社区医院', status: 'active', description: '社区医疗服务' },
  { id: 'org3', name: '社区综治办', gridId: 'grid3', gridName: '商业区网格', type: 'commercial', contact: '综治办主任', phone: '0537-6666666', address: '商业街管理处', status: 'active', description: '商业区综合治理协调' },
  { id: 'org4', name: '社区学校', gridId: 'grid7', gridName: '学校配套网格', type: 'education', contact: '校办主任', phone: '0537-7777777', address: '社区学校', status: 'active', description: '学校教育与社区联动' },
  { id: 'org5', name: '社区安保队', gridId: 'grid2', gridName: 'B区网格', type: 'security', contact: '安保队长', phone: '0537-5555555', address: 'B区安保岗亭', status: 'active', description: '社区治安与夜间巡逻' }
];


