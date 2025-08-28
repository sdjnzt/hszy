import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Space,
  Button,
  Badge,
  Statistic,
  message,
  Table,
  Modal,
  Form,
  Tag,
  Avatar,
  Descriptions
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { getGridPersons, GridPerson } from './data';

const { Title } = Typography;
const { Search } = Input;

/**
 * 伪随机数（可复现）
 */
const createSeededRandom = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    // xorshift32
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    // 转为 [0,1)
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
};

/**
 * 加权姓氏库（含少量复姓，低权重），粗略贴合国内姓氏分布
 */
const SURNAME_WEIGHTED: Array<{ n: string; w: number }> = [
  { n: '王', w: 8 }, { n: '李', w: 8 }, { n: '张', w: 7 }, { n: '刘', w: 6 }, { n: '陈', w: 5 },
  { n: '杨', w: 4 }, { n: '黄', w: 3 }, { n: '赵', w: 3 }, { n: '周', w: 3 }, { n: '吴', w: 3 },
  { n: '徐', w: 2 }, { n: '孙', w: 2 }, { n: '胡', w: 2 }, { n: '朱', w: 2 }, { n: '高', w: 2 },
  { n: '林', w: 2 }, { n: '何', w: 2 }, { n: '郭', w: 2 }, { n: '马', w: 2 }, { n: '罗', w: 2 },
  // 复姓（低权重）
  { n: '欧阳', w: 1 }, { n: '司马', w: 1 }, { n: '上官', w: 1 }, { n: '刘', w: 1 }, { n: '王', w: 1 }
];
const SURNAME_TOTAL = SURNAME_WEIGHTED.reduce((s, it) => s + it.w, 0);

/**
 * 名字常用字库（男女混合，避免极端生僻字）
 */
const GIVEN_NAME_CHARS = (
  '伟强磊勇军杰涛超明刚峰雷飞晨辉宇凡凯瑞博梓阳晨轩泽浩洋鑫磊' +
  '芳娜静丽娟艳婷雪欣梅慧倩丹琳霞洁璐宁雅露琪怡彤悦萌涵莹钰' +
  '国志新中海胜建兵健辉利志豪成鑫航鑫鹏泽林然昊霖浩然子豪子涵'
).split('');

/**
 * 生成贴近真实分布的中文姓名：
 * - 姓氏按加权概率选择（含少量复姓）
 * - 名字长度：两字约70%，一字约20%，三字约10%
 */
const createNameGenerator = (seed = 2025) => {
  const rnd = createSeededRandom(seed);
  const pickSurname = () => {
    let r = rnd() * SURNAME_TOTAL;
    for (const item of SURNAME_WEIGHTED) {
      if ((r -= item.w) <= 0) return item.n;
    }
    return SURNAME_WEIGHTED[SURNAME_WEIGHTED.length - 1].n;
  };
  const pickGiven = () => GIVEN_NAME_CHARS[Math.floor(rnd() * GIVEN_NAME_CHARS.length)];
  return () => {
    const surname = pickSurname();
    const p = rnd();
    const len = p < 0.7 ? 2 : p < 0.9 ? 1 : 3;
    let given = '';
    for (let i = 0; i < len; i++) {
      let c = pickGiven();
      // 避免同字连写几率过高
      if (i > 0 && c === given[i - 1]) c = pickGiven();
      given += c;
    }
    return surname + given;
  };
};

const genName = createNameGenerator();

/**
 * 网格-人员管理（表格+CRUD）
 * - 表格列表：排序、过滤、分页、选择
 * - 搜索筛选：关键字、类型、状态
 * - CRUD：查看详情、添加、编辑、删除（本地模拟）
 * - 批量删除与导出筛选结果
 */
