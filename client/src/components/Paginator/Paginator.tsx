import ReactPaginateImport from "react-paginate";
import "./Paginator.css";

type ReactPaginateType = typeof ReactPaginateImport;

const Paginate =
  (ReactPaginateImport as unknown as { default?: ReactPaginateType }).default ??
  ReactPaginateImport;

type Props = {
  pageCount: number;
  pageIndex: number;
  onPageChange: (nextIndex: number) => void;
};

type PageChangeEvent = {
  selected: number;
};

export default function Paginator({
  pageCount,
  pageIndex,
  onPageChange,
}: Props) {
  if (pageCount <= 1) return null;

  return (
    <div className="Paginator">
      <Paginate
        forcePage={pageIndex}
        pageCount={pageCount}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={(e: PageChangeEvent) => onPageChange(e.selected)}
        previousLabel="Prev"
        nextLabel="Next"
        breakLabel="…"
        containerClassName="Paginator__list"
        pageClassName="Paginator__item"
        pageLinkClassName="Paginator__link"
        activeClassName="Paginator__item--active"
        previousClassName="Paginator__item"
        nextClassName="Paginator__item"
        disabledClassName="Paginator__item--disabled"
        previousLinkClassName="Paginator__link"
        nextLinkClassName="Paginator__link"
        breakClassName="Paginator__item"
        breakLinkClassName="Paginator__link"
      />
    </div>
  );
}
