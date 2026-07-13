// 🟢 Pure Server Component (No "use client", no MUI imports)
export default function HomeLoading() {
  const skeletonHeights = [
    320, 240, 400, 280, 360, 300, 420, 260, 380, 310, 340, 290,
  ];

  return (
    <div className="loading-container">
      <div className="masonry-skeleton">
        {skeletonHeights.map((height, i) => (
          <div
            key={i}
            className="skeleton-card"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>

      <style>{`
        .loading-container {
          padding: 24px;
          width: 100%;
          box-sizing: border-box;
        }

        .masonry-skeleton {
          column-gap: 16px;
        }

        .skeleton-card {
          break-inside: avoid; /* Prevents cards from splitting awkwardly across columns */
          margin-bottom: 16px;
          width: 100%;
          background-color: #2c2e33;
          border-radius: 12px;
          animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Responsive Columns matching your Material UI breakpoints natively */
        @media (min-width: 0px) {
          .masonry-skeleton { column-count: 2; }
        }
        @media (min-width: 600px) {
          .masonry-skeleton { column-count: 3; }
        }
        @media (min-width: 900px) {
          .masonry-skeleton { column-count: 4; }
        }
        @media (min-width: 1200px) {
          .masonry-skeleton { column-count: 5; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}