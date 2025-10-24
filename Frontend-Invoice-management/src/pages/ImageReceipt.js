
import ReceiptAdd from './ReceiptAdd';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useReactToPrint } from "react-to-print";
import { Button } from '@mui/material';
import "./ImageReceipt.css"
import ReceiptForm from './ReceiptForm';

function ImageReceipt() {

    const [data, setData] = useState({});
    const { state } = useLocation();  // Get passed props from state
    const { customerId } = state || {};  // Destructure the customer object
    const navigate = useNavigate()
    console.log("customer Id", { customerId })
    const [customerDetails, setCustomerDetails] = useState({})

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await fetch(
                    `/api/customer/getCustomerDetails?customerId=${customerId}`
                );
                const result = await response.json();
                console.log("Customer Details", { result });
                setData({ ...data, name: result.name, address: result.address });
                setCustomerDetails(result);
            } catch (error) {
                console.error('Failed to fetch customer details:', error);
            }
        };
        fetchCustomerDetails();
    }, [customerId]);


    const handleBackClick = () => {
        console.log("Hello back")
        navigate('/customer/viewAll')
    }




    const positions = {
        lotNo: { top: "189px", left: "116px" },
        parchiNo: { top: "219px", left: "145px" },
        date: { top: "82px", left: "488px" },
        name: { top: "113px", left: "67px" },
        address: { top: "114px", left: "415px" },
        truckNo: { top: "138px", left: "340px" },
        accountId: { top: "0%", left: "10%" },
        weightType: { top: "20%", left: "5%" },
        saleType: { top: "25%", left: "5%" },
        tonWeight: { top: "190px", left: "471px" },
        noOfBags: { top: "246px", left: "78px" },
        deduction: { top: "216px", left: "452px" },
        packingSize: { top: "244px", left: "272px" },
        rate: { top: "274px", left: "78px" },
        discount: { top: "55%", left: "5%" },
        description: { top: "60%", left: "5%" },
        cropName: { top: "162px", left: "115px" },
        cropVariety: { top: "169px", left: "320px" },
        netWeight: { top: "245px", left: "450px" },
        amount: { top: "80%", left: "5%" },
        finalAmount: { top: "273px", left: "293px" },
        removeSeriesNo: { top: "85px", left: "87px" }
    };

    console.log({ data })
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] h-screen" style={{ height: "100vh" }}>
            {/* Left Side: Background Image */}
            <div >
                <div className="p-4" style={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton
                        onClick={handleBackClick}
                        aria-label="Go back"
                        sx={{
                            color: 'black', // Customize color
                            backgroundColor: '#f0f0f0', // Light background
                            '&:hover': { backgroundColor: '#e0e0e0' }, // Hover effect
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Button onClick={() => reactToPrintFn()}>Print</Button>
                </div>
                <div
                    style={{
                        position: "relative",
                        width: "600px",
                        height: "400px",
                        backgroundImage: `url(${require('../assets/Untitled-design-2.jpg')})`,
                        backgroundSize: "cover", // Ensures the image covers the entire container
                        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
                        transformOrigin: 'center', // Ensures rotation happens from the center
                    }}
                    ref={contentRef}
                >
                    {/* Overlay with Fields */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            color: "white",
                            padding: "20px",
                            overflowX: "hidden",
                        }}
                        className="flex flex-col gap-4"
                    >
                        <div
                            key={data?.date ?? "145822"}
                            style={{
                                position: "absolute",
                                ...positions["date"], // Apply dynamic positioning
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "16px",
                                padding: "5px",
                                borderRadius: "5px",
                                backgroundColor: "white",
                            }}
                        >
                            <span className="">{data ? (new Date(data.date).toLocaleDateString()) : (new Date().toLocaleDateString())}</span>

                        </div>

                        {
                            data?.name ?

                                (
                                    <div
                                        key={"name"}
                                        style={{
                                            position: "absolute",
                                            ...positions["name"], // Apply dynamic positioning
                                            color: "white",
                                            width: "200px",
                                            height: "20px",
                                            backgroundColor: "white",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            paddingTop: "0px",
                                            paddingBottom: "0px",
                                        }}
                                    >

                                        <span className="" style={{
                                            position: "absolute", top: "0px", left: "0px", paddingTop: "0px", zIndex: 100,
                                            paddingBottom: "0px", backgroundColor: "white", paddingRight: "20px", fontSize: "15px"
                                        }}>{data?.name ?? ""}</span>
                                        <span className="" style={{
                                            position: "relative", top: "-1px", paddingTop: "0px", zIndex: 99,
                                            paddingBottom: "0px", left: "74px", paddingRight: "211px", color: "white", backgroundColor: "white", fontSize: "8px"
                                        }}>Adita</span>
                                    </div>
                                ) : null

                        }

                        {
                            data?.varieties?.length > 0 && (
                                <div
                                    key={2223}
                                    style={{
                                        position: "absolute",
                                        ...positions["cropVariety"],
                                        height: "25px",
                                        fontSize: "12px",
                                        padding: "2px",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 500
                                    }}
                                >
                                    {data.varieties.map((v, index) => (
                                        <span key={v.id}>
                                            {v.variety}{index !== data.varieties.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </div>
                            )
                        }


                        {data.saleType !== "Select Sale Type" ? (data.saleType === "Buy" ? (
                            <div
                                key={"4478454545454545454"}
                                style={{
                                    position: "absolute",
                                    ...positions["date"],
                                    left: "266px", // Apply dynamic positioning
                                    borderRadius: "5px",
                                    backgroundColor: "black",
                                    width: "25px", height: "25px"

                                }}
                            >


                            </div>
                        ) : (
                            <div
                                key={"4478454545454545454"}
                                style={{
                                    position: "absolute",
                                    ...positions["date"], // Apply dynamic positioning
                                    left: "382px",
                                    borderRadius: "5px",
                                    backgroundColor: "black",
                                    width: "25px", height: "25px"

                                }}
                            >
                            </div>
                        )) : null

                        }
                        <div style={{ position: "absolute" }}></div>
                        {
                            data?.address ?

                                (
                                    <div
                                        key={"address"}
                                        style={{
                                            position: "absolute",
                                            ...positions["address"], // Apply dynamic positioning
                                            color: "white",
                                            width: "200px",
                                            height: "20px",
                                            backgroundColor: "white",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            paddingTop: "0px",
                                            paddingBottom: "0px",
                                        }}
                                    >

                                        <span className="" style={{
                                            position: "absolute", top: "0px", left: "0px", paddingTop: "0px", zIndex: 100,
                                            paddingBottom: "0px", backgroundColor: "white", paddingRight: "20px", fontSize: "15px"
                                        }}>{customerDetails?.address}</span>
                                        <span className="" style={{
                                            position: "relative", top: "-1px", paddingTop: "0px", zIndex: 99,
                                            paddingBottom: "0px", left: "74px", paddingRight: "81px", color: "white", backgroundColor: "white", fontSize: "8px"
                                        }}>Adita</span>
                                    </div>
                                ) : null

                        }
                        {
                            data?.truckNo ?

                                (
                                    <div
                                        key={"truckNo"}
                                        style={{
                                            position: "absolute",
                                            ...positions["truckNo"], // Apply dynamic positioning
                                            color: "white",
                                            width: "200px",
                                            height: "20px",
                                            backgroundColor: "white",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            paddingTop: "0px",
                                            paddingBottom: "0px",
                                        }}
                                    >

                                        <span className="" style={{
                                            position: "absolute", top: "0px", left: "0px", paddingTop: "0px", zIndex: 100,
                                            paddingBottom: "0px", backgroundColor: "white", paddingRight: "20px", fontSize: "15px"
                                        }}>{data?.truckNo
                                            ?? "undefined"}</span>
                                        <span className="" style={{
                                            position: "relative", top: "-1px", paddingTop: "0px", zIndex: 99,
                                            paddingBottom: "0px", left: "74px", paddingRight: "142px", color: "white", backgroundColor: "white", fontSize: "8px"
                                        }}>Adita</span>
                                    </div>
                                ) : null

                        }
                        <div
                            key={"removeSeriesNo"}
                            style={{
                                position: "absolute",
                                ...positions["removeSeriesNo"], // Apply dynamic positioning
                                color: "white",
                                width: "103px",
                                height: "20px",
                                backgroundColor: "white",
                                fontWeight: "bold",
                                fontSize: "16px",
                                paddingTop: "0px",
                                paddingBottom: "0px",
                            }}
                        >
                            <span className="" style={{
                                position: "relative", top: "-1px", paddingTop: "0px", zIndex: 99,
                                paddingBottom: "0px", left: "0px", color: "black", backgroundColor: "white", fontSize: "8px"
                            }}></span>
                        </div>
                        {Object.entries(data)?.map(([key, value]) => {
                            if (key === "weightType" || key === "saleType" || key === "discount" || key === "description" || key === "amount" || key === "name" || key === "phoneNo" || key === "date" || key === 'varieties')
                                return null;

                            return (
                                (
                                    <div
                                        key={key}
                                        style={{
                                            position: "absolute",
                                            ...positions[key], // Apply dynamic positioning
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            padding: "5px",
                                            borderRadius: "5px",

                                        }}
                                    >
                                        <span className="">{value}</span>

                                    </div>
                                ))

                        }) ?? null}
                    </div>
                </div>
            </div>
            {/* Right Side: Receipt Information Component */}
            <div style={{ position: "relative", overflowY: "auto" }}>
                <div className="flex justify-center items-center bg-gray-100">
                    <ReceiptForm data={(value) => setData(value)} />
                    {/* <ReceiptAdd data={setData} /> */}
                </div>
            </div>
        </div >


    );
}

export default ImageReceipt;
