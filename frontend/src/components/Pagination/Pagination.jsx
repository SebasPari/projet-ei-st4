export function Pagination({ currentPage, totalPages, onPageClick }) {
  const pages = [];
  const firstPage = Math.max(currentPage - 2, 1);
  const lastPage = Math.min(currentPage + 2, totalPages);

  if (totalPages > 0) {
    pages.push(
      <button
        key="previous"
        onClick={() => onPageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    );
  }

  for (let i = firstPage; i <= lastPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageClick(i)}
        disabled={i === currentPage}
      >
        {i}
      </button>
    );
  }

  if (lastPage < totalPages) {
    pages.push(
      <button key="dots" disabled>
        ...
      </button>
    );
    pages.push(
      <button key="last-page" disabled>
        {totalPages}
      </button>
    );
  }

  if (totalPages > 0) {
    pages.push(
      <button
        key="next"
        onClick={() => onPageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    );
  }

  return <div className="pagination">{pages}</div>;
}
