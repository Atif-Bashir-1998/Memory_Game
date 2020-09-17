$(function() {
    // preparing different variables so that when page loads they are initialized
    total_clicks = 0;
    images = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg", "image7.jpg", "image8.jpg", "image9.jpg", "image10.jpg"];

    // hash table to make sure only 2 cards of an image are shown
    answer_dictionary = {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0
    };

    // creating the audio objects
    var clickSound = new Audio("./ljud/click.mp3");
    var successSound = new Audio('./ljud/success.mp3');

    // function returns the name of the image(i.e image1.jpg) which is on the other face of card
    function pictureName (list) {
        for (i=0; i<list.length; i++) {
            if (list[i].includes(".jpg")) {
                return list[i];
            }
        }
    }

    //initially place an image under each card and make sure only 2 cards have that image by using hash table
    var cards = $(".item");
    for (i = 1; i<=cards.length; i++) {
        while (true) {
            var random_number = Math.floor(Math.random() * 10);
            if (answer_dictionary[random_number] < 2) {
                answer_dictionary[random_number] += 1;
                $('#'+i).addClass(images[random_number]);
                break;
            }
            else {
                continue;
            }

        }
    }

    // this function is used for animation using animate.css
    function animate(element, animation) {
        $(element).addClass('animate__animated animate__'+animation);
        var wait = setTimeout(function () {
            $(element).removeClass('animate__animated animate__'+animation);
        }, 1000);
    }

    // updating the click counter
    function updateClicks () {
        total_clicks += 1 ;
        $("#total_clicks").text(total_clicks);
    }

    // variable to keep track of visible images
    var visibleImages = 0;

    // this function makes sure that only 2 cards are flipped at a time
    function canShow() {
        if (visibleImages < 2)
            return true;

        return false;
    }

    // declaring these variables to keep track of current card and previous card
    var currentID;
    var previousID;
    var currentImage;
    var previousImage;

    // adding an event listener to the item class
    $(".item").click(function () {

        // notCompletedFlag makes sure that user is not clicking on the card they have already solved correctly
        var notCompletedFlag = !($(this).attr("class").includes("done"));

        if (canShow() && notCompletedFlag) {
            visibleImages += 1;
            if (visibleImages === 1) {
                updateClicks();
                clickSound.play();

                previousID = $(this).attr('id')
                previousImage = pictureName($(this).attr('class').split(" "));

                animate("#"+previousID, "flipOutY"); 
                var showImage = setTimeout(function () {
                    $("#"+previousID).css("background-image", "url('./images/"+previousImage+"')");
                },900);
                animate("#"+previousID, "fadeIn");
            }

            else {
                currentID = $(this).attr('id');
                // following if is to make sure that the user is not clicking the previously clicked card
                if (currentID !== previousID) {
                    clickSound.play();
                    updateClicks();
    
                    currentImage = pictureName($(this).attr('class').split(" "));
    
                    animate("#"+currentID, "flipOutY");
                    var showCurrentImage = setTimeout(function () {
                        $("#"+currentID).css("background-image", "url('./images/"+currentImage+"')");
                    }, 900);
                    animate("#"+currentID, "fadeIn");
    
                    // Now check if both the images are the same
                    var comparison = setTimeout(function() {
                        if (currentImage === previousImage) {
                            successSound.play();
    
                            animate("#"+currentID, "fadeOut");
                            var showCurrentImage = setTimeout(function () {
                                $("#"+currentID).css("background-image", "none").addClass("done");
                            }, 900);
                            animate("#"+currentID, "fadeIn");
    
                            animate("#"+previousID, "fadeOut"); 
                            var showImage = setTimeout(function () {
                                $("#"+previousID).css("background-image", "none").addClass("done");
                            },900);
                            animate("#"+previousID, "fadeIn");
    
                        }
                        else {
                            //console.log("WRONG");
    
                            animate("#"+currentID, "flipOutY");
                            var showCurrentImage = setTimeout(function () {
                                $("#"+currentID).css("background-image", "url('./images/backside.jpg')");
                            }, 900);
                            animate("#"+currentID, "fadeIn");
    
                            animate("#"+previousID, "flipOutY");
                            var showCurrentImage = setTimeout(function () {
                                $("#"+previousID).css("background-image", "url('./images/backside.jpg')");
                            }, 900);
                            animate("#"+previousID, "fadeIn");
                        }
                    },1500)
    
                    var flushing_variables = setTimeout(function () {
                        visibleImages = 0;
                    },2500);
                }

                else{
                    //console.log("clicking the same card");
                    visibleImages -= 1;
                }
                
            }
        }

        else {
            //console.log("can not show")
        }



    })


})