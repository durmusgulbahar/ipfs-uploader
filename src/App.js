import logo from './logo.svg';
import './App.css';
import { create } from 'ipfs-http-client'
import { useState } from 'react';
import { Buffer } from "buffer";

// connect to ipfs daemon API server
const INFURA_PROJECT_ID = "2Jj1KTbwwajeWGWACrpdmRlfrzy"
const INFURA_API_KEY = "26d6aeb1dd16c1dad758d4d7a6f245fa"

const projectId = INFURA_PROJECT_ID;
const projectSecret = INFURA_API_KEY;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  }
})

function App() {

  const [fileUrl, updateFileUrl] = useState("");

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://nftmarket2.infura-ipfs.io/ipfs/${added.path}`
      updateFileUrl(url)

      console.log(fileUrl);
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  
  return (
    <div className="App">
      <h1>IPFS Example</h1>
      
      <input
        type="file"
        onChange={onChange}
      />
      {
        fileUrl && (
          <img src={fileUrl} width="600px" /> 
        )
      }
      <p>{fileUrl}</p>
      </div>
  )
}

export default App;
