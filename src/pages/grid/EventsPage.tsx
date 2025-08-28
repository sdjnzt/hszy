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
  Table, 
  Tag, 
  Modal, 
  Form, 
  message 
} from 'antd';
import { 
  FileTextOutlined, 
  SearchOutlined, 
  ReloadOutlined, 
  DownloadOutlined, 
  PlusOutlined, 
  EditOutlined 
} from '@ant-design/icons';
import { getGridEvents, GridEvent } from './data';

const { Title } = Typography;
const { Search } = Input;

const priorityOptions = [
  { value: 'all', label: '全部优先级' },
  { value: 'urgent', label: '紧急' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const nowTimestamp = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
};

// 生成更真实的中文姓名（加权姓氏 + 1~2字名），可复现
const createSeededRandom = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
};
const SURNAME_WEIGHTED: Array<{ n: string; w: number }> = [
  { n: '王', w: 8 }, { n: '李', w: 8 }, { n: '张', w: 7 }, { n: '刘', w: 6 }, { n: '陈', w: 5 },
  { n: '杨', w: 4 }, { n: '黄', w: 3 }, { n: '赵', w: 3 }, { n: '周', w: 3 }, { n: '吴', w: 3 },
  { n: '徐', w: 2 }, { n: '孙', w: 2 }, { n: '胡', w: 2 }, { n: '朱', w: 2 }, { n: '高', w: 2 },
  { n: '林', w: 2 }, { n: '何', w: 2 }, { n: '郭', w: 2 }, { n: '马', w: 2 }, { n: '罗', w: 2 }
];
const SURNAME_TOTAL = SURNAME_WEIGHTED.reduce((s, it) => s + it.w, 0);
const GIVEN_NAME_CHARS = ('伟强磊勇军杰涛超明刚峰雷飞晨辉宇凡凯瑞博梓阳辉涛博明杰伟洋磊' +
                          '芳娜静丽娟艳婷雪欣梅慧倩丹琳霞洁璐宁雅露琪怡彤悦萌涵莹钰怡洁琳').split('');
const genName = (() => {
  const rnd = createSeededRandom(2031);
  const pickSurname = () => {
    let r = rnd() * SURNAME_TOTAL;
    for (const it of SURNAME_WEIGHTED) { if ((r -= it.w) <= 0) return it.n; }
    return SURNAME_WEIGHTED[SURNAME_WEIGHTED.length - 1].n;
  };
  const pickGiven = () => GIVEN_NAME_CHARS[Math.floor(rnd() * GIVEN_NAME_CHARS.length)];
  return () => {
    const surname = pickSurname();
    const len = rnd() < 0.75 ? 1 : 2;
    let given = '';
    for (let i = 0; i < len; i++) {
      let c = pickGiven();
      if (i > 0 && c === given[i - 1]) c = pickGiven();
      given += c;
    }
    return surname + given;
  };
})();

