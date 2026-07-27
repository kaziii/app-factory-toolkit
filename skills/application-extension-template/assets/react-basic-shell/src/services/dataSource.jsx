// 数据结合层（成品件，禁改结构）：演示数据先渲染，真实接口异步替换。
//
// 用法（页面/数据文件中）：
//   const { data, source } = useDataSource({ endpoint: '/api/bff/todos', mock: mockRows });
//   <DataBadge source={source} />   // 「真实数据 / 演示数据」角标，用到真实接口的数据块必须挂
//
// 行为：
// - 始终先用 mock 渲染（永不白屏）；endpoint 为空即纯演示数据；
// - 嵌入陌衡企信演示环境时经宿主数据桥（window.__PREVIEW_BRIDGE__）代发请求 ——
//   宿主按服务端策略白名单过滤，策略为 mock-only 时真实请求会被拒绝并保持演示数据；
// - standalone 本地运行（pnpm dev）直接 fetch 同源，无 BFF 时自然回退演示数据；
// - 真实请求失败静默回退，界面通过 source 标注数据来源，不弹错。
//
// endpoint 取值必须来自 skill 的 references/publish/api-catalog.json 清单；清单外的数据需求
// 记入 manifest.expectedApis[]，不要臆造 endpoint。
import { useEffect, useState } from 'react';

export function useDataSource({ endpoint, mock }) {
  const [state, setState] = useState({ data: mock, source: 'mock' });

  useEffect(() => {
    if (!endpoint) return undefined;
    let cancelled = false;
    const bridge = typeof window !== 'undefined' ? window.__PREVIEW_BRIDGE__ : null;
    const request = bridge
      ? bridge.fetch(endpoint)
      : fetch(endpoint, { headers: { Accept: 'application/json' } }).then(response => {
          if (!response.ok) throw new Error(String(response.status));
          return response.json();
        });
    request
      .then(data => {
        if (!cancelled && data != null) setState({ data, source: 'real' });
      })
      .catch(() => {
        // 静默回退演示数据：失败原因（策略拒绝/接口不可用）不打断演示。
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return state;
}

const badgeStyles = {
  real: { color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0' },
  mock: { color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a' },
};

export function DataBadge({ source }) {
  const style = badgeStyles[source === 'real' ? 'real' : 'mock'];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {source === 'real' ? '真实数据' : '演示数据'}
    </span>
  );
}
