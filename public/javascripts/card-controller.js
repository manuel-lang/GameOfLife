function updateBalance(balance) {
  $(".coin-balance").html(" " + balance);
}
function increaseProgressbar() {
  if(barState < 0.95) { // Possible loss of precision
    console.log(barState);
    barState += 0.1;
    bar.animate(barState);
  }
}
function showModal () {
  $('#myModal').modal('show')
}

var bar;
var barState = 0.1;

var questions;
$.get('/questions', function(data) {
  console.log(data);
  questions = data;
});

$(document).ready(function() {

  $(".mozgradient").css("background", "");
  updateBalance(2000);
  bar = new ProgressBar.Line('#progressbar', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: {width: '100%', height: '100%'},
    text: {
      style: {
        color: '#999',
        padding: 0,
        margin: 0,
        transform: null
      },
      autoStyleContainer: false
    },
    from: {color: '#FFEA82'},
    to: {color: '#ED6A5A'},
    step: (state, bar) => {
      bar.setText('In ' + Math.round(bar.value() * 20) + ' years');
    }
  });

  bar.animate(0.1);

  var animating = false;
  var cardsCounter = 0;
  var numOfCards = 10; // Assuming that there are always 10 questions
  var decisionVal = 80;
  var pullDeltaX = 0;
  var deg = 0;
  var $card, $cardReject, $cardLike;

  function pullChange() {
    animating = true;
    deg = pullDeltaX / 10;
    $card.css("transform", "translateX("+ pullDeltaX +"px) rotate("+ deg +"deg)");

    var opacity = pullDeltaX / 100;
    var rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
    var likeOpacity = (opacity <= 0) ? 0 : opacity;
    $cardReject.css("opacity", rejectOpacity);
    $cardLike.css("opacity", likeOpacity);
  };

  function release() {
    if (pullDeltaX >= decisionVal) {
      $card.addClass("to-right");
    } else if (pullDeltaX <= -decisionVal) {
      $card.addClass("to-left");
    }

    if (Math.abs(pullDeltaX) >= decisionVal) {
      $card.addClass("inactive");

      setTimeout(function() {
        $card.addClass("below").removeClass("inactive to-left to-right");
        cardsCounter++;
        increaseProgressbar();
        simulateNextYear();

        if (cardsCounter === numOfCards) {
          window.location.replace( "/final/" + Math.round(moneyInTheWealth + moneyInTheBank));
          cardsCounter = 0;
          $(".demo__card").removeClass("below");
        }
      }, 300);
    }

    if (Math.abs(pullDeltaX) < decisionVal) {
      $card.addClass("reset");
    }

    setTimeout(function() {
      $card.attr("style", "").removeClass("reset")
        .find(".demo__card__choice").attr("style", "");

      pullDeltaX = 0;
      animating = false;
    }, 300);
  };

  $(document).on("mousedown touchstart", ".demo__card:not(.inactive)", function(e) {
    if (animating) return;

    $card = $(this);
    $cardReject = $(".demo__card__choice.m--reject", $card);
    $cardLike = $(".demo__card__choice.m--like", $card);
    var startX =  e.pageX || e.originalEvent.touches[0].pageX;

    $(document).on("mousemove touchmove", function(e) {
      var x = e.pageX || e.originalEvent.touches[0].pageX;
      pullDeltaX = (x - startX);
      if (!pullDeltaX) return;
      pullChange();
    });

    $(document).on("mouseup touchend", function() {
      $(document).off("mousemove touchmove mouseup touchend");
      if (!pullDeltaX) return; // prevents from rapid click events
      release();
    });
  });

});

/**
 * START OF CALCULATION UNIT
 */
let SALARY_INCREASE = 1.4;
let WEALTH_INTEREST = 1.04;
let INCREASE_EVERY_N_YEARS = 4;
let START_INCOME = 3600;
let START_CAPITAL = 0;

var netIncome = START_INCOME;

var moneyInTheBank = START_INCOME;
var moneyInTheWealth = START_CAPITAL;
var simulationYear = 0;

function simulateNextYear(oneTimeChangeBank, oneTimeChangeWealth) {
  console.log("The year is " + simulationYear " + ahead your time");

  simulationYear++;
  if(simulationYear % INCREASE_EVERY_N_YEARS === 0) {
    netIncome *= SALARY_INCREASE;
  }
  moneyInTheWealth *= WEALTH_INTEREST;
  moneyInTheBank += oneTimeChangeBank;
  moneyInTheWealth += oneTimeChangeWealth;
  updateBalance(moneyInTheBank);
}
