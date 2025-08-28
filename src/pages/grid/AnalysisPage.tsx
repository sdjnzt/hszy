import React, { useMemo } from 'react';
import { Card, Row, Col, Typography, Space, Button, Select, Badge, message } from 'antd';
import { Pie, Column } from '@ant-design/plots';
import ChartWrapper from '../../components/ChartWrapper';
import { getGridUnits, getGridEvents } from './data';

const { Title } = Typography;

const AnalysisPage: React.FC = () => {
  const units = useMemo(() => getGridUnits(), []);
  const events = useMemo(() => getGridEvents(), []);

  const gridPopulationData = units.map(u => ({ grid: u.name, population: u.population })).filter(d => d.population !== undefined && d.population !== null);
  const eventTypeData = Object.entries(
    events.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    name: type === 'safety' ? '安全事件' : type === 'environment' ? '环境问题' : type === 'facility' ? '设施维护' : type === 'service' ? '服务问题' : '其他',
    count
  })).filter(d => d.count != null);

  const eventsByGrid = units.map(u => ({ grid: u.name, count: events.filter(e => e.gridId === u.id).length }));
  const statusData = Object.entries(
    events.reduce((acc, e) => { acc[e.status] = (acc[e.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([status, count]) => ({ name: status === 'pending' ? '待处理' : status === 'processing' ? '处理中' : status === 'completed' ? '已完成' : '已取消', count }));
  const priorityData = Object.entries(
    events.reduce((acc, e) => { acc[e.priority] = (acc[e.priority] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([p, count]) => ({ name: p === 'urgent' ? '紧急' : p === 'high' ? '高' : p === 'medium' ? '中' : '低', count }));

  const totalEvents = events.length;

  const handleExport = () => {
    const header = ['网格','人口','事件数'];
    const rows = units.map(u => [u.name, u.population, events.filter(e => e.gridId === u.id).length]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '网格人口与事件统计.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    message.success('已导出统计数据');
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>数据分析</Title>
        <Space>
          <Badge count={totalEvents} showZero>
            <Button onClick={handleExport}>导出CSV</Button>
          </Badge>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="网格人口分布">
            {gridPopulationData.length > 0 && (
              <ChartWrapper height={300}>
                <Column
                  data={gridPopulationData}
                  xField="grid"
                  yField="population"
                  height={300}
                  color="#1890ff"
                  label={{ position: 'top' }}
                  autoFit={false}
                />
              </ChartWrapper>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="事件类型分布">
            {eventTypeData.length > 0 && (
              <ChartWrapper height={300}>
                <Pie
                  data={eventTypeData}
                  angleField="count"
                  colorField="name"
                  height={300}
                  radius={0.8}
                  label={{ position: 'outside', content: (d: any) => d.name }}
                  autoFit={false}
                />
              </ChartWrapper>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="各网格事件数量">
            <ChartWrapper height={300}>
              <Column
                data={eventsByGrid}
                xField="grid"
                yField="count"
                height={300}
                color="#722ed1"
                label={{ position: 'top' }}
                autoFit={false}
              />
            </ChartWrapper>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="事件状态占比" size="small">
                <ChartWrapper height={260}>
                  <Pie
                    data={statusData}
                    angleField="count"
                    colorField="name"
                    radius={0.8}
                    height={260}
                    label={{ position: 'outside', content: (d: any) => d.name }}
                    autoFit={false}
                  />
                </ChartWrapper>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="事件优先级占比" size="small">
                <ChartWrapper height={260}>
                  <Pie
                    data={priorityData}
                    angleField="count"
                    colorField="name"
                    radius={0.8}
                    height={260}
                    label={{ position: 'outside', content: (d: any) => d.name }}
                    autoFit={false}
                  />
                </ChartWrapper>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AnalysisPage;


