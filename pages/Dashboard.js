import React, { useContext, useEffect, useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress,
  Box
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  ArrowUpward, 
  ArrowDownward,
  Savings
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { AuthContext } from '../context';

const Dashboard = () => {
  const { financialData, fetchFinancialData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    if (financialData.expenseCategories && financialData.expenseCategories.length > 0) {
      const formattedData = financialData.expenseCategories.map(item => ({
        name: item.category,
        value: item.amount
      }));
      setChartData(formattedData);
      setLoading(false);
    } else {
      // Nếu không có dữ liệu, thử tải lại sau 5s
      const timer = setTimeout(() => {
        fetchFinancialData();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [financialData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Tổng quan tài chính
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Thu nhập
              </Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <ArrowUpward style={{ color: '#4caf50', marginRight: 8 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(financialData.income)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Chi tiêu
              </Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <ArrowDownward style={{ color: '#f44336', marginRight: 8 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(financialData.expense)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Tiết kiệm
              </Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <Savings style={{ color: '#ff9800', marginRight: 8 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(financialData.savings)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Số dư
              </Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <AccountBalanceWallet style={{ color: '#2196f3', marginRight: 8 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(financialData.balance)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 20, height: 400, borderRadius: 12 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Phân bổ chi tiêu
            </Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography>Không có dữ liệu chi tiêu</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
