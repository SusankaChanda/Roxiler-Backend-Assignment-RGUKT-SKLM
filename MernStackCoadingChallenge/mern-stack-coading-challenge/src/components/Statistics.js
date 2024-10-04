import React from 'react'

const Statistics = ({selectedMonth,months,statistics}) => {
  return (
    <div>
        <div className="statistics">
            <h2>Statistics for {months.find(month => month.value === selectedMonth).label}</h2>
            <p>Total Sales: ${statistics.totalSales}</p>
            <p>Total Sold Items: {statistics.totalSold}</p>
            <p>Total Not Sold Items: {statistics.totalNotSold}</p>
        </div>
    </div>
  )
}

export default Statistics
