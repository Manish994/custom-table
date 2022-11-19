import React from "react";
import "./datatable.css";
import ReactDOM from "react-dom";

class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      headers: props.headers,
      data: props.data,
      sortby: null,
      descending: null,
    };
    this.keyField = props.keyField || "id";
    this.noData = props.noData || "No Record Found !";
    this.width = props.width || "100%";
  }

  onDragOver = (e) => {
    e.preventDefault();
  };

  onDragStart = (e, sourceIdxValue) => {
    e.dataTransfer.setData("text/plain", sourceIdxValue);
  };

  onDrop = (e, targetIdxValue) => {
    e.preventDefault();
    let source = e.dataTransfer.getData("text/plain");
    let headers = [...this.state.headers];
    let srcHeader = headers[source];
    let targetHeader = headers[targetIdxValue];

    let temp = srcHeader.index;
    srcHeader.index = targetHeader.index;
    targetHeader.index = temp;

    this.setState({
      headers,
    });
  };

  renderTableHeader = () => {
    let { headers } = this.state;
    headers.sort((a, b) => {
      if (a.index > b.index) return 1;
      return -1;
    });

    let headerView = headers.map((header, index) => {
      let title = header.title;
      let cleanTitle = header.accessor;
      let width = header.width;

      if (this.state.sortby === index) {
        title += this.state.descending ? "\u2193" : "\u2191";
      }

      return (
        <th
          key={cleanTitle}
          ref={(th) => (this.th = th)}
          style={{ width: width }}
          data-col={cleanTitle}
          onDragStart={(e) => this.onDragStart(e, index)}
          onDragOver={this.onDragOver}
          onDrop={(e) => this.onDrop(e, index)}
        >
          <span draggable data-col={cleanTitle} className="header-cell">
            {title}
          </span>
        </th>
      );
    });
    return headerView;
  };

  renderNoData = () => {
    return (
      <tr>
        <td colSpan={this.header.length}>{this.noData}</td>
      </tr>
    );
  };

  renderContent = () => {
    let { headers, data } = this.state;
    let conentView = data.map((row, rowIdx) => {
      let id = row[this.keyField];

      let tds = headers.map((header, headerIdx) => {
        let content = row[header.accessor];
        let cell = header.cell;

        if (cell) {
          if (typeof cell === "object") {
            if (cell.type === "image" && content) {
              content = (
                <img style={cell.style} src={content} alt="loading"></img>
              );
            }
          } else if (typeof cell === "function") {
            content = cell(content);
          }
        }

        return (
          <td key={headerIdx} data-id={id} data-row={rowIdx}>
            {content}
          </td>
        );
      });
      return <tr key={id}>{tds}</tr>;
    });
    return conentView;
  };

  onSort = (e) => {
    let data = this.state.data.slice(); // create duplicate array from original array
    let colIndex = ReactDOM.findDOMNode(e.target).parentNode.cellIndex;
    let colTitle = e.target.dataset.col;

    let descending = !this.state.descending;

    data.sort((a, b) => {
      let sortVal = 0;
      if (a[colTitle] < b[colTitle]) {
        sortVal = -1; //0 vanda sano value aauchha ?
      } else if (a[colTitle] > b[colTitle]) {
        sortVal = 1; // 0 vanda thulo value aaucha ?
      }
      if (descending) {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });

    this.setState({
      data,
      sortby: colIndex,
      descending,
    });
  };

  renderTable = () => {
    let title = this.props.title || "Data-Table";
    let headerView = this.renderTableHeader();
    let contentView =
      this.state.data.length > 0 ? this.renderContent() : this.renderNoData();

    return (
      <table className="data-inner-table">
        <caption className="data-table-caption">{title}</caption>
        <thead onClick={this.onSort}>
          <tr>{headerView}</tr>
        </thead>
        <tbody>{contentView}</tbody>
      </table>
    );
  };

  render() {
    return <div className={this.props.className}>{this.renderTable()}</div>;
  }
}

export default DataTable;
