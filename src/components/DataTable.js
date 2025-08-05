import React, { useEffect, useState } from "react";
import { List } from "react-virtualized";
import "./styles/DataTable.css";

const generateMockData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Client ${index + 1}`,
    email: `client${index + 1}@example.com`,
  }));
};

const DataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulating API fetch
    const fetchData = async () => {
      const mockData = generateMockData(100000); // Generate 100,000 records
      setData(mockData);
      setFilteredData(mockData);
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term)
    );

    setFilteredData(filtered);
  };

  const rowRenderer = ({ index, key, style }) => {
    const item = filteredData[index];
    return (
      <div key={key} style={style} className="row">
        <span>{item.id}</span>
        <span>{item.name}</span>
        <span>{item.email}</span>
      </div>
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search clients..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="table-container">
        <List
          width={800}
          height={500}
          rowCount={filteredData.length}
          rowHeight={40}
          rowRenderer={rowRenderer}
        />
      </div>
    </div>
  );
};

export default DataTable;
