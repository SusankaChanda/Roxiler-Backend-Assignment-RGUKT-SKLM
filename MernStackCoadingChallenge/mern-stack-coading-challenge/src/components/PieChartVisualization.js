import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const PieChartVisualization = ({ selectedMonth }) => {
    const [data, setData] = useState([]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF69B4', '#D2691E'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/statistics/pie?month=${selectedMonth}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching pie chart data:', error);
                setData([]); // Optional: Clear data on error
            }
        };

        fetchData();
    }, [selectedMonth]);

    if (!data.length) return <p>No data available for this month.</p>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Tooltip />
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartVisualization;
