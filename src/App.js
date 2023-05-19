import logo from './logo.svg';
import './App.css';
import { create } from 'ipfs-http-client'
import { useState } from 'react';
import { Buffer } from "buffer";


// connect to ipfs daemon API server

const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_API_KEY;
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
  const [metadataURL, setMetadataURL] = useState("");
  const [formInput, updateFormInput] = useState({ name: '', description: '', price: '' })
  
  // upload image to the IPFS
  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://ipfs-uploader.infura-ipfs.io/ipfs/${added.path}`
      
      updateFileUrl(url)
      
      //upload metadata to ipfs

    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
    
  }

  //
  async function uploadToMetadata(){

    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return

    try {
      const data = JSON.stringify({
        name, description, price, image: fileUrl
      })

      const added = await client.add(data)
      const url = `https://ipfs-uploader.infura-ipfs.io/ipfs/${added.path}`
      setMetadataURL(url);

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
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <button onClick={uploadToMetadata}>upload</button>
       </div>
      {
        fileUrl && (
          <img src={fileUrl} width="600px" /> 
        )
      }
      <p>Image url : {fileUrl}</p>
      <p>Metadata url: {metadataURL}</p>
      </div>
  )
}

export default App;
