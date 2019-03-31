function updateBalance(balance) {
  $(".coin-balance").html(" &nbsp;Bank: " + balance + "€");
}
function updateBill(balance) {
    $(".bill-balance").html("&nbsp;Wealth: " + balance + "€");
}

function increaseProgressbar() {
  if(barState < 0.95) { // Possible loss of precision
    barState += 0.1;
    bar.animate(barState);
  }
}
function showModal (message, headline) {
  $('#modalText').text(message);
  $('#modalLabel').text(headline);
  $('#myModal').modal('show')

}

var bar;
var barState = 0.1;
var questions;

$.get('/questions', function(data) {
  questions = data;
});

$(document).ready(function() {
  $(".mozgradient").css("background", "");
  updateBalance(START_INCOME);
  updateBill(START_CAPITAL);
  showModal("Plan your finances by swiping right (for YES) or left (for NO) ! Of course you have some passive income every year. Don't worry about that :)", "See yourself in 20 years!");
  bar = new ProgressBar.Line('#progressbar', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#35647E',
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
    var decision = "undefined";
    if (pullDeltaX >= decisionVal) {
      $card.addClass("to-right");
      decision = "yes";
    } else if (pullDeltaX <= -decisionVal) {
      $card.addClass("to-left");
      decision = "no";
    }

    if (Math.abs(pullDeltaX) >= decisionVal) {
      $card.addClass("inactive");

      setTimeout(function() {
        $card.addClass("below").removeClass("inactive to-left to-right");
        cardsCounter++;
        increaseProgressbar();
        simulateNextYear(decision, questions, position--);

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
let SALARY_INCREASE = 1.5;
let WEALTH_INTEREST = 1.04;
let INCREASE_EVERY_N_YEARS = 4;
let START_INCOME = 4200;
let START_CAPITAL = 0;

var netIncome = START_INCOME;

var moneyInTheBank = START_INCOME;
var moneyInTheWealth = START_CAPITAL;
var simulationYear = 0;
var position = 9;

/**
 *
 * @param data
 * @param position
 * @param decisionIdx
 * @param decision int Value: 0: yes response, 1: no response
 * @returns {{yearly_bank_change: *, one_time_bank_changed: *, one_time_change_wealth: *, yearly_wealth_change: *}}
 */
function getNewValues(data, position, decisionIdx, decision) {
  return {
    "one_time_bank_changed" : data[position].money_balance[decision][decisionIdx].one_time_change_bank,
    "one_time_change_wealth" : data[position].money_balance[decision][decisionIdx].one_time_wealth_change,
    "yearly_bank_change" : data[position].money_balance[decision][decisionIdx].yearly_change_bank,
    "yearly_wealth_change" : data[position].money_balance[decision][decisionIdx].yearly_wealth_change
  }
}


function simulateNextYear(decision, data, position) {
  var randomResult, randomPositionIdx, oneTimeChangeBank, oneTimeChangeWealth;
  if(decision === "yes") {
    randomPositionIdx = Math.floor(Math.random()*data[position].yes_response.length);
    randomResult = data[position].yes_response[randomPositionIdx]; // I need the position for that

  }else if (decision === "no"){
    randomPositionIdx = Math.floor(Math.random()*data[position].no_response.length);
    randomResult = data[position].no_response[randomPositionIdx];
  }else {
    console.err("Err: decision undefined");
  }
  simulationYear++;
  //showModal(randomResult, decision.toUpperCase());
  $.notify({
    // options
    message: randomResult
  },{
    // settings
    type: 'info'
  });

  netIncome = simulationYear % INCREASE_EVERY_N_YEARS === 0? netIncome*SALARY_INCREASE:netIncome;

  var changes = getNewValues(data,  position, randomPositionIdx, decision === "yes"?0:1);

  moneyInTheWealth *= WEALTH_INTEREST;
  moneyInTheBank += changes.one_time_bank_changed + netIncome;
  moneyInTheWealth += changes.one_time_change_wealth;
  updateBalance(Math.round(moneyInTheBank));
  updateBill(Math.round(moneyInTheWealth));
}