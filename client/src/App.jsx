import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/bills/user/:userId" replace />} /> */}

        <Route path="/" element={<h1>landing</h1>} />

        {/* user */}
        <Route path="/users/register" element={<h1>RegisterPAge</h1>} />
        <Route path="/users/login" element={<h1>LoginPage</h1>} />
        <Route path="/users/:id" element={<h1>ProfilePage</h1>} />

        {/* bill */}
        <Route path="/bills/add-bill" element={<h1>Addbill</h1>} />
        <Route path="/bills/user/:userId" element={<h1>All bills</h1>} />
        <Route path="/bills/:id" element={<h1>BillById</h1>} />
        <Route path="/bills/upload-image" element={<h1>UploadBill</h1>} />

        {/* items */}
        <Route
          path="/items/bill/:billId"
          element={<h1>all items in bill</h1>}
        />

        {/* partisipan */}
        <Route
          path="/participants/bill/:billId"
          element={<h1>all items in bill</h1>}
        />

        {/* alokasi */}
        <Route
          path="/allocations/item/:itemId"
          element={<h1>all items in bill</h1>}
        />
        <Route
          path="/allocations/participant/:participantId"
          element={<h1>all partisipan in bill</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
