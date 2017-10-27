/* States which trains can be in. Trains either go
 * TO_DEPART, BOARDING, DEPARTING, GONE
 * or
 * TO_ARRIVE, ARRIVING, ARRIVED, GONE
 * or
 * TO_ARRIVE, ARRIVING, BOARDING, DEPARTING, GONE
 */
var TO_DEPART = 1;
var BOARDING = 2;
var DEPARTING = 3;
var TO_ARRIVE = 4;
var ARRIVING = 5;
var ARRIVED = 6;
var GONE = 7;

/* Kinds of trains. */
var INBOUND = 1;
var OUTBOUND = 2;
var THROUGH = 3;

/* Creates a new train to show on the departure board.
 * name: (string) train's name, as should appear on the board
 * from: (string) where train comes from, should appear in FROM column.
 * to: (string) next destination.
 * number: (number): Train #, as should appear on board.
 * arrival: (number): time (in minutes since midnight) when train should
 *          arrive at station, or 0 if train departs from this station.
 * departure: (number): time (in munutes since midnight) when train should
 *          leave this station, or 0 if train terminates at this station.
 * kind: how train goes through this station: INBOUND, OUTBOUND, THROUGH.
 */
function Train(name, from, to, number, arrival, departure, kind) {
  this.name = name;
  this.from = from;
  this.to = to;
  this.number = number;
  this.arrival = arrival;
  this.departure = departure;
  this.kind = kind;
  if (kind == INBOUND || kind == THROUGH) {
    this.state = TO_ARRIVE;
  } else if (kind == OUTBOUND) {
    this.state = TO_DEPART;
  }
}

/* Helper constructor to make a commute train that leaves San Jose
 * for San Francisco.
 */
function MakeCommute(departureTime, trainNumber) {
  return new Train("SF PASS", "", "SF", trainNumber, 0, departureTime, 
                    OUTBOUND);
}

/* Helper constructor to make a commute train that terminates in San Jose.
 */
function MakeArrivingCommute(arrivalTime, trainNumber) {
  return new Train("SJ PASS", "SF", "", trainNumber, arrivalTime, 0,
                    INBOUND);
}

/* List of all trains to appear on the departure board. */
var trains = [
  new Train("Salinas Pass", "SF", "Salinas", 30, 245, 255, THROUGH),
   MakeCommute(285, 105),
   new Train("Oak. Pass", "", "Oakland", 503, 0, 285, OUTBOUND),
  MakeCommute(340, 135),
  MakeCommute(360, 137),
  MakeCommute(370, 139),
  MakeCommute(390, 141),
  MakeCommute(395, 143),
  new Train("Sunset Ltd", "New Orleans", "SF", 101, 425, 435, THROUGH),
  MakeCommute(430, 145),
  MakeCommute(435, 149),
  MakeCommute(450, 151),
  new Train("Padre", "Watsonville", "Oakland", 73, 460, 465, THROUGH),
  MakeCommute(470, 153),
  MakeArrivingCommute(470, 136),
  new Train("Salinas Pass", "", "Salinas", 32, 0, 480, OUTBOUND),
  new Train("Lark", "Los Angeles", "Oakland", 75, 499, 504, THROUGH),
  MakeCommute(515, 155),
  new Train("Daylight", "SF", "Los Angeles", 72, 527, 527, THROUGH)
];

/* Constructs the string form of a line of the departure board for the named
 * train. */
function LineForTrain(train) {
  line = ""
  if (train.state == TO_DEPART || train.state == BOARDING || train.state == DEPARTING) {
    line += TimeString(train.departure);
  } else if (train.state == TO_ARRIVE || train.state == ARRIVING) {
    line += TimeString(train.arrival);
  }
  line += ' ' + Pad(String(train.number),5);
  line += Pad(train.name, 13) + Pad(train.from, 13);
  line += Pad(train.to, 10);
  train_state = "";
  if (time < train.arrival) {
      train_state = 'ON TIME';
  } else if (train.state == BOARDING) {
      train_state = 'BOARDING';
  } else if (train.state == ARRIVING) {
      train_state = 'ARRIVING';
  } else if (train.state == DEPARTING) {
      train_state = 'DEPARTING';
  } else if (time > train.departure) {
    train_state = 'DELAYED';
  } else {
      train_state = '----';
  }
   line += train_state;
   return line;
}

