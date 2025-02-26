import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import RegisterPage from "./pages/Register.page";
import LoginPage from "./pages/Login.page";
import AddBillPage from "./pages/AddBill.page";
import UploadBillPage from "./pages/UploadBill.page";
import BillsPage from "./pages/Bills.page";
import AddParticipantsPage from "./pages/AddParticipant.page";
import AllocateItemsPage from "./pages/AllocateItems.page";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/bills/user/:userId" replace />} /> */}

          <Route path="/" element={<h1>landing</h1>} />

          {/* user */}
          <Route path="/users/register" element={<RegisterPage />} />
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/:id" element={<h1>ProfilePage</h1>} />

          {/* bill */}
          {/* <Route path="/bills/add-bill" element={<h1>Addbill</h1>} />
          <Route path="/bills/user/:userId" element={<h1>All bills</h1>} />
          <Route path="/bills/:id" element={<h1>BillById</h1>} />
          <Route path="/bills/upload-image" element={<h1>UploadBill</h1>} /> */}

          <Route path="/bills" element={<BillsPage />} />
          <Route path="/bills/:id" element={<h1>Bill Detail Page</h1>} />
          <Route path="/bills/upload" element={<UploadBillPage />} />
          <Route path="/bills/add" element={<AddBillPage />} />
          <Route
            path="/bills/add-participants/:billId"
            element={<AddParticipantsPage />}
          />
          <Route
            path="/bills/allocate-items/:billId"
            element={<AllocateItemsPage />}
          />

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
    </Provider>
  );
}

export default App;
