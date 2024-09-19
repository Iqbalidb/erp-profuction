import React from "react";

const CriticalProcessExpandRow = ( { data } ) => {
  return (
    <div
      style={{ backgroundColor: "white", color: "black" }}
      className="expandable-content p-2"
    >
      <p>
        <span>
          <strong>Critical Process : </strong>
          {data.name},{" "}
        </span>

        <span>
          <strong>Status :</strong>{" "}
          {data.status === true ? "Active" : "Inactive"}
        </span>
      </p>
    </div>
  );
};

export default CriticalProcessExpandRow;
