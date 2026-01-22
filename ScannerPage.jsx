import axios from "axios"
import { useEffect, useState } from "react"
import "../pages/ScannerPage.css"
export default function ScannerPage() {
    const [qrCode, setQrCode] = useState({
        message: ""
    })

    const [scanner, setScanner] = useState({
        qrImage: ""
    });

    const handleQr = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/useScanner/generate", qrCode)
            .then((res) => {
                console.log(res.data);
                setScanner({
                    qrImage: res.data.data.qrImage
                });
            })
            .catch((err) => {console.log(err)});
    };

    return (
        <>
            <div className="Qr-container">

                <div onSubmit={handleQr}>
                    <div className="Qr-left">
                        <div className="Qr-text">
                            <div className="QR_image">
                                {scanner.qrImage ? (
                                    <img src={scanner.qrImage} alt="QR Code" />
                                ) : (
                                    <p>QR Image not available</p>
                                )}
                            </div>
                            <h1>GENERATE QR CODE</h1><hr style={{ width: '300px', marginLeft: '25px' }} />
                            <input onChange={(e) => { setQrCode({ ...qrCode, message: e.target.value }) }} type="text" placeholder="Enter Anything" required />
                            <button onClick={handleQr} type="submit">Generate QR</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}