import React from "react";
import "./datatable.css";

class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = { headers: props.headers, data: props.data };
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
          {title}
        </th>
      );
    });
    return headerView;
  };

  renderTable = () => {
    let title = this.props.title || "Data-Table";
    let headerView = this.renderTableHeader();
    let contentView = "Content Goes here";

    return (
      <table className="data-inner-table">
        <caption className="data-table-caption">{title}</caption>
        <thead>
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
