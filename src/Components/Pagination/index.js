import React, { Fragment } from "react";

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
  render() {
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
    return (
      <div className="pagination">
        {/* Render Array Of Component */}
        {[PageSelector, prevButton]}
      </div>
    );
  }
}

export default Pagination;
