import React, { useState } from "react";

const GateManagement = () => {
  const [gates, setGates] = useState([
    { gateId: "G1", gateName: "Main Entrance", location: "Front Building" },
    { gateId: "G2", gateName: "Back Gate", location: "Warehouse Area" },
  ]);

  const [newGate, setNewGate] = useState({ gateName: "", location: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleAddGate = () => {
    if (!newGate.gateName.trim()) return alert("Please enter gate name");
    const newId = `G${gates.length + 1}`;
    setGates([...gates, { gateId: newId, ...newGate }]);
    setNewGate({ gateName: "", location: "" });
  };

  const handleDeleteGate = (id) => {
    setGates(gates.filter((gate) => gate.gateId !== id));
  };

  const handleEditGate = (index) => {
    setEditIndex(index);
    setNewGate({
      gateName: gates[index].gateName,
      location: gates[index].location,
    });
  };

  const handleUpdateGate = () => {
    const updatedGates = [...gates];
    updatedGates[editIndex] = {
      ...updatedGates[editIndex],
      ...newGate,
    };
    setGates(updatedGates);
    setEditIndex(null);
    setNewGate({ gateName: "", location: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Gate Management
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Gate Name"
          value={newGate.gateName}
          onChange={(e) =>
            setNewGate({ ...newGate, gateName: e.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
        />
        <input
          type="text"
          placeholder="Location (optional)"
          value={newGate.location}
          onChange={(e) =>
            setNewGate({ ...newGate, location: e.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
        />

        {editIndex === null ? (
          <button
            onClick={handleAddGate}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Gate
          </button>
        ) : (
          <button
            onClick={handleUpdateGate}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Update Gate
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-medium border-b">
                Gate ID
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium border-b">
                Gate Name
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium border-b">
                Location
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-medium border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {gates.map((gate, index) => (
              <tr
                key={gate.gateId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-4 border-b">{gate.gateId}</td>
                <td className="py-2 px-4 border-b">{gate.gateName}</td>
                <td className="py-2 px-4 border-b">{gate.location}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleEditGate(index)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGate(gate.gateId)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {gates.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="py-4 text-center text-gray-500 italic"
                >
                  No gates added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GateManagement;
