var list = {}
var inputBase = '<span class="add-input" role="textbox" contenteditable onkeydown="opItem(event)" oninput="toggleCursor()" onclick="listClickAction(this)">'
var inputCloser = '</span>'

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function verifyList() {
    exists = !jQuery.isEmptyObject(list)
    hasTitle = !!list.title
    hasItems = !!list.items
    return (exists && hasTitle && hasItems)
}

function renderList() {
    //Sets list title from object 
    list.title.trim().length && $('.title').toggleClass('placeholder', false)
    $('.title').text(list.title)

    //Sets list contents from object
    $('li').remove()
    list.items.map(item => {
        console.log(item);
        $('.tasks').append('<li class="item norm">' + inputBase + item + inputCloser + '</li>')
    })
}

function loadList() {
    //Attempts to generate list from localStorage
    list = JSON.parse(window.localStorage.getItem('list')) ||
           {}

    if (verifyList()) {
        renderList()
    }
}

function updateList() {
    console.log("Updating List...")

    list.title = $('.title').text()
    list.items = []

    $("li > span").each(function (index) {
        list.items.push($(this).text())
    })
    window.localStorage.setItem('list', JSON.stringify(list))
}