const PersonsPage: React.FC = () => {
  const [persons, setPersons] = useState<GridPerson[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | GridPerson['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | GridPerson['status']>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewing, setViewing] = useState<GridPerson | null>(null);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingPerson, setEditingPerson] = useState<GridPerson | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  /** 手机号脱敏展示 */
  const maskPhone = (phone?: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  /** 常见中国大陆手机号段 */
  const MOBILE_PREFIXES = ['130','131','132','133','134','135','136','137','138','139','150','151','152','153','155','156','157','158','159','166','171','172','173','175','176','177','178','180','181','182','183','185','186','187','188','189','198','199'];
  const generateMobile = (rand: () => number, index: number): string => {
    const prefix = MOBILE_PREFIXES[Math.floor(rand() * MOBILE_PREFIXES.length)];
    // 8位尾号，避免简单顺序：混合索引与随机数
    const tailNum = Math.floor((rand() * 1e8 + (index * 9301 + 49297) % 1e8)) % 1e8;
    const tail = String(tailNum).padStart(8, '0');
    return `${prefix}${tail}`;
  };

  useEffect(() => {
    const base = getGridPersons();
    // 生成更大规模的人口数据，姓名使用生成器，稳定且更接近真实分布
    const grids = Array.from(new Set(base.map(b => b.gridName)));
    const target = 1352; // 社区总人数：1352
    const rnd = createSeededRandom(2026);
    const today = new Date().toISOString().slice(0, 10);
    const result: GridPerson[] = [];
    for (let i = 0; i < target; i++) {
      const sample = base[i % base.length];
      const name = genName();
      // 内联生成手机号，避免依赖警告
      const MOBILE_PREFIXES_LOCAL = ['130','131','132','133','134','135','136','137','138','139','150','151','152','153','155','156','157','158','159','166','171','172','173','175','176','177','178','180','181','182','183','185','186','187','188','189','198','199'];
      const prefix = MOBILE_PREFIXES_LOCAL[Math.floor(rnd() * MOBILE_PREFIXES_LOCAL.length)];
      const tailNum = Math.floor((rnd() * 1e8 + (i * 9301 + 49297) % 1e8)) % 1e8;
      const phone = `${prefix}${String(tailNum).padStart(8, '0')}`;
      // 类型分布：居民≈82%，工作人员≈12%，访客≈5%，管理员≈1%
      const rt = rnd();
      const type: GridPerson['type'] = rt < 0.82 ? 'resident' : rt < 0.94 ? 'worker' : rt < 0.99 ? 'visitor' : 'manager';
      // 状态分布：正常≈94%，警告≈4.5%，警报≈1.5%
      const rs = rnd();
      const status: GridPerson['status'] = rs < 0.94 ? 'normal' : rs < 0.985 ? 'warning' : 'alert';
      result.push({
        id: `${sample.id}_${i}`,
        name,
        gridId: sample.gridId,
        gridName: grids[i % grids.length] || sample.gridName,
        type,
        phone,
        address: `${grids[i % grids.length] || sample.gridName}${(i % 6) + 1}号楼${(i % 18) + 101}室`,
        status,
        lastUpdate: today
      });
    }
    setPersons(result);
  }, []);

  // 去抖
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // 过滤
  const filteredPersons = useMemo(() => {
    const keyword = debouncedSearch;
    return persons.filter(p =>
      (keyword === '' || p.name.includes(keyword) || p.phone.includes(keyword) || p.address.includes(keyword) || p.gridName.includes(keyword)) &&
      (typeFilter === 'all' || p.type === typeFilter) &&
      (statusFilter === 'all' || p.status === statusFilter)
    );
  }, [persons, debouncedSearch, typeFilter, statusFilter]);

  // 统计
  const stats = useMemo(() => {
    const total = persons.length;
    const byType = {
      resident: persons.filter(p => p.type === 'resident').length,
      worker: persons.filter(p => p.type === 'worker').length,
      visitor: persons.filter(p => p.type === 'visitor').length,
      manager: persons.filter(p => p.type === 'manager').length,
    };
    const warnings = persons.filter(p => p.status !== 'normal').length;
    return { total, byType, warnings };
  }, [persons]);

  // 导出（导出脱敏电话）
  const handleExport = () => {
    const header = ['姓名', '网格', '类型', '电话', '地址', '状态'];
    const rows = filteredPersons.map(p => [
      p.name,
      p.gridName,
      p.type === 'resident' ? '居民' : p.type === 'worker' ? '工作人员' : p.type === 'visitor' ? '访客' : '管理员',
      maskPhone(p.phone),
      p.address,
      p.status === 'normal' ? '正常' : p.status === 'warning' ? '警告' : '警报'
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '网格人员列表.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('已导出当前筛选结果');
  };

  // 新增
  const onAdd = async () => {
    try {
      const values = await addForm.validateFields();
      const today = new Date().toISOString().slice(0, 10);
      const newItem: GridPerson = {
        id: 'p_' + Date.now(),
        name: values.name,
        gridId: 'grid_' + Math.random().toString(36).slice(2, 6),
        gridName: values.gridName,
        type: values.type,
        phone: values.phone,
        address: values.address,
        status: values.status,
        lastUpdate: today
      };
      setPersons(prev => [newItem, ...prev]);
      setAddVisible(false);
      addForm.resetFields();
      message.success('新增成功');
    } catch (e) {
      message.error('请完善信息');
    }
  };

  // 编辑
  const onEdit = async () => {
    if (!editingPerson) return;
    try {
      const values = await editForm.validateFields();
      const today = new Date().toISOString().slice(0, 10);
      setPersons(prev => prev.map(p => p.id === editingPerson.id ? {
        ...p,
        name: values.name,
        gridName: values.gridName,
        type: values.type,
        phone: values.phone,
        address: values.address,
        status: values.status,
        lastUpdate: today
      } : p));
      setEditVisible(false);
      setEditingPerson(null);
      message.success('保存成功');
    } catch (e) {
      message.error('请完善信息');
    }
  };

  // 删除
  const onDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除该人员？',
      icon: <DeleteOutlined />,
      okType: 'danger',
      onOk: () => {
        setPersons(prev => prev.filter(p => p.id !== id));
        message.success('已删除');
      }
    });
  };

  // 批量删除
  const onBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择记录');
      return;
    }
    Modal.confirm({
      title: `确认删除选中的 ${selectedRowKeys.length} 条记录？`,
      icon: <DeleteOutlined />,
      okType: 'danger',
      onOk: () => {
        setPersons(prev => prev.filter(p => !selectedRowKeys.includes(p.id)));
        setSelectedRowKeys([]);
        message.success('批量删除成功');
      }
    });
  };

  // 列配置
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      sorter: (a: GridPerson, b: GridPerson) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <Space>
          <Avatar size={24} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '网格',
      dataIndex: 'gridName',
      key: 'gridName',
      width: 160,
      filters: [
        ...Array.from(new Set(persons.map(p => p.gridName))).map(name => ({ text: name, value: name }))
      ],
      onFilter: (value: any, record: GridPerson) => record.gridName === value
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      filters: [
        { text: '居民', value: 'resident' },
        { text: '工作人员', value: 'worker' },
        { text: '访客', value: 'visitor' },
        { text: '管理员', value: 'manager' }
      ],
      onFilter: (value: any, record: GridPerson) => record.type === value,
      render: (t: GridPerson['type']) => (
        <Tag color={t === 'resident' ? 'blue' : t === 'worker' ? 'green' : t === 'visitor' ? 'orange' : 'purple'}>
          {t === 'resident' ? '居民' : t === 'worker' ? '工作人员' : t === 'visitor' ? '访客' : '管理员'}
        </Tag>
      )
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      sorter: (a: GridPerson, b: GridPerson) => a.phone.localeCompare(b.phone),
      render: (p: string) => maskPhone(p)
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: '正常', value: 'normal' },
        { text: '警告', value: 'warning' },
        { text: '警报', value: 'alert' }
      ],
      onFilter: (value: any, record: GridPerson) => record.status === value,
      render: (s: GridPerson['status']) => (
        <Tag color={s === 'normal' ? 'green' : s === 'warning' ? 'orange' : 'red'}>
          {s === 'normal' ? '正常' : s === 'warning' ? '警告' : '警报'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: GridPerson) => (
        <Space size="small">
          <Button type="link" onClick={() => setViewing(record)}>详情</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => {
            setEditingPerson(record);
            setEditVisible(true);
            editForm.setFieldsValue({ ...record });
          }}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)}>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}><UserOutlined style={{ marginRight: 8 }} />人员管理</Title>

      {/* 顶部统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="人员总数" value={stats.total} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="居民" value={stats.byType.resident} valueStyle={{ color: '#2f54eb' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="工作人员" value={stats.byType.worker} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="告警人数(警告/警报)" value={stats.warnings} valueStyle={{ color: '#fa541c' }} />
          </Card>
        </Col>
      </Row>

      {/* 筛选与操作 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={12} align="middle">
          <Col xs={24} sm={10} md={8} lg={6}>
            <Search
              placeholder="搜索姓名/电话/地址/网格名"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: 'all', label: '全部类型' },
                { value: 'resident', label: '居民' },
                { value: 'worker', label: '工作人员' },
                { value: 'visitor', label: '访客' },
                { value: 'manager', label: '管理员' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'normal', label: '正常' },
                { value: 'warning', label: '警告' },
                { value: 'alert', label: '警报' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={10}>
            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={() => { setSearchText(''); setTypeFilter('all'); setStatusFilter('all'); }}>重置</Button>
              <Badge count={filteredPersons.length} showZero>
                <Button icon={<DownloadOutlined />} onClick={handleExport}>导出筛选结果</Button>
              </Badge>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddVisible(true)}>新增人员</Button>
              <Button danger icon={<DeleteOutlined />} onClick={onBatchDelete}>批量删除</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns as any}
          dataSource={filteredPersons}
          rowKey="id"
          bordered
          sticky
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys, preserveSelectedRowKeys: true }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        open={!!viewing}
        title="人员详情"
        onCancel={() => setViewing(null)}
        footer={<Button onClick={() => setViewing(null)}>关闭</Button>}
        width={700}
      >
        {viewing && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="姓名">{viewing.name}</Descriptions.Item>
            <Descriptions.Item label="网格">{viewing.gridName}</Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag color={viewing.type === 'resident' ? 'blue' : viewing.type === 'worker' ? 'green' : viewing.type === 'visitor' ? 'orange' : 'purple'}>
                {viewing.type === 'resident' ? '居民' : viewing.type === 'worker' ? '工作人员' : viewing.type === 'visitor' ? '访客' : '管理员'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={viewing.status === 'normal' ? 'green' : viewing.status === 'warning' ? 'orange' : 'red'}>
                {viewing.status === 'normal' ? '正常' : viewing.status === 'warning' ? '警告' : '警报'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="电话">{maskPhone(viewing.phone)}</Descriptions.Item>
            <Descriptions.Item label="地址" span={2}>{viewing.address}</Descriptions.Item>
            <Descriptions.Item label="最近更新" span={2}>{viewing.lastUpdate}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 新增弹窗 */}
      <Modal
        open={addVisible}
        title="新增人员"
        onCancel={() => { setAddVisible(false); addForm.resetFields(); }}
        onOk={onAdd}
        okText="确认添加"
        cancelText="取消"
        width={700}
      >
        <Form form={addForm} layout="vertical" initialValues={{ type: 'resident', status: 'normal' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="如：张伟" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gridName" label="网格" rules={[{ required: true, message: '请输入网格名称' }]}>
                <Input placeholder="如：A区网格" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="resident">居民</Select.Option>
                  <Select.Option value="worker">工作人员</Select.Option>
                  <Select.Option value="visitor">访客</Select.Option>
                  <Select.Option value="manager">管理员</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
                <Input placeholder="如：139****0001（系统显示将自动脱敏）" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="normal">正常</Select.Option>
                  <Select.Option value="warning">警告</Select.Option>
                  <Select.Option value="alert">警报</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="address" label="地址" rules={[{ required: true, message: '请输入地址' }]}>
                <Input placeholder="如：A区1号楼101室" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        open={editVisible}
        title="编辑人员"
        onCancel={() => { setEditVisible(false); setEditingPerson(null); }}
        onOk={onEdit}
        okText="保存"
        cancelText="取消"
        width={700}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="如：张伟" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gridName" label="网格" rules={[{ required: true, message: '请输入网格名称' }]}>
                <Input placeholder="如：A区网格" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="resident">居民</Select.Option>
                  <Select.Option value="worker">工作人员</Select.Option>
                  <Select.Option value="visitor">访客</Select.Option>
                  <Select.Option value="manager">管理员</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
                <Input placeholder="如：139****0001（系统显示将自动脱敏）" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="normal">正常</Select.Option>
                  <Select.Option value="warning">警告</Select.Option>
                  <Select.Option value="alert">警报</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="address" label="地址" rules={[{ required: true, message: '请输入地址' }]}>
                <Input placeholder="如：A区1号楼101室" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonsPage;


