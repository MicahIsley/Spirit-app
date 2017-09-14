// Global Variables

//EaselJS animation variables
var canvas;
var stage;
var rRotation = -.5;
var lRotation = .5;
var dragonHead = 1;
var resourcesLoaded = 0;
var totalResources;
var images = {};
var spirit;
var currentUserId;
var currentUsername;

//Game variables
var hungryTime;
var currentTime;
var spicyDragon = new SpiritAnimal(150, 100, 100, 6, 15);
var mangoMonkey = new SpiritAnimal(120, 100, 100, 5, 15);
var seal = new SpiritAnimal(130, 100, 100, 5, 15);
var apple = new foodItem(50, "juicy");
var carrot = new foodItem(40, "crunchy");
var cupcake = new foodItem(80, "sweet");
var steak = new foodItem(100, "chewy");
var username = "test";
var optionMenuToggle = true;
var apples;
var carrots;
var cupcakes;
var steaks;

moment().format();

function getUserData() {
    $.ajax('/user', {
        credentials: "include",
    })
    .then((res) => {
        currentUserId = res.user;
        getCurrentUsername();
        this.isAuthenticated = true
        if (typeof cb === 'function') {
            cb(res.json().user);
        }
    });
};

function getCurrentUsername(){
    console.log(currentUserId);
    $.get("/api/userinfo/" + currentUserId, function(data){
        console.log(data.username);
        currentUsername = data.username;
        findSpiritAnimal();
    });
};

function findSpiritAnimal(){
	$.get("/api/spiritAnimal/" + currentUsername, function(data){
		spirit = data.animal;
	}).done(function(){
		init(spirit);
		$("#animalSpecies").text(spirit.toUpperCase());
	});
};

getUserData();

// Game Logic


function checkHungry() {
	if(spicyDragon.hunger > 0){
		spicyDragon.hunger -= 1;
		adjustHungerMeter();
	}else{}
	if(spicyDragon.hunger <= 140){
		$("#animalThoughtBubble").text("I'm hungry, feeed meeeee!");
	}
	setTimeout("checkHungry()", 1000);
}
checkHungry();

function checkBored() {
	if(spicyDragon.sleep > 0){
		spicyDragon.sleep -= 1;
	} else{}
	if(spicyDragon.sleep === 0){
		$("#")
	}
}

function clearThoughtBubble() {
	setTimeout(function(){
		$("#animalThoughtBubble").text(" ");
	}, 5000);
}

function adjustHungerMeter() {
	var percentage = ((spicyDragon.hunger/150) * 100);
	if(percentage < 100){
		$("#hungerMeterFill").css("width", percentage + "%");
	} else{
		$("#hungerMeterFill").css("width", "100%");
	}
}

// Game Buttons
$("#signIn").click(function(){
	$("#buttons").hide();
	$("#loginForm").show();
});

$("#signUp").click(function(){
	$("#buttons").hide();
	$("#registerForm").show();
});

$("#closeLoginWindow").click(function(){
	$("#buttons").show();
	$("#login").hide();
});

$("#options").click(function(){
	if(optionMenuToggle === true){
		$("#menuOptions").show()
		optionMenuToggle = false;
	}else if(optionMenuToggle === false){
		$("#menuOptions").hide();
		optionMenuToggle = true;
	}
});

$("#food").click(function(){
	renderFoodItems();
});

$(document).on("click", ".itemSlot", function(){
	var foodItemQuantity = $(this, "span").text();
	var foodItem = $(this).attr("id");
		switch (foodItem) {
			case "apples":
				apples -= 1;
				break;
			case "carrots":
				carrots -= 1;
				break;
			case "cupcakes":
				cupcakes -= 1;
				break;
			case "steaks":
				steaks -= 1;
				break;
		}
	console.log(foodItem);
	spicyDragon.feed(foodItem);
	console.log(spicyDragon.hunger);
	var changeQuantity = {
		apples: apples,
		carrots: carrots,
		cupcakes: cupcakes,
		steaks: steaks}
	$.ajax({
		method: "PUT",
		url: "/api/updateItems/" + currentUsername,
		data: changeQuantity
	})
	.done(function() {
		renderFoodItems();
	});
});

function renderFoodItems(){
	$("#itemSlotRow").show();
	$.get("api/" + currentUsername + "/items", function(data) {
		apples = data[0].apples;
		carrots = data[0].carrots;
		cupcakes = data[0].cupcakes;
		steaks = data[0].steaks;
		$("#itemSlot0").text(apples);
		$("#itemSlot1").text(carrots);
		$("#itemSlot2").text(cupcakes);
		$("#itemSlot3").text(steaks);
	});
};

$(".hideButton").click(function(){
	var hideThis = $(this).parent().attr("id");
	$("#" + hideThis).hide();
});

// Spirit Animal constructor

