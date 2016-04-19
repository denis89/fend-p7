// Maps
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 53.5527,
            lng: 10.0070
        },
        zoom: 11
    });

    // Knockout.js
    var places = [{
        name: "Betahaus",
        description: "This is a great Coworking Office",
        
        position: {
            lat: 53.562737,
            lng: 9.960122
        }
    }, {
        name: "Flughafen",
        description: "I believe, I can fly!",
        
        position: {
            lat: 53.633443,
            lng: 9.998417
        }
    }, {
        name: "Strand",
        description: "Relax!",
        
        position: {
            lat: 53.545275,
            lng: 9.881932
        }
    }, {
        name: "Aussenalster",
        description: "A beautiful Lake!",
          
        position: {
            lat: 53.564734,
            lng: 10.006526
        }
    }, {
        name: "Sommer Salon",
        description: "A Bar with Table Football!",
       
        position: {
            lat: 53.550290,
            lng: 9.961271
        }
    }, {
        name: "Tennis Witthoeft",
        description: "I like Tennis!",
          
        position: {
            lat: 53.610135,
            lng: 10.044216
          }
        },
       {
       name: "www.Sites4Businesses.net",
       description: "My Startup",
        
       position: {
           lat: 53.557869,
           lng: 10.019238
       }
    }];

    places.forEach(function(place) {
        place.marker = new google.maps.Marker({
            position: place.position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: place.name,
            description: place.description,
            
        });









        place.marker.addListener('click', function onPlaceClick() {
            if (place.marker.getAnimation() !== null) {
                place.marker.setAnimation(null);
            } else {
                place.marker.setAnimation(google.maps.Animation.BOUNCE);
            }
            infowindow.setContent('<h3>' + place.marker.title + '</h3>' + '<p>' + place.marker.description + '</p>' );
            infowindow.open(map, place.marker);
            place.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ place.marker.setAnimation(null); }, 750);
              


        });
    });



 // Foursquare API next to the markers. Thanks for your help Heidi.
       function foursquare (place) {
       var apikey = "OLZKDYTU4ETHFE5AMX30FSRDW1V51G1HL5LYQBIJY0UR2V3C";
       var url = "https://api.foursquare.com/v2/venues/search?";
       var query = place.name;
       var ll = place.position.lat + "," + place.position.lng; 
       var requesturl = url + "ll=" + ll + "&query="+ query +"&oauth_token="+ apikey + "&v=20160331";
       
   $.ajax(requesturl).
   done(function(result){
    
     console.log(result.response.venues[0].contact.phone);
     for (var i = 0; i < result.length; i++) {
        places[i].phone = result[i];
    }
   }).fail(function(){
    alert("API not found!");
   });
   
     };
     

     console.log(foursquare(places[1]));


   


    var viewModel = function() {
        var self = this;
        
    

        self.points = ko.observableArray(places);
        // An array, that can observe itself. Haha. Knockout.js is really confusing.

        self.query = ko.observable('');
 
       function onPlaceClick() {
    google.maps.event.trigger(marker, 'click');
};

        self.search = ko.computed(function() {
            // ko.computed: these are functions that are dependent on one or more other observables, and will automatically update whenever any of these dependencies change
            //Thanks for your help Heidi :)
            return ko.utils.arrayFilter(self.points(), function(point) {
                // visible is a boolean variable 
                var visible = point.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
                // check whether the name of the point matches with the query string
                // A Google Maps function
                point.marker.setVisible(visible);
                return visible;
            });
        });
    };

    ko.applyBindings(new viewModel());
}

function googleError() {
    alert("API error");
};