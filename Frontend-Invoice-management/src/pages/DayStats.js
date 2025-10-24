import { useEffect, useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';
import axios from 'axios';
import DataTable from './DataTable';

const PdfComponent = () => {
    const targetRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileUpload = async () => {
        console.log("this function is running")
        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('File uploaded and email sent successfully!');
            } else {
                alert('Error in uploading file or sending email.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred during the file upload.');
        }
    };

    useEffect(() => {
        console.log({ selectedFile })
    }, [selectedFile])

    return (
        <div className='col-span-10 p-6 ml-12 mr-12'>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select File</label>
                <input type="file" onChange={handleFileChange} />
                <button onClick={() => handleFileUpload()} >Submit</button>
            </div>
            <button onClick={() => generatePDF(targetRef, { filename: 'page.pdf' })}>Download PDF</button>

            <div ref={targetRef}>
                <DataTable />
            </div>
        </div>
    )
}
export default PdfComponent;