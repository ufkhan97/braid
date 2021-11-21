<svelte:head>
	<script src="https://unpkg.com/ipfs@0.55.1/dist/index.min.js" on:load={ipfsLoaded}></script>
	<script src="https://unpkg.com/orbit-db@0.26.1/dist/orbitdb.min.js" on:load={odbLoaded}></script>
</svelte:head>
<script>
	import { onMount } from "svelte";
	import auth from "./authService.js";
	import { isAuthenticated, user, user_tasks, tasks, searchResults, idIncrement, uploads } from "./components/store";
	import TaskItem from "./components/TaskItem.svelte";
	import SearchResult from "./components/SearchResult.svelte";
	import Dialog from "./components/Dialog.svelte"
	import { File_Retrieval } from "./components/File-Retrieval.js"

	// import { BraidOrbit as BO } from "./components/BraidOrbit.js"

	// const Ipfs = require('ipfs')
    // const OrbitDB = require('orbit-db')

    // module.exports = exports = new braidOrbit(Ipfs, OrbitDB)

	// const BO = require('./components/BraidOrbit.js')

	let odbready = false;
	let ipfsready = false;
    let mounted = false;

	onMount(() => {
		// import { BraidOrbit as BO } from "./components/BraidOrbit.js"
            // The payment-form is ready.
            mounted = true;
            if (ipfsready && odbready) {
				// import { BraidOrbit as BO } from "./components/BraidOrbit.js"
				// const BO = require('./components/BraidOrbit.js')
				loadBO();
            }
        });
 
	function ipfsLoaded() {
		// The external Stripe javascript is ready.
		ipfsready = true;
		if (mounted && odbready) {
			// import { BraidOrbit as BO } from "./components/BraidOrbit.js"
			// const BO = require('./components/BraidOrbit.js')
			loadBO();
		}
	}

	function odbLoaded() {
		// The external Stripe javascript is ready.
		odbready = true;
		if (mounted && ipfsready) {
			// import { BraidOrbit as BO } from "./components/BraidOrbit.js"
			// const BO = require('./components/BraidOrbit.js')
			loadBO();
		}
	}

	function loadBO() {
		// Time for Stripe.js to do its magic.
		// const stripe = tripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
		// var elements = stripe.elements();
		// etc..

		const BO = require('./components/BraidOrbit.js')
		BO.onready = () => {
			console.log(BO.orbitdb.id)	
		}

		BO.create()

		// BO.onready = () => {
		// 	console.log(BO.papers.id)
		// }


		// onsole.log(BO.orbitdb.id)	
	}

	//Console logging and instantiates OrbitDB 
	// BO.onready = () => {
	// 	console.log(BO.orbitdb.id)
	// }

	// BO.create()

	// //Creating a database
	// BO.onready = () => {
	// console.log(BO.papers.id)
	// }

	// //Creating data 
	// const cid = await BO.addNewPaper(hash, author, title, date, doi)
	// const content = await BO.node.dag.get(IPFS.asCID(cid))
	// console.log(content.value.payload)

	// //Reading data
	// papers = BO.getAllPapers()
	// papers.forEach((paper) => { /* do something */ })

	// paper = BO.getPaperByHash('hash')
	// console.log(paper)

	// //Updating data
	// const cid = await BO.updatePaperByHash(hash, author, title, date, doi)
	// // do stuff with the cid as above

	// //Deleting data
	// const cid = await BO.deletePaperByHash("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
	// const content = await BO.node.dag.get(IPFS.asCID(cid))
	// console.log(content.value.payload)

	// //Uploading files and storing content hash
	// document.getElementById("fileUpload").addEventListener('change', async (event) => {
	// const file = event.target.files[0]
	// if (file) {
	// 	const result = await BO.node.add(file)
	// 	const cid = await BO.addNewPaper(result[0].hash)
	// }
	// })
  
	let auth0Client;
	let newTask;
	let isLoading = true;
	let searching = false;
	let searchKeyword;
	let resultscontainer;
	// let filename = "covidcough.pdf";

	onMount(async () => {
		// user.name.set("loading");
		// user.email.set("...");

	  auth0Client = await auth.createClient();
  
	  isAuthenticated.set(await auth0Client.isAuthenticated());
	  user.set(await auth0Client.getUser());

	//   console.log("user" + user);

	  isLoading = false;
	});
  
	function login() {
	  auth.loginWithPopup(auth0Client);
	}
  
	function logout() {
	  auth.logout(auth0Client);
	}

	function search(){
		var l = $searchResults.length;	// get our current items list count
		$idIncrement = l

		searching = true;
		console.log("searching");
		console.log(searchKeyword);

		// TODO: Add actual search
		let searchResult = {
			"CID": "12345", 
			"PaperCID": "23456",
			"Title": "The title of the paper",
			"Author": "The author of the paper",
			"FileName": "file.pdf",
			"Comments": [
				{
					"CommentID": "The id of the comment",
					"Comment": "The comment",
					"Author": "The author of the comment",
					"Date": "The date of the comment",
					"Time": "The time of the comment"
				},
				{
					"CommentID": "The id of the comment",
					"Comment": "The comment",
					"Author": "The author of the comment",
					"Date": "The date of the comment",
					"Time": "The time of the comment"
				}
			],
				"old-versions": [
						{
							"version": 1,
							"CID": "xyz"
						},
						{
							"version": 2,
							"CID": "abc"
						} 
				],
			"Favorites": "0",
			"Views": 1,
			"special_verification": "1",
			"current_version": 3
		};

		$searchResults[l] = searchResult;
		// $searchResults.push(searchResult);
		console.log($searchResults);

	}
  
	function addItem() {
	  let newTaskObject = {
		id: genRandom(),
		description: newTask,
		completed: false,
		user: $user.email
	  };
  
	  console.log(newTaskObject);
  
	  let updatedTasks = [...$tasks, newTaskObject];
  
	  tasks.set(updatedTasks);
  
	  newTask = "";
	}
  
	function genRandom(length = 7) {
	  var chars =
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	  var result = "";
	  for (var i = length; i > 0; --i)
		result += chars[Math.round(Math.random() * (chars.length - 1))];
	  return result;
	}

	// import { onMount } from 'svelte';

	// let photos = [];

	// onMount(async () => {
	// 	// const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
	// 	// photos = await res.json();

	// 	BO.create()

	// 	// BO.onready = () => {
	// 	// 	console.log(BO.orbitdb.id)
	// 	// }


	// });
  </script>

