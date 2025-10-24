import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { commafy } from 'commafy-anything'
import { useReactToPrint } from 'react-to-print';
import { Button } from '@mui/material';

const Ledger = () => {
    const [ledge, setLedge] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { state } = useLocation();
    const { customer } = state || {};
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    console.log("customer", customer)
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/transaction/getAllTransactionOfCustomer?customerId=${customer.customerId}`);
            if (!response.ok) {
                throw new Error(`Error fetching transactions: ${response.statusText}`);
            }
            const data = await response.json();
            const transactions = data.map((tsx) => {

                const accountType = tsx.paymentMode === "Cash" ? `Cash A/c ${tsx.Account.name}` : `Bank A/c ${tsx.Account.name}`

                return ({
                    date: tsx.date,
                    particulars: accountType + `${tsx.transactionType === "debit" ? ' Debited' : ' Credited'}`,
                    debit: tsx.transactionType === "debit" ? tsx.amount : "",
                    credit: tsx.transactionType === "credit" ? tsx.amount : "",
                    vchNo: tsx?.voucherNo ?? "Transaction",
                })
            });
            return transactions;
        } catch (err) {
            setError(err.message || 'Failed to fetch transactions');
        }
    };

    const fetchReceipts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/receipt/customerId?customerId=${customer.customerId}`);
            if (!response.ok) {
                throw new Error(`Error fetching receipts: ${response.statusText}`);
            }
            const data = await response.json();

            const receipts = data.map((receipt) => ({
                date: receipt.date,
                particulars: `${receipt.products?.[0].details.cropName ?? 'Not availaible'} Seeds ${receipt.saleType}`,
                debit: receipt.saleType === "Sale" ? receipt.finalAmount : "",
                credit: receipt.saleType === "Buy" ? receipt.finalAmount : "",
                vchNo: receipt?.parchiNo,
            }));
            return receipts;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const transaction = await fetchTransactions();
            const receipts = await fetchReceipts();
            const newData = [...transaction, ...receipts]
            newData.sort((a, b) => new Date(a.date) - new Date(b.date))
            setLedge([...newData])
            setLoading(false);
        }
        fetchData()
    }, []);

    // Calculate totals
    const totalCredit = ledge.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
    const totalDebit = ledge.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);


    return (
        <>
            <div ref={contentRef} className="col-span-10 p-6 ml-12 mr-12">
                <Button onClick={() => reactToPrintFn()}>Print</Button>
                <div style={styles.header}>
                    <h2 style={styles.companyName}>Satyam Beej Bhandar</h2>
                    <p style={styles.address}>Gram - Jaloda, Vikas Khand Moman Badodiya, Dist. - Shajapur</p>
                    <h3 style={styles.accountTitle}>Ledger Account</h3>
                    {
                        ledge.length > 0 ? (<p style={styles.dateRange}>{new Date(ledge[0].date).toLocaleDateString()}-{new Date(ledge[ledge.length - 1].date).toLocaleDateString()}</p>) : null
                    }
                </div>
                <div class="mb-6 p-4 rounded-2xl border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-800">{customer.name}</h2>
                            <p class="text-sm text-gray-600">📞 +91 {customer.phoneNo}</p>
                            <p class="text-sm text-gray-600">🏠 {customer.address}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-500 mt-2">Closing Balance</p>
                            <p
                                className={`text-lg font-bold ${(totalDebit - totalCredit) > 0 ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                ₹{commafy(Math.abs(totalCredit - totalDebit).toFixed(2))}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={styles.container}>

                    {loading ? (
                        <div style={styles.loader}>Loading...</div>
                    ) : error ? (
                        <div style={styles.error}>{error}</div>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.tableHeader}>Date</th>
                                    <th style={styles.tableHeader}>Particulars</th>
                                    <th style={styles.tableHeader}>Voucher No.</th>
                                    <th style={styles.tableHeader}>Debit</th>
                                    <th style={styles.tableHeader}>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledge.map((entry, index) => (
                                    <tr key={index} style={styles.tableRow}>
                                        <td style={styles.tableCell}>{new Date(entry.date).toLocaleDateString()}</td>
                                        <td style={styles.tableCell}><strong>{entry.particulars}</strong></td>
                                        <td style={styles.tableCell}>{entry.vchNo}</td>
                                        <td style={{ ...styles.tableCell }}>
                                            {commafy(entry.debit ? Number(entry.debit).toFixed(2) : "")}
                                        </td>
                                        <td style={{ ...styles.tableCell }}>
                                            {commafy(entry.credit ? Number(entry.credit).toFixed(2) : "")}
                                        </td>
                                    </tr>
                                ))}

                                <tr>
                                    <td style={styles.tableCell}>{new Date().toLocaleDateString()}</td>
                                    <td style={styles.tableCell}>{"Balance Amount"}</td>
                                    <td style={styles.tableCell}>{""}</td>
                                    <td style={{ ...styles.tableCell, color: 'red' }}>
                                        {(totalCredit - totalDebit) > 0
                                            ? commafy((totalCredit - totalDebit).toFixed(2))
                                            : ""}
                                    </td>
                                    <td style={{ ...styles.tableCell, color: 'green' }}>
                                        {(totalDebit - totalCredit) > 0
                                            ? commafy((totalDebit - totalCredit).toFixed(2))
                                            : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={styles.tableCell} ></td>
                                    <td style={{ ...styles.tableCell }}></td>
                                    <td style={{ ...styles.tableCell }}></td>
                                    <td style={{ ...styles.tableCell, borderColor: "black", borderTop: "2px" }}>{commafy(Math.max(totalCredit.toFixed(2), totalDebit.toFixed(2)))}</td>
                                    <td style={{ ...styles.tableCell }}>{commafy(Math.max(totalCredit.toFixed(2), totalDebit.toFixed(2)))}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        margin: '20px auto',
        maxWidth: '1200px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: "18px"
    },
    title: {
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    loader: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#555',
    },
    error: {
        textAlign: 'center',
        fontSize: '18px',
        color: 'red',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        padding: '10px',
        fontSize: '16px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd',
    },

    tableCell: {
        padding: '5px',
        textAlign: 'left',
        fontSize: '17px',
        color: 'black',
    },
};

export default Ledger;
