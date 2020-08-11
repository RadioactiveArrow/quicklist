var editMode = true;
var inputBase = '<span class="add-input" role="textbox" contenteditable onkeydown="opItem(event)" oninput="toggleCursor()" onclick="listClickAction(this)">'
var inputCloser = '</span>'

function togglePlaceHolder() {
    if ($('.title').text().length == 0) {
        $('.title').toggleClass('placeholder', true)
    }
    else {
        $('.title').toggleClass('placeholder', false)
    }
    // updateList()
}

function toggleCursor() {
    //Toggles cursor coloring for selected items
    if ($('.cursor > span').text().length != 0) {
        $('.cursor').toggleClass('dark', true)
    }
    else {
        $('.cursor').toggleClass('dark', false)
    }
}

function titleHandler(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        $('.cursor > span').focus()
    }
}

function modeSwitch() {
    editMode = !editMode;
    $('.modes').toggleClass('editSelected')
    $('.modes').toggleClass('checkSelected')
    $('.tasks').toggleClass('checklistMode')
    $('.item > span').prop('contenteditable', editMode)

    if ($('.item').length > 1) {
        $('.cursor > span').text($('.cursor > span').text().length ? $('.cursor > span').text() : "‎‎");
        $('.cursor').toggleClass('norm')
        $('.cursor').toggleClass('cursor')
    } else {
        if ($('.cursor > span').text().length == 0) {
            $('.cursor > span').text("‎");
        }
        $('.cursor').toggleClass('norm')
        $('.cursor').toggleClass('cursor')
    }
}

function listClickAction(node) {
    if ($('.tasks').hasClass('checklistMode') && $('.item').length > 1) {
        $(node).parent().remove()
    } else if ($('.tasks').hasClass('checklistMode')) {
        modeSwitch()
        $(node).parent().before('<li class="item cursor">' + inputBase + $('.cursor > span').text() + inputCloser + '<br></li>')
        $(node).html(inputBase + inputCloser + '<br>')
        $(node).toggleClass('dark', false);
        $(node).toggleClass('norm', false);
        $(node).parent().remove()
    }
}

function cursorPullback(sel) {
    var range = document.createRange();
    var textNode = document.querySelector('.cursor > span').childNodes[0]
    range.setStart(textNode, textNode.length)
    range.collapse(true);
    sel.removeAllRanges()
    sel.addRange(range)
}

function opItem(e) {
    toggleCursor()

    var sel = window.getSelection();
    var range = sel.getRangeAt(0);

    var inputSelectStart = range.startOffset
    var inputSelectEnd = range.endOffset
    var pushContent = $('.cursor > span').text().substr(inputSelectStart)

    //Enter checks
    if (e.keyCode == 13) {
        e.preventDefault();
        if (inputSelectStart != 0 && pushContent.length) { //Push to next item
            console.log("-> PUSH NEXT")

            $('.cursor > span').text($('.cursor > span').text().substr(0, inputSelectStart))
            if ($('.cursor').next().children('.add-input').text() && ($('.cursor').next().children('.add-input').text().length == 0)) {
                $('.cursor').next().children('.add-input').text(pushContent)
                $('.cursor').next().toggleClass('norm', false)
                $('.cursor').next().toggleClass('cursor', true)
                $('.cursor').toggleClass('norm', true)
                $('.cursor').toggleClass('cursor', false)
                $('.cursor > span').focus()
            }
            else {
                $('.cursor').before('<li class="item norm">' + inputBase + $('.cursor > span').text() + inputCloser + '<br></li>')
                $('.cursor').html(inputBase + inputCloser + '<br>')
                $('.cursor').toggleClass('dark', false);
                $('.cursor > span').text(pushContent)
                $('.cursor > span').focus()
            }

        } else if ($('.cursor > span').text().length != 0 && inputSelectStart == 0 && inputSelectEnd == 0) {
            console.log("-> ADD BACKWARDS")

            if ($('.cursor').next().text() && $('.cursor').next().children('.add-input').text().length == 0) {
                $('.cursor').next().children('.add-input').text($('.cursor > span').text())
                $('.cursor > span').text("")
            }
            else {
                $('.cursor').before('<li class="item cursor">' + inputBase + inputCloser + '<br></li>')
                $('.cursor').next().toggleClass('cursor', false)
                $('.cursor').next().toggleClass('norm', true)
                $('.cursor > span').focus()
            }

        } else if ($('.cursor > span').text().length != 0) {
            console.log("-> ADD")

            $('.cursor').before('<li class="item norm">' + inputBase + $('.cursor > span').text() + inputCloser + '<br></li>')
            $('.cursor').html(inputBase + inputCloser + '<br>')
            $('.cursor').toggleClass('dark', false);
            $('.cursor').toggleClass('norm', false);
            $('.cursor > span').focus()

        }
    }

    //Backspace checks
    if (e.keyCode == 8) {
        if ($('.cursor > span').text().length == 0 && $('.cursor').prev().children('.add-input')) { //Remove Item
            e.preventDefault();
            console.log("<- REMOVE")

            //Removes item and focuses on previous item
            $('.cursor').prev().toggleClass('norm', false)
            $('.cursor').prev().toggleClass('cursor', true)
            $('.cursor').next().toggleClass('cursor', false)
            $('.cursor').next().toggleClass('norm', true)
            $('.cursor > span').text($('.cursor > span').text())
            $('.cursor').next().remove()
            $('.cursor > span').focus()

            cursorPullback(sel)

        } else if (inputSelectStart == 0 && inputSelectEnd == 0 && $('.cursor').prev().text()) { //Pull to last item
            e.preventDefault();
            console.log('<- PULL BACK')

            var pullContent = $('.cursor > span').text()
            $('.cursor').prev().toggleClass('norm', false)
            $('.cursor').prev().toggleClass('cursor', true)
            $('.cursor > span').text($('.cursor > span').text())
            $('.cursor').next().toggleClass('cursor', false)
            $('.cursor').next().toggleClass('norm', true)
            $('.cursor').next().remove()
            $('.cursor > span').focus()

            cursorPullback(sel)

        } else if (inputSelectStart == 0 && inputSelectEnd == 0 && $('.cursor').next().text()) {
            e.preventDefault();
            console.log("<- REMOVE FIRST")

            $('.cursor').next().children('.add-input').text($('.cursor').next().children('.add-input').text())
            $('.cursor').next().toggleClass('norm', false)
            $('.cursor').next().toggleClass('cursor', true)
            $('.cursor').prev().remove()
            $('.cursor > span').focus()

            cursorPullback(sel)
        }
    }

    updateList();
}

$(document).ready(function () {
    $("li > span").text("")
    loadList()

    $("body").focus(function () {
        $(this).attr("placeholder", '');
    });

    $(document).on('focus', 'li > span', function () {
        if (!$('.cursor > span').is(':focus')) {
            console.log('cursor event')
            $('.cursor').toggleClass('norm', true)
            $('.cursor').toggleClass('cursor', false)
            var selected = $(':focus')[0].parentElement
            $(selected).toggleClass('cursor', true)
            $(selected).toggleClass('norm', false)
        }
        toggleCursor()
    });

    $("li, span").on('DOMSubtreeModified',function(){
        updateList()
    });
});

