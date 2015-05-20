function popup() {
alert("Hello World")
};


function LOG_IN() {
//alert("moving to log in page");
window.location.href = 'file/login.html';
};


function NEW_USER() {
//alert("moving to newwwwwwwwww");
window.location.href = 'file/new_user.html';

};



var btn = document.createElement("BUTTON1");        // Create a <button> element
var t = document.createTextNode("log in");       // Create a text node
btn.appendChild(t);                                // Append the text to <button>
document.body.appendChild(btn); 
