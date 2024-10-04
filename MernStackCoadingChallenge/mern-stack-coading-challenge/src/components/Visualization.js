import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Visualization = ({ selectedMonth }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/statistics/bar/?month=${selectedMonth}`);
                const transactions = response.data;

                console.log(transactions); // Log the fetched transactions for debugging

                const ranges = [
                    { range: '0-100', count: 0 },
                    { range: '101-200', count: 0 },
                    { range: '201-300', count: 0 },
                    { range: '301-400', count: 0 },
                    { range: '401-500', count: 0 },
                    { range: '501-600', count: 0 },
                    { range: '601-700', count: 0 },
                    { range: '701-800', count: 0 },
                    { range: '801-900', count: 0 },
                    { range: '901-above', count: 0 },
                ];

                transactions.forEach(transaction => {
                    const price = transaction.price;

                    if (price <= 100) ranges[0].count++;
                    else if (price <= 200) ranges[1].count++;
                    else if (price <= 300) ranges[2].count++;
                    else if (price <= 400) ranges[3].count++;
                    else if (price <= 500) ranges[4].count++;
                    else if (price <= 600) ranges[5].count++;
                    else if (price <= 700) ranges[6].count++;
                    else if (price <= 800) ranges[7].count++;
                    else if (price <= 900) ranges[8].count++;
                    else ranges[9].count++; // For 901 and above
                });

                setData(ranges);
            } catch (error) {
                console.error('Error fetching transaction statistics:', error);
                setData([]); // Clear data on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth]);

    // Loading state
    if (loading) return <p>Loading...</p>;

    // Check if data is available
    if (!data.length) return <p>No transactions available for this month.</p>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Visualization;
