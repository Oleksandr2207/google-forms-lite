import { Link } from "react-router-dom";
import { useFormsQuery } from "../../api/formsApi";
import FormCard from "../../components/FormCard/FormCard";
import Paginator from "../../components/Paginator/Paginator";
import { usePagination } from "../../hooks/usePagination";
import "./HomePage.css";

export default function HomePage() {
  const { data, isLoading, isError } = useFormsQuery();
  const forms = data ?? [];
  const { pageCount, pageIndex, setPageIndex, slice } = usePagination({
    totalItems: forms.length,
    itemsPerPage: 3,
  });
  const pageForms = forms.slice(slice.start, slice.end);

  return (
    <div className="HomePage stack">
      <div className="panel">
        <div className="panelHeader">
          <div>
            <div className="HomePage__h">Your forms</div>
            <div className="muted">Create, fill and view responses</div>
          </div>
          <Link className="btn btnPrimary" to="/forms/new">
            Create new form
          </Link>
        </div>
        <div className="panelBody">
          {isLoading ? <div className="muted">Loading…</div> : null}
          {isError ? (
            <div className="error">
              Failed to load forms. Is the server running?
            </div>
          ) : null}

          {forms.length ? (
            <div className="HomePage__grid">
              {pageForms.map((f) => (
                <FormCard key={f.id} form={f} />
              ))}
            </div>
          ) : !isLoading && !isError ? (
            <div className="HomePage__empty">
              <div style={{ fontWeight: 700 }}>No forms yet</div>
              <div className="muted">
                Create your first form to get started.
              </div>
            </div>
          ) : null}

          {forms.length > 3 ? (
            <Paginator
              pageCount={pageCount}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
