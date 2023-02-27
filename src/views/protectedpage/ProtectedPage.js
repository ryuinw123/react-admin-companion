import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import useAxios from "../../utils/useAxios";
import "./ProtectedPage.css";
import building from "../../images/icons/type_building.png";
import dorm from "../../images/icons/type_dorm.png";
import pin from "../../images/icons/type_pin.png";
import restaurant from "../../images/icons/type_restaurant.png";
import room from "../../images/icons/type_room.png";
import school from "../../images/icons/type_school.png";
import shop from "../../images/icons/type_shop.png";
import SearchBar from "../../components/searchbar/SearchBar";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicnl1aW53MTIzIiwiYSI6ImNsODV5M21odjB0dXAzbm9lZDhnNXVoY2UifQ.IiTAr5ITOUcCVjPjWiRe1w";

function ProtectedPage() {
  const imageUrls = {
    ตึก: building,
    หอพัก: dorm,
    ทั่วไป: pin,
    ร้านอาหาร: restaurant,
    ห้องเรียน: room,
    อาคารเรียน: school,
    ร้านค้า: shop,
  };

  const [res, setRes] = useState("");
  const api = useAxios();
  const [markerInformation, setMarkerInformation] = useState([]);
  const [eventInformation, setEventInformation] = useState([]);

  function createEventFeatureCollection(events) {
    const features = events.map((event) => {
      const coordinates = JSON.parse(event.polygon).map((point) => [
        point[0],
        point[1],
      ]);
      return {
        type: "Feature",
        properties: {
          event_id: event.event_id,
          eventname: event.eventname,
          description: event.description,
          starttime: event.starttime,
          endtime: event.endtime,
          createtime: event.createtime,
          enable: event.enable,
          student: event.student,
        },
        geometry: {
          type: "Polygon",
          coordinates: [coordinates],
        },
      };
    });

    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features,
      },
    };
  }

  function createMarkerFeatureCollection(data) {
    const features = data.map((item) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)],
      },
      properties: {
        id: item.id,
        name: item.name,
        place: item.place,
        address: item.address,
        description: item.description,
        type: item.type,
        enable: item.enable,
        createtime: item.createtime,
        created_user: item.created_user,
      },
    }));

    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features,
      },
    };
  }
  //test API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/test/");
        setRes(response.data.response);
      } catch {
        setRes("Something went wrong");
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  //Initilize Map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });
  //Initilize Map
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    /*map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });*/

    map.current.on("click", "markers", (e) => {
      map.current.flyTo({
        center: e.features[0].geometry.coordinates,
        duration: 2000,
      });

      // Copy coordinates array.

      const coordinates = e.features[0].geometry.coordinates.slice();
      const id = e.features[0].properties.id;
      const description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div> ${description}<a href="/marker/${id}"> <button> Edit </button></a> </div>`
        )
        .addTo(map.current);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.current.on("mouseenter", "markers", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.current.on("mouseleave", "markers", () => {
      map.current.getCanvas().style.cursor = "";
    });

    map.current.on("click", "events", (e) => {
      console.log(e.features[0].geometry.coordinates)
      const center = turf.center(
        turf.polygon(e.features[0].geometry.coordinates)
      );
      const centerCoordinates = center.geometry.coordinates;

      map.current.flyTo({
        center: centerCoordinates,
        duration: 2000,
      });

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;
      const id = e.features[0].properties.event_id;

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<div> ${description}<a href="/event/${id}"> <button> Edit </button></a> </div>`
        )
        .addTo(map.current);

      console.log(coordinates);
    });
    map.current.on("mouseenter", "events", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.current.on("mouseleave", "events", () => {
      map.current.getCanvas().style.cursor = "";
    });
  }, [map]);

  //Get Marker Information
  useEffect(() => {
    const getMarkerInformation = async () => {
      try {
        const response = await api.get("/marker/");
        console.log(response.data);

        setMarkerInformation(response.data);
        console.log(createMarkerFeatureCollection(response.data));
      } catch (e) {
        console.log(e);
      }
    };
    getMarkerInformation();
  }, []);

  //Get Event Information
  useEffect(() => {
    const getMarkerInformation = async () => {
      try {
        const response = await api.get("/event/");

        setEventInformation(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getMarkerInformation();
  }, []);

  //Add Image top Map And style Layer
  useEffect(() => {
    if (!map.current) return;
    if (markerInformation.length === 0) return;
    if (map.current.getLayer("markers")) map.current.removeLayer("markers");
    if (map.current.getSource("markers-source"))
      map.current.removeSource("markers-source");

    const loadImage = (imageUrls, mapbox) => {
      try {
        Object.entries(imageUrls).forEach(async ([type, url]) => {
          await mapbox.loadImage(url, (error, image) => {
            if (error) throw error;
            console.log(type);
            mapbox.addImage(type, image);
          });
        });
      } catch (e) {
        console.log(e);
      }
    };

    map.current.on("load", (e) => {
      /*Object.entries(imageUrls).forEach(([type, url]) => {
        e.target.loadImage(url, (error, image) => {
          if (error) throw error;
          console.log(type);
          e.target.addImage(type, image);
        });
      });*/
      loadImage(imageUrls, e.target);

      e.target.addSource(
        "markers-source",
        createMarkerFeatureCollection(markerInformation)
      );
      e.target.addLayer({
        id: "markers",
        type: "symbol",
        source: "markers-source",
        layout: {
          "icon-image": ["to-string", ["get", "type"]],
          "icon-allow-overlap": true,
          "icon-size": 0.8,
        },
        paint: {},
      });
    });
  }, [map, markerInformation]);
  //Create Polygon Event
  useEffect(() => {
    if (!map.current) return;
    if (eventInformation.length === 0) return;
    if (map.current.getLayer("events")) map.current.removeLayer("events");
    if (map.current.getLayer("events-outline"))
      map.current.removeLayer("events-outline");
    if (map.current.getSource("events-source"))
      map.current.removeSource("events-source");

    map.current.on("load", (e) => {
      e.target.addSource(
        "events-source",
        createEventFeatureCollection(eventInformation)
      );
      e.target.addLayer({
        id: "events",
        type: "fill",
        source: "events-source",
        paint: {
          "fill-color": "#0080ff", // blue color fill
          "fill-opacity": 0.5,
        },
      });
      e.target.addLayer({
        id: "events-outline",
        type: "line",
        source: "events-source",
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 3,
        },
      });
    });
  }, [map, eventInformation]);

  const onSearchBarClick = (item) => {
    
    if (item.eventname) {
      const polygon = JSON.parse(item.polygon)
      polygon.push(polygon[0])
      console.log([polygon])
      const center = turf.center(turf.polygon([polygon]));
      const centerCoordinates = center.geometry.coordinates;

      map.current.flyTo({
        center: centerCoordinates,
        duration: 2000,
        zoom: 4,
      });
      new mapboxgl.Popup()
        .setLngLat(centerCoordinates)
        .setHTML(
          `<div> ${item.description}<a href="/event/${item.event_id}"> <button> Edit </button></a> </div>`
        )
        .addTo(map.current);

    } else {

      const coordinates = [item.longitude,item.latitude]

      map.current.flyTo({
        center: coordinates,
        duration: 2000,
        zoom: 4,
      });

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div> ${item.description}<a href="/marker/${item.id}"> <button> Edit </button></a> </div>`
        )
        .addTo(map.current);
    }
  };

  return (
    <div className="container">
      <h1>Projected Page</h1>
      <p>{res}</p>
      <div className="position-relative">
        <div className="sidebar position-absolute">
          <SearchBar
            placeholder="ค้นหา"
            data={[...markerInformation, ...eventInformation]}
            onSearchBarClick={onSearchBarClick}
          />
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default ProtectedPage;