function SpiritAnimal(hunger, sleep, bored, intelligence, happiness){
	this.hunger = hunger;
	this.sleep = sleep;
	this.bored = bored;
	this.intelligence = intelligence;

	this.feed = function(food){
		if(this.hunger < 140){
			switch (food) {
				case "apple":
					this.hunger += 40;
					break;
				case "carrot":
					this.hunger += 30;
					break;
				case "cupcake":
					this.hunger += 60;
					break;
				case "steak":
					this.hunger += 90;
					break;
			}
			console.log(" Delicious! New hunger level: " + this.hunger);
			$("#animalThoughtBubble").text("Thank you!");
			clearThoughtBubble();
			adjustHungerMeter();
		}else if(this.hunger >= 140){
			$("#animalThoughtBubble").text("No thanks! I'm full.");
			clearThoughtBubble();
		}
	}

	this.play = function(){
		if(this.bored = true){
			console.log("Yay! Let's play!")
			this.bored = false;
			this.hungry = true;
		}else if(this.bored = false){
			console.log("Not right now. Later?");
		}
	}

}

//Item constructor

function foodItem(energy, flavor){
	this.energy = energy;
	this.flavor = flavor;
}

// Spirit Animal Animation
$(document).ready(function(){
});

canvas = document.getElementById("canvasDiv");

function init(spirit) {
	stage = new createjs.Stage(canvas);
	switch (spirit) {
		case "dragon":
			loadSpicyDragon();
			break;
		case "dino":
			loadSourDino();
			break;
		case "monkey":
			loadMangoMonkey();
			break;
		case "seal":
			loadCocoSeal();
			break;
		case "dog":
			loadDog();
			break;
		case "cat":
			loadCat();
			break;
		case "bear":
			loadBear();
			break;
	}
}

function loadCat(){
	$("#catDisplay").show();
	$("#canvasDiv").hide();
}

function loadDog(){
	totalResources = 1;
	loadImage("dog");
}

function loadBear(){
	totalResources = 1;
	loadImage("bear");
}

function loadSpicyDragon(){
	totalResources = 4;
	loadImage("dragon/dragon-rwing4");
	loadImage("dragon/dragon-lwing4");
	loadImage("dragon/dragon-body4");
	loadImage("dragon/dragon-head4");
}

function loadSourDino(){
	totalResources = 6;
	loadImage("dino/dino-larm");
	loadImage("dino/dino-lleg");
	loadImage("dino/dino-body");
	loadImage("dino/dino-rleg");
	loadImage("dino/dino-rarm");
	loadImage("dino/dino-head");
}


function loadMangoMonkey(){
	totalResources = 5;
	loadImage("monkey/monkey-tail");
	loadImage("monkey/monkey-body");
	loadImage("monkey/monkey-top");
	loadImage("monkey/monkey-head");
	loadImage("monkey/monkey-arm");
}

function loadCocoSeal(){
	totalResources = 5;
	loadImage("seal/seal-lear");
	loadImage("seal/seal-rear");
	loadImage("seal/seal-body");
	loadImage("seal/seal-flippers");
	loadImage("seal/seal-tail");
}

