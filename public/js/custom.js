// DATPICKER

import moment from "moment";

$(function () {

    $('input[name="datefilter"]').daterangepicker({
        autoUpdateInput: false,
        opens: 'left',
        startDate: moment().startOf('hour'),
        locale: {
            cancelLabel: 'Clear'
        }
    });
});

$('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
});

$('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});


$(document).ready(function () {
    $('.applyBtn').click(function () {
        $('.daterange-btn input').css("width", "230px");
    });
    $('.cancelBtn').click(function () {
        $('.daterange-btn input').css("width", "140px");
    });
});


// DATPICKER


// DROPDOWN

$(document).ready(function () {
    $('.influ-drop-btn').click(function () {
        $(".influ-drop-list").not($(this).parent().find(".influ-drop-list").slideToggle('fast')).slideUp();
        event.stopPropagation();
    });

    $('.influ-drop-btn').click(function () {
        $(".far").not($(this).parent().find(".far").toggleClass('active')).removeClass('active');
    });

    $(document).click(function () {
        $('.influ-drop-list').slideUp('fast');
        $(".far").removeClass('active');
    });
    $('.influ-drop-list').click(function () {
        event.stopPropagation();
    });
});

// DROPDOWN


// MORE-DROPDOWN

$(document).ready(function () {
    $('.influ-more-drop-btn').click(function () {
        $(".influ-more-drop-list").not($(this).parent().find(".influ-more-drop-list").slideToggle('fast')).slideUp();
        event.stopPropagation();
    });

    $(document).click(function () {
        $('.influ-more-drop-list').slideUp('fast');
    });
    $('.influ-more-drop-list').click(function () {
        event.stopPropagation();
    });
});

// MORE-DROPDOWN

// DOT-TOGGLE

$(document).ready(function () {
    $('.dot-toogle').click(function () {
        $(".dot-toogle-list").not($(this).parent().find(".dot-toogle-list").slideToggle('fast')).slideUp();
        event.stopPropagation();
    });

    $(document).click(function () {
        $('.dot-toogle-list').slideUp('fast');
    });
    $('.dot-toogle-list').click(function () {
        event.stopPropagation();
    });
});

// DOT-TOGGLE



// SIDE-MENU
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function contentmanage() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// / SIDE-MENU
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */


// FAQ-POP-SERVICE-DROPDOWN

$(document).ready(function () {
    $('.faq-dropdown-btn').click(function () {
        $(".faq-dropdown-list").slideToggle('fast');
        $(this).toggleClass('active');
        event.stopPropagation();
    });

    $(document).click(function () {
        $('.faq-dropdown-list').slideUp('fast');
        $('.faq-dropdown-btn').removeClass('active');
    });
});

// FAQ-POP-SERVICE-DROPDOWN

// PASSOWRD-HIDE-SHOW

$(function () {
    $('#eye').click(function () {
        if ($(this).hasClass('fa-eye-slash')) {
            $(this).removeClass('fa-eye-slash');
            $(this).addClass('fa-eye');
            $('#password').attr('type', 'text');
        } else {
            $(this).removeClass('fa-eye');
            $(this).addClass('fa-eye-slash');
            $('#password').attr('type', 'password');
        }
    });
});

// PASSOWRD-HIDE-SHOW




// TOGGLE SIDEBAR

const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
})

// TOGGLE SIDEBAR



// custum-select

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

// custum-select


