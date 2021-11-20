import { Web3Storage, getFilesFromPath } from 'web3.storage'


async function checkCID(cid) {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhNjhBMkNhMUVGZDBiQzUzZDI1ZDU1MWE3YUYwRTM0NzQ4OTdFMkMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzcwMjEyNjkzOTAsIm5hbWUiOiJCcmFpZFRlc3RUb2tlbiJ9.uqd9FiMCE5IGfXa4vrciA01bXL3a3AyfuTDp1jmKovU'
    const storage = new Web3Storage({ token }) // Instanciates connection to web3 storage by providing token

    // Still working through this logic -- need to beable to pull down the filename using the provideed CID
    const res1 = await storage.get(cid)
    const files = await res1.files()
    console.log(`Got a response! [${files.status}] ${files.name}`)
    if (!res1.ok) {
        throw new Error(`failed to get ${cid}`)
    }
//NEED TO FIGURE OUT HOW TO GET FILE NAME OR URL OR JUST PASS STRING WITH AREA FOR FILENAME

    var res
    try {
        const status = await storage.status(cid)
        console.error(status.name)
        res = true
    }
    catch {
        //[system.exception]
        console.error('CID is not valid')
        res = false
    }
    return res
  }

  
// not sure if we want to pull retreive file using only cid or using both cid and filename... 
// need to discuss how user will search for file

async function fileRetrieval(cid, filename) {
    console.log(`input file: ${cid} output name: ${filename}`)
    const validCID = await checkCID(cid).then(console.error)
    if (validCID ==true) {
        console.log('worked')
    }
    else {
        console.log('failed')
    }
    // check if filename exists
    // check if cid and filename match

    return (`${cid}.ipfs.dweb.link/${filename}`)
}


const url = await fileRetrieval('bafybeidcduhicfis45pnixjvcayb3guqs6xh7ylms4fnote2l27gqwhln4', 'test').then(console.log)