const ASSIGNEE_DEPTS = ['工程部','保洁部','综治办','安保队','物业中心','后勤部','应急组'];

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<GridEvent[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gridFilter, setGridFilter] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editing, setEditing] = useState<GridEvent | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    const ts = nowTimestamp();
    const initial = getGridEvents().map((e, idx) => ({ 
      ...e, 
      reporter: genName(),
      assignee: ASSIGNEE_DEPTS[idx % ASSIGNEE_DEPTS.length],
      createdAt: ts, 
      updatedAt: ts 
    }));
    setEvents(initial);
  }, []);

  // 去抖
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(t);
  }, [searchText]);

  const allGrids = useMemo(() => Array.from(new Set(events.map(e => e.gridName))), [events]);

  const filtered = useMemo(() => {
    return events.filter(e =>
      (debouncedSearch === '' || e.title.includes(debouncedSearch) || e.description.includes(debouncedSearch) || e.reporter.includes(debouncedSearch) || e.assignee.includes(debouncedSearch)) &&
      (priorityFilter === 'all' || e.priority === priorityFilter) &&
      (statusFilter === 'all' || e.status === statusFilter) &&
      (gridFilter === 'all' || e.gridName === gridFilter)
    );
  }, [events, debouncedSearch, priorityFilter, statusFilter, gridFilter]);

  const colorByPriority = (p: GridEvent['priority']) => p === 'urgent' ? 'red' : p === 'high' ? 'orange' : p === 'medium' ? 'blue' : 'green';
  const colorByStatus = (s: GridEvent['status']) => s === 'pending' ? 'orange' : s === 'processing' ? 'blue' : s === 'completed' ? 'green' : 'red';

  const handleExport = () => {
    const header = ['标题','网格','优先级','状态','报告人','处理人','创建时间','更新时间','描述'];
    const rows = filtered.map(e => [e.title, e.gridName, e.priority, e.status, e.reporter, e.assignee, e.createdAt, e.updatedAt, e.description.replace(/\n/g,' ')]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '事件列表.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('已导出筛选结果');
  };

  const onBatchStatus = (status: GridEvent['status']) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择记录');
      return;
    }
    setEvents(prev => prev.map(e => selectedRowKeys.includes(e.id) ? { ...e, status } : e));
    setSelectedRowKeys([]);
    message.success('批量状态已更新');
  };

  const onAdd = async () => {
    try {
      const values = await addForm.validateFields();
      const ts = nowTimestamp();
      const item: GridEvent = {
        id: 'e_' + Date.now(),
        title: values.title,
        gridId: 'grid_' + Math.random().toString(36).slice(2,6),
        gridName: values.gridName,
        type: values.type || 'other',
        priority: values.priority,
        status: values.status,
        reporter: values.reporter || genName(),
        assignee: values.assignee || ASSIGNEE_DEPTS[Math.floor(Math.random()*ASSIGNEE_DEPTS.length)],
        createdAt: ts,
        updatedAt: ts,
        description: values.description || ''
      };
      setEvents(prev => [item, ...prev]);
      setAddVisible(false);
      addForm.resetFields();
      message.success('新增事件成功');
    } catch (e) {
      message.error('请完善事件信息');
    }
  };

  const onEdit = async () => {
    if (!editing) return;
    try {
      const values = await editForm.validateFields();
      const ts = nowTimestamp();
      setEvents(prev => prev.map(e => e.id === editing.id ? { ...e, ...values, updatedAt: ts } : e));
      setEditVisible(false);
      setEditing(null);
      message.success('保存成功');
    } catch (e) {
      message.error('请完善事件信息');
    }
  };

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    { title: '网格', dataIndex: 'gridName', key: 'gridName', width: 140, filters: allGrids.map(g => ({ text: g, value: g })), onFilter: (v: any, r: GridEvent) => r.gridName === v },
    { title: '优先级', dataIndex: 'priority', key: 'priority', width: 110, filters: priorityOptions.filter(o=>o.value!=='all').map(o=>({ text: o.label, value: o.value })), onFilter: (v:any,r:GridEvent)=>r.priority===v, render: (p: GridEvent['priority']) => <Tag color={colorByPriority(p)}>{p==='urgent'?'紧急':p==='high'?'高':p==='medium'?'中':'低'}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 110, filters: statusOptions.filter(o=>o.value!=='all').map(o=>({ text: o.label, value: o.value })), onFilter: (v:any,r:GridEvent)=>r.status===v, render: (s: GridEvent['status']) => <Tag color={colorByStatus(s)}>{s==='pending'?'待处理':s==='processing'?'处理中':s==='completed'?'已完成':'已取消'}</Tag> },
    { title: '报告人', dataIndex: 'reporter', key: 'reporter', width: 120 },
    { title: '处理人', dataIndex: 'assignee', key: 'assignee', width: 120 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 160 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '操作', key: 'action', width: 160, fixed: 'right' as const, render: (_: any, r: GridEvent) => (
      <Space size="small">
        <Button type="link" onClick={() => { setEditing(r); setEditVisible(true); editForm.setFieldsValue(r); }}>编辑</Button>
      </Space>
    )}
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}><FileTextOutlined style={{ marginRight: 8 }} />事件管理</Title>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={12}>
          <Col xs={24} sm={10} md={8} lg={6}>
            <Search placeholder="搜索标题/描述/报告人/处理人" allowClear value={searchText} onChange={(e)=>setSearchText(e.target.value)} enterButton={<SearchOutlined />} />
          </Col>
          <Col xs={12} sm={6} md={4} lg={4}>
            <Select value={gridFilter} onChange={setGridFilter} options={[{ value: 'all', label: '全部网格' }, ...allGrids.map(g => ({ value: g, label: g }))]} style={{ width: '100%' }} />
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <Select value={priorityFilter} onChange={setPriorityFilter} options={priorityOptions} style={{ width: '100%' }} />
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={()=>{ setSearchText(''); setGridFilter('all'); setPriorityFilter('all'); setStatusFilter('all'); }}>重置</Button>
              <Badge count={filtered.length} showZero>
                <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
              </Badge>
              <Button type="primary" icon={<PlusOutlined />} onClick={()=> { setAddVisible(true); addForm.setFieldsValue({ reporter: genName(), assignee: ASSIGNEE_DEPTS[0] }); }}>新增事件</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns as any}
          dataSource={filtered}
          rowKey="id"
          bordered
          sticky
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys, preserveSelectedRowKeys: true }}
        />
      </Card>

      {/* 新增事件 */}
      <Modal
        open={addVisible}
        title="新增事件"
        onCancel={() => { setAddVisible(false); addForm.resetFields(); }}
        onOk={onAdd}
        okText="确认添加"
        cancelText="取消"
        width={700}
      >
        <Form form={addForm} layout="vertical" initialValues={{ priority: 'medium', status: 'pending' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="如：电梯故障" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gridName" label="网格" rules={[{ required: true, message: '请输入网格名称' }]}>
                <Input placeholder="如：A区网格" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                <Select options={priorityOptions.filter(o=>o.value!=='all')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select options={statusOptions.filter(o=>o.value!=='all')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="类型">
                <Select options={[
                  { value: 'facility', label: '设施' },
                  { value: 'environment', label: '环境' },
                  { value: 'service', label: '服务' },
                  { value: 'safety', label: '安全' },
                  { value: 'other', label: '其他' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="reporter" label="报告人" rules={[{ required: true, message: '请输入报告人' }]}>
                <Input placeholder="如：张三" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assignee" label="处理人" rules={[{ required: true, message: '请输入处理人' }]}>
                <Input placeholder="如：工程部" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={4} placeholder="请填写事件描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑事件 */}
      <Modal
        open={editVisible}
        title="编辑事件"
        onCancel={() => { setEditVisible(false); setEditing(null); }}
        onOk={onEdit}
        okText="保存"
        cancelText="取消"
        width={700}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="如：电梯故障" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gridName" label="网格" rules={[{ required: true, message: '请输入网格名称' }]}>
                <Input placeholder="如：A区网格" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                <Select options={priorityOptions.filter(o=>o.value!=='all')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select options={statusOptions.filter(o=>o.value!=='all')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="类型">
                <Select options={[
                  { value: 'facility', label: '设施' },
                  { value: 'environment', label: '环境' },
                  { value: 'service', label: '服务' },
                  { value: 'safety', label: '安全' },
                  { value: 'other', label: '其他' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="reporter" label="报告人" rules={[{ required: true, message: '请输入报告人' }]}>
                <Input placeholder="如：张三" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assignee" label="处理人" rules={[{ required: true, message: '请输入处理人' }]}>
                <Input placeholder="如：工程部" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="updatedAt" label="更新时间">
            <Input placeholder="系统将自动填写当前时间" disabled />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={4} placeholder="请填写事件描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventsPage;


