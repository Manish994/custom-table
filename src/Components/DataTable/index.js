import React from "react";
import "./datatable.css";
import ReactDOM from "react-dom";
import Pagination from "../Pagination";

class DataTable extends React.Component {
  _preSearchData = null;

  constructor(props) {
    super(props);

    this.state = {
      headers: props.headers,
      data: props.data,
      pagedData: props.data,
      sortby: null,
      descending: null,
      search: false,
      pageLength: this.props.pagination.pageLength || 5,
      currentPage: 3,
    };
    this.keyField = props.keyField || "id";
    this.noData = props.noData || "No Record Found !";
    this.width = props.width || "100%";

    //Add Pagination Support
    this.pagination = this.props.pagination;
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
          ref={(th) => (this[cleanTitle] = th)} //this.id, this.name, this.profile, this.qualification, this.rating
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
    let { headers } = this.state;
    let data = this.pagination ? this.state.pagedData : this.state.data;
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

  onSearch = (e) => {
    //Grab the search text
    // let neddle = e.target.value.trim().toLowerCase();

    //Empty input Box
    // if (!neddle) {
    //   this.setState({
    //     data: this._preSearchData,
    //   });
    // }

    let { headers } = this.state;
    let data = this._preSearchData;

    // Grab the index of the target column
    let idx = e.target.dataset.idx;

    // Get the target column name
    let targetCol = this.state.headers[idx].accessor;

    // Filter the records
    let searchData = this._preSearchData.filter((row) => {
      let show = true;

      for (let field in row) {
        let fieldValue = row[field];
        let inputId = "inp" + field;
        let input = this[inputId];
        // id,name,profile,age is empty then show = true;
        if (!fieldValue === "") {
          show = true;
        } else {
          show =
            fieldValue
              .toString()
              .toLowerCase()
              .indexOf(input.value.toString().toLowerCase()) > -1;

          if (!show) break;
        }
      }
      return show;
    });
    // let searchData = this._preSearchData.filter((row) => {
    //   return row[targetCol].toString().toLowerCase().indexOf(neddle) > -1;
    // });

    // Update the state
    this.setState(
      {
        data: searchData,
        pagedData: searchData,
        totalRecords: searchData,
      },
      () => {
        if (this.pagination.enabled) {
          this.onGotoPage(1);
        }
      }
    );
  };

  renderSearch = () => {
    let { search, headers } = this.state;
    if (!search) {
      return null;
    }

    let searchInputs = headers.map((header, headerIdx) => {
      //Get the header ref (renderTableHeader = th=> th[clientTitle] = th)
      let hdr = this[header.accessor];

      let inputId = "inp" + header.accessor;

      return (
        <td key={headerIdx}>
          <input
            type="text"
            ref={(input) => (this[inputId] = input)}
            data-idx={headerIdx}
            style={{ width: hdr.clientWidth - 23 + "px" }}
          />
        </td>
      );
    });

    return <tr onChange={this.onSearch}>{searchInputs}</tr>;
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
        <tbody>
          {this.renderSearch()}
          {contentView}
        </tbody>
      </table>
    );
  };

  onToggleSearch = (e) => {
    if (this.state.search) {
      this.setState({
        data: this._preSearchData,
        search: false,
      });
      this._preSearchData = null;
    } else {
      this._preSearchData = this.state.data;
      this.setState({
        search: true,
      });
    }
  };

  renderToolbar = () => {
    return (
      <div className="toolbar">
        <button onClick={this.onToggleSearch}>Search</button>
      </div>
    );
  };

  getPagedData = (pageNo, pageLength) => {
    let startOfRecord = (pageNo - 1) * pageLength;
    let endOfRecord = startOfRecord + pageLength;

    let data = this.state.data;
    let pagedData = data.slice(startOfRecord, endOfRecord);

    return pagedData;
  };

  onPageLengthChange = (pageLength) => {
    //when state hook is update than callback function is executed
    this.setState(
      {
        pageLength: parseInt(pageLength, 10),
      },
      () => {
        this.onGotoPage(this.state.currentPage);
      }
    );
  };

  onGotoPage = (pageNo) => {
    let pagedData = this.getPagedData(pageNo, this.state.pageLength);
    this.setState({
      pagedData: pagedData,
      currentPage: pageNo,
    });
  };

  componentDidMount() {
    if (this.pagination.enabled) {
      this.onGotoPage(this.state.currentPage);
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.pagination.enabled && (
          <Pagination
            type={this.props.pagination.type}
            totalRecords={this.state.data.length}
            pageLength={this.state.pageLength}
            onPageLengthChange={this.onPageLengthChange}
            currentPage={this.state.currentPage}
            onGotoPage={this.onGotoPage}
          />
        )}
        {this.renderToolbar()}
        {this.renderTable()}
      </div>
    );
  }
}

export default DataTable;
