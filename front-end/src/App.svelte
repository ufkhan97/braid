<script>
	import { onMount } from "svelte";
	import auth from "./authService";
	import { isAuthenticated, user, user_tasks, tasks, searchResults, idIncrement } from "./store";
	import TaskItem from "./components/TaskItem.svelte";
	import SearchResult from "./components/SearchResult.svelte";
  
	let auth0Client;
	let newTask;
	let isLoading = true;
	let searching = false;
	let searchKeyword;
	let resultscontainer;

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
  </script>

<style>
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
  
	{#if isLoading}
		<div class="loader"></div>
	{:else}
	<!-- Application -->
	<!-- if not authenticated -->
	{#if !$isAuthenticated}
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
	  <div class="row bottom-page-row">
		<!-- <row class="row"> -->
			<div class="col-md-3 offset-md-1">
				<div class="jumbotron">
					<h1>IPFS</h1>
				</div>
			</div>
			<div class="col-md-3 offset-md-4">
			<!-- create a button -->
			<button
				class="btn btn-primary btn-lg btn-block"
				on:click="{login}"
				>Login</button>
			<button
				class="btn btn-primary btn-lg btn-block"
				on:click="{login}"
				>Upload</button>
			</div>
		<!-- </row> -->
		</div>
	</div>
	<!-- if is authenticated -->
	{:else}
	<div class="container" id="main-application">
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
	</div>
	{/if}
	{/if}
  </main>