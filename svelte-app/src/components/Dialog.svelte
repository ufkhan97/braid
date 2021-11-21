<script>
	import { storeFiles } from './File-Upload.js';
	import { uploads } from './store.js'
	let fileinput = [];
	let loading;
	let cid;

	// const onFileSelected = async (e) =>{
	async function onFileSelected(){
		console.log("On Change");
		console.log(fileinput.files);
	}

	async function onSubmit(){
		loading = "loading"
		console.log("submit")
		let file = fileinput.files[0];
		let files = [file];
		console.log(files);
		cid = await storeFiles(files);
		loading = "done"
		var l = $uploads.length;
		$uploads[l] = [cid, files[0].name];
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