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
  message,
  Tabs
} from 'antd';
import { TeamOutlined, SearchOutlined, ReloadOutlined, DownloadOutlined, PlusOutlined, PieChartOutlined, TableOutlined } from '@ant-design/icons';
import { getGridOrganizations, GridOrganization } from './data';
import ReactECharts from 'echarts-for-react';

const { Title } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'property', label: '物业' },
  { value: 'security', label: '安保' },
  { value: 'medical', label: '医疗' },
  { value: 'education', label: '教育' },
  { value: 'commercial', label: '商业' },
];

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'active', label: '活跃' },
  { value: 'inactive', label: '停用' },
];

interface OrgEx extends GridOrganization {
  leader?: string;
  email?: string;
  dutyPhone?: string;
  foundedAt?: string;
}

// 脱敏工具
const maskPhone = (phone?: string) => phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '';
const maskEmail = (email?: string) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  return `${name[0]}***@${domain}`;
};

// 真实姓名生成器（加权姓氏 + 1~2字名，可复现）
const createSeededRandom = (seed: number) => { let s = seed>>>0; return () => { s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%1_000_000)/1_000_000; }; };
const SURNAME_WEIGHTED: Array<{n:string;w:number}> = [
  { n: '王', w: 8 }, { n: '李', w: 8 }, { n: '张', w: 7 }, { n: '刘', w: 6 }, { n: '陈', w: 5 },
  { n: '杨', w: 4 }, { n: '黄', w: 3 }, { n: '赵', w: 3 }, { n: '周', w: 3 }, { n: '吴', w: 3 }
];
const SURNAME_TOTAL = SURNAME_WEIGHTED.reduce((s, it) => s + it.w, 0);
const GIVEN_NAME_CHARS = ('伟强磊勇军杰涛超明峰雷飞晨辉宇凡凯瑞博梓阳芳娜静丽娟艳婷雪欣梅慧倩丹琳霞洁璐宁雅怡彤悦萌涵莹钰').split('');
const genLeaderName = (() => {
  const rnd = createSeededRandom(2033);
  const pickSurname = () => { let r = rnd()*SURNAME_TOTAL; for (const it of SURNAME_WEIGHTED){ if((r-=it.w)<=0) return it.n; } return SURNAME_WEIGHTED[SURNAME_WEIGHTED.length-1].n; };
  const pickGiven = () => GIVEN_NAME_CHARS[Math.floor(rnd()*GIVEN_NAME_CHARS.length)];
  return () => { const surname = pickSurname(); const len = rnd()<0.7?1:2; let given=''; for(let i=0;i<len;i++){ let c=pickGiven(); if(i>0 && c===given[i-1]) c=pickGiven(); given+=c; } return surname+given; };
})();

