import "./App.css";
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);

    let model = {
      headers: [
        { title: "ID", accessor: "id", index: 0 },
        {
          title: "Profile",
          accessor: "profile",
          index: 1,
          width: 80,
          cell: { type: "image", style: { width: "50px" } },
        },
        { title: "Name", accessor: "name", index: 2 },
        { title: "Age", accessor: "age", index: 3 },
        { title: "Qualification", accessor: "qualification", index: 4 },
        {
          title: "Rating",
          accessor: "rating",
          index: 5,
          width: 200,
          cell: (row) => (
            <div className="rating">
              <div
                styles={{
                  backgroundColor: "lightskyblue",
                  textAlign: "center",
                  height: "1.9em",
                  width: (row / 5) * 201 + "px",
                  margin: "3px 0 4px 0",
                }}
              >
                {row}
              </div>
            </div>
          ),
        },
      ],
      data: [
        {
          id: 1,
          name: "a",
          age: 29,
          qualification: "B.Tech",
          rating: 4,
          profile:
            "https://cdn.pixabay.com/photo/2021/12/14/16/15/city-6870803_960_720.jpg",
        },
        {
          id: 2,
          name: "b",
          age: 10,
          qualification: "M.Tech",
          rating: 4,
          profile:
            "https://cdn.pixabay.com/photo/2021/12/14/16/15/city-6870803_960_720.jpg",
        },
        {
          id: 3,
          name: "c",
          age: 54,
          qualification: "MSC",
          rating: 3,
          profile:
            "https://cdn.pixabay.com/photo/2021/12/14/16/15/city-6870803_960_720.jpg",
        },
      ],
    };

    for (var i = 4; i <= 20; i++) {
      model.data.push({
        id: i,
        name: "name " + i,
        age: i + 15,
        qualification: "Graduate " + i,
        rating: i % 2 ? 3 : 4,
        profile:
          "https://cdn.pixabay.com/photo/2021/12/14/16/15/city-6870803_960_720.jpg",
      });
    }
    this.state = model;
  }
  render() {
    return <div className="App"></div>;
  }
}
export default App;
