import React from "react";
import film from "../../images/img/film.png";
import "./aboutPage.css"

const aboutPage = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div class="col-6 text-center about-default-text">
          <div className="row">
            <h2 className="my-5 about-text">เกี่ยวกับเรา</h2>
            <p>
              Kmitl Companion Application เป็นแอพพลิเคชั่นในการช่วยเหลือนักศึกษา
              เพื่อให้ใช้ชีวิตในรั้วมหาลัยได้อย่างสะดวกสบายมากขึ้น
            </p>
          </div>
          <div className="row">
            <div className="col-6">
              <img src={film} alt="" className="img-fluid my-5" />
              <p>62010758 นาย ร่มธรรม ตั้งสุนันท์ธรรม</p>
            </div>
            <div className="col-6">
              <img src={film} alt="" className="img-fluid my-5"/>
              <p>62010893 นาย เป็นเกย์เฒ่า ในวันที่ดี</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default aboutPage;
