import { useEffect, useState, useRef } from "react";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";
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
import UserInfo from "../../components/userinfo/UserInfo";
import toilet from "../../images/icons/type_toilet.png";
import bank from "../../images/icons/type_bank.png";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicnl1aW53MTIzIiwiYSI6ImNsODV5M21odjB0dXAzbm9lZDhnNXVoY2UifQ.IiTAr5ITOUcCVjPjWiRe1w";

function ProtectedPage() {
  const { user } = useContext(AuthContext);

  const imageUrls = {
    สถานที่: building,
    หอพัก: dorm,
    ทั่วไป: pin,
    ร้านอาหาร: restaurant,
    ห้องเรียน: room,
    อาคารเรียน: school,
    ร้านค้า: shop,
    ห้องน้ำ: toilet,
    ธนาคาร: bank,
  };

  const api = useAxios();
  const [markerInformation, setMarkerInformation] = useState([]);
  const [eventInformation, setEventInformation] = useState([]);
  const [navTabs, setNavTabs] = useState(0);

  const [switchState, setSwitchState] = useState(1);

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

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(100.7794983025522);
  const [lat, setLat] = useState(13.730180723212523);
  const [zoom, setZoom] = useState(15);

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
      const name = e.features[0].properties.name;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div> ${name}<a href="/marker/${id}"> <button> Edit </button></a> </div>`
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
      console.log(e.features[0].geometry.coordinates);
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
      const eventname = e.features[0].properties.eventname;

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<div> ${eventname}<a href="/event/${id}"> <button> Edit </button></a> </div>`
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
    const getEventInformation = async () => {
      try {
        const response = await api.get("/event/");

        setEventInformation(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getEventInformation();
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
      console.log("Add Event Source");
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
      const polygon = JSON.parse(item.polygon);
      polygon.push(polygon[0]);
      console.log([polygon]);
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
          `<div> ${item.eventname}<a href="/event/${item.event_id}"> <button> Edit </button></a> </div>`
        )
        .addTo(map.current);
    } else {
      const coordinates = [item.longitude, item.latitude];

      map.current.flyTo({
        center: coordinates,
        duration: 2000,
        zoom: 4,
      });

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div> ${item.name}<a href="/marker/${item.id}"> <button> Edit </button></a> </div>`
        )
        .addTo(map.current);
    }
  };

  useEffect(() => {
    if (!map.current) return;
    if (navTabs === 0) {
      if (map.current.getLayer("events-outline"))
        map.current.setLayoutProperty(
          "events-outline",
          "visibility",
          "visible"
        );
      if (map.current.getLayer("events"))
        map.current.setLayoutProperty("events", "visibility", "visible");
      if (map.current.getLayer("markers"))
        map.current.setLayoutProperty("markers", "visibility", "visible");
      return;
    }
    if (navTabs === 1) {
      if (map.current.getLayer("events-outline"))
        map.current.setLayoutProperty("events-outline", "visibility", "none");
      if (map.current.getLayer("events"))
        map.current.setLayoutProperty("events", "visibility", "none");
      if (map.current.getLayer("markers"))
        map.current.setLayoutProperty("markers", "visibility", "visible");
      return;
    }

    if (navTabs === 2) {
      if (map.current.getLayer("events-outline"))
        map.current.setLayoutProperty(
          "events-outline",
          "visibility",
          "visible"
        );
      if (map.current.getLayer("events"))
        map.current.setLayoutProperty("events", "visibility", "visible");
      if (map.current.getLayer("markers"))
        map.current.setLayoutProperty("markers", "visibility", "none");
      return;
    }
  }, [navTabs]);

  return (
    <>
      <div className="border-bottom">
        <div className="container protected-text mt-3">
          <h1 className="fw-bold">แผนที่</h1>
          <h3 className="ms-4">
            ยินดีต้อนรับ แอดมิน <UserInfo user={user} />
          </h3>
        </div>
      </div>
      <div className="container protected-text mb-5">
        <div class="  d-block d-lg-flex justify-content-lg-between protected-list">
          <ul className="nav justify-content-center justify-content-lg-start my-2">
            <li className={`map-nav ${navTabs == 0 ? "active" : ""}`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setNavTabs(0);
                }}
              >
                ทั้งหมด
              </button>
            </li>
            <li className={`map-nav ${navTabs == 1 ? "active" : ""}`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setNavTabs(1);
                }}
              >
                ปักหมุด
              </button>
            </li>
            <li className={`map-nav ${navTabs == 2 ? "active" : ""}`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setNavTabs(2);
                }}
              >
                อีเวนท์
              </button>
            </li>
            <li className="d-flex align-items-center ps-3">
              <label>Disable &nbsp;&nbsp;&nbsp;</label>
              <div class="form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  defaultChecked={switchState}
                  onChange={(e) => {
                    setSwitchState((prevState) => (prevState + 1) % 2);
                    let state = (switchState + 1) % 2;
                    map.current.setFilter("markers", [
                      "==",
                      ["get", "enable"],
                      state,
                    ]);
                    map.current.setFilter("events", [
                      "==",
                      ["get", "enable"],
                      state,
                    ]);
                    map.current.setFilter("events-outline", [
                      "==",
                      ["get", "enable"],
                      state,
                    ]);
                  }}
                />
              </div>
              <label>&nbsp;&nbsp;&nbsp;Enable</label>
            </li>
          </ul>
          <div className="my-2 position-relative" style={{ zIndex: "1" }}>
            <div className="position-absolute searchbar-position">
              <SearchBar
                placeholder="ค้นหา"
                data={
                  navTabs === 0
                    ? [...markerInformation, ...eventInformation]
                    : navTabs === 1
                    ? markerInformation
                    : eventInformation
                }
                onSearchBarClick={onSearchBarClick}
              />
            </div>
          </div>
        </div>

        <div>
          <div ref={mapContainer} className="map-container" />
        </div>
      </div>
    </>
  );
}

export default ProtectedPage;
