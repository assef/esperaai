export default function Loading() {
  return (
    <div className="detail-layout">
      <div className="detail-back-bar" />
      <div className="detail-main-col" style={{ gap: 18, display: 'flex', flexDirection: 'column' }}>
        <div className="skeleton" style={{ height: 36, width: '70%', borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 20, width: '40%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 140, borderRadius: 22 }} />
      </div>
    </div>
  );
}
