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

  
	let auth0Client;
	let newTask;
	let isLoading = true;
	let searching = false;
	let searchKeyword;
	let resultscontainer;
	let odbready = false;
	let ipfsready = false;
    let mounted = false;
	// let filename = "covidcough.pdf";

	onMount(async () => {
		// user.name.set("loading");
		// user.email.set("...");

	  auth0Client = await auth.createClient();
  
	  isAuthenticated.set(await auth0Client.isAuthenticated());
	  user.set(await auth0Client.getUser());


		mounted = true;
		if (ipfsready && odbready) {
			loadBO();
		}

	  isLoading = false;
	});
  
	function login() {
	  auth.loginWithPopup(auth0Client);
	}
  
	function logout() {
	  auth.logout(auth0Client);
	}

	 
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

	async function loadBO() {
		// Time for Stripe.js to do its magic.
		// const stripe = tripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
		// var elements = stripe.elements();
		// etc..

		// import braid orbitdb
		const BO = require('./components/braidOrbit.js')

		// console.log(BO)

		//define onready function
		BO.onready = () => {
			console.log(BO.orbitdb.id)	
		}

		//create db
		BO.create()

		//Creating papers database
		BO.onready = () => {
			console.log(BO.papers.id)
		}
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
	  <a class="navbar-brand" href="/#">braid</a>
	  <a class="navbar-brand" href="/#">discord</a>
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
			<h1 class="display-4">braid paper search</h1>
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
					{#await File_Retrieval(upload.hash, upload.filename) then value}
					<span>CID: {upload.hash}</span>
					<span>title: {upload.title}</span>
					<span>Date Archived: {upload.date}</span>
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