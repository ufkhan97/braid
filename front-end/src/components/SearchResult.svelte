<script>
    // import { searchResults } from "../store";
    export let searchResult = {};
  
    // let isChecked;
  
    // function taskDone() {
    //   console.log(isChecked);
  
    //   let updatedTasks = $tasks.map((currentTask) => {
    //     if (currentTask.id === task.id) {
    //       currentTask.completed = isChecked;
    //       return currentTask;
    //     }
    //     return currentTask;
    //   });
  
    //   tasks.set(updatedTasks);
    //   console.log($tasks);
    // }
  </script>
  
  <style>
    .completed {
      color: red;
      text-decoration: line-through;
    }
  </style>
  
  <main>
    <!-- <li class="list-group-item"> -->
      <div class="card">
        <div class="card-body">

          <div class="row">
            <div class="col-md-6">
              <h5 class="card-title">
                <a href="#{searchResult.Title}">{searchResult.Title}</a>
              </h5>
              <p class="card-text">{searchResult.Author}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <p class="card-text">Favorites: {searchResult.Favorites}</p>
          
            </div>
            <div class="col-md-3">
              <p class="card-text">Views: {searchResult.Views}</p>
          
            </div>
            <div class="col-md-3">
              <p class="card-text">Versions: {searchResult.current_version}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <a href="https://{searchResult.PaperCID}.ipfs.dweb.xyz/{searchResult.FileName}" class="btn btn-primary">
                Go to Article
              </a>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              {#each searchResult.Comments as comment}
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{comment.Author}</h5>
                  <p class="card-text">{comment.Comment}</p>
                </div>
              </div>
              {/each}
            </div>
          </div>
        </div>
      <!-- <span>{searchResult.PaperTitle}</span> -->
    <!-- </li> -->
  </main>