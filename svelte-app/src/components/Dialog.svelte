<script>
import { fix_and_destroy_block } from 'svelte/internal';

	import { storeFiles } from './File-Upload.js';
	import { uploads } from './store.js'
	let fileinput = [];
	let loading;
	let cid;
	let author;
	let title;
	let today = new Date();
	let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	let doi = "test";
	let hash;
	let BO;
	let l;
	// const BO = require('./braidOrbit.js')
	// console.log("BO")
	// console.log(BO)
	// BO.onready = () => {
	// 	console.log(BO.orbitdb.id)	
	// }

	// const onFileSelected = async (e) =>{
	async function onFileSelected(){
		console.log("On Change");
		console.log(fileinput.files);
		console.log(fileinput.files[0].name);
	}

	async function onSubmit(){
		loading = "loading"
		console.log("submit")
		let file = fileinput.files[0];
		let files = [file];
		console.log(files);
		console.log(file.name);
		let filename = file.name;
		hash = await storeFiles(files)
		console.log("hash: ", hash),
		// cid = await BO.addNewPaper(hash, author, title, date, doi)
		// console.log("cid: ", cid)
		// console.log(BO.addNewPaper)
		// content = await BO.node.dag.get(IPFS.asCID(cid))
		l = $uploads.length;
		$uploads[l] = {
			"hash": hash, 
			"author": author, 
			"title": title, 
			"date": date, 
			"doi": doi, 
			"filename": filename
		};
		// console.log("payload")
		// console.log(content.value.payload)
		loading = "done"
    }
	// let onSubmit
</script>

<div class="modal" id="exampleModal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
	  <div class="modal-content">
		<div class="modal-header">
		  <h5 class="modal-title">New Upload</h5>
		  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<!-- <form class="position-form"> -->
			<div class="modal-body" style="text-align: left;">
				<!-- <input type="file" id="myFile" name="filename"> -->
				<!-- <div class="chan" on:click={()=>{fileinput.click();}}>Choose Image</div> -->
        		<input bind:this={author} type="text" id="author" placeholder="Author" required>
				<input bind:this={title} type="text" id="title" placeholder="Title" required>
				<input 
					style="" 
					type="file" 
					accept=".txt, .pdf" 
					on:change={(e)=>onFileSelected(e)}
					bind:this={fileinput} 
				>

				<!-- on:change={(e)=>onFileSelected(e)}  -->
			</div>
			<div class="modal-footer">
				{#if loading == "loading"}
					<div class="spinner-border text-primary" role="status">
						<span class="sr-only">Loading...</span>
					</div>
				{:else if loading == "done"}
					<div>DONE!</div>
				{/if}
				<button on:click={onSubmit} class="btn button-1">Confirm Upload</button>
				<button type="button" class="btn button-2" data-dismiss="modal">Close</button>
			</div>
		<!-- </form> -->
	  </div>
	</div>
  </div>

  <style>
	
  </style>