<style>
	/* body{
		padding: 0px;
	} */

	nav{
		background-color: #1A4F7E;
		color: white;
	}

	nav a{
		color: #ccc;
		transition: 250ms;
	}

	nav a:hover{
		color: #fff;
		text-decoration: none;
	}
	#main-application {
	  margin-top: 50px;
	}

	/* .full-height-container{
		height: 100vh;
	} */

	.bottom-page-row {
		margin-bottom: 25px;
		margin-top: 25px;
	}

	.container{
		/* display: flex; */
	}
</style>

<main>
	<!-- App Bar -->
	
	<nav class="navbar navbar-expand-lg"> <!-- navbar-dark bg-dark -->
	  <a class="navbar-brand" href="/#">Braid</a>
	  <button
		class="navbar-toggler"
		type="button"
		data-toggle="collapse"
		data-target="#navbarText"
		aria-controls="navbarText"
		aria-expanded="false"
		aria-label="Toggle navigation"
	  >
		<span class="navbar-toggler-icon" />
	  </button>
	  <div class="collapse navbar-collapse" id="navbarText">
		<div class="navbar-nav mr-auto user-details">
		  {#if $isAuthenticated}
		  <span class="text-white">&nbsp;&nbsp;{$user.name} ({$user.email})</span>
		  {:else}<span>&nbsp;</span>{/if}
		</div>
		<span class="navbar-text">
		  <ul class="navbar-nav float-right">
			{#if $isAuthenticated}
			<li class="nav-item">
			  <a class="nav-link" href="/#" on:click="{logout}">Log Out</a>
			</li>
			{:else}
			<li class="nav-item">
			  <a class="nav-link" href="/#" on:click="{login}">Log In</a>
			</li>
			{/if}
		  </ul>
		</span>
	  </div>
	</nav>
  
	<!-- {#if isLoading}
		<div class="loader"></div>
	{:else} -->
	<!-- Application -->
	<!-- if not authenticated -->
	
	<div class="container mt-5 full-height-container" style="overflow: hidden;">
	  <div class="row">
		<div class="col-md-10 offset-md-1">
		  <div class="jumbotron">
			<h1 class="display-4">Braid paper search</h1>
			<input
				class="form-control"
				bind:value="{searchKeyword}"
				placeholder="Search for something"
			/>
			<button class="btn btn-primary mt-3" on:click="{search}">
			  Search
			</button>
			<a href="#" >Advanced...</a>
		  </div>
		</div>
	  </div>
	  {#if searching}
	  <div bind:this={resultscontainer} class="row">
		<div class="col-md-10 offset-md-1">
			<div class="jumbotron">
				{#each $searchResults as result}
				<SearchResult searchResult="{result}" />
				{/each}
			</div>
		</div>
	  </div>
	  {/if}
	  {#if $uploads.length > 0}
	  <div bind:this={resultscontainer} class="row">
		<div class="col-md-10 offset-md-1">
		  <div class="jumbotron">
			<h1 class="display-4">My Uploads</h1>
			{#each $uploads as upload}
			<div class="card">
				<div class="card-body">
					{#await File_Retrieval(upload[0], upload[1]) then value}
					<span>{upload[0]}</span>
					<a href="https://{value}" class="btn btn-primary"></a>
					{/await}
				</div>
			</div>
			{/each}
		  </div>
		</div>
	</div>
	{/if}
	  <div class="row bottom-page-row">
		<!-- <row class="row"> -->
			<div class="col-md-3 offset-md-1">
				<div class="jumbotron">
					<h1>IPFS</h1>
				</div>
			</div>
			<div class="col-md-3 offset-md-4">
			<!-- create a button -->
			{#if !$isAuthenticated}
			<button
				class="btn btn-primary btn-lg btn-block"
				on:click="{login}"
				>Login</button>
			{:else}
			<button
				class="btn btn-primary btn-lg btn-block"
				data-toggle="modal" data-target="#exampleModal"
				>Upload</button>
			<!-- <a href="#"  class="button button-1">Upload</a> -->
			{/if}
			</div>
		<!-- </row> -->
		</div>
		<Dialog></Dialog>
	</div>
	<!-- if is authenticated -->
	
	<!-- <div class="container" id="main-application">
	  <div class="row">
		<div class="col-md-6">
		  <ul class="list-group">
			{#each $user_tasks as item (item.id)}
			<TaskItem task="{item}" />
			{/each}
		  </ul>
		</div>
		<div class="col-md-6">
		  <input
			class="form-control"
			bind:value="{newTask}"
			placeholder="Enter New Task"
		  />
		  <br />
		  <button type="button" class="btn btn-primary" on:click="{addItem}">
			Add Task
		  </button>
		</div>
	  </div>
	</div> -->
	<!-- {/if} -->
</main>