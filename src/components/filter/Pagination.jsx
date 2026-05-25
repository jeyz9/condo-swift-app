const Pagination = ({ currentPage = 0, pageCount = 0, onPageChange, className = "" }) => {
  if (pageCount <= 1) return null;

  const handleClick = (page) => {
    if (!onPageChange) return;
    if (page < 0 || page >= pageCount) return;
    onPageChange(page);
  };

  return (
    <div className={`join flex justify-center ${className}`}>
      <button
        className="join-item btn"
        disabled={currentPage === 0}
        onClick={() => handleClick(currentPage - 1)}
        aria-label="Previous page"
      >
        «
      </button>

      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`join-item btn ${i === currentPage ? "btn-active bg-[#8C6239] text-white" : ""}`}
          aria-current={i === currentPage ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}

      <button
        className="join-item btn"
        disabled={currentPage + 1 === pageCount}
        onClick={() => handleClick(currentPage + 1)}
        aria-label="Next page"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
