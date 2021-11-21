import { Web3Storage, getFilesFromPath } from 'web3.storage'


export async function File_Retrieval(cid, filename) {
    console.log(`CID: ${cid} Filename: ${filename}`)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhNjhBMkNhMUVGZDBiQzUzZDI1ZDU1MWE3YUYwRTM0NzQ4OTdFMkMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzcwMjEyNjkzOTAsIm5hbWUiOiJCcmFpZFRlc3RUb2tlbiJ9.uqd9FiMCE5IGfXa4vrciA01bXL3a3AyfuTDp1jmKovU'
    const storage = new Web3Storage({ token }) // Instanciates connection to web3 storage by providing token
    var retrieved_filename
    var url

    const conn = await storage.get(cid)
    
    // If CID is valid
    if (conn.ok) {
        console.log(`Validated ${cid}!`)

        // Get filename from ipfs
        const files = await conn.files()
        for (const file of files) {
            // console.log(`Retrieved information: ${file.cid} ${file.name} ${file.size}`)
            retrieved_filename = file.name
        }

        // Check to see if passed in filename and pulled down filename match
        if (filename === retrieved_filename) {
            console.log('CID & Filename check complete -- SUCCESS')
            url = `${cid}.ipfs.dweb.link/${filename}`
        }
        else{
            console.error('Passed in filename does not match')
        }
    }

    else {
        console.error(`Failed to get ${cid}`)
        console.error('CID & Filename check complete -- FAILURE')
    }

    return url
  }

// TEST CASES

// WORKS -- valid cid, valid filename
// const ouputURL1 = await File_Retrieval('bafybeidcduhicfis45pnixjvcayb3guqs6xh7ylms4fnote2l27gqwhln4', 'test-file.txt').then(console.log)

// // DOES NOT WORK -- valid cid, invalid filename
// const ouputURL2 = await File_Retrieval('bafybeidcduhicfis45pnixjvcayb3guqs6xh7ylms4fnote2l27gqwhln4', 'test.txt').then(console.log)

// // DOES NOT WORK -- invalid cid, valid filename
// const ouputURL3 = await File_Retrieval('bafybeidcduhicfis45pnixjvcayb3guqs6xh7ylms4fnote2l27gqwhln4m', 'test-file.txt').then(console.log)

// // DOES NOT WORK -- invalid cid, invalid filename
// const ouputURL4 = await File_Retrieval('bafybeidcduhicfis45pnixjvcayb3guqs6xh7ylms4fnote2l27gqwhln4m', 'test.txt').then(console.log)
