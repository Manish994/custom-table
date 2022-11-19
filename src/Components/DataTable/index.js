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

      return (
        <th
          key={cleanTitle}
          ref={(th) => (this.th = th)}
          style={{ width: width }}
          data-col={cleanTitle}
        >
          <span data-col={cleanTitle} className="header-cell">
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
    debugger;
    console.log(e.target);
    let data = this.state.data.slice(); // create duplicate array from original array
    let colIndex = ReactDOM.findDOMNode(e.target).parentNode.cellIndex;
    console.log(colIndex);
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
