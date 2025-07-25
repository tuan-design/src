import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Dashboard, 
  Transactions, 
  Categories, 
  Reports, 
  AddTransaction
} from './pages';
import { Navbar, Sidebar } from './components';
import { AuthContext } from './context';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sheetId, setSheetId] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [financialData, setFinancialData] = useState({
    income: 0,
    expense: 0,
    savings: 0,
    balance: 0,
    expenseCategories: []
  });

  // Xử lý tham số URL khi ứng dụng khởi chạy
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const apiParam = queryParams.get('api');
    const sheetIdParam = queryParams.get('sheetId');
    
    if (apiParam && sheetIdParam) {
      setApiUrl(decodeURIComponent(apiParam));
      setSheetId(decodeURIComponent(sheetIdParam));
      
      // Tạo user mặc định từ tham số URL
      const defaultUser = {
        name: "Quản trị viên",
        email: "admin@miniapp.com"
      };
      
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
      localStorage.setItem('apiUrl', apiParam);
      localStorage.setItem('sheetId', sheetIdParam);
    } else {
      // Thử lấy dữ liệu từ localStorage nếu không có tham số URL
      const savedUser = localStorage.getItem('user');
      const savedApiUrl = localStorage.getItem('apiUrl');
      const savedSheetId = localStorage.getItem('sheetId');
      
      if (savedUser && savedApiUrl && savedSheetId) {
        setUser(JSON.parse(savedUser));
        setApiUrl(savedApiUrl);
        setSheetId(savedSheetId);
      }
    }
    
    setLoading(false);
  }, []);

  // Lấy dữ liệu tài chính
  const fetchFinancialData = async () => {
    if (!apiUrl || !sheetId) return;
    
    try {
      const response = await axios.get(apiUrl, {
        params: {
          action: 'getFinancialSummary',
          sheetId: sheetId,
          startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        }
      });
      
      if (response.data && !response.data.error) {
        setFinancialData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tài chính:', error);
    }
  };

  // Thêm giao dịch mới
  const addNewTransaction = async (transaction) => {
    if (!apiUrl || !sheetId) return false;
    
    try {
      const response = await axios.post(apiUrl, {
        ...transaction,
        action: 'addTransaction',
        sheetId: sheetId
      });
      
      if (response.data && response.data.success) {
        fetchFinancialData();
        return true;
      }
    } catch (error) {
      console.error('Lỗi khi thêm giao dịch:', error);
    }
    return false;
  };

  // Cập nhật dữ liệu khi có thay đổi
  useEffect(() => {
    if (apiUrl && sheetId) {
      fetchFinancialData();
      
      // Kiểm tra kết nối định kỳ mỗi 5 phút
      const interval = setInterval(fetchFinancialData, 300000);
      return () => clearInterval(interval);
    }
  }, [apiUrl, sheetId]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f7fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader"></div>
          <p style={{ marginTop: 20 }}>Đang kết nối với dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!apiUrl || !sheetId) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f7fa',
        padding: 20,
        textAlign: 'center'
      }}>
        <div>
          <h2>Thiếu thông tin kết nối</h2>
          <p>
            Vui lòng truy cập ứng dụng thông qua liên kết từ bot Telegram với đầy đủ tham số:
          </p>
          <code>
            https://miniappshare.netlify.app/?api=URL_API&sheetId=ID_SHEET
          </code>
          <p style={{ marginTop: 20 }}>
            <a href="/" style={{ color: '#4caf50' }}>
              Thử lại
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ 
        user, 
        sheetId, 
        apiUrl, 
        financialData,
        addNewTransaction,
        fetchFinancialData
      }}>
        <Router>
          <div className="app-container">
            <Navbar />
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/add-transaction" element={<AddTransaction />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
