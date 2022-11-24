import React, { Fragment } from "react";
import "../Pagination/pagination.css";

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: this.props.currentPage || 1,
    };
  }

  onPageLengthChange = (e) => {
    //pass value from onPageLengthChange function to parent Component
    this.props.onPageLengthChange(this.pageLenthInput.value);
  };

  onPrevPage = (e) => {
    if (this.state.currentPage === 1) return;
    this.onGotoPage(this.state.currentPage - 1);
  };

  onGotoPage = (pageNo) => {
    if (pageNo === this.state.currentPage) return;
    if (this.currentPageInput) {
      this.currentPageInput.value = pageNo;
    }

    this.setState({
      currentPage: pageNo,
    });

    this.props.onGotoPage(pageNo);
  };

  _getPaginationButtons = (text) => {
    let classNames = "pagination-btn";

    if (this.state.currentPage === text) {
      classNames += " current-page ";
    }

    let html = (
      <button
        key={`btn-${text}`}
        id={`btn-${text}`}
        className={classNames}
        onClick={(e) => {
          this.onGotoPage(text);
        }}
      >
        {text}
      </button>
    );
    return html;
  };

  onNextPage = (e) => {
    //yedi pages vand dherai vayo vane return
    if (this.state.currentPage > this.pages - 1) return;

    this.onGotoPage(this.state.currentPage + 1);
  };

  render() {
    //Get total display page
    let totalRecords = this.props.totalRecords;
    let pages = Math.ceil(totalRecords / this.props.pageLength);
    this.pages = pages;

    let PageSelector = (
      <Fragment key="page-fragment">
        <span key="page-selector" className="page-selector">
          Rows per page :
          <input
            key="page-input"
            type="number"
            min="1"
            //input box maa lekhe ko value lai pageLengthInput maa set gareko chhu
            // ref ko use gare ra directly access garna sakchhu
            ref={(input) => (this.pageLenthInput = input)}
            defaultValue={this.props.pageLength || 5}
            onChange={this.onPageLengthChange}
          ></input>
        </span>
      </Fragment>
    );

    let prevButton = (
      <button
        key="prev"
        className="pagination-btn-prev"
        onClick={this.onPrevPage}
      >
        {"<"}
      </button>
    );

    let nextButton = (
      <button
        key="next"
        className="pagination-btn-next"
        onClick={this.onNextPage}
      >
        {">"}
      </button>
    );

    let buttons = [];
    if (this.props.type === "long") {
      for (let i = 1; i <= pages; i++) {
        buttons.push(this._getPaginationButtons(i));
      }
    } else if (this.props.type === "short") {
      buttons.push(
        <input
          type="number"
          className="current-page-input"
          key="currentPageInput"
          max={this.pages}
          defaultValue={this.state.currentPage}
          ref={(input) => {
            this.currentPageInput = input;
          }}
          onChange={this.onCurrentPageChange}
        ></input>
      );
    }
    return (
      <div className="pagination">
        {/* Render Array Of Component */}
        {[PageSelector, prevButton, buttons, nextButton]}
      </div>
    );
  }
}

export default Pagination;
