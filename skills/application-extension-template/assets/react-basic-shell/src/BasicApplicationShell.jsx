import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  AppWindow,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock3,
  Eye,
  FileCheck2,
  Filter,
  Grid2X2,
  LayoutGrid,
  List,
  Maximize2,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  Users,
  Wallet,
  X
} from 'lucide-react';
import { defaultApplicationDefinition } from './basicShellData';
import './basic-application-shell.css';

const moduleIconMap = {
  building: Building2,
  users: Users,
  wallet: Wallet
};

const globalActions = [
  { id: 'messages', label: '消息', Icon: MessageSquareText },
  { id: 'todo', label: '待办', Icon: FileCheck2 },
  { id: 'dashboard', label: '运行总览', Icon: LayoutGrid },
  { id: 'risk', label: '风险预警', Icon: ShieldAlert }
];

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

function useOutsideClose(open, ref, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = event => {
      if (!ref.current?.contains(event.target)) onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, ref, onClose]);
}

const focusableSelector = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

function useFocusReturn(open, triggerRef) {
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
    wasOpenRef.current = open;
  }, [open, triggerRef]);
}

function useDialogFocus(open, containerRef, onClose) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const returnTarget = document.activeElement;
    const container = containerRef.current;
    const focusable = () => Array.from(container?.querySelectorAll(focusableSelector) || []);
    window.requestAnimationFrame(() => focusable()[0]?.focus());

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.requestAnimationFrame(() => returnTarget instanceof HTMLElement && returnTarget.focus());
    };
  }, [open]);
}

function normalizeOption(option) {
  return typeof option === 'string' ? { label: option, value: option } : option;
}

function normalizeFilter(filter, index) {
  return typeof filter === 'string'
    ? { key: `filter-${index}`, label: filter, rowKey: '', options: [] }
    : { key: filter.key || `filter-${index}`, label: filter.label || `筛选${index + 1}`, options: [], ...filter };
}

function IconButton({ label, children, className = '', active = false, ...props }) {
  return (
    <button className={classNames('bsh-icon-button', active && 'is-active', className)} type="button" aria-label={label} {...props}>
      {children}
    </button>
  );
}

function Button({ children, tone = 'secondary', className = '', ...props }) {
  return (
    <button className={classNames('bsh-button', `bsh-button--${tone}`, className)} type="button" {...props}>
      {children}
    </button>
  );
}

function StatusDot({ tone = 'green', children }) {
  return (
    <span className="bsh-status-dot">
      <i data-tone={tone} />
      {children}
    </span>
  );
}

function StatusBadge({ tone = 'neutral', children }) {
  return <span className="bsh-status-badge" data-tone={tone}>{children}</span>;
}

