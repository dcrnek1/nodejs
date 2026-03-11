import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

export default function PaginationComponent({page, total}) {
  const currentPage = page > total ? total : page < 1 ? 1 : page;
  const previousPage = currentPage > 1 && currentPage <= total ? currentPage - 1 : currentPage == 1 ? false : 1;
  const nextPage = currentPage < total ? currentPage + 1 : false;

  const maxVisible = 3; // number of pages to show around current
  let startPage = Math.max(currentPage - 1, 1);
  let endPage = startPage + maxVisible - 1;

  if (endPage > total) {
    endPage = total;
    startPage = Math.max(endPage - maxVisible + 1, 1);
  }


  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  
  const paginationItems = []
  pages.forEach(p => {
      paginationItems.push(<PaginationLink key={p} isActive={currentPage === p} to={`?page=${p}`}>{p}</PaginationLink>);
    });


  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious to={`?page=${previousPage}`} className={!previousPage && "pointer-events-none opacity-30"}/>
        </PaginationItem>
        {startPage > 1 && 
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>}
        {paginationItems.map((item) => item)}
        {endPage < total && 
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>}
        <PaginationItem>
          <PaginationNext to={`?page=${nextPage}`} className={!nextPage && "pointer-events-none opacity-30"} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
