const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9090; 

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.status(200).send(`<h1 style="text-align:center;">Welcome in Anuradha Backend</h1>`);
})

// Proxy requests to Digilocker API
app.post('/get-token', async (req, res) => {
    const { payload } = req.body;
    
    const url = process.env.DIGI_URL_1;
    const Code = payload;
    console.log("Code",Code);

    const grantType = 'authorization_code';
    const clientId = 'AW6A72E90E';
    const clientSecret = '88c23091c8b73a89b7a2';
    const redirectUri = 'https://verified-adharcard.vercel.app/';
    const codeVerifier = '_34W.h85p9~C_E5afi.ALG.yV_dD2Adq~Xda4k3W7U8n8y';

    const bodyData = `code=${encodeURIComponent(Code)}&grant_type=${encodeURIComponent(grantType)}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_verifier=${encodeURIComponent(codeVerifier)}`;

    try {
        const fetchingData = await axios.post(url, bodyData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const access_token = fetchingData.data.access_token;

        const url2 = process.env.DIGI_URL_2;
        
        const fetchingData2WithAccessToken = await axios.post(url2, {}, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        // Check if fetchingData2WithAccessToken contains the expected data
        if (fetchingData2WithAccessToken && fetchingData2WithAccessToken.data) {
            res.status(200).json({
                success: true,
                dataOfUrl: fetchingData2WithAccessToken.data,
            });
        } else {
            res.status(500).json({ error: 'Unexpected response from the second API' });
        }        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.get("/match-emp", async (req, res) => {
//     try {
//         const url3 = process.env.EMP_URL;

//         const fetchingDataOfEmp = await axios.get(url3, {
//             "id": "9076"
//         }, {
//             headers: {
//                 Token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjkwNzYiLCJ0aW1lIjoxNzA1MTUyMTIxfQ.0Qd9ZpJ7X5HfqmlaPz2d5wMFzyCkYhbJC9Z8rlgA3s"
//             },
//         });

//         // Check if fetchingDataOfEmp contains the expected data
//         if (fetchingDataOfEmp && fetchingDataOfEmp.data) {
//             res.status(200).json({
//                 success: true,
//                 dataOfEmp: fetchingDataOfEmp.data
//             });
//         } else {
//             res.status(500).json({
//                 success: false,
//                 error: 'Unexpected response from the EMP API',
//                 message: 'Internal Server Error'
//             });
//         }
//     } catch (error) {
//         console.error('Error: ', error.message);
//         res.status(500).json({
//             success: false,
//             'error': error,
//             message: 'Internal Server Error'
//         });
//     }
// });


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
