const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const uri = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
app.use(cors());

const fetchTransactions = async () => {
    try {
        const response = await axios.get(uri);
        return response.data; // Return the transactions data
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return []; // Return an empty array on error
    }
};

app.get('/', async (req, res) => {
    const transactions = await fetchTransactions();
    res.send(transactions);
});

app.get('/statistics', async (req, res) => {
    const month = req.query.month;
    const transactions = await fetchTransactions();

    if (!transactions.length) {
        return res.json({ totalSales: 0, totalSold: 0, totalNotSold: 0 });
    }

    let filteredTransactions;
    
    if (month === '00') {
        filteredTransactions = transactions; // Include all transactions
        
    } else {
        const monthRegex = new RegExp(`^${month}`);
        filteredTransactions = transactions.filter(transaction => {
            const date = new Date(transaction.dateOfSale);
            const transactionMonth = String(date.getMonth() + 1).padStart(2, '0');
            return transactionMonth === month;
        });
    }

    const totalSales = filteredTransactions.reduce((sum, transaction) => sum + transaction.price, 0);
    const totalSold = filteredTransactions.filter(transaction => transaction.sold).length;
    const totalNotSold = filteredTransactions.filter(transaction => !transaction.sold).length;

    res.json({
        totalSales,
        totalSold,
        totalNotSold,
    });
});


app.get('/statistics/bar', async (req, res) => {
    const month = req.query.month;
    const transactions = await fetchTransactions();

    if (!transactions.length) {
        return res.json([]);
    }

    const filteredTransactions = transactions.filter(transaction => {
        const date = new Date(transaction.dateOfSale);
        const transactionMonth = String(date.getMonth() + 1).padStart(2, '0');
        return transactionMonth === month;
    });

    res.json(filteredTransactions);
});

app.get('/statistics/pie', async (req, res) => {
    const selectedMonth = req.query.month;
    const transactions = await fetchTransactions();

    const categoryCounts = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.dateOfSale);
        const transactionMonth = String(date.getMonth() + 1).padStart(2, '0');

        if (transactionMonth === selectedMonth) {
            const category = transaction.category; // Assuming 'category' is a field in your transaction data
            if (category) {
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        }
    });

    const result = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
    }));

    res.json(result);
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
