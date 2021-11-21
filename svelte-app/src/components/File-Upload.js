import { Web3Storage, getFilesFromPath } from 'web3.storage'

export async function fileUpload(input_file, output_name) {
    console.log(`input file: ${input_file} output name: ${output_name}`)
    var cid
    if (input_file.length == 0 ){
        console.error('no file added')
    }
    else if (output_name.length == 0){
        console.error('no name specified')
    }
    //else if (){
        // Need to check if input_file is actually valid
    //}
    else {
        const file_load = await getFilesFromPath(input_file)
        //console.log(file_load)
        const file = []
        file.push(...file_load)
        //console.log(file)
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhNjhBMkNhMUVGZDBiQzUzZDI1ZDU1MWE3YUYwRTM0NzQ4OTdFMkMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzcwMjEyNjkzOTAsIm5hbWUiOiJCcmFpZFRlc3RUb2tlbiJ9.uqd9FiMCE5IGfXa4vrciA01bXL3a3AyfuTDp1jmKovU'
        const storage = new Web3Storage({ token }) // Instanciates connection to web3 storage by providing token

        console.log(`Uploading ${file.length} file`)
        var cid = await storage.put(file, {name: output_name})
        console.log('Content added with CID:', cid)
    }
    
    return cid
}

export async function storeFiles(files) {
    // const client = makeStorageClient()
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhNjhBMkNhMUVGZDBiQzUzZDI1ZDU1MWE3YUYwRTM0NzQ4OTdFMkMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzcwMjEyNjkzOTAsIm5hbWUiOiJCcmFpZFRlc3RUb2tlbiJ9.uqd9FiMCE5IGfXa4vrciA01bXL3a3AyfuTDp1jmKovU'
    const storage = new Web3Storage({ token }) // Instanciates connection to web3 storage by providing token

    const cid = await storage.put(files)
    console.log('stored files with cid:', cid)
    return cid
}

// // No filepath error
// const cid1 = await fileUpload('', 'test1').then(console.log)
// //console.log(`cid1: ${cid1}`)
// // No output name error
// const cid2 = await fileUpload('./test-file.text', '').then(console.log)
// //console.log(`cid2: ${cid2}`)
// //successful upload
// const cid3 = await fileUpload('./dev/test-file.txt', 'test_file4').then(console.log)
// //console.log(`cid3: ${cid3}`)