function ApplicationSwitcher({ apps, activeAppId, onSelect }) {
  return (
    <div className="bsh-app-switcher-popover" role="dialog" aria-label="应用切换">
      <div className="bsh-app-switcher-card">
        <div className="bsh-app-switcher-grid">
          {apps.slice(0, 5).map(app => (
            <button
              className={classNames('bsh-app-switcher-entry', activeAppId === app.id && 'is-active')}
              key={app.id}
              type="button"
              onClick={() => onSelect(app)}
              title={app.name}
            >
              <img className="bsh-app-switcher-logo" src={app.logoSrc} alt="" />
              <span>{app.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountPopover({ user, onClose, onLogout, onManageAccount }) {
  return (
    <section className="bsh-account-popover" role="dialog" aria-label="账户信息">
      <div className="bsh-account-profile-row">
        <img className="bsh-account-avatar" src={user.avatarSrc} alt="" />
        <div className="bsh-account-copy">
          <strong>{user.name}</strong>
          <small>{user.phone}</small>
        </div>
        <div className="bsh-account-actions">
          <Button onClick={onManageAccount}>管理账号</Button>
          <Button className="bsh-account-logout" onClick={onLogout}>退出登录</Button>
        </div>
      </div>
      <button className="bsh-sr-only" type="button" onClick={onClose}>关闭账户菜单</button>
    </section>
  );
}

function GlobalActionPanel({ action, panel }) {
  const items = panel.items || [];
  const distribution = panel.distribution || [];
  return (
    <section className="bsh-global-panel" role="dialog" aria-label={panel.title}>
      <header className="bsh-global-panel-header">
        <div>
          <span className="bsh-global-eyebrow">{panel.eyebrow}</span>
          <h2>{panel.title}</h2>
          <p>{panel.description}</p>
        </div>
        <span className={classNames('bsh-global-status', panel.tone === 'danger' && 'is-danger')}>{panel.status}</span>
      </header>
      <div className="bsh-global-metrics">
        {panel.metrics.map(([label, value, helper]) => (
          <article className="bsh-global-metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{helper}</small>
          </article>
        ))}
      </div>
      <div className="bsh-global-content-grid">
        <section className="bsh-global-section">
          <div className="bsh-global-section-head"><h3>最新{action.label}</h3><span>今日</span></div>
          <div className="bsh-global-queue">
            {items.map(item => (
              <article className="bsh-global-queue-item" key={item.title}>
                <span><strong>{item.title}</strong><small>{item.meta}</small></span>
                <b>{item.priority}</b>
              </article>
            ))}
          </div>
        </section>
        <section className="bsh-global-section">
          <div className="bsh-global-section-head"><h3>消息类型</h3><span>占比</span></div>
          <div className="bsh-global-distribution">
            {distribution.map(item => (
              <div className="bsh-distribution-item" key={item.label}>
                <div><span>{item.label}</span><strong>{item.value}%</strong></div>
                <i><b style={{ width: `${item.value}%` }} /></i>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function detailValue(item, row) {
  return item.rowKey ? row[item.rowKey] ?? item.fallback ?? '—' : item.value ?? item.fallback ?? '—';
}

function DetailDrawer({ row, detail, onClose }) {
  const drawerRef = useRef(null);
  const tabs = (detail?.tabs || ['基本信息', '业务详情', '材料清单', '办理记录', '操作日志']).map((tab, index) =>
    typeof tab === 'string' ? { id: `detail-tab-${index}`, label: tab } : tab
  );
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);
  useDialogFocus(Boolean(row), drawerRef, onClose);

  if (!row) return null;
  const tabContent = detail?.tabContent?.[activeTabId] || {};
  const facts = tabContent.facts || detail?.facts || [];
  const infoFields = tabContent.infoFields || detail?.infoFields || [];
  const sections = tabContent.sections || detail?.sections || [];

  function handleTabKeyDown(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setActiveTabId(tabs[nextIndex].id);
    drawerRef.current?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  }

  return (
    <div className="bsh-modal-layer" role="presentation">
      <button className="bsh-modal-scrim" type="button" aria-label="关闭详情" onClick={onClose} />
      <aside ref={drawerRef} className="bsh-detail-drawer" role="dialog" aria-modal="true" aria-label={`${row.primary}详情`}>
        <header className="bsh-drawer-header">
          <div className="bsh-drawer-title"><h2>{row.primary}</h2><p>{row.secondary}</p></div>
          <div className="bsh-drawer-actions">
            <Button>查看档案</Button><Button>维护记录</Button><Button>导出详情</Button><IconButton label="关闭详情" onClick={onClose}><X /></IconButton>
          </div>
        </header>
        <div className="bsh-drawer-tabs" role="tablist" aria-label="详情页面">
          {tabs.map((tab, index) => <button key={tab.id} className={classNames('bsh-drawer-tab', activeTabId === tab.id && 'is-active')} type="button" role="tab" aria-selected={activeTabId === tab.id} tabIndex={activeTabId === tab.id ? 0 : -1} onClick={() => setActiveTabId(tab.id)} onKeyDown={event => handleTabKeyDown(event, index)}>{tab.label}</button>)}
        </div>
        <div className="bsh-drawer-body" role="tabpanel">
          <section className="bsh-detail-facts">{facts.map(item => <div key={item.label}><span>{item.label}</span><strong>{detailValue(item, row)}</strong><small>{item.helper || ''}</small></div>)}</section>
          <section className="bsh-info-grid">
            {infoFields.map(item => <article className="bsh-info-item" key={item.label}><span>{item.label}</span><strong>{detailValue(item, row)}</strong></article>)}
          </section>
          {sections.map(section => <section className="bsh-detail-section" key={section.title}><h3>{section.title}</h3><div className="bsh-detail-columns">{section.panels.map(panel => <article className="bsh-detail-panel" key={panel.title}><h4>{panel.title}</h4>{panel.items.map(item => item.progress === undefined ? <div className="bsh-note-item" key={item.label}><span>{item.label}</span><strong>{detailValue(item, row)}</strong></div> : <div className="bsh-progress-item" key={item.label}><span>{item.label}</span><strong>{detailValue(item, row)}</strong><i><b style={{ width: `${item.progress}%` }} /></i></div>)}</article>)}</div></section>)}
        </div>
      </aside>
    </div>
  );
}

function FormDialog({ definition, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(false);

  const requestClose = () => {
    if (pending) return;
    if (dirty && !window.confirm('表单内容尚未提交，确认关闭吗？')) return;
    onClose();
  };

  useDialogFocus(true, dialogRef, requestClose);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      await onSubmit?.(Object.fromEntries(new FormData(event.currentTarget)));
      setDirty(false);
      onClose();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="bsh-modal-layer" role="presentation">
      <button className="bsh-modal-scrim bsh-form-scrim" type="button" aria-label="关闭表单" onClick={requestClose} />
      <section ref={dialogRef} className="bsh-form-dialog" role="dialog" aria-modal="true" aria-label={definition.page.createLabel}>
        <header className="bsh-form-header"><div><h2>{definition.page.createLabel}</h2>{definition.page.formDescription ? <p>{definition.page.formDescription}</p> : null}</div><IconButton label="关闭表单" onClick={requestClose}><X /></IconButton></header>
        <form className="bsh-form-body" onChange={() => setDirty(true)} onSubmit={handleSubmit}>
          <div className="bsh-form-grid">
            {definition.page.formFields.map(field => (
              <label className={classNames('bsh-form-field', field.full && 'is-full')} key={field.id}>
                <span>{field.label}</span>
                {field.type === 'textarea' ? <textarea name={field.id} placeholder={field.placeholder || ''} required={field.required} /> : null}
                {field.type === 'select' ? <select name={field.id} defaultValue="" required={field.required}><option value="" disabled>{field.placeholder || `请选择${field.label}`}</option>{(field.options || []).map(option => { const normalized = normalizeOption(option); return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>; })}</select> : null}
                {!['textarea', 'select'].includes(field.type) ? <input name={field.id} type={field.type || 'text'} placeholder={field.placeholder || ''} required={field.required} /> : null}
              </label>
            ))}
          </div>
          <footer className="bsh-form-footer"><Button disabled={pending} onClick={requestClose}>取消</Button><Button tone="primary" type="submit" disabled={pending}>{pending ? '提交中...' : '提交'}</Button></footer>
        </form>
      </section>
    </div>
  );
}

function SettingsDrawer({ onClose, application, module }) {
  const drawerRef = useRef(null);
  const tabs = application.settingsTabs || ['基础参数', '流程设置', '账号设置', '工单设置', '整改设置'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  useDialogFocus(true, drawerRef, onClose);
  return (
    <aside ref={drawerRef} className="bsh-settings-drawer" role="dialog" aria-label={`${application.name}设置`}>
      <header className="bsh-settings-header"><div><h2>{application.name}设置</h2><p>{module.label}的配置范围与审计规则</p></div><IconButton label="关闭应用设置" onClick={onClose}><X /></IconButton></header>
      <div className="bsh-settings-tabs" role="tablist">{tabs.map(tab => <button className={classNames('bsh-settings-tab', activeTab === tab && 'is-active')} type="button" role="tab" aria-selected={activeTab === tab} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
      <div className="bsh-settings-content" role="tabpanel"><span>{module.label}</span><strong>{activeTab}</strong></div>
    </aside>
  );
}

function ModuleSwitcher({ modules, activeModuleId, onSelect, onClose }) {
  const panelRef = useRef(null);
  useDialogFocus(true, panelRef, onClose);
  return (
    <>
      <button className="bsh-module-scrim" type="button" aria-label="关闭模块切换" onClick={onClose} />
      <aside ref={panelRef} className="bsh-module-switcher" role="dialog" aria-modal="true" aria-label="模块切换">
        {modules.map(module => <button className={classNames('bsh-module-switcher-item', activeModuleId === module.id && 'is-active')} key={module.id} type="button" onClick={() => onSelect(module.id)}><span>{module.label}</span>{activeModuleId === module.id ? <Check /> : null}</button>)}
      </aside>
    </>
  );
}

function ViewModeMenu({ viewMode, onViewModeChange }) {
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const viewText = viewMode === 'list' ? '列表' : viewMode === 'sidebar' ? '侧栏' : '卡片';
  return <div className="bsh-view-menu"><Button aria-expanded={viewMenuOpen} onClick={() => setViewMenuOpen(value => !value)}>{viewText}<ChevronDown /></Button>{viewMenuOpen ? <div className="bsh-simple-menu">{[['list', '列表'], ['sidebar', '侧栏'], ['board', '卡片']].map(([id, label]) => <button type="button" key={id} onClick={() => { onViewModeChange(id); setViewMenuOpen(false); }}>{label}{viewMode === id ? <Check /> : null}</button>)}</div> : null}</div>;
}

function UpdateGroup({ page, onRefresh, compact = false }) {
  return <div className={classNames('bsh-update-group', compact && 'is-compact')}><span className="bsh-update-icon"><Clock3 /></span><div><small>数据更新时间</small><div className="bsh-update-time"><strong>{page.updatedAt}</strong><IconButton label="刷新数据" onClick={onRefresh}><RefreshCw /></IconButton></div></div></div>;
}

function PageHeader({ page, viewMode, onViewModeChange, onCreate, onRefresh }) {
  return (
    <header className="bsh-page-header">
      <UpdateGroup page={page} onRefresh={onRefresh} />
      <div className="bsh-page-actions"><Button tone="primary" onClick={onCreate}><Plus />{page.createLabel}</Button><ViewModeMenu viewMode={viewMode} onViewModeChange={onViewModeChange} /><IconButton label="更多操作"><MoreHorizontal /></IconButton></div>
    </header>
  );
}

function MetricStrip({ metrics }) {
  return <section className="bsh-metric-strip" aria-label="数据统计">{metrics.slice(0, 6).map(item => <article className="bsh-metric-item" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.helper}</small></article>)}</section>;
}

function QueryToolbar({ filters, sortOptions, activeSort, onSortChange, query, searchPlaceholder, onQueryChange, activeFilters, onFilterChange, onClearFilters }) {
  const [openMenu, setOpenMenu] = useState('');
  const toolbarRef = useRef(null);
  const normalizedFilters = filters.map(normalizeFilter);
  const selectedCount = Object.values(activeFilters).reduce((total, values) => total + values.length, 0);
  const selectedSort = sortOptions.find(option => option.id === activeSort) || sortOptions[0];
  useOutsideClose(Boolean(openMenu), toolbarRef, () => setOpenMenu(''));

  const toggleFilterValue = (filter, value) => {
    const current = activeFilters[filter.key] || [];
    onFilterChange(filter.key, current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  };

  return (
    <div className="bsh-query-toolbar" ref={toolbarRef}>
      <div className="bsh-query-start">
        <div className="bsh-filter-anchor">
          <Button className={activeSort !== sortOptions[0]?.id ? 'is-selected' : ''} aria-expanded={openMenu === 'sort'} onClick={() => setOpenMenu(value => value === 'sort' ? '' : 'sort')}>{selectedSort?.label || '排序方式'}<ChevronDown /></Button>
          {openMenu === 'sort' ? <div className="bsh-filter-menu" role="menu" aria-label="排序方式">{sortOptions.map(option => <button type="button" role="menuitemradio" aria-checked={activeSort === option.id} key={option.id} onClick={() => { onSortChange(option.id); setOpenMenu(''); }}>{option.label}{activeSort === option.id ? <Check /> : null}</button>)}</div> : null}
        </div>
        <i className="bsh-toolbar-divider" />
        {normalizedFilters.map(filter => {
          const values = activeFilters[filter.key] || [];
          return <div className="bsh-filter-anchor" key={filter.key}><Button className={values.length ? 'is-selected' : ''} aria-expanded={openMenu === filter.key} onClick={() => setOpenMenu(value => value === filter.key ? '' : filter.key)}>{filter.label}{values.length ? ` ${values.length}` : ''}<ChevronDown /></Button>{openMenu === filter.key ? <div className="bsh-filter-menu" role="menu" aria-label={filter.label}>{filter.options.length ? filter.options.map(option => { const normalized = normalizeOption(option); const checked = values.includes(normalized.value); return <button type="button" role="menuitemcheckbox" aria-checked={checked} key={normalized.value} onClick={() => toggleFilterValue(filter, normalized.value)}>{normalized.label}{checked ? <Check /> : null}</button>; }) : <span className="bsh-filter-empty">请在数据定义中配置筛选项</span>}</div> : null}</div>;
        })}
      </div>
      <div className="bsh-query-end">
        <label className="bsh-search"><Search /><input value={query} onChange={event => onQueryChange(event.target.value)} placeholder={searchPlaceholder || '搜索记录'} /></label>
        <div className="bsh-advanced-filter"><Button className={selectedCount ? 'is-selected' : ''} aria-expanded={openMenu === 'advanced'} onClick={() => setOpenMenu(value => value === 'advanced' ? '' : 'advanced')}><Filter />筛选{selectedCount ? ` ${selectedCount}` : ''}</Button>{openMenu === 'advanced' ? <div className="bsh-filter-menu"><strong>当前筛选</strong><span className="bsh-filter-summary">已选择 {selectedCount} 个条件</span><button type="button" disabled={!selectedCount} onClick={onClearFilters}>清除条件{selectedCount ? <X /> : null}</button></div> : null}</div>
      </div>
    </div>
  );
}

const legacyColumnKeys = ['primary', 'type', 'start', 'end', 'days', 'status', 'signer', 'signStatus'];
const defaultSortOptions = [{ id: 'default', label: '排序方式' }];

function normalizedColumns(columns = []) {
  return columns.map((column, index) => typeof column === 'string'
    ? { key: legacyColumnKeys[index] || `field-${index}`, label: column, kind: index === 0 ? 'primary' : [1, 5, 7].includes(index) ? 'status' : 'text' }
    : { kind: 'text', ...column }
  );
}

function TableCell({ row, column }) {
  if (column.kind === 'primary') return <div className="bsh-primary-cell"><strong>{row[column.key] ?? row.primary}</strong><small>{row[column.secondaryKey || 'secondary'] || ''}</small></div>;
  if (column.kind === 'status-dot') return <StatusDot tone={row[column.toneKey] || column.tone || 'green'}>{row[column.key] ?? '—'}</StatusDot>;
  if (column.kind === 'status') return <StatusBadge tone={row[column.toneKey] || column.tone || 'neutral'}>{row[column.key] ?? '—'}</StatusBadge>;
  return row[column.key] ?? '—';
}

function TableView({ page, rows, onOpenDetail, onBatchAction }) {
  const columns = normalizedColumns(page.columns);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pageSize, setPageSize] = useState(page.pageSize || 10);
  const [pageIndex, setPageIndex] = useState(0);
  const selectAllRef = useRef(null);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const visibleRows = rows.slice(safePageIndex * pageSize, (safePageIndex + 1) * pageSize);
  const visibleIds = visibleRows.map(row => row.id);
  const selectedVisibleCount = visibleIds.filter(id => selectedIds.includes(id)).length;
  const allVisibleSelected = visibleRows.length > 0 && selectedVisibleCount === visibleRows.length;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = selectedVisibleCount > 0 && !allVisibleSelected;
  }, [selectedVisibleCount, allVisibleSelected]);

  useEffect(() => {
    setSelectedIds(current => {
      const next = current.filter(id => rows.some(row => row.id === id));
      return next.length === current.length ? current : next;
    });
    if (pageIndex > pageCount - 1) setPageIndex(pageCount - 1);
  }, [rows, pageCount, pageIndex]);

  function toggleAllVisible() {
    setSelectedIds(current => allVisibleSelected ? current.filter(id => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])]);
  }

  function toggleRow(id) {
    setSelectedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  const selectedRows = rows.filter(row => selectedIds.includes(row.id));
  return (
    <div className={classNames('bsh-table-container', selectedRows.length && 'has-batch-row')}>
      {selectedRows.length ? <div className="bsh-batch-bar"><span>已选择 <strong>{selectedRows.length}</strong> 条记录</span><div>{(page.batchActions || ['批量导出', '批量归档']).map(action => <Button key={action} onClick={() => onBatchAction?.(action, selectedRows)}>{action}</Button>)}<Button onClick={() => setSelectedIds([])}>取消选择</Button></div></div> : null}
      <div className="bsh-table-scroll"><table className="bsh-table"><thead><tr><th className="bsh-selection-cell"><input ref={selectAllRef} aria-label="选择当前页全部记录" type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} /></th>{columns.map(column => <th key={column.key}>{column.label}</th>)}<th>操作</th></tr></thead><tbody>{visibleRows.map(row => <tr key={row.id} onClick={() => onOpenDetail(row)}><td className="bsh-selection-cell"><input aria-label={`选择${row.primary || row.id}`} type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleRow(row.id)} onClick={event => event.stopPropagation()} /></td>{columns.map(column => <td key={column.key}><TableCell row={row} column={column} /></td>)}<td className="bsh-table-actions" onClick={event => event.stopPropagation()}><button type="button" onClick={() => onOpenDetail(row)}>查看</button><button type="button">编辑</button><button type="button">删除</button></td></tr>)}</tbody></table>{!visibleRows.length ? <div className="bsh-empty-state">暂无符合条件的记录</div> : null}</div>
      <Pagination total={rows.length} pageSize={pageSize} pageIndex={safePageIndex} onPageSizeChange={value => { setPageSize(value); setPageIndex(0); }} onPageIndexChange={setPageIndex} />
    </div>
  );
}

function Pagination({ total, pageSize, pageIndex, onPageSizeChange, onPageIndexChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? pageIndex * pageSize + 1 : 0;
  const end = Math.min(total, (pageIndex + 1) * pageSize);
  return <footer className="bsh-pagination"><span>显示{start}到{end}条记录，共{total}条数据</span><div><div className="bsh-page-size"><button type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>每页{pageSize}条<ChevronDown /></button>{menuOpen ? <div className="bsh-page-size-menu">{[10, 20, 50].map(size => <button type="button" key={size} onClick={() => { onPageSizeChange(size); setMenuOpen(false); }}>每页{size}条{pageSize === size ? <Check /> : null}</button>)}</div> : null}</div><button type="button" disabled={pageIndex === 0} onClick={() => onPageIndexChange(pageIndex - 1)}><ChevronLeft /></button><button type="button" className="is-current">{pageIndex + 1}</button><button type="button" disabled={pageIndex >= pageCount - 1} onClick={() => onPageIndexChange(pageIndex + 1)}><ChevronRight /></button></div></footer>;
}

function SidebarPage({ page, rows, queryProps, viewMode, onViewModeChange, onOpenDetail, onCreate, onRefresh }) {
  const [selectedGroup, setSelectedGroup] = useState(page.groups[0]?.id);
  const selectedGroupLabel = page.groups.find(group => group.id === selectedGroup)?.name || page.title;
  return (
    <main className="bsh-sidebar-page">
      <aside className="bsh-record-sidebar">
        <div className="bsh-sidebar-rail-header"><UpdateGroup page={page} onRefresh={onRefresh} compact /></div>
        <div className="bsh-sidebar-actions"><label className="bsh-sidebar-search"><Search /><input placeholder="请输入搜索内容" /></label><Button>更多<MoreHorizontal /></Button></div>
        <div className="bsh-group-list">{page.groups.map(group => <button className={classNames('bsh-group-card', selectedGroup === group.id && 'is-active')} type="button" aria-current={selectedGroup === group.id} key={group.id} onClick={() => setSelectedGroup(group.id)}><div><strong>{group.name}</strong><span>{group.count}</span></div><small>{group.description}</small><i><Eye /><Pencil /></i></button>)}</div>
      </aside>
      <section className="bsh-sidebar-page-main">
        <header className="bsh-sidebar-main-header"><h1>{selectedGroupLabel}</h1><div className="bsh-page-actions"><Button tone="primary" onClick={onCreate}><Plus />{page.createLabel}</Button><ViewModeMenu viewMode={viewMode} onViewModeChange={onViewModeChange} /><IconButton label="更多操作"><MoreHorizontal /></IconButton></div></header>
        <MetricStrip metrics={page.metrics} />
        <QueryToolbar {...queryProps} />
        <section className="bsh-record-surface"><TableView page={page} rows={rows.slice(0, 3)} onOpenDetail={onOpenDetail} /></section>
      </section>
    </main>
  );
}

function BoardView({ page, rows, onOpenDetail }) {
  const rowsForColumn = column => {
    if (!column.statuses?.length) return rows.slice(0, 2);
    return rows.filter(row => column.statuses.includes(row.status)).slice(0, 2);
  };
  return <div className="bsh-board">{page.boardColumns.map(column => <section className={`bsh-board-column bsh-board-column--${column.color}`} key={column.id}><header>{column.label}<span>({rowsForColumn(column).length})</span></header><div>{rowsForColumn(column).map(row => <article className="bsh-board-card" key={row.id} onClick={() => onOpenDetail(row)}><div><input aria-label={`选择${row.primary}`} type="checkbox" onClick={event => event.stopPropagation()} /><Bell /></div><strong>{row.primary}</strong><small>{row.start}</small><span>{row.status}</span><p>{row.signer} / {row.type}</p><footer><span><Paperclip /> 1</span><span><Eye /><Pencil /><Plus /></span></footer></article>)}</div></section>)}</div>;
}

// embedded：嵌入宿主平台（如陌衡企信 /preview 整页接管）时置 true —— 隐藏顶部 52px 平台用户栏
// （该层由宿主平台拥有，见规范「壳层所有权」platform-integrated 模式）；standalone 本地运行保持三段完整壳。
export function BasicApplicationShell({ definition = defaultApplicationDefinition, embedded = false, onApplicationChange, onBack, onCreateSubmit, onBatchAction, onLogout, onManageAccount }) {
  const [selectedAppId, setSelectedAppId] = useState(definition.application.id);
  const [activeModuleId, setActiveModuleId] = useState(definition.modules[0]?.id);
  const [activeTabId, setActiveTabId] = useState(definition.modules[0]?.tabs[0]?.id);
  const [viewMode, setViewMode] = useState('list');
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [activeSort, setActiveSort] = useState(definition.page.sortOptions?.[0]?.id || 'default');
  const [lastUpdatedAt, setLastUpdatedAt] = useState(definition.page.updatedAt);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [moduleSwitcherOpen, setModuleSwitcherOpen] = useState(false);
  const [globalPanelId, setGlobalPanelId] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailRow, setDetailRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const switcherRef = useRef(null);
  const accountRef = useRef(null);
  const globalActionsRef = useRef(null);
  const switcherTriggerRef = useRef(null);
  const accountTriggerRef = useRef(null);
  const globalTriggerRef = useRef(null);

  const activeModule = definition.modules.find(module => module.id === activeModuleId) || definition.modules[0];
  const ActiveModuleIcon = moduleIconMap[activeModule.icon] || Building2;
  const activeTabIdSafe = activeModule.tabs.some(tab => tab.id === activeTabId) ? activeTabId : activeModule.tabs[0]?.id;
  const page = { ...definition.page, ...(definition.pagesByTab?.[activeTabIdSafe] || {}) };
  const sortOptions = page.sortOptions?.length ? page.sortOptions : defaultSortOptions;
  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = (page.rows || []).filter(row => !normalizedQuery || Object.values(row).join(' ').toLowerCase().includes(normalizedQuery));
    (page.filters || []).map(normalizeFilter).forEach(filter => {
      const values = activeFilters[filter.key] || [];
      if (values.length && filter.rowKey) result = result.filter(row => values.includes(row[filter.rowKey]));
    });
    const sort = sortOptions.find(option => option.id === activeSort);
    if (sort?.key) result = [...result].sort((left, right) => String(left[sort.key] ?? '').localeCompare(String(right[sort.key] ?? ''), 'zh-CN') * (sort.direction === 'desc' ? -1 : 1));
    return result;
  }, [page.rows, page.filters, sortOptions, query, activeFilters, activeSort]);
  const activeApplication = definition.applications.find(app => app.id === selectedAppId) || definition.application;
  const selectedApplication = { ...definition.application, ...activeApplication, tierLabel: definition.application.tierLabel };

  const closeTransient = () => {
    setSwitcherOpen(false);
    setAccountOpen(false);
    setModuleSwitcherOpen(false);
    setGlobalPanelId('');
  };

  useOutsideClose(switcherOpen, switcherRef, () => setSwitcherOpen(false));
  useOutsideClose(accountOpen, accountRef, () => setAccountOpen(false));
  useOutsideClose(Boolean(globalPanelId), globalActionsRef, () => setGlobalPanelId(''));
  useFocusReturn(switcherOpen, switcherTriggerRef);
  useFocusReturn(accountOpen, accountTriggerRef);
  useFocusReturn(Boolean(globalPanelId), globalTriggerRef);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key !== 'Escape') return;
      setSwitcherOpen(false);
      setAccountOpen(false);
      setGlobalPanelId('');
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function selectApplication(app) {
    setSelectedAppId(app.id);
    setSwitcherOpen(false);
    onApplicationChange?.(app);
  }

  function selectModule(moduleId) {
    const module = definition.modules.find(item => item.id === moduleId) || definition.modules[0];
    setActiveModuleId(module.id);
    setActiveTabId(module.tabs[0]?.id);
    setModuleSwitcherOpen(false);
    closeTransient();
  }

  function selectTab(tabId) {
    setActiveTabId(tabId);
    setQuery('');
    setActiveFilters({});
    setActiveSort(definition.pagesByTab?.[tabId]?.sortOptions?.[0]?.id || definition.page.sortOptions?.[0]?.id || 'default');
    setLastUpdatedAt(definition.pagesByTab?.[tabId]?.updatedAt || definition.page.updatedAt);
    closeTransient();
  }

  function handleTabKeyDown(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = activeModule.tabs;
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    selectTab(tabs[nextIndex].id);
    event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  }

  const queryProps = {
    filters: page.filters || [],
    sortOptions,
    activeSort,
    onSortChange: setActiveSort,
    query,
    searchPlaceholder: page.searchPlaceholder,
    onQueryChange: setQuery,
    activeFilters,
    onFilterChange: (key, values) => setActiveFilters(current => ({ ...current, [key]: values })),
    onClearFilters: () => setActiveFilters({})
  };

  function toggleGlobalPanel(id) {
    setGlobalPanelId(current => current === id ? '' : id);
    setSettingsOpen(false);
    setSwitcherOpen(false);
    setAccountOpen(false);
  }

  return (
    <div className={classNames('bsh-root', embedded && 'is-embedded')}>
      {embedded ? null : <header className="bsh-topbar">
        <div className="bsh-brand"><img src={definition.brand.logoSrc} alt={definition.brand.name} /></div>
        <div className="bsh-topbar-cluster">
          <div className="bsh-popover-anchor" ref={switcherRef}>
            <IconButton ref={switcherTriggerRef} label="切换应用" className="bsh-switcher-trigger" active={switcherOpen} onClick={() => { setSwitcherOpen(value => !value); setAccountOpen(false); }}><AppWindow /></IconButton>
            {switcherOpen ? <ApplicationSwitcher apps={definition.applications} activeAppId={selectedAppId} onSelect={selectApplication} /> : null}
          </div>
          <div className="bsh-popover-anchor" ref={accountRef}>
            <button ref={accountTriggerRef} className="bsh-avatar-trigger" type="button" aria-label={`${definition.currentUser.name}，${definition.currentUser.role}`} onClick={() => { setAccountOpen(value => !value); setSwitcherOpen(false); }}><img src={definition.currentUser.avatarSrc} alt="" /></button>
            {accountOpen ? <AccountPopover user={definition.currentUser} onClose={() => setAccountOpen(false)} onManageAccount={onManageAccount} onLogout={onLogout} /> : null}
          </div>
        </div>
      </header>}

      <section className="bsh-app-navigation">
        <div className="bsh-app-navigation-start">{definition.application.backAction ? <button className="bsh-back-action" type="button" onClick={() => onBack?.(definition.application.backAction)}><ArrowLeft />{definition.application.backAction.label || '返回'}</button> : null}<div className="bsh-app-identity"><img src={selectedApplication.logoSrc} alt="" /><div><div className="bsh-app-title-row"><strong>{selectedApplication.name}</strong><span>{selectedApplication.tierLabel}</span></div><small>{selectedApplication.summary}</small></div></div></div>
        <div className="bsh-app-actions" ref={globalActionsRef}>
          <div className="bsh-app-action-group">{globalActions.slice(0, 2).map(action => <div className="bsh-action-anchor" key={action.id}><IconButton label={action.label} active={globalPanelId === action.id} onClick={event => { globalTriggerRef.current = event.currentTarget; toggleGlobalPanel(action.id); }}><action.Icon /></IconButton><span>{action.label}</span>{globalPanelId === action.id ? <GlobalActionPanel action={action} panel={definition.globalPanels[action.id]} /> : null}</div>)}</div>
          <div className="bsh-app-action-group">{globalActions.slice(2).map(action => <div className="bsh-action-anchor" key={action.id}><IconButton label={action.label} active={globalPanelId === action.id} onClick={event => { globalTriggerRef.current = event.currentTarget; toggleGlobalPanel(action.id); }}><action.Icon /></IconButton><span>{action.label}</span>{globalPanelId === action.id ? <GlobalActionPanel action={action} panel={definition.globalPanels[action.id]} /> : null}</div>)}</div>
          <Button className="bsh-upgrade-button"><Maximize2 />升级 Pro</Button>
          <IconButton label="应用设置" active={settingsOpen} onClick={() => { setSettingsOpen(value => !value); setGlobalPanelId(''); }}><Settings /></IconButton>
        </div>
      </section>

      <nav className="bsh-module-navigation" aria-label="应用模块和页面">
        {definition.modules.length > 1 ? <button className="bsh-module-anchor" type="button" aria-expanded={moduleSwitcherOpen} onClick={() => setModuleSwitcherOpen(true)}><span className="bsh-module-icon"><ActiveModuleIcon /></span><span><strong>{activeModule.label}</strong><small>{activeModule.kicker}</small></span><ChevronsUpDown /></button> : <div className="bsh-module-anchor is-static"><span className="bsh-module-icon"><ActiveModuleIcon /></span><span><strong>{activeModule.label}</strong><small>{activeModule.kicker}</small></span></div>}
        <div className="bsh-tabs" role="tablist">{activeModule.tabs.map((tab, index) => <button className={classNames('bsh-tab', activeTabIdSafe === tab.id && 'is-active')} key={tab.id} type="button" role="tab" aria-selected={activeTabIdSafe === tab.id} tabIndex={activeTabIdSafe === tab.id ? 0 : -1} onKeyDown={event => handleTabKeyDown(event, index)} onClick={() => selectTab(tab.id)}>{tab.label}</button>)}</div>
      </nav>

      {viewMode === 'sidebar' ? <SidebarPage page={{ ...page, updatedAt: lastUpdatedAt }} rows={rows} queryProps={queryProps} viewMode={viewMode} onViewModeChange={setViewMode} onOpenDetail={setDetailRow} onCreate={() => setFormOpen(true)} onRefresh={() => setLastUpdatedAt(new Date().toLocaleTimeString('zh-CN', { hour12: false }))} /> : <main className="bsh-page-frame"><PageHeader page={{ ...page, updatedAt: lastUpdatedAt }} viewMode={viewMode} onViewModeChange={setViewMode} onCreate={() => setFormOpen(true)} onRefresh={() => setLastUpdatedAt(new Date().toLocaleTimeString('zh-CN', { hour12: false }))} /><MetricStrip metrics={page.metrics} /><QueryToolbar {...queryProps} /><section className="bsh-record-surface">{viewMode === 'list' ? <TableView page={page} rows={rows} onOpenDetail={setDetailRow} onBatchAction={onBatchAction} /> : null}{viewMode === 'board' ? <BoardView page={page} rows={rows} onOpenDetail={setDetailRow} /> : null}</section></main>}

      {moduleSwitcherOpen ? <ModuleSwitcher modules={definition.modules} activeModuleId={activeModule.id} onSelect={selectModule} onClose={() => setModuleSwitcherOpen(false)} /> : null}
      {settingsOpen ? <SettingsDrawer application={selectedApplication} module={activeModule} onClose={() => setSettingsOpen(false)} /> : null}
      <DetailDrawer row={detailRow} detail={page.detail} onClose={() => setDetailRow(null)} />
      {formOpen ? <FormDialog definition={{ ...definition, page }} onSubmit={onCreateSubmit} onClose={() => setFormOpen(false)} /> : null}
      <span className="bsh-current-application" aria-live="polite">当前应用：{activeApplication.name}</span>
    </div>
  );
}
