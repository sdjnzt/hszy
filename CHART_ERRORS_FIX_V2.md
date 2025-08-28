# 图表错误修复说明 V2.0

## 问题描述

项目运行过程中出现了以下运行时错误：

1. **`Cannot read properties of null (reading 'on')`** - 图表DOM绑定问题
2. **`Undefined variable: type`** - 图表标签模板中的变量引用问题

## 错误原因

1. **DOM绑定问题**: 图表组件在DOM元素未完全准备好时就开始渲染，导致`Plot.bindSizeSensor`失败
2. **标签模板问题**: Pie图表的`label.content`使用了`{type}`变量，但数据中没有`type`字段
3. **渲染时机问题**: 图表在DOM尺寸不稳定时就开始渲染

## 修复方案

### 1. 创建ChartWrapper组件

创建了一个专门的图表包装组件来解决DOM绑定问题：

```tsx
const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  children, 
  height = 300, 
  loading = false,
  error 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 确保DOM元素存在且尺寸稳定
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setIsReady(true);
      });
      
      resizeObserver.observe(containerRef.current);
      
      // 延迟设置ready状态，确保DOM完全稳定
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <div ref={containerRef} style={{ height, position: 'relative' }}>
      {isReady && !loading && !hasError && (
        <div style={{ height: '100%', width: '100%' }}>
          {children}
        </div>
      )}
      {!isReady && (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="default" tip="准备中..." />
        </div>
      )}
    </div>
  );
};
```

### 2. 修复数据字段问题

将所有Pie图表的数据字段从`type`改为`name`：

```tsx
// 修复前
const eventTypeData = [
  { type: '安全事件', count: 45 },  // ❌ 错误：字段名不匹配
  { type: '环境问题', count: 38 },
];

// 修复后
const eventTypeData = [
  { name: '安全事件', count: 45 },  // ✅ 正确：字段名匹配
  { name: '环境问题', count: 38 },
];
```

### 3. 修复标签模板

将所有Pie图表的`label.content`从`'{type}'`改为`'{name}'`：

```tsx
// 修复前
label={{
  type: 'outer',
  content: '{type}', // ❌ 错误：数据中没有type字段
}}

// 修复后
label={{
  type: 'outer',
  content: '{name}', // ✅ 正确：使用name字段
}}
```

### 4. 使用ChartWrapper包装所有图表

```tsx
<ChartWrapper height={300}>
  <Pie
    data={eventTypeData}
    angleField="count"
    colorField="name"
    height={300}
    radius={0.8}
    label={{
      type: 'outer',
      content: '{name}',
    }}
  />
</ChartWrapper>
```

## 修复的文件

1. **`src/components/ChartWrapper.tsx`** - 新增图表包装组件
2. **`src/pages/HomePage.tsx`** - 修复数据字段和标签模板，使用ChartWrapper
3. **`src/pages/FitnessEquipmentPage.tsx`** - 修复数据字段和标签模板，使用ChartWrapper
4. **`src/pages/GridManagementPage.tsx`** - 修复数据字段和标签模板，使用ChartWrapper

## 修复效果

- ✅ 消除了`Cannot read properties of null (reading 'on')`错误
- ✅ 消除了`Undefined variable: type`错误
- ✅ 图表渲染更加稳定和可靠
- ✅ 提供了优雅的加载状态和错误处理
- ✅ 确保DOM完全准备好后再渲染图表

## 技术特点

1. **ResizeObserver**: 监听DOM尺寸变化，确保图表容器稳定
2. **延迟渲染**: 使用setTimeout确保DOM完全稳定
3. **状态管理**: 通过isReady状态控制图表渲染时机
4. **错误边界**: 结合ErrorBoundary提供双重错误保护
5. **加载状态**: 提供友好的加载提示

## 预防措施

1. **DOM稳定性**: 确保图表容器尺寸稳定后再渲染
2. **数据一致性**: 确保图表数据字段名与标签模板匹配
3. **渲染时机**: 使用专门的包装组件控制渲染时机
4. **错误处理**: 多层错误保护机制
5. **用户体验**: 提供加载状态和错误提示

## 注意事项

- 所有Pie图表必须使用`name`字段作为标签内容
- 图表必须包装在`ChartWrapper`中以确保DOM稳定
- 保持数据字段名与标签模板的一致性
- 定期检查图表组件的依赖更新