function loadImage(name) {
	images[name] = new Image();
	images[name].onload = function() {
		resourceLoaded();
	}
	images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {
	resourcesLoaded += 1;
	if(resourcesLoaded === totalResources) {
		switch (spirit) {
		case "dragon":
			handleDragonLoad();
			break;
		case "dino":
			handleDinoLoad();
			break;
		case "monkey":
			handleMonkeyLoad();
			break;
		case "seal":
			handleSealLoad();
			break;
		case "dog":
			handleDogLoad();
			break;
		case "cat":
			handleCatLoad();
			break;
		case "bear":
			handleBearLoad();
			break;
		}
	}
}

function handleDragonLoad() {
	dragonRWing = new createjs.Bitmap("images/dragon/dragon-rwing4.png");
	dragonRWing.x = 160;
	dragonRWing.y = 220;
	dragonRWing.regX = images["dragon/dragon-rwing4"].width/2;
	dragonRWing.regY = images["dragon/dragon-rwing4"].height/2;

	dragonBody = new createjs.Bitmap("images/dragon/dragon-body4.png");
	dragonBody.x = 10;
	dragonBody.y = 170;

	dragonLWing = new createjs.Bitmap("images/dragon/dragon-lwing4.png");
	dragonLWing.x = 100;
	dragonLWing.y = 210;
	dragonLWing.regX = images["dragon/dragon-lwing4"].width/2;
	dragonLWing.regY = images["dragon/dragon-lwing4"].height/2;

	dragonHead = new createjs.Bitmap("images/dragon/dragon-head4.png");
	dragonHead.x = 30;
	dragonHead.y = 20;

	stage.addChild(dragonLWing);
	stage.addChild(dragonRWing);
	stage.addChild(dragonBody);
	stage.addChild(dragonHead);

	createjs.Ticker.setFPS(60);
	createjs.Ticker.on("tick", dragonTick);
}

function handleDinoLoad(){
	dinoLArm = new createjs.Bitmap("images/dino/dino-larm.png");
	dinoLArm.x = -90;
	dinoLArm.y = 20;

	dinoLLeg = new createjs.Bitmap("images/dino/dino-lleg.png");
	dinoLLeg.x = -65;
	dinoLLeg.y = 95;

	dinoBody = new createjs.Bitmap("images/dino/dino-body.png");
	dinoBody.x = 0;
	dinoBody.y = 30;

	dinoRLeg = new createjs.Bitmap("images/dino/dino-rleg.png");
	dinoRLeg.x = 10;
	dinoRLeg.y = 95;

	dinoRArm = new createjs.Bitmap("images/dino/dino-rarm.png");
	dinoRArm.x = 22;
	dinoRArm.y = 38;

	dinoHead = new createjs.Bitmap("images/dino/dino-head.png");
	dinoHead.x = -50;
	dinoHead.y = -60;

	stage.addChild(dinoLArm);
	stage.addChild(dinoLLeg);
	stage.addChild(dinoBody);
	stage.addChild(dinoRLeg);
	stage.addChild(dinoRArm);
	stage.addChild(dinoHead);

	createjs.Ticker.setFPS(60);
	createjs.Ticker.on("tick", dinoTick);
}

function handleMonkeyLoad(){
	monkeyTail = new createjs.Bitmap("images/monkey/monkey-tail.png");
	monkeyTail.x = 130;
	monkeyTail.y = 100;

	monkeyBody = new createjs.Bitmap("images/monkey/monkey-body.png");
	monkeyBody.x = 0;
	monkeyBody.y = 150;

	monkeyTop = new createjs.Bitmap("images/monkey/monkey-top.png");
	monkeyTop.x = -10;
	monkeyTop.y = -50;

	monkeyHead = new createjs.Bitmap("images/monkey/monkey-head.png");
	monkeyHead.x = 20;
	monkeyHead.y = 40;

	monkeyArm = new createjs.Bitmap("images/monkey/monkey-arm.png");
	monkeyArm.x = 108;
	monkeyArm.y = 65;

	stage.addChild(monkeyTail);
	stage.addChild(monkeyBody);
	stage.addChild(monkeyTop);
	stage.addChild(monkeyHead);
	stage.addChild(monkeyArm);
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.on("tick", monkeyTick);
}

function handleSealLoad(){
	sealBody = new createjs.Bitmap("images/seal/seal-body.png");
	sealBody.x = -30;
	sealBody.y = 40;

	sealREar = new createjs.Bitmap("images/seal/seal-rear.png");
	sealREar.x = 125;
	sealREar.y = -15;

	sealLEar = new createjs.Bitmap("images/seal/seal-lear.png");
	sealLEar.x = 55;
	sealLEar.y = -15;

	sealFlippers = new createjs.Bitmap("images/seal/seal-flippers.png");
	sealFlippers.x = 110;
	sealFlippers.y = 170;

	sealTail = new createjs.Bitmap("images/seal/seal-tail.png");
	sealTail.x = -52;
	sealTail.y = 135;

	stage.addChild(sealREar);
	stage.addChild(sealLEar);
	stage.addChild(sealBody);
	stage.addChild(sealFlippers);
	stage.addChild(sealTail);

	createjs.Ticker.setFPS(60);
	createjs.Ticker.on("tick", sealTick);
}

function handleDogLoad(){
	dog = new createjs.Bitmap("images/dog.png");
	dog.x = 0;
	dog.y = 50;

	stage.addChild(dog);

	createjs.Ticker.setFPS(60);
	createjs.Ticker.on("tick", dogTick);
}

function handleBearLoad(){
	bear = new createjs.Bitmap("images/bear.png");
	bear.x = 0;
	bear.y = 50;

	stage.addChild(bear);

	createjs.Ticker.setFPS(60);
	createjs.Ticker.on("tick", bearTick);
}

function dragonTick(event){
	dragonRWing.rotation += rRotation;
	if (dragonRWing.rotation < -10) {
		rRotation = .5;
	} else if (dragonRWing.rotation > 10) {
		rRotation = -.5;
	}

	dragonLWing.rotation += lRotation;
	if (dragonLWing.rotation < -10) {
		lRotation = .5;
	} else if (dragonLWing.rotation > 10) {
		lRotation = -.5;
	}

	stage.update(event);
}

function dinoTick(event){
	stage.update(event);
}

function monkeyTick(event){
	stage.update(event);
}

function sealTick(event){
	stage.update(event);
}

function dogTick(event){
	stage.update(event);
}

function bearTick(event){
	stage.update(event);
}