const OrganizationsPage: React.FC = () => {
  const [orgs, setOrgs] = useState<OrgEx[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gridFilter, setGridFilter] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editing, setEditing] = useState<OrgEx | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('visual');

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const base = getGridOrganizations();
    const rnd = createSeededRandom(2045);
    const genLandline = () => {
      const localLen = Math.random() < 0.5 ? 7 : 8;
      const first = String(2 + Math.floor(rnd() * 8));
      const rest = String(Math.floor(rnd() * Math.pow(10, localLen - 1))).padStart(localLen - 1, '0');
      return `0537-${first}${rest}`;
    };
    const enriched: OrgEx[] = base.map((o, idx) => ({
      ...o,
      leader: genLeaderName(),
      email: `contact${idx}@corp.cn`,
      dutyPhone: genLandline(),
      phone: genLandline(),
      foundedAt: today
    }));
    setOrgs(enriched);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const allGrids = useMemo(() => Array.from(new Set(orgs.map(o => o.gridName))), [orgs]);

  const filtered = useMemo(() => orgs.filter(o =>
    (debouncedSearch === '' || o.name.includes(debouncedSearch) || o.contact.includes(debouncedSearch) || o.phone.includes(debouncedSearch) || o.address.includes(debouncedSearch)) &&
    (typeFilter === 'all' || o.type === typeFilter) &&
    (statusFilter === 'all' || o.status === statusFilter) &&
    (gridFilter === 'all' || o.gridName === gridFilter)
  ), [orgs, debouncedSearch, typeFilter, statusFilter, gridFilter]);

  // ECharts 数据
  const byType = useMemo(() => Object.entries(
    orgs.reduce((acc, o) => { acc[o.type] = (acc[o.type] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([t, c]) => ({ name: t === 'property' ? '物业' : t === 'security' ? '安保' : t === 'medical' ? '医疗' : t === 'education' ? '教育' : '商业', value: c })), [orgs]);

  const byStatus = useMemo(() => Object.entries(
    orgs.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([s, c]) => ({ name: s === 'active' ? '活跃' : '停用', value: c })), [orgs]);

  const byGrid = useMemo(() => allGrids.map(g => ({ grid: g, count: orgs.filter(o => o.gridName === g).length })), [orgs, allGrids]);

  const handleExport = () => {
    const header = ['名称','网格','类型','状态','联系人','电话(脱敏)','负责人','邮箱(脱敏)','值班电话(脱敏)','地址','成立日期'];
    const rows = filtered.map(o => [o.name, o.gridName, o.type, o.status, o.contact, maskPhone(o.phone), o.leader || '', maskEmail(o.email), maskPhone(o.dutyPhone), o.address, o.foundedAt || '']);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '组织列表.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    message.success('已导出筛选结果');
  };

  const onAdd = async () => {
    try {
      const values = await addForm.validateFields();
      const today = new Date().toISOString().slice(0, 10);
      const item: OrgEx = {
        id: 'org_' + Date.now(),
        name: values.name,
        gridId: 'grid_' + Math.random().toString(36).slice(2,6),
        gridName: values.gridName,
        type: values.type,
        contact: values.contact,
        phone: values.phone,
        address: values.address,
        status: values.status,
        description: values.description || '',
        leader: values.leader || genLeaderName(),
        email: values.email || `info@corp.cn`,
        dutyPhone: values.dutyPhone,
        foundedAt: today
      };
      setOrgs(prev => [item, ...prev]);
      setAddVisible(false);
      addForm.resetFields();
      message.success('新增组织成功');
    } catch (e) { message.error('请完善组织信息'); }
  };

  const onEdit = async () => {
    if (!editing) return;
    try {
      const values = await editForm.validateFields();
      setOrgs(prev => prev.map(o => o.id === editing.id ? { ...o, ...values } : o));
      setEditVisible(false);
      setEditing(null);
      message.success('保存成功');
    } catch (e) { message.error('请完善组织信息'); }
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name', width: 180, ellipsis: true },
    { title: '网格', dataIndex: 'gridName', key: 'gridName', width: 140, filters: allGrids.map(g => ({ text: g, value: g })), onFilter: (v:any,r:OrgEx)=>r.gridName===v },
    { title: '类型', dataIndex: 'type', key: 'type', width: 120, filters: typeOptions.filter(o=>o.value!=='all').map(o=>({ text: o.label, value: o.value })), onFilter: (v:any,r:OrgEx)=>r.type===v,
      render: (t: GridOrganization['type']) => <Tag color={t==='property'?'blue':t==='security'?'green':t==='medical'?'red':t==='education'?'purple':'orange'}>{t==='property'?'物业':t==='security'?'安保':t==='medical'?'医疗':t==='education'?'教育':'商业'}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 110, filters: statusOptions.filter(o=>o.value!=='all').map(o=>({ text: o.label, value: o.value })), onFilter: (v:any,r:OrgEx)=>r.status===v,
      render: (s: GridOrganization['status']) => <Tag color={s==='active'?'green':'red'}>{s==='active'?'活跃':'停用'}</Tag> },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 120 },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 140, render: (v: string) => maskPhone(v) },
    { title: '负责人', dataIndex: 'leader', key: 'leader', width: 120 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 180, render: (v: string) => maskEmail(v) },
    { title: '值班电话', dataIndex: 'dutyPhone', key: 'dutyPhone', width: 160, render: (v: string) => maskPhone(v) },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: '成立日期', dataIndex: 'foundedAt', key: 'foundedAt', width: 120 },
    { title: '操作', key: 'action', width: 160, fixed: 'right' as const, render: (_:any, r:OrgEx) => (
      <Space size="small">
        <Button type="link" onClick={() => { setEditing(r); setEditVisible(true); editForm.setFieldsValue(r); }}>编辑</Button>
      </Space>
    ) },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}><TeamOutlined style={{ marginRight: 8 }} />组织管理</Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<span><PieChartOutlined />可视化</span>} key="visual">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card title="类型占比">
                <ReactECharts 
                  option={{
                    tooltip: { trigger: 'item' },
                    series: [{
                      type: 'pie', radius: '70%',
                      data: byType,
                      label: { formatter: '{b}: {c}' }
                    }]
                  }}
                  style={{ height: 260 }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="状态占比">
                <ReactECharts 
                  option={{
                    tooltip: { trigger: 'item' },
                    series: [{ type: 'pie', radius: '70%', data: byStatus, label: { formatter: '{b}: {c}' } }]
                  }}
                  style={{ height: 260 }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="各网格组织数量">
                <ReactECharts 
                  option={{
                    tooltip: { trigger: 'axis' },
                    xAxis: { type: 'category', data: byGrid.map(i => i.grid) },
                    yAxis: { type: 'value', name: '数量' },
                    series: [{ type: 'bar', data: byGrid.map(i => i.count), itemStyle: { color: '#1890ff' }, label: { show: true, position: 'top' } }]
                  }}
                  style={{ height: 260 }}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={<span><TableOutlined />列表</span>} key="table">
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={12}>
              <Col xs={24} sm={10} md={8} lg={6}>
                <Search placeholder="搜索名称/联系人/电话/地址" allowClear value={searchText} onChange={(e)=>setSearchText(e.target.value)} enterButton={<SearchOutlined />} />
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
                <Select value={gridFilter} onChange={setGridFilter} options={[{ value: 'all', label: '全部网格' }, ...allGrids.map(g => ({ value: g, label: g }))]} style={{ width: '100%' }} />
              </Col>
              <Col xs={12} sm={4} md={4} lg={4}>
                <Select value={typeFilter} onChange={setTypeFilter} options={typeOptions} style={{ width: '100%' }} />
              </Col>
              <Col xs={12} sm={4} md={4} lg={4}>
                <Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={24} md={12} lg={6}>
                <Space wrap>
                  <Button icon={<ReloadOutlined />} onClick={()=>{ setSearchText(''); setGridFilter('all'); setTypeFilter('all'); setStatusFilter('all'); }}>重置</Button>
                  <Badge count={filtered.length} showZero>
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
                  </Badge>
                  <Button type="primary" icon={<PlusOutlined />} onClick={()=> { setAddVisible(true); addForm.setFieldsValue({ leader: genLeaderName() }); }}>新增组织</Button>
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
              scroll={{ x: 1400 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
              rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys, preserveSelectedRowKeys: true }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 新增组织 */}
      <Modal
        open={addVisible}
        title="新增组织"
        onCancel={() => { setAddVisible(false); addForm.resetFields(); }}
        onOk={onAdd}
        okText="确认添加"
        cancelText="取消"
        width={700}
      >
        <Form form={addForm} layout="vertical" initialValues={{ type: 'property', status: 'active' }}>
          {/* 表单内容保持不变 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="组织名称" rules={[{ required: true, message: '请输入组织名称' }]}>
                <Input placeholder="如：物业服务中心" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gridName" label="所属网格" rules={[{ required: true, message: '请输入网格名称' }]}>
                <Input placeholder="如：A区网格" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select options={typeOptions.filter(o=>o.value!=='all')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select options={statusOptions.filter(o=>o.value!=='all')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="leader" label="负责人">
                <Input placeholder="如：王经理" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contact" label="联系人" rules={[{ required: true, message: '请输入联系人' }]}>
                <Input placeholder="如：物业经理" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="如：0537-8xxxxxxx（显示时将脱敏）" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱">
                <Input placeholder="如：contact@corp.cn（显示时将脱敏）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dutyPhone" label="值班电话">
                <Input placeholder="如：0537-6xxxxxxx（显示时将脱敏）" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="地址" rules={[{ required: true, message: '请输入地址' }]}>
            <Input placeholder="如：A区物业办公室" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="组织职责与说明" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑组织 */}
      <Modal
        open={editVisible}
        title="编辑组织"
        onCancel={() => { setEditVisible(false); setEditing(null); }}
        onOk={onEdit}
        okText="保存"
        cancelText="取消"
        width={700}
      >
        <Form form={editForm} layout="vertical">
          {/* 与新增一致 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="组织名称" rules={[{ required: true, message: '请输入组织名称' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gridName" label="所属网格" rules={[{ required: true, message: '请输入网格名称' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select options={typeOptions.filter(o=>o.value!=='all')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select options={statusOptions.filter(o=>o.value!=='all')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="leader" label="负责人">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contact" label="联系人" rules={[{ required: true, message: '请输入联系人' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dutyPhone" label="值班电话">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="地址" rules={[{ required: true, message: '请输入地址' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationsPage;


