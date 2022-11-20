import React, { Fragment } from "react";

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.currentPage = 1;
    this.pageLength = this.props.pageLength;
  }

  onPageLengthChange = (e) => {
    //pass value from onPageLengthChange function to parent Component
    this.props.onPageLengthChange(this.pageLenthInput.value);
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
    return (
      <div className="pagination">
        {/* Render Array Of Component */}
        {[PageSelector]}
      </div>
    );
  }
}

export default Pagination;
