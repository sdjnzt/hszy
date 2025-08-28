import React, { useEffect, useRef, useState } from 'react';
import { Spin, Alert } from 'antd';

interface ChartWrapperProps {
  children: React.ReactElement;
  height?: number;
  loading?: boolean;
  error?: string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  children, 
  height = 300, 
  loading = false,
  error 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const el = containerRef.current!;
      const width = el.clientWidth;
      setContainerWidth(width);
      setIsReady(width > 0);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(containerRef.current);

    // 初始两次测量，确保稳定
    const raf1 = requestAnimationFrame(updateSize);
    const timer = setTimeout(updateSize, 120);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(raf1);
      clearTimeout(timer);
    };
  }, []);

  // 错误处理
  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  if (hasError) {
    return (
      <Alert
        message="图表加载失败"
        description={error || "图表渲染时出现错误，请刷新页面重试"}
        type="error"
        showIcon
        style={{ height, display: 'flex', alignItems: 'center' }}
      />
    );
  }

  if (loading) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#fafafa',
          border: '1px dashed #d9d9d9',
          borderRadius: '6px'
        }}
      >
        <Spin size="large" tip="图表加载中..." />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        height,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isReady && containerWidth > 0 && !loading && !hasError && (
        <div style={{ height: '100%', width: '100%' }}>
          {React.cloneElement(children, {
            // 关闭 autoFit，避免内部绑定尺寸传感器
            autoFit: false,
            height,
            width: containerWidth,
          })}
        </div>
      )}
      {!isReady && (
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#fafafa',
          border: '1px dashed #d9d9d9',
          borderRadius: '6px'
        }}>
          <Spin size="default" tip="准备中..." />
        </div>
      )}
    </div>
  );
};

export default ChartWrapper;