/* Creates a string of the given size from the provided string, padding or
 * truncating as needed.
 */
function Pad(str, sz) {
  if (str.length > sz) {
    return str.slice(0, sz);
  }
  while (str.length < sz) {
    str += ' ';
  }
  return str;
}

/* Fast clock time, in seconds since midnight. */
var time = 250;
/* Fast clock rate.  20 = 3:1 ratio.*/
var seconds_per_minute = 20;

var ms_per_sec = 1000;

/* Reference to DepartureBoard object. */
var board = 0;

/* Updates the departure board based on input from the user. */
function HandleKeyPress(event) {
  var keynum;
  if (event.which) {
    keynum = event.which;
    if (keynum >= 49 && keynum < 56) {
      AdvanceTrainInSlot(keynum - 48);
    }		     
  }		      
}

/* Number of rows in the departure board. */
ROW_COUNT = 12
/* Number of columns in the departure board. */

COLUMN_COUNT = 56
/* Sets up the departure board. */
function Init() {
    document.onkeypress = function(event) { HandleKeyPress(event); };;
    board = new DepartureBoard (
        document.getElementById ('departure_board'), { rowCount: ROW_COUNT, letterCount: COLUMN_COUNT }); 

    setTimeout(function() { AdvanceTime(); }, seconds_per_minute * ms_per_sec);
    Redraw();
}

/* Generates astring representing the time, in 00:00 format. */
function TimeString(offset) {
  hours = Math.floor(offset / 60);
  minutes = offset - (hours * 60); 
  str = '0' + String(hours) + ':';
  if (minutes < 10) {
	str += '0' + String(minutes);
  } else {
    str += String(minutes);
  }
  return str;
}

/* Periodic timer to increase the fast time clock.
 * seconds_per_minute sets the fast clock rate.
 */
function AdvanceTime() {
    if (!clock_stopped) {
        time += 1;
        var elt = document.getElementById("time");
        elt.textContent = TimeString(time);
    }
    setTimeout(function() {AdvanceTime(); }, seconds_per_minute * ms_per_sec);
}

/* Redraws the departure board after user input has changed the contents. */
function Redraw() {		      
    var values = [];
    values.push('Time       Train        From         To        Status')
    var trainsToDisplay = Math.min(trains.length, ROW_COUNT);
    for (var i=0; i < trainsToDisplay; i++) {
      var train = trains[i];

      var nextEvent = 0;
      if (train.state == GONE) {
        continue;
      }
        		     
      var line = LineForTrain(train);
      values.push(line);
    }
    board.setValue(values);
}

/* Move the train to the next state:
 * TO_ARRIVE -> ARRIVING
 * ARRIVING -> ARRIVED
 * ARRIVED -> BOARDING or GONE
 * TO_DEPART -> BOARDING
 * BOARDING -> DEPARTING
 * DEPARTING -> GONE
 * 
 * Trains start in TO_ARRIVE or TO_DEPART;
 * arriving trains disappear after ARRIVED
 * departing trains disappear after DEPARTING.
 */
function AdvanceTrainInSlot(slot) {
  if (trains.length < slot) {
    return;
  }

  var train = trains[slot - 1];
  
  if (train.state == TO_DEPART) {
    train.state = BOARDING;
  } else if (train.state == BOARDING) {
    train.state = DEPARTING;
  } else if (train.state == DEPARTING) {
    train.state = GONE;
  } else if (train.state == TO_ARRIVE) {
    train.state = ARRIVING;
  } else if (train.state == ARRIVING) {
    if (train.kind == INBOUND) {
      train.state = ARRIVED;
    } else {
      train.state = BOARDING;
    }
  } else if (train.state == ARRIVED) {
    train.state = GONE;
  }

  if (train.state == GONE) {
    trains.splice(slot-1, 1);
  }
  Redraw();
}

var clock_stopped = false;

/* Pauses the fast clock. */
function StopClock() {
  if (clock_stopped) {
    clock_stopped = false;
    document.getElementById('stopClockButton').value = 'Stop Clock';
  } else {
    clock_stopped = true;
    document.getElementById('stopClockButton').value = 'Start Clock';
  }
}
