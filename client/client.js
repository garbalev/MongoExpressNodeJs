console.log($('#h1').text());

$.get('http://localhost:3000/users-api/users').then((data) => {
    console.log(data);;
});

$.get('http://localhost:3000/users-api/users/4').then((data) => {
    console.log(data);;
}); 



let obj = {name: 'Alonzo', age: 55};
$.ajax({
    type: 'POST',
    url: 'http://localhost:3000/users-api/users',
    headers: { "Accept": "application/json", "Content-Type": "application/json"},
    data: JSON.stringify(obj),
    success: (data) => console.log(data)
})

// $.ajax({
//     type: 'DELETE',
//     url: 'http://localhost:3000/users-api/users/1',
//     headers: { "Accept": "application/json"},
//     success: (data) => console.log(data)
// })



