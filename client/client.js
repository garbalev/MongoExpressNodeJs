// $.get('http://localhost:3000/users-api/users').then((data) => {
//     console.log(data);;
// });

// $.get('http://localhost:3000/users-api/users/4').then((data) => {
//     console.log(data);;
// });

let objForPost = { name: "Pedro", age: 71 };

// $.ajax({
//     type: 'POST',
//     url: 'http://localhost:3000/users-api/users',
//     headers: { "Accept": "application/json", "Content-Type": "application/json"},
//     data: JSON.stringify(objForPost),
//     success: (data) => console.log(data)
// })

// $.ajax({
//     type: 'DELETE',
//     url: 'http://localhost:3000/users-api/users/1',
//     headers: { "Accept": "application/json"},
//     success: (data) => console.log(data)
// })

let objForPut = { id: 4, name: "Serhio", age: 46 };

// $.ajax({
//     type: 'PUT',
//     url: 'http://localhost:3000/users-api/users',
//     headers: { "Accept": "application/json", "Content-Type": "application/json"},
//     data: JSON.stringify(objForPut),
//     success: (data) => console.log(data)
// })

function loadData(url = "") {
  $(".usersList").html("");
  $("#idValue")[0].value = "";
  $.get(`http://localhost:3001/users-api/users${url}`)
    .then((data) => {
      console.log(data);
      if (typeof data === "string") {
        $(".usersList").append(`
            <h1>${data}.</h1>
        `);
      } else {
        for (let user of data) {
          $(".usersList").append(`
            <div class="user">
              <div style='max-width: 58%'>  
                <p>Name: <span class="response">${user.name}</span></p>
                <p>Age: <span class="response">${user.age}</span></p>
                <p>ID: <span class="response">${user.id}</span></p>
              </div>
              <div style='display: flex; flex-direction: column'>
                <span class="buttons deleteUser">Delete user</span>
                <span class="buttons editUser">Edit</span>
              </div>           
            </div>
            `);
        }
      }
    })
    .fail((err, status) =>
      alert(status + ", check that server is running and the URL is correct")
    );
}

$("#showAll").click(() => {
  $("#buttonAddUser").show();
  $("#formAddUser").hide();
  loadData();
});

$("#showById").click(() => {
  $("#formAddUser").hide();
  if ($("#idValue")[0].value == 0) {
    alert("Enter ID, please");
  } else {
    $("#buttonAddUser").show();
    loadData(`/${$("#idValue")[0].value}`);
  }
});

// $(".deleteUser").click(() => {
//   console.log('dasdadasddasnn');
// });

$(".usersList").on("click", ".deleteUser", function (e) {
  $("#formAddUser").hide();
  let deleteId = $(e.target)
    .parent()
    .siblings()
    .find(".response:eq(-1)")
    .text();
  console.log(deleteId);
  $("#formAddUser").hide();
  $.ajax({
    type: "DELETE",
    url: `http://localhost:3001/users-api/users/${deleteId}`,
    headers: { Accept: "application/json" },
    success: (data) => console.log(data),
  }).then(() => {
    loadData();
  });
});

let userIdToEdit = '';

$(".usersList").on("click", ".editUser", function (e) {
  let userID = $(e.target).parent().siblings().find(".response:eq(-1)").text();
  userIdToEdit = userID;
  let topPos = $(e.target).parent().offset().top;
  $("#addUser").text("Edit");
  $("#formAddUser").toggle();
  $("#formAddUser").offset({ top: topPos + 10, left: 262 });
 
});


$("#buttonAddUser").click(() => {
  if ($(".user").length > 0) {
    $("#addUser").text("Add");
    $("#formAddUser").css({
      "left": "550px",
      "top": "133px",
    });
    $("#formAddUser").toggle();
  }
});

$("#addUser").click(function() {
  let name = document.forms[0][0].value;
  let age = document.forms[0][1].value;
  if ($(this).text() === 'Edit') {
    console.log('EDDDDIIIT ' + userIdToEdit);
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:3001/users-api/users',
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        data: JSON.stringify({ name: name, age: age, id: userIdToEdit}),
        success: () => document.forms[0].reset(),
    }).then(() => loadData())
  } else {
    if (name !== "" && age !== "") {
      document.forms[0].reset();
      $.ajax({
        type: "POST",
        url: "http://localhost:3001/users-api/users",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ name: name, age: age }),
        success: () => document.forms[0].reset(),
      })
        .then(() => loadData())
        .fail((err, status, errorThrown) =>
          alert(status + ", check that server is running and the URL is correct")
        );
    } else {
      alert("Input fields must not be empty");
    }
  }
  
});

$("#close").click(() => {
  $("#buttonAddUser").hide();
  $("#formAddUser").hide();
  $(".usersList").html("");
  $(".usersList").append('<h2>Click the buttons above to start</h2>');
});
