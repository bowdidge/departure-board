# Model Railroad Departure Board

This web page simulates a railroad departure board, and is intended for
running a schedule into and out of a station on a model railroad.
It's intended to visualize what's going on in the model
railroad and help operators know what's going on.

## The Problem

Specifically, I was building a model of the station and tracks around
San Jose's former mainline station located at Market Street and Bassett St.
in San Jose.  In 1928, this station had more than 90 departures and arrivals.
Most trains were commute trains to San Francisco, but several medium and 
long distance trains also went through the two track train shed at the station.

With the model, I wanted to help the folks operating the trains know
what trains needed to be positioned, which would arrive, and which would
depart.  For visitors, I wanted them to have an understanding of the
trains that the models represented, as well as a sense for the sheer
number of trains passing through the station.

Read more about the Market Street Station at the [Vasona Branch Blog](http://vasonabranch.blogspot.com/search/label/Market%20Street).

## To use

Load the web page to start it.  The departure board shows at the top; the
current time in a sped-up fast clock appears at the bottom.  The grey box
contains a button to pause the fast clock.  Typing digits 1-9 anywhere in the
web page causes the nth train to be advanced to its next state.

Trains originating at the station move through the states "--", "boarding",
"departing", and removed from the board.  Trains terminating in the station
pass through the states "---", "arriving", "arrived", and removed from the
board.  Trains passing through the station pass through the states
"on time", "arriving", "boarding", "departing", and removed from the board.

## Code

The CSS-based departure board comes from Paul Cuthbertson's Departure Board
code (https://github.com/paulcuth/departure-board).  My own changes only
involved the state changes.

Paul's code is primarily in departure-board.js; my logic for controlling the
web page is in marketst.js.

The css-based flip-cards are unbearably slow on a Raspberry Pi.  To improve
performance, the board only does six flips (as opposed to the prototypical
number of flips in Paul's implementation.
