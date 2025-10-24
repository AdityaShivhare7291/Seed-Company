import React, { useEffect, useState, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import AuthContext from "./AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./store/slice/ProductSlice";
import { addCustomer } from "./store/slice/CustomerSlice";
import { addAccount } from "./store/slice/AccountSlice";
import TabbedPage from "./pages/TabPages";
import NoPageFound from "./pages/NoPageFound";
import ProtectedWrapper from "./ProtectedWrapper";
import api from "./services/api";

// Lazy Load Components
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Layout = React.lazy(() => import("./components/Layout"));
const CustomerAdd = React.lazy(() => import("./pages/CustomerAdd"));
const ProductAdd = React.lazy(() => import("./pages/ProductAdd"));
const CustomerPage = React.lazy(() => import("./pages/CustomerPage"))
const ReceiptAdd = React.lazy(() => import("./pages/ReceiptAdd"))
const TransactionAdd = React.lazy(() => import("./pages/AddTransaction"))
const AccountUpdatedPage = React.lazy(() => import("./pages/AccountUpdatedPages"))
const AccountPage = React.lazy(() => import("./pages/AccountPage"));
const StockPage = React.lazy(() => import("./pages/StockPage"))
const SendMail = React.lazy(() => import("./pages/SendEmailPage"))
const InvoiceGenerator = React.lazy(() => import("./components/InvoiceGenerator"))
const ImageReceipt = React.lazy(() => import("./pages/ImageReceipt"))
const OverviewDetails = React.lazy(() => import("./pages/OverviewDetails"))
const PdfComponent = React.lazy(() => import('./pages/DayStats.js'))


const App = () => {

  const [user, setUser] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(true);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails)

  const fetchInitialData = async () => {
    try {
      const [products, customers, accounts] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getAccounts()
      ]);

      dispatch(setProducts(products));
      dispatch(addCustomer(customers));
      dispatch(addAccount(accounts.data || accounts));
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  let value = { user, signin, signout };

  if (isFetchingData) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedWrapper>
                  <Layout />
                </ProtectedWrapper>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/customer/add" element={<CustomerAdd />} />
              <Route path="/product/add" element={<ProductAdd />} />
              <Route path="/customer/viewAll" element={<CustomerPage />} />
              <Route path="/customer/receiptAdd" element={<ImageReceipt />} />
              <Route path="/customer/tabs" element={<TabbedPage />} />
              <Route path="/customer/addTransaction" element={<TransactionAdd />} />
              <Route path="/accountPage" element={<AccountUpdatedPage />} />
              <Route path="/accountPageList" element={<AccountPage />} />
              <Route path="/StockList" element={<StockPage />} />
              <Route path="/sendMail" element={<SendMail />} />
              <Route path="/invoiveGenerator" element={<InvoiceGenerator />} />
              <Route path="/overview" element={<OverviewDetails />} />
              <Route path="/pdfViewer" element={<PdfComponent />} />

            </Route>
            <Route path="/imageReceipt" element={<ImageReceipt />} />
            <Route path="*" element={<NoPageFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
