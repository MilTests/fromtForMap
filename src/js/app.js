
var Device = React.createClass({
    getInitialState: function() {
        setInterval(this.timer1, 1000);
        setInterval(this.timer2, 500);
        return {
            value1: '500',
            value2: '500'
        };
    },
    timer1: function() {
        $.ajax({
            url: 'http://192.168.50.6:56565/lol/status/getRandomStatuses',
            success: function(data){
                this.setState({value1: data.rows});
            }.bind(this)
        });
    },
    timer2: function() {
        $.ajax({
            url: 'http://192.168.50.6:56565/lol/location/getRandomLocations',
            success: function(data){
                this.setState({value2: data.rows});
                drow(data);
            }.bind(this)
        });
    },
    render: function () {
        var statusesTemplate;
        if (this.state.value1 instanceof Array)
            statusesTemplate = this.state.value1.map(function(item) {
                return (
                    <div>
                        <p>status: {(item.status.isOnline) ? 'online' : 'offline'}</p>
                        <span class="badge">{item.mac}</span>
                        <hr />
                    </div>
                );
            });
        return (<li className={" device " + " list-group-item "}>{statusesTemplate}</li>);
    }
});

var DevList = React.createClass({
    render: function() {
        return (
            <ul className={" devList " + " list-group "}>
                <Device />
            </ul>
        );
    }
});

ReactDOM.render(
    <DevList />,
    document.getElementById('devListId')
);

// drow map
var mymap = L.map('mapid').setView([56.326944, 44.0075], 12);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a rel="nofollow" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);


//56.326944, 44.0075
//item.location.lat, item.location.lon
var markers = [];
function drow(data) {
    markers.forEach(function (marker) {
       mymap.removeLayer(marker);
    });
    markers = [];

    (data.rows || []).forEach(function (item) {
        var marker = L.marker([item.location.lon.toFixed(6), item.location.lat.toFixed(6)]);
        marker.addTo(mymap);
        markers.push(marker);
        console.log(item);
        marker.bindPopup("<b>id: " + item.ts + "</b><br>" + item.mac).openPopup();
    });
}

