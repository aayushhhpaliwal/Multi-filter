import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";

import Select from "react-select";
import "react-select/dist/react-select.css";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData(),
      filtered: [],
      select2: undefined
    };
  }

  onFilteredChangeCustom = (value, accessor) => {
    let filtered = this.state.filtered;
    let insertNewFilter = 1;

    if (filtered.length) {
      filtered.forEach((filter, i) => {
        if (filter["id"] === accessor) {
          if (value === "" || !value.length) filtered.splice(i, 1);
          else filter["value"] = value;

          insertNewFilter = 0;
        }
      });
    }

    if (insertNewFilter) {
      filtered.push({ id: accessor, value: value });
    }

    this.setState({ filtered: filtered });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <pre>{JSON.stringify(this.state.filtered)}</pre>
        <br />
        <br />
        Extern Select2 :{" "}
        <Select
          style={{ width: "50%", marginBottom: "20px" }}
          onChange={(entry) => {
            this.setState({ select2: entry });
            this.onFilteredChangeCustom(
              entry.map((o) => {
                return o.value;
              }),
              "firstName"
            );
          }}
          value={this.state.select2}
          multi={true}
          options={this.state.data.map((o, i) => {
            return { id: i, value: o.firstName, label: o.firstName };
          })}
        />
        <ReactTable
          data={data}
          filterable
          filtered={this.state.filtered}
          onFilteredChange={(filtered, column, value) => {
            this.onFilteredChangeCustom(value, column.id || column.accessor);
          }}
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;
            if (typeof filter.value === "object") {
              return row[id] !== undefined
                ? filter.value.indexOf(row[id]) > -1
                : true;
            } else {
              return row[id] !== undefined
                ? String(row[id]).indexOf(filter.value) > -1
                : true;
            }
          }}
          columns={[
            {
              Header: "Name",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName"
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: (d) => d.lastName
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age"
                },
                {
                  Header: "Over 21",
                  accessor: "age",
                  id: "over",
                  Cell: ({ value }) => (value >= 21 ? "Yes" : "No")
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
