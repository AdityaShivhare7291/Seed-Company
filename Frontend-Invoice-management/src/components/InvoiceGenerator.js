import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from "react-to-print";
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

const ReceiptInvoice = () => {
    const { state } = useLocation();
    const { receiptDatam } = state || {};
    console.log({ receiptDatam });

    const [customerDetails, setCustomerDetails] = useState({});

    // Destructure necessary data from receiptDatam
    const {
        lotNumber,
        amount,
        deduction,
        discount,
        finalAmount,
        netWeight,
        noOfBags,
        rate,
        saleType,
        weightType,
        productList,
        workerDetails,
        accountDetails,
        accountId,
        productId,
        customerId
    } = receiptDatam || {};

    const productName = productList?.filter((product) => product.cropId === productId)[0]?.cropName || "N/A";
    const cropVariety = productList?.filter((product) => product.cropId === productId)[0]?.Variety || "N/A";
    const accountName = accountDetails?.filter((account) => account.accountId === parseInt(accountId))[0]?.name || "N/A";
    console.log({ accountName, accountDetails, accountId })
    const workerName = workerDetails?.userDetails?.name || "N/A";


    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await fetch(
                    `/api/customer/getCustomerDetails?customerId=${customerId}`
                );
                const result = await response.json();
                console.log("Customer Details", { result });
                setCustomerDetails(result);
            } catch (error) {
                console.error('Failed to fetch customer details:', error);
            }
        };
        fetchCustomerDetails();
    }, [customerId]);

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <div className="col-span-10 p-6 ml-12 mr-12">
            <button onClick={() => reactToPrintFn()}>Print</button>
            <div ref={contentRef}>
                <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Invoice</h2>

                    {/* Customer Details Section */}
                    <div
                        style={{
                            marginBottom: '20px',
                            padding: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            backgroundColor: '#f0f8ff',
                        }}
                    >
                        <h1 style={{ marginBottom: '10px', color: '#333' }}><strong>Customer Details</strong></h1>
                        <p><strong>Name:</strong> {customerDetails.name || "N/A"}</p>
                        <p><strong>Address:</strong> {customerDetails.address || "N/A"}</p>
                        <p><strong>Phone:</strong> {customerDetails.phoneNo || "N/A"}</p>
                    </div>

                    {/* Invoice Details Section */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0px',
                            border: '1px solid #ddd',
                            padding: '20px',
                            borderRadius: '10px',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <div style={{ padding: '10px' }}>
                            <p><strong>Lot Number:</strong> {lotNumber}</p>
                            <p><strong>Account Name:</strong> {accountName}</p>
                        </div>
                        <div style={{ padding: '10px' }}>
                            <p><strong>Worker Name:</strong> {workerName}</p>
                            <p><strong>Amount:</strong> ₹{amount?.toFixed(2)}</p>
                        </div>
                        <div style={{ padding: '10px' }}>
                            <p><strong>Crop Name:</strong> {productName}</p>
                            <p><strong>Crop Variety:</strong> {cropVariety}</p>
                            <p><strong>Buy OR Sale</strong> {saleType}</p>
                        </div>
                        <div style={{ padding: '10px' }}>
                            <p><strong>Rate:</strong> ₹{rate} /KG</p>
                            <p><strong>Quantity:</strong> {noOfBags} Bags</p>
                        </div>
                        <div style={{ padding: '10px' }}>
                            <p><strong>Net Weight:</strong> {netWeight} /KG</p>
                            <p><strong>Deduction:</strong> {deduction?.toFixed(2)}</p>
                        </div>
                        <div style={{ padding: '10px' }}>
                            <p><strong>Discount:</strong> ₹{isNaN(discount) ? "0" : discount?.toFixed(2)}</p>
                            <p><strong>Final Amount:</strong> ₹{finalAmount?.toFixed(2)}</p>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#555' }}>
                        Thank you for your business!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReceiptInvoice;
