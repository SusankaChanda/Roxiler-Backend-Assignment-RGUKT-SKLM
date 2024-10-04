import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styling/transactionDashboard.css';
import Visualization from './Visualization';
import Statistics from './Statistics';
import PieChartVisualization from './PieChartVisualization';

const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const TransactionDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedDescription, setExpandedDescription] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('03'); // Default month is March
    const [statistics, setStatistics] = useState({ totalSales: 0, totalSold: 0, totalNotSold: 0 });
    const [loading, setLoading] = useState(false);
    const transactionsPerPage = 10;
    const [visualizationState, setVisualizationState] = useState({
        stats: false,
        visual: false,
        piechart: false,
        allStats: false,
    });

    // Fetch transactions from the API
    const handleAPI = async () => {
        setLoading(true);
        try {
            const response = await axios("http://localhost:5000/");
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAllStats = () => {
        setVisualizationState(prevState => ({
            ...prevState,
            allStats: !prevState.allStats,
            stats: !prevState.allStats,
            visual: !prevState.allStats,
            piechart: !prevState.allStats,
        }));
    };

    // Fetch statistics based on the selected month
    const fetchStatistics = async (month) => {
        setLoading(true);
        try {
            console.log("Selected Month =", month);
            const response = await axios.get(`http://localhost:5000/statistics?month=${month}`);
            setStatistics(response.data);
        } catch (error) {
            console.error("Error fetching statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleAPI();
        fetchStatistics(selectedMonth); // Fetch statistics for the default month
    }, []);

    useEffect(() => {
        fetchStatistics(selectedMonth); // Fetch statistics whenever the month changes
        setCurrentPage(1); // Reset to first page on month change
    }, [selectedMonth]);

    // Filter transactions based on search term and selected month
    const filteredTransactions = transactions.filter((transaction) => {
        const date = new Date(transaction.dateOfSale);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month in "MM" format
        const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMonth = month === selectedMonth;

        return matchesSearch && matchesMonth;
    });

    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
    const lastIndex = currentPage * transactionsPerPage;
    const firstIndex = lastIndex - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(firstIndex, lastIndex);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const toggleDescription = (id) => {
        setExpandedDescription(expandedDescription === id ? null : id);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className='main-container'>
            <div className='sub-container'>
                <div className='heading-main-container'>
                    <div className='heading-container'><h1>Transaction Dashboard</h1></div>
                </div>
                <div className='filters-container'>
                    <div className='filters-sub-container'>
                        <p className='filter-name'>Search Any :- </p>
                        <input
                            type="text"
                            placeholder="Search by title or description"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='input-bar'
                        />
                    </div>
                    <div className='filters-sub-container'>
                        <p className='filter-name'>Select Month</p>
                        <select className='input-bar'
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}>
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='filters-sub-container'>
                        <button className='all-stats-button' onClick={handleAllStats}>
                            Click me to get all Statistics
                        </button>
                    </div>
                </div>

                <div>
                    <div className='filter-button-container'>
                        <div>
                            <button className='filter-buttons' onClick={() => setVisualizationState(prev => ({ ...prev, stats: !prev.stats }))}>
                                Click me to View Statistics - {monthNames[selectedMonth - 1]}  
                            </button>
                            {visualizationState.stats && <Statistics selectedMonth={selectedMonth} months={months} statistics={statistics} />}
                        </div>
                        <div>
                            <button className='filter-buttons' onClick={() => setVisualizationState(prev => ({ ...prev, visual: !prev.visual }))}>
                                Click me to View Bargraph - {monthNames[selectedMonth - 1]}   
                            </button>
                            {visualizationState.visual && <Visualization selectedMonth={selectedMonth} />}
                        </div>
                        <div>
                            <button className='filter-buttons' onClick={() => setVisualizationState(prev => ({ ...prev, piechart: !prev.piechart }))}>
                                Click me to View PieChart - {monthNames[selectedMonth - 1]}   
                            </button>
                            {visualizationState.piechart && <PieChartVisualization selectedMonth={selectedMonth} />}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <h1 className='transaction-heading'>Transactions of {monthNames[selectedMonth - 1]}</h1>
                    </div>
                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>TITLE</th>
                                    <th>DESCRIPTION</th>
                                    <th>PRICE</th>
                                    <th>CATEGORY</th>
                                    <th>SOLD</th>
                                    <th>IMAGE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTransactions.map((each) => (
                                    <tr key={each.id}>
                                        <td>{each.id}</td>
                                        <td>{each.title}</td>
                                        <td>
                                            <div className={expandedDescription === each.id ? 'description expanded' : 'description'}>
                                                {each.description}
                                            </div>
                                            {expandedDescription === each.id ? (
                                                <button className='show-more-button' onClick={() => toggleDescription(each.id)}>Read less....</button>
                                            ) : (
                                                <button className='show-more-button' onClick={() => toggleDescription(each.id)}>Read more.....</button>
                                            )}
                                        </td>
                                        <td>{each.price}</td>
                                        <td>{each.category}</td>
                                        <td>{each.sold ? "Yes" : "No"}</td>
                                        <td>
                                            <img src={each.image} alt={each.title} width="50" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous Page</button>
                    <span>{currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDashboard;
