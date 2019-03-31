function showProModal () {
    $('#modalText').text("Congratulations! You have gone the long way of smart living, carefully managing your finances. Now it pays you back as you relax at the SPA on the private beach, sipping Margarita before heading out of the next paradise island! Indeed, Bon Voyage! Mind your coin, you may never know when. But wouldn’t it be better if someone else could make this process easier and more enjoyable? Live your dreams hassle free, be part of MLP club!");
    $('#modalLabel').text("Luxury Travel Expert");
    $('#myModal').modal('show');
    $('#myModal').modal.style.color = "#ffffff";
}

function showSemiModal () {
    $('#modalText').text("You have saved enough to travel comfortably. The hotel is decent,  and you can even afford dining in fine restaurants from time to time when you are exploring the world! Maybe if you were making more rational investment decisions you would be lying on the private beach, feeling the warmth of the luxurious getaway.Join the MLP Club and be be part of an improved life journey and better saving decisions.");
    $('#modalLabel').text("Package Holiday Lover");
    $('#myModal').modal('show');
    $('#myModal').modal.style.color = "#ffffff";
}

function showLowModal () {
    $('#modalText').text("You have spent 20 years of your life full of hard work, impulsive purchases and…. not really successful investment decisions. Still your dream to travel around the world might come true, if you are inventive and creative enough to travel on a small budget. Learn more about making your dreams come true in the easier and more enjoyable way by joining the MLP Club.");
    $('#modalLabel').text("Dreamer");
    $('#myModal').modal('show');
    $('#myModal').modal.style.color = "#ffffff";
}

$(document).ready(function() {
  //  $('#myModal').modal('hide');